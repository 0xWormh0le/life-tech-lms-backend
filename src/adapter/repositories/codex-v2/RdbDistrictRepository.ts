import { DataSource, Repository } from 'typeorm'
import { District } from '../../../domain/entities/codex-v2/District'
import { DistrictTypeormEntity } from '../../typeorm/entity/District'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbDistrictRepository {
  typeormRepository: Repository<DistrictTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    district: District,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(district),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(district)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<District[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const districts = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(districts)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all districts',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id,
      })

      if (!result) {
        return successErrorable(null)
      }

      const district = this.transformToDomainEntity(result)

      return successErrorable(district)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get district. id: ${id}`,
        e,
      )
    }
  }

  findByName = async (
    name: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        name,
      })

      if (!result) {
        return successErrorable(null)
      }

      const district = this.transformToDomainEntity(result)

      return successErrorable(district)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get district. name: ${name}`,
        e,
      )
    }
  }

  update = async (
    district: District,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: district.id },
        this.transformToTypeormEntity(district),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update district. $${JSON.stringify(district)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: DistrictTypeormEntity,
  ): District => {
    return {
      id: typeormEntity.id,
      name: typeormEntity.name,
      stateId: typeormEntity.state_id,
      lmsId: typeormEntity.lms_id,
      externalLmsDistrictId: typeormEntity.district_lms_id,
      enableRosterSync: typeormEntity.enable_roster_sync,
      createdAt: typeormEntity.created_at,
      createdUserId: typeormEntity.created_user_id,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: District,
  ): QueryDeepPartialEntity<DistrictTypeormEntity> => {
    return {
      id: domainEntity.id,
      name: domainEntity.name,
      state_id: domainEntity.stateId ?? undefined,
      lms_id: domainEntity.lmsId,
      district_lms_id: domainEntity.externalLmsDistrictId,
      enable_roster_sync: domainEntity.enableRosterSync,
      created_user_id: domainEntity.createdUserId ?? undefined,
      created_at: domainEntity.createdAt,
    }
  }
}
