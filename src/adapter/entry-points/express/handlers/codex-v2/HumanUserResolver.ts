import { DataSource } from 'typeorm'
import GetHumanUsersUseCase from '../../../../../domain/usecases/codex-v2/human-user/GetHumanUsersUseCase'
import UpdateHumanUserUseCase from '../../../../../domain/usecases/codex-v2/human-user/UpdateHumanUserUseCase'
import CreateHumanUserUseCase from '../../../../../domain/usecases/codex-v2/human-user/CreateHumanUserUseCase'
import { RdbHumanUserRepository } from '../../../../repositories/codex-v2/RdbHumanUserRepository'
import { RdbUserRepository } from '../../../../repositories/codex-v2/RdbUserRepository'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import {
  CreateHumanUserPayload,
  HumanUser,
  MutationCreateHumanUserArgs,
  MutationUpdateHumanUserArgs,
  UpdateHumanUserPayload,
  QueryHumanUsersArgs,
} from './_gen/resolvers-type'
import { HumanUser as DomainEntityHumanUser } from '../../../../../domain/entities/codex-v2/HumanUser'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'
import GetHumanUserByUserIdUseCase from '../../../../../domain/usecases/codex-v2/human-user/GetHumanUserByUserIdUseCase'

type ResolverHumanUserResponse = HumanUser

export class HumanUserResolver {
  getUseCase: GetHumanUsersUseCase

  getByUserIdUseCase: GetHumanUserByUserIdUseCase

  createUseCase: CreateHumanUserUseCase

  updateUseCase: UpdateHumanUserUseCase

  constructor(private readonly appDataSource: DataSource) {
    const humanUserRepository = new RdbHumanUserRepository(this.appDataSource)
    const datetimeRepository = new SystemDateTimeRepository()
    const userRepository = new RdbUserRepository(this.appDataSource)

    this.getUseCase = new GetHumanUsersUseCase(humanUserRepository)
    this.getByUserIdUseCase = new GetHumanUserByUserIdUseCase(
      humanUserRepository,
    )
    this.createUseCase = new CreateHumanUserUseCase(
      datetimeRepository,
      userRepository,
      humanUserRepository,
    )
    this.updateUseCase = new UpdateHumanUserUseCase(
      datetimeRepository,
      userRepository,
      humanUserRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryHumanUsersArgs,
    QueryResult<ResolverHumanUserResponse>
  > = async (user, _parent, { email }) => {
    const res = await this.getUseCase.run(
      user,
      typeof email === 'string' ? email : null,
    )
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  getHumanUserByUserId: ResolverWithAuthenticatedUser<
    void,
    HumanUser,
    { userId: string }
  > = async (user, parent): Promise<ResolverHumanUserResponse> => {
    const res = await this.getByUserIdUseCase.run(user, parent.userId)

    return this.transformToGraphqlSchema(valueOrThrowErr(res))
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateHumanUserArgs,
    CreateHumanUserPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      email: input.email ?? null,
      loginId: input.loginId ?? null,
      plainPassword: input.password ?? null,
    })

    return {
      humanUser: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateHumanUserArgs,
    UpdateHumanUserPayload
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      email: input.email ?? null,
      loginId: input.loginId ?? null,
      plainPassword: input.password ?? null,
    })

    return {
      humanUser: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityHumanUser,
  ): ResolverHumanUserResponse => {
    return {
      __typename: 'HumanUser',
      userId: domainEntity.userId,
      loginId: domainEntity.loginId,
      email: domainEntity.email,
      password: domainEntity.hashedPassword,
      user: {
        id: '',
        isDemo: false,
        role: '',
      },
    }
  }
}
