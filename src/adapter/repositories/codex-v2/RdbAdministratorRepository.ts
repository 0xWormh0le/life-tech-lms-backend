import { DataSource, Repository } from 'typeorm'
import { Administrator } from '../../../domain/entities/codex-v2/Administrator'
import { AdministratorTypeormEntity } from '../../typeorm/entity/Administrator'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { AdministratorDistrictTypeormEntity } from '../../typeorm/entity/AdministratorDistrict'
import { AdministratorRepository } from '../../../domain/usecases/codex-v2/_shared/repositories/AdministratorRepository'

export class RdbAdministratorRepository implements AdministratorRepository {
  typeormAdministratorRepository: Repository<AdministratorTypeormEntity>

  typeormAdministratorDistrictRepository: Repository<AdministratorDistrictTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormAdministratorRepository = this.typeormDataSource.getRepository(
      AdministratorTypeormEntity,
    )
    this.typeormAdministratorDistrictRepository =
      this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    administrator: Administrator,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const administratorTypeormEntity =
        this.transformToTypeormEntity(administrator)

      await this.typeormAdministratorRepository.insert(
        administratorTypeormEntity,
      )

      await this.typeormAdministratorDistrictRepository.insert({
        id: uuid(),
        administrator: administrator,
        district: {
          id: administrator.districtId,
        },
        created_user_id: administrator.createdUserId,
        created_date: administrator.createdAt,
      })

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(administrator)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<Administrator[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const administrators = (
        await this.typeormAdministratorDistrictRepository.find({
          relations: ['district', 'administrator'],
        })
      )
        // await this.typeormAdministratorRepository
        //   .createQueryBuilder('administrators')
        //   .leftJoinAndSelect(
        //     AdministratorDistrictTypeormEntity,
        //     'administrators_districts',
        //     'administrators.id::VARCHAR = administrators_districts.administrator_id::VARCHAR',
        //   )
        //   .select('administrators.*')
        //   .addSelect('administrators_districts.district_id')
        //   .getRawMany()
        .map((e: AdministratorDistrictTypeormEntity) => {
          // ).map((e: AdministratorTypeormEntity & { district_id: string } ) => {
          //   return this.transformToDomainEntity(e, e.district_id)
          return this.transformToDomainEntity(e.administrator, e.district.id)
        })

      return successErrorable(administrators)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all administrators',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormAdministratorDistrictRepository.findOne({
        where: {
          administrator: {
            id: id,
          },
        },
        relations: ['district', 'administrator'],
      })

      if (!result) {
        return successErrorable(null)
      }

      const administrator = this.transformToDomainEntity(
        result.administrator,
        result.district.id,
      )

      return successErrorable(administrator)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get administrator. id: ${id}`,
        e,
      )
    }
  }

  findByUserId = async (
    userId: string,
  ): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormAdministratorDistrictRepository.findOne({
        where: {
          administrator: {
            user_id: userId,
          },
        },
        relations: ['district', 'administrator'],
      })

      if (!result) {
        return successErrorable(null)
      }

      const administrator = this.transformToDomainEntity(
        result.administrator,
        result.district.id,
      )

      return successErrorable(administrator)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get administrator. userId: ${userId}`,
        e,
      )
    }
  }

  update = async (
    administrator: Administrator,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormAdministratorRepository.update(
        { id: administrator.id },
        this.transformToTypeormEntity(administrator),
      )
      await this.typeormAdministratorDistrictRepository.update(
        {
          administrator: {
            id: administrator.id,
          },
        },
        {
          district: {
            id: administrator.districtId,
          },
        },
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update administrator. $${JSON.stringify(administrator)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    administratorTypeormEntity: AdministratorTypeormEntity,
    districtId: string,
  ): Administrator => {
    return {
      id: administratorTypeormEntity.id,
      userId: administratorTypeormEntity.user_id,
      role: `administrator`,
      districtId: districtId,
      firstName: administratorTypeormEntity.first_name,
      lastName: administratorTypeormEntity.last_name,
      externalLmsAdministratorId:
        administratorTypeormEntity.administrator_lms_id,
      isDeactivated: administratorTypeormEntity.is_deactivated,
      createdUserId: administratorTypeormEntity.created_user_id,
      createdAt: administratorTypeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: Administrator,
  ): QueryDeepPartialEntity<AdministratorTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      first_name: domainEntity.firstName ?? '',
      last_name: domainEntity.lastName ?? '',
      administrator_lms_id: domainEntity.externalLmsAdministratorId,
      is_deactivated: domainEntity.isDeactivated,
      created_date: domainEntity.createdAt,
      created_user_id: domainEntity.createdUserId ?? undefined,
    }
  }
}
