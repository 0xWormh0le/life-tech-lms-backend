import { DataSource } from 'typeorm'
import GetUsersUseCase from '../../../../../domain/usecases/codex-v2/user/GetUsersUseCase'
import GetUserByIdUseCase from '../../../../../domain/usecases/codex-v2/user/GetUserByIdUseCase'
import { RdbUserRepository } from '../../../../repositories/codex-v2/RdbUserRepository'
import {
  CreateUserPayload,
  User,
  HumanUser,
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
  UpdateUserPayload,
} from './_gen/resolvers-type'
import { User as DomainEntityUser } from '../../../../../domain/entities/codex-v2/User'
import CreateUserUseCase from '../../../../../domain/usecases/codex-v2/user/CreateUserUseCase'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import UpdateUserUseCase from '../../../../../domain/usecases/codex-v2/user/UpdateUserUseCase'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'

type HandlerUserResponse = User

export class UserResolver {
  getUseCase: GetUsersUseCase

  geUserByIdUseCase: GetUserByIdUseCase

  createUseCase: CreateUserUseCase

  updateUseCase: UpdateUserUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const userRepository = new RdbUserRepository(this.appDataSource)

    this.getUseCase = new GetUsersUseCase(userRepository)
    this.geUserByIdUseCase = new GetUserByIdUseCase(userRepository)
    this.createUseCase = new CreateUserUseCase(
      userRepository,
      datetimeRepository,
    )
    this.updateUseCase = new UpdateUserUseCase(
      datetimeRepository,
      userRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<void, QueryResult<User>> = async (
    user,
  ) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  getUserById: ResolverWithAuthenticatedUser<void, User, HumanUser> = async (
    user,
    parent,
  ): Promise<User> => {
    const res = await this.geUserByIdUseCase.run(user, parent.userId)

    return this.transformToGraphqlSchema(valueOrThrowErr(res))
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateUserArgs,
    Omit<CreateUserPayload, 'user'> & {
      user: HandlerUserResponse
    }
  > = async (user, _parent, { input }) => {
    if (
      input.role !== 'internalOperator' &&
      input.role !== 'administrator' &&
      input.role !== 'teacher' &&
      input.role !== 'student'
    ) {
      throw new Error(`unknown userRole. role: ${input.role}`)
    }

    const res = await this.createUseCase.run(user, {
      ...input,
      role: input.role,
    })

    return {
      user: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId ?? null,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateUserArgs,
    Omit<UpdateUserPayload, 'user'> & {
      user: HandlerUserResponse
    }
  > = async (user, _parent, { input }) => {
    if (
      input.role !== 'internalOperator' &&
      input.role !== 'administrator' &&
      input.role !== 'teacher' &&
      input.role !== 'student'
    ) {
      throw new Error(`unknown userRole. role: ${input.role}`)
    }

    const res = await this.updateUseCase.run(user, {
      ...input,
      role: input.role,
    })

    return {
      user: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId ?? null,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityUser,
  ): HandlerUserResponse => {
    return {
      __typename: 'User',
      id: domainEntity.id,
      role: domainEntity.role,
      isDemo: domainEntity.isDemo,
    }
  }
}
