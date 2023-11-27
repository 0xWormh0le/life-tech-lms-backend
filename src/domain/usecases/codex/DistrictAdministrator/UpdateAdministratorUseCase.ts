import { Administrator } from '../../../entities/codex/DistrictAdministrator'
import { UserRole } from './../../../entities/codex/User'
import { User } from '../../../entities/codex/User'
import { isValidEmail, isValidUUID } from '../../shared/Ensure'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export interface IAdministratorRepository {
  updateAdministratorById(
    user: User,
    administratorId: string,
    administrator: Administrator,
  ): Promise<
    Errorable<
      Administrator,
      | E<'UnknownRuntimeError'>
      | E<'AdministratorNotFound'>
      | E<'EmailAlreadyExists'>
      | E<'InvalidAdministratorId'>
      | E<'PermissionDenied'>
      | E<'InvalidEmail'>
    >
  >
}

export class UpdateAdministratorUseCase {
  constructor(private administratorRepository: IAdministratorRepository) {}

  async run(
    user: User,
    administratorId: string,
    administrator: Administrator,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AdministratorNotFound'>
      | E<'EmailAlreadyExists'>
      | E<'InvalidAdministratorId'>
      | E<'PermissionDenied'>
      | E<'InvalidEmail'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            "The user does not have permission to edit the specified administrator's information",
        },
        value: null,
      }
    }

    // Validate with provided administratorId
    if (!isValidUUID(administratorId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidAdministratorId',
          message: 'Invalid administratorId',
        },
        value: null,
      }
    }

    //validate provided email is valid or not
    if (!isValidEmail(administrator.email)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidEmail',
          message: 'Invalid email is provided',
        },
        value: null,
      }
    }

    const updateAdministratorResult =
      await this.administratorRepository.updateAdministratorById(
        user,
        administratorId,
        administrator,
      )

    if (updateAdministratorResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          updateAdministratorResult.error,
          updateAdministratorResult.error.message,
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
