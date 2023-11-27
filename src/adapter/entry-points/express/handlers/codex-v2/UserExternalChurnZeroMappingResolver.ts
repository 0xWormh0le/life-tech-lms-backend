import { DataSource } from 'typeorm'
import {
  CreateUserExternalChurnZeroMappingPayload,
  MutationCreateUserExternalChurnZeroMappingArgs,
  QueryUserExternalChurnZeroMappingArgs,
  UserExternalChurnZeroMapping,
  MutationUpdateUserExternalChurnZeroMappingArgs,
  UpdateUserExternalChurnZeroMappingPayload,
} from './_gen/resolvers-type'
import { UserExternalChurnZeroMapping as DomainEntityUserExternalChurnZeroMapping } from '../../../../../external/churn-zero/domain/entities/UserExternalChurnZeroMapping'
import { ResolverWithAuthenticatedUser } from '.'
import GetUserExternalChurnZeroMappingUseCase from '../../../../../external/churn-zero/domain/usecases/user-external-churn-zero-contact-mapping/GetUserExternalChurnZeroMappingUseCase'
import CreateUserExternalChurnZeroMappingUseCase from '../../../../../external/churn-zero/domain/usecases/user-external-churn-zero-contact-mapping/CreateUserExternalChurnZeroMappingUseCase'
import UpdateUserExternalChurnZeroMappingUseCase from '../../../../../external/churn-zero/domain/usecases/user-external-churn-zero-contact-mapping/UpdateUserExternalChurnZeroMappingUseCase'
import { RdbUserExternalChurnZeroMappingRepository } from '../../../../../external/churn-zero/adapter/repositories/RdbUserExternalChurnZeroMappingRepository'
import { valueOrThrowErr } from './utilities'

export class UserExternalChurnZeroMappingResolver {
  getOneUseCase: GetUserExternalChurnZeroMappingUseCase

  createUseCase: CreateUserExternalChurnZeroMappingUseCase

  updateUseCase: UpdateUserExternalChurnZeroMappingUseCase

  constructor(private readonly appDataSource: DataSource) {
    const userExternalChurnZeroMappingRepository =
      new RdbUserExternalChurnZeroMappingRepository(this.appDataSource)

    this.getOneUseCase = new GetUserExternalChurnZeroMappingUseCase(
      userExternalChurnZeroMappingRepository,
    )
    this.createUseCase = new CreateUserExternalChurnZeroMappingUseCase(
      userExternalChurnZeroMappingRepository,
    )
    this.updateUseCase = new UpdateUserExternalChurnZeroMappingUseCase(
      userExternalChurnZeroMappingRepository,
    )
  }

  queryOne: ResolverWithAuthenticatedUser<
    QueryUserExternalChurnZeroMappingArgs,
    UserExternalChurnZeroMapping
  > = async (user, _parent, { userId }) => {
    const res = await this.getOneUseCase.run(user, userId)
    const data = valueOrThrowErr(res)

    return this.transformToGraphqlSchema(data)
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateUserExternalChurnZeroMappingArgs,
    CreateUserExternalChurnZeroMappingPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, input)

    return {
      userExternalChurnZeroMapping: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateUserExternalChurnZeroMappingArgs,
    UpdateUserExternalChurnZeroMappingPayload
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, input)

    return {
      userExternalChurnZeroMapping: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityUserExternalChurnZeroMapping,
  ): UserExternalChurnZeroMapping => {
    return {
      __typename: 'UserExternalChurnZeroMapping',
      userId: domainEntity.userId,
      externalChurnZeroContactExternalId:
        domainEntity.externalChurnZeroContactExternalId,
      externalChurnZeroAccountExternalId:
        domainEntity.externalChurnZeroAccountExternalId,
    }
  }
}
