import { DataSource } from 'typeorm'
import GetDistrictRosterSyncStatusUseCase from '../../../../../domain/usecases/codex-v2/district-roster-sync-status/GetDistrictRosterSyncStatusesUseCase'
import { RdbDistrictRosterSyncStatusRepository } from '../../../../repositories/codex-v2/RdbDistrictRosterSyncStatusRepository'
import {
  DistrictRosterSyncStatus,
  QueryDistrictRosterSyncStatusesArgs,
} from './_gen/resolvers-type'
import { DistrictRosterSyncStatus as DomainEntityDistrictRosterSyncStatus } from '../../../../../domain/entities/codex-v2/DistrictRosterSyncStatus'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'

export class DistrictRosterSyncStatusResolver {
  getUseCase: GetDistrictRosterSyncStatusUseCase

  constructor(private readonly appDataSource: DataSource) {
    const districtResolverSyncStatusRepository =
      new RdbDistrictRosterSyncStatusRepository(this.appDataSource)

    this.getUseCase = new GetDistrictRosterSyncStatusUseCase(
      districtResolverSyncStatusRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryDistrictRosterSyncStatusesArgs,
    QueryResult<DistrictRosterSyncStatus>
  > = async (user, _parent, { districtId }) => {
    const res = await this.getUseCase.run(user, districtId ?? null)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityDistrictRosterSyncStatus,
  ): DistrictRosterSyncStatus => {
    return {
      __typename: 'DistrictRosterSyncStatus',
      id: domainEntity.id,
      districtId: domainEntity.districtId,
      errorMessage: domainEntity.errorMessage,
      startedAt: domainEntity.startedAt.toISOString(),
      finishedAt: domainEntity.finishedAt?.toISOString(),
    }
  }
}
