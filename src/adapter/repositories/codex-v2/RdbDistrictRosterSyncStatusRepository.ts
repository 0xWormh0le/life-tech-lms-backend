import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { DistrictRosterSyncStatus } from '../../../domain/entities/codex-v2/DistrictRosterSyncStatus'
import { DistrictRosterSyncStatusTypeormEntity } from '../../typeorm/entity/DistrictRosterSyncStatus'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'

export class RdbDistrictRosterSyncStatusRepository {
  typeormRepository: Repository<DistrictRosterSyncStatusTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      DistrictRosterSyncStatusTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: DistrictRosterSyncStatus,
  ): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(entity))

      return successErrorable(null)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create district roster sync status: ${JSON.stringify(
          entity,
        )}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findByDistrictId = async (
    id: string,
  ): Promise<
    Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({
      district_id: id,
    })
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ id })
  }

  private findAllByField = async (
    where?: FindOptionsWhere<DistrictRosterSyncStatusTypeormEntity>,
  ): Promise<
    Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (await this.typeormRepository.find({ where })).map(
        this.transformToDomainEntity,
      )

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get district roster sync statuses`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<DistrictRosterSyncStatusTypeormEntity>,
  ): Promise<
    Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOneBy(where)

      if (!result) {
        return successErrorable(null)
      }

      const entity = this.transformToDomainEntity(result)

      return successErrorable(entity)
    } catch (e) {
      const fields = Object.keys(where).join()
      const values = Object.values(where).join()

      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get district roster sync status. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: DistrictRosterSyncStatus,
  ): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: entity.id },
        this.transformToTypeormEntity(entity),
      )

      return successErrorable(null)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update district roster sync status. $${JSON.stringify(
          entity,
        )}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: DistrictRosterSyncStatusTypeormEntity,
  ): DistrictRosterSyncStatus => {
    return {
      id: typeormEntity.id,
      districtId: typeormEntity.district_id,
      startedAt: typeormEntity.started_at,
      finishedAt: typeormEntity.finished_at,
      errorMessage: typeormEntity.error_message,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: DistrictRosterSyncStatus,
  ): QueryDeepPartialEntity<DistrictRosterSyncStatusTypeormEntity> => {
    return {
      id: domainEntity.id,
      district_id: domainEntity.districtId,
      started_at: domainEntity.startedAt,
      finished_at: domainEntity.finishedAt ?? undefined,
      error_message: domainEntity.errorMessage ?? undefined,
    }
  }
}
