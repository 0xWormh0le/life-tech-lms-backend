import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { DistrictPurchasedPackage } from '../../../domain/entities/codex-v2/DistrictPurchasedPackage'
import { DistrictPurchasedPackageTypeormEntity } from '../../typeorm/entity/DistrictPurchasedPackage'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'

export class RdbDistrictPurchasedPackageRepository {
  typeormRepository: Repository<DistrictPurchasedPackageTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      DistrictPurchasedPackageTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: DistrictPurchasedPackage,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const districtEntity = await this.transformToTypeormEntity(entity)

      await this.typeormRepository.insert(districtEntity)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create district purchased package: ${JSON.stringify(
          entity,
        )}`,
        e,
      )
    }
  }

  findAll = async (
    relation = false,
  ): Promise<
    Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (
        await this.typeormRepository.find(
          relation ? { relations: ['district_id'] } : undefined,
        )
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get all district purchased packages`,
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<DistrictPurchasedPackage | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findByField({ id })
  }

  findByDistrictId = async (
    districtId: string,
  ): Promise<
    Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (
        await this.typeormRepository.find({
          where: {
            district_id: {
              id: districtId,
            },
          },
          relations: ['district_id'],
        })
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get all district purchased packages`,
        e,
      )
    }
  }

  private findByField = async (
    where: FindOptionsWhere<DistrictPurchasedPackageTypeormEntity>,
  ): Promise<
    Errorable<DistrictPurchasedPackage | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOne({
        where,
        relations: ['district_id'],
      })

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
        `failed to get district purchased package. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: Partial<DistrictPurchasedPackage>,
  ): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
    try {
      const typeormEntity = await this.transformToTypeormEntity(entity)

      if (entity.id === undefined) {
        return failureErrorable(
          'UnknownRuntimeError',
          'failed to update district purchased package: id is missing',
        )
      }
      await this.typeormRepository.update({ id: entity.id }, typeormEntity)

      return successErrorable(null)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update district purchased package. $${JSON.stringify(
          entity,
        )}`,
        e,
      )
    }
  }

  delete = async (
    id: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.delete({ id: id })

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to delete district purchased package. id: ${id}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: DistrictPurchasedPackageTypeormEntity,
  ): DistrictPurchasedPackage => {
    return {
      id: typeormEntity.id,
      curriculumPackageId: typeormEntity.package_id,
      createdUserId: typeormEntity.created_user_id,
      districtId: typeormEntity.district_id.id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = async (
    domainEntity: Partial<DistrictPurchasedPackage>,
  ): Promise<QueryDeepPartialEntity<DistrictPurchasedPackageTypeormEntity>> => {
    const result: QueryDeepPartialEntity<DistrictPurchasedPackageTypeormEntity> =
      {
        id: domainEntity.id,
        package_id: domainEntity.curriculumPackageId,
        created_user_id: domainEntity.createdUserId ?? undefined,
        created_date: domainEntity.createdAt,
        district_id: { id: domainEntity.districtId },
      }

    return result
  }
}
