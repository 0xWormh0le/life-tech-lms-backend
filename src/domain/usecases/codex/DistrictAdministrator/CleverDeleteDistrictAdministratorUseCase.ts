import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'

export interface IDistrictAdministratorRepository {
  deactivateDistrictAdministrators(
    districtId: string,
  ): Promise<
    Errorable<
      { message: string },
      E<'UnknownRuntimeError' | 'AdministratorNotFound'>
    >
  >
}

export class CleverDeleteDistrictAdministratorUseCase {
  constructor(
    private districtAdministratorRepository: IDistrictAdministratorRepository,
  ) {}

  async run(
    user: User,
    administratorId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidAdministratorId'>
      | E<'AdministratorNotFound'>
    >
  > {
    // Check authorization for this User
    if (user.role !== 'internalOperator') {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    //validate with provided distrcitId
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

    // Post district administrators to the database
    const districtAdministratorErrorable =
      await this.districtAdministratorRepository.deactivateDistrictAdministrators(
        administratorId,
      )

    if (districtAdministratorErrorable.hasError) {
      if (
        districtAdministratorErrorable.error.type === 'AdministratorNotFound'
      ) {
        return districtAdministratorErrorable
      }

      return {
        hasError: true,
        error: wrapError(
          districtAdministratorErrorable.error,
          `Failed to deactivateDistrictAdministrators ${administratorId}`,
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
