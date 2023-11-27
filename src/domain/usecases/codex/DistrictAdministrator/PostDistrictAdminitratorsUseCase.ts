import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidEmail, isValidUUID } from '../../shared/Ensure'
import { userRoles } from '../../shared/Constants'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

export type AdminitaratorInfo = {
  email: string
  firstName?: string
  lastName?: string
  administratorLMSId?: string
  password?: string
}

export type UserEmailInfo = {
  email: string | null
}

export enum BadRequestEnum {
  duplicateRecordsWithSameEmail = 'duplicateRecordsWithSameEmail',
  userAlreadyExistWithEmail = 'userAlreadyExistWithEmail',
  emailInvalid = 'emailInvalid',
  emailNotProvided = 'emailNotProvided',
}

export type BadRequestError = {
  index: number
  message: BadRequestEnum[]
}

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export interface IDistrictAdministratorRepository {
  postDistrictAdministrators(
    districtId: string,
    data: AdminitaratorInfo[],
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>>
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface IUserRepository {
  getUsersByEmails(
    emails: string[],
  ): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>>
}

const getValidationMessagesForAdministrator = (
  administrator: AdminitaratorInfo,
): BadRequestEnum[] => {
  const errors: BadRequestEnum[] = []
  const assert = (expr: boolean, msg: BadRequestEnum): boolean => {
    if (!expr) {
      errors.push(msg)

      return false
    }

    return true
  }

  if (
    assert(administrator.email ? true : false, BadRequestEnum.emailNotProvided)
  ) {
    assert(isValidEmail(administrator.email), BadRequestEnum.emailInvalid)
  }

  return errors
}

export class PostDistrictAdministratorsUseCase {
  constructor(
    private districtAdministratorRepository: IDistrictAdministratorRepository,
    private userRepository: IUserRepository,
  ) {}

  async run(
    user: User,
    districtId: string,
    data: AdminitaratorInfo[],
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidDistrictId'>
      | E<'DistrictNotFound'>
      | E<'InvalidAdministratorAttributes', BadRequestError[]>
      | E<'FailedToGetUsersData'>
      | E<'AdministratorNotFound'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to add the administrators.',
        },
        value: null,
      }
    }

    //validate with provided distrcitId
    if (!isValidUUID(districtId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidDistrictId',
          message: 'Invalid districtId',
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const adminisratorResult =
        await this.districtAdministratorRepository.getDistrictAdministratorByUserId(
          user.id,
        )

      if (adminisratorResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            adminisratorResult.error,
            `failed to getDistrictAdministratorByUserId ${user.id}`,
          ),
          value: null,
        }
      }

      if (!adminisratorResult.value) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: `The specified administrator not found for ${user.id}`,
          },
          value: null,
        }
      }

      if (adminisratorResult.value.districtId !== districtId) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to add the administrators.',
          },
          value: null,
        }
      }
    }

    const allErrors: { index: number; message: BadRequestEnum[] }[] = []
    const emailsArr = data.map(function (item) {
      return item.email
    })
    const userDataByEmails = await this.userRepository.getUsersByEmails(
      emailsArr,
    )

    if (userDataByEmails.hasError) {
      return {
        hasError: true,
        error: {
          type: 'FailedToGetUsersData',
          message: `Failed to get users data by emails ${emailsArr.join(', ')}`,
        },
        value: null,
      }
    }

    data.forEach((row, i) => {
      const errors: BadRequestEnum[] =
        getValidationMessagesForAdministrator(row)
      const duplicateEmailFounds = emailsArr.filter(
        (item) => item === row.email,
      )

      if (duplicateEmailFounds.length > 1) {
        errors.push(BadRequestEnum.duplicateRecordsWithSameEmail)
      }

      const userWithEmailAlreadyExists = userDataByEmails.value.find(
        (item) => (item.email ?? '').toLowerCase() === row.email.toLowerCase(),
      )

      if (userWithEmailAlreadyExists) {
        errors.push(BadRequestEnum.userAlreadyExistWithEmail)
      }

      if (errors.length) {
        allErrors.push({
          index: i,
          message: errors,
        })
      }
    })

    if (allErrors.length > 0) {
      return {
        hasError: true,
        error: {
          type: 'InvalidAdministratorAttributes',
          message: allErrors as BadRequestError[],
        },
        value: null,
      }
    }

    // Post district administrators to the database
    const districtAdministratorErrorable =
      await this.districtAdministratorRepository.postDistrictAdministrators(
        districtId,
        data,
        user.id,
      )

    if (districtAdministratorErrorable.hasError) {
      if (districtAdministratorErrorable.error.type === 'DistrictNotFound') {
        return districtAdministratorErrorable
      }

      return {
        hasError: true,
        error: wrapError(
          districtAdministratorErrorable.error,
          `Failed to postDistrictAdministrators ${districtId}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
