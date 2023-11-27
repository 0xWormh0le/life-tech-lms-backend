import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [userRoles.internalOperator]

export interface IDistrictRepository {
  deleteDistrict(
    districtId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>>
  >
}

export class DeleteDistrictUseCase {
  constructor(private distictRepository: IDistrictRepository) {}

  async run(
    user: User,
    districtId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidDistrictId'>
      | E<'DistrictInfoNotFound'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    // Validate with provided districtId
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

    // Delete District From DistrictRepository
    const districtResult = await this.distictRepository.deleteDistrict(
      districtId,
    )

    if (districtResult.hasError) {
      switch (districtResult.error.type) {
        case 'DistrictInfoNotFound': {
          return {
            hasError: true,
            error: wrapError(
              districtResult.error,
              `district information not found.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              districtResult.error,
              `failed to delete district ${districtId}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: districtResult.value,
    }
  }
}
