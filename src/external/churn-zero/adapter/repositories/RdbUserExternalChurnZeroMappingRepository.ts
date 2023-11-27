import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm'
import { UserExternalChurnZeroMapping } from '../../domain/entities/UserExternalChurnZeroMapping'
import { UserExternalChurnZeroMappingTypeormEntity } from '../../../../adapter/typeorm/entity/UserExternalChurnZeroMapping'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../../domain/usecases/shared/Errors'

export class RdbUserExternalChurnZeroMappingRepository {
  typeormRepository: Repository<UserExternalChurnZeroMappingTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      UserExternalChurnZeroMappingTypeormEntity,
    )
  }

  create = async (
    entity: UserExternalChurnZeroMapping,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(entity))

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create UserExternalChurnZeroMapping: ${JSON.stringify(
          entity,
        )}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<UserExternalChurnZeroMapping[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findByUserId = async (
    userId: string,
  ): Promise<
    Errorable<UserExternalChurnZeroMapping | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ user_id: userId })
  }

  findByUserIds = async (
    userIds: string[],
  ): Promise<
    Errorable<UserExternalChurnZeroMapping[], E<'UnknownRuntimeError'>>
  > => this.findAllByField({ user_id: In(userIds) })

  findAllByField = async (
    where?: FindOptionsWhere<UserExternalChurnZeroMappingTypeormEntity>,
  ): Promise<
    Errorable<UserExternalChurnZeroMapping[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (await this.typeormRepository.find({ where })).map(
        this.transformToDomainEntity,
      )

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get UserExternalChurnZeroMapping`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<UserExternalChurnZeroMappingTypeormEntity>,
  ): Promise<
    Errorable<UserExternalChurnZeroMapping | null, E<'UnknownRuntimeError'>>
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
        `failed to get user lesson step status. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: UserExternalChurnZeroMapping,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { user_id: entity.userId },
        this.transformToTypeormEntity(entity),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update user lesson step status. $${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserExternalChurnZeroMappingTypeormEntity,
  ): UserExternalChurnZeroMapping => {
    return {
      userId: typeormEntity.user_id,
      externalChurnZeroContactExternalId:
        typeormEntity.external_churn_zero_contact_external_id,
      externalChurnZeroAccountExternalId:
        typeormEntity.external_churn_zero_account_external_id,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: UserExternalChurnZeroMapping,
  ): QueryDeepPartialEntity<UserExternalChurnZeroMappingTypeormEntity> => {
    return {
      user_id: domainEntity.userId,
      external_churn_zero_contact_external_id:
        domainEntity.externalChurnZeroContactExternalId,
      external_churn_zero_account_external_id:
        domainEntity.externalChurnZeroAccountExternalId,
    }
  }
}
