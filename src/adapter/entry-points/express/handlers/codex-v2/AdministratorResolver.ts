import { DataSource } from 'typeorm'
import GetAdministratorsUseCase from '../../../../../domain/usecases/codex-v2/administrator/GetAdministratorsUseCase'
import UpdateAdministratorUseCase from '../../../../../domain/usecases/codex-v2/administrator/UpdateAdministratorUseCase'
import CreateAdministratorUseCase from '../../../../../domain/usecases/codex-v2/administrator/CreateAdministratorUseCase'
import { RdbAdministratorRepository } from '../../../../repositories/codex-v2/RdbAdministratorRepository'
import { RdbDistrictRepository } from '../../../../repositories/codex-v2/RdbDistrictRepository'
import { RdbUserRepository } from '../../../../repositories/codex-v2/RdbUserRepository'
import { RdbHumanUserRepository } from '../../../../repositories/codex-v2/RdbHumanUserRepository'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import {
  Administrator,
  MutationCreateAdministratorArgs,
  CreateAdministratorPayload,
  MutationUpdateAdministratorArgs,
  UpdateAdministratorPayload,
} from './_gen/resolvers-type'
import { Administrator as DomainEntityAdministrator } from '../../../../../domain/entities/codex-v2/Administrator'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'

type ResolverAdministratorResponse = Omit<Administrator, 'humanUser'>

export class AdministratorResolver {
  administratorRepository: RdbAdministratorRepository

  getUseCase: GetAdministratorsUseCase

  updateUseCase: UpdateAdministratorUseCase

  createUseCase: CreateAdministratorUseCase

  constructor(private readonly appDataSource: DataSource) {
    const districtRepository = new RdbDistrictRepository(this.appDataSource)
    const userRepository = new RdbUserRepository(this.appDataSource)
    const humanUserRepository = new RdbHumanUserRepository(this.appDataSource)
    const datetimeRepository = new SystemDateTimeRepository()

    this.administratorRepository = new RdbAdministratorRepository(
      this.appDataSource,
    )
    this.getUseCase = new GetAdministratorsUseCase(this.administratorRepository)
    this.updateUseCase = new UpdateAdministratorUseCase(
      districtRepository,
      this.administratorRepository,
    )
    this.createUseCase = new CreateAdministratorUseCase(
      datetimeRepository,
      userRepository,
      humanUserRepository,
      districtRepository,
      this.administratorRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<ResolverAdministratorResponse>
  > = async (user) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateAdministratorArgs,
    Omit<CreateAdministratorPayload, 'administrator'> & {
      administrator: ResolverAdministratorResponse
    }
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      externalLmsAdministratorId: input.externalLmsAdministratorId ?? null,
    })

    return {
      administrator: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateAdministratorArgs,
    Omit<UpdateAdministratorPayload, 'administrator'> & {
      administrator: ResolverAdministratorResponse
    }
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      externalLmsAdministratorId: input.externalLmsAdministratorId ?? null,
    })

    return {
      administrator: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityAdministrator,
  ): ResolverAdministratorResponse => {
    return {
      __typename: 'Administrator',
      id: domainEntity.id,
      userId: domainEntity.userId,
      role: domainEntity.role,
      districtId: domainEntity.districtId,
      firstName: domainEntity.firstName,
      lastName: domainEntity.lastName,
      externalLmsAdministratorId: domainEntity.externalLmsAdministratorId,
      isDeactivated: domainEntity.isDeactivated,
      createdUserId: domainEntity.createdUserId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
