import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidEmail, isValidUUID } from '../../shared/Ensure'
import { userRoles } from '../../shared/Constants'
import { Organizations } from '../../../entities/codex/Organization'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { Teacher, TeacherOrganization } from '../../../entities/codex/Teacher'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export type TeacherInfo = Omit<
  Teacher,
  'teacherId' | 'userId' | 'createdUserId' | 'createdDate'
>

export type UserInfo = {
  email: string | null
}

export enum BadRequestEnum {
  duplicateRecordsWithSameEmail = 'duplicateRecordsWithSameEmail',
  duplicateRecordsWithSameTeacherLMSId = 'duplicateRecordsWithSameTeacherLMSId',
  userAlreadyExistWithEmail = 'userAlreadyExistWithEmail',
  userAlreadyExistWithTeacherLMSId = 'userAlreadyExistWithTeacherLMSId',
  emailInvalid = 'emailInvalid',
  emailNotProvided = 'emailNotProvided',
  emptyPassword = 'emptyPassword',
}

export type BadRequestError = {
  index: number
  message: BadRequestEnum[]
}

export interface ITeacherRepository {
  createTeachers(
    organizationId: string,
    data: TeacherInfo[],
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  getTeacherByTeacherLMSIds(
    teacherLMSIds: string[],
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>>
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface IUserRepository {
  getUsersByEmails(
    emails: string[],
  ): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface IOrganizationRepository {
  getOrganizationById(
    organizationId: string,
  ): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>>
}

const getValidationMessagesForTeacher = (
  teacher: TeacherInfo,
): BadRequestEnum[] => {
  const errors: BadRequestEnum[] = []
  const assert = (expr: boolean, msg: BadRequestEnum): boolean => {
    if (!expr) {
      errors.push(msg)

      return false
    }

    return true
  }

  if (!teacher.teacherLMSId) {
    assert(teacher.email ? true : false, BadRequestEnum.emailNotProvided)
    assert(teacher.password ? true : false, BadRequestEnum.emptyPassword)
  }

  if (teacher.email) {
    assert(isValidEmail(teacher.email), BadRequestEnum.emailInvalid)
  }

  return errors
}

export class CreateTeachersUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private userRepository: IUserRepository,
    private organizationRepository: IOrganizationRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    organizationId: string,
    user: User,
    data: TeacherInfo[],
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidOrganizationId'>
      | E<'OrganizationNotFound'>
      | E<'AdministratorNotFound'>
      | E<'TeacherNotFound'>
      | E<'InvalidTeacherAttributes', BadRequestError[]>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'The user does not have permission to add the teachers.',
        },
        value: null,
      }
    }

    // Validate with provided distrcitId
    if (!isValidUUID(organizationId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidOrganizationId',
          message: 'Invalid organizationId',
        },
        value: null,
      }
    }

    const organizationResult =
      await this.organizationRepository.getOrganizationById(organizationId)

    if (organizationResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          organizationResult.error,
          `failed to getOrganizationById '${organizationId}'`,
        ),
        value: null,
      }
    }

    if (!organizationResult.value) {
      return {
        hasError: true,
        error: {
          type: 'OrganizationNotFound',
          message: `The specified organization not found for ${organizationId}`,
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const adminisratorResult =
        await this.administratorRepository.getDistrictAdministratorByUserId(
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

      if (
        adminisratorResult.value.districtId !==
        organizationResult.value.districtId
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message: 'The user does not have permission to add the teachers.',
          },
          value: null,
        }
      }
    }

    if (user.role === userRoles.teacher) {
      const getTeacherInfo = await this.teacherRepository.getTeacherByUserId(
        user.id,
      )

      if (getTeacherInfo.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getTeacherInfo.error,
            `failed to fetch teachers from db for teacher id ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getTeacherInfo.value) {
        return {
          hasError: true,
          error: {
            type: 'TeacherNotFound',
            message: `The specified teacher not found for ${user.id}`,
          },
          value: null,
        }
      }

      if (getTeacherInfo.value.teacherOrganizations) {
        const teacherOrganizations =
          getTeacherInfo.value.teacherOrganizations.find(
            (i) => i.id === organizationId,
          )

        if (!teacherOrganizations) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message: 'The user does not have permission to add the teachers.',
            },
            value: null,
          }
        }
      }
    }

    const allErrors: BadRequestError[] = []
    const mapCountByEmail: Record<string, number> = {}

    data.forEach((item) => {
      if (item.email) {
        mapCountByEmail[item.email] = (mapCountByEmail[item.email] | 0) + 1
      }
    })

    const emailsArr: string[] = Object.keys(mapCountByEmail)
    const userDataByEmails = await this.userRepository.getUsersByEmails(
      emailsArr,
    )

    if (userDataByEmails.hasError) {
      return {
        hasError: true,
        error: wrapError(
          userDataByEmails.error,
          `failed to getUsersByEmails for emails: '${emailsArr.join(', ')}'`,
        ),
        value: null,
      }
    }

    const mapUserByEmail: Record<string, boolean> = {}

    userDataByEmails.value.forEach((item) => {
      if (item.email && !mapUserByEmail[item.email]) {
        mapUserByEmail[item.email] = true
      }
    })

    const mapCountByTeacherLMSId: Record<string, number> = {}

    data.forEach((item) => {
      if (item.teacherLMSId) {
        mapCountByTeacherLMSId[item.teacherLMSId] =
          (mapCountByTeacherLMSId[item.teacherLMSId] | 0) + 1
      }
    })

    const teacherLMSIdArr: string[] = Object.keys(mapCountByTeacherLMSId)
    const teacherDataByTeacherLMSIds =
      await this.teacherRepository.getTeacherByTeacherLMSIds(teacherLMSIdArr)

    if (teacherDataByTeacherLMSIds.hasError) {
      return {
        hasError: true,
        error: wrapError(
          teacherDataByTeacherLMSIds.error,
          `failed to getTeacherByTeacherLMSIds '${teacherLMSIdArr.join(', ')}'`,
        ),
        value: null,
      }
    }

    const mapTeacherByLMSId: Record<string, boolean> = {}

    teacherDataByTeacherLMSIds.value.forEach((item) => {
      if (item.teacherLMSId && !mapTeacherByLMSId[item.teacherLMSId]) {
        mapTeacherByLMSId[item.teacherLMSId] = true
      }
    })

    data.forEach((row, i) => {
      const errors: BadRequestEnum[] = getValidationMessagesForTeacher(row)

      if (row.email && mapCountByEmail[row.email] > 1) {
        errors.push(BadRequestEnum.duplicateRecordsWithSameEmail)
      }

      if (row.teacherLMSId && mapCountByTeacherLMSId[row.teacherLMSId] > 1) {
        errors.push(BadRequestEnum.duplicateRecordsWithSameTeacherLMSId)
      }

      if (row.email && mapUserByEmail[row.email]) {
        errors.push(BadRequestEnum.userAlreadyExistWithEmail)
      }

      if (row.teacherLMSId && mapTeacherByLMSId[row.teacherLMSId]) {
        errors.push(BadRequestEnum.userAlreadyExistWithTeacherLMSId)
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
          type: 'InvalidTeacherAttributes',
          message: allErrors,
        },
        value: null,
      }
    }

    // Post district administrators to the database
    const teacherErrorable = await this.teacherRepository.createTeachers(
      organizationId,
      data,
      user.id,
    )

    if (teacherErrorable.hasError) {
      return {
        hasError: true,
        error: wrapError(teacherErrorable.error, `failed to createTeachers`),
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
