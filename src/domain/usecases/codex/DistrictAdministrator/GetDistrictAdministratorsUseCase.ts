import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'

export interface IDistrictAdministratorRepository {
  getDistrictAdministrators(
    districtId: string,
    administratorIds: string[] | undefined,
  ): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>>
}

export class GetDistrictAdministratorsUseCase {
  constructor(
    private districtAdministratorRepository: IDistrictAdministratorRepository,
  ) {}

  async run(
    user: User,
    districtId: string,
    administratorIds: string[] | undefined,
  ): Promise<
    Errorable<
      DistrictAdministrator[],
      | E<'DistrictAdministratorNotFoundError'>
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidDistrictId'>
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

    // Get district administrators from some Reposity
    const districtAdministratorErrorable =
      await this.districtAdministratorRepository.getDistrictAdministrators(
        districtId,
        administratorIds,
      )

    if (districtAdministratorErrorable.hasError) {
      return {
        hasError: true,
        error: wrapError(
          districtAdministratorErrorable.error,
          `Failed to getDistrictAdministrators ${districtId}`,
        ),
        value: null,
      }
    }

    if (districtAdministratorErrorable.value.length === 0) {
      return {
        hasError: true,
        error: {
          type: 'DistrictAdministratorNotFoundError',
          message: `No district administrator found for district id ${districtId}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: districtAdministratorErrorable.value,
    }
  }
}
