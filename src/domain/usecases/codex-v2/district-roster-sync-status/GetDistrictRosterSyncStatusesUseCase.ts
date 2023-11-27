import { DistrictRosterSyncStatus } from '../../../entities/codex-v2/DistrictRosterSyncStatus'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface DistrictRosterSyncStatusRepository {
  findAll(): Promise<
    Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>
  >
  findByDistrictId(
    id: string,
  ): Promise<Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>>
}

export default class GetDistrictRosterSyncStatusesUseCase {
  constructor(
    private readonly districtRosterSyncStatusRepository: DistrictRosterSyncStatusRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    districtId: string | null,
  ): Promise<
    Errorable<
      DistrictRosterSyncStatus[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    if (districtId === null) {
      return await this.districtRosterSyncStatusRepository.findAll()
    } else {
      return await this.districtRosterSyncStatusRepository.findByDistrictId(
        districtId,
      )
    }
  }
}
