import { DataSource, Repository } from 'typeorm'
import { UserAccessTokenTypeormEntity } from '../../typeorm/entity/UserAccessToken'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export type UserAccessToken = {
  id: string
  userId: string
  accessToken: string
  createdAt: Date
}

export class RdbUserAccessTokenRepository {
  typeormRepository: Repository<UserAccessTokenTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      UserAccessTokenTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    userAccessToken: UserAccessToken,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(userAccessToken),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(userAccessToken)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<UserAccessToken[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const userAccessTokens = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(userAccessTokens)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all userAccessTokens',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id,
      })

      if (!result) {
        return successErrorable(null)
      }

      const userAccessToken = this.transformToDomainEntity(result)

      return successErrorable(userAccessToken)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get userAccessToken. id: ${id}`,
        e,
      )
    }
  }

  findByAccessToken = async (
    accessToken: string,
  ): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        access_token: accessToken,
      })

      if (!result) {
        return successErrorable(null)
      }

      const userAccessToken = this.transformToDomainEntity(result)

      return successErrorable(userAccessToken)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get userAccessToken. accessToken: ${accessToken}`,
        e,
      )
    }
  }

  update = async (
    userAccessToken: UserAccessToken,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: userAccessToken.id },
        this.transformToTypeormEntity(userAccessToken),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update userAccessToken. $${JSON.stringify(userAccessToken)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserAccessTokenTypeormEntity,
  ): UserAccessToken => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      accessToken: typeormEntity.access_token,
      createdAt: typeormEntity.created_at,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: UserAccessToken,
  ): QueryDeepPartialEntity<UserAccessTokenTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      access_token: domainEntity.accessToken,
      created_at: domainEntity.createdAt,
    }
  }
}
