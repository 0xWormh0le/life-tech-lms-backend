import { DistrictRosterSyncStatus } from '../../entities/codex/DistrictRosterSyncStatus'
import { User } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'
import { isValidUUID } from '../shared/Ensure'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IDistrictRosterSyncStatusRepository {
  getDistrictRosterSyncStatus(
    districtId: string,
  ): Promise<
    Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>
  >
}

export class GetDistrictRosterSyncStatusUseCase {
  constructor(
    private districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository,
  ) {}

  async run(
    requestedUser: User,
    districtId: string,
  ): Promise<
    Errorable<
      DistrictRosterSyncStatus | null,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'InvalidDistrictId'>
    >
  > {
    if (requestedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to view roster sync status.',
        },
        value: null,
      }
    }

    //validate with provided districtId
    if (!isValidUUID(districtId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidDistrictId',
          message: 'Invalid format of DistrictId.',
        },
        value: null,
      }
    }

    const result =
      await this.districtRosterSyncStatusRepository.getDistrictRosterSyncStatus(
        districtId,
      )

    if (result.hasError) {
      return {
        hasError: true,
        error: wrapError(
          result.error,
          `Failed to get roster sync status of district : ${districtId}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: result.value,
    }
  }
}
