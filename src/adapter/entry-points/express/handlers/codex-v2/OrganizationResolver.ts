import { DataSource } from 'typeorm'
import GetOrganizationsUseCase from '../../../../../domain/usecases/codex-v2/organization/GetOrganizationsUseCase'
import UpdateOrganizationUseCase from '../../../../../domain/usecases/codex-v2/organization/UpdateOrganizationUseCase'
import CreateOrganizationUseCase from '../../../../../domain/usecases/codex-v2/organization/CreateOrganizationUseCase'
import { RdbOrganizationRepository } from '../../../../repositories/codex-v2/RdbOrganizationRepository'
import { RdbDistrictRepository } from '../../../../repositories/codex-v2/RdbDistrictRepository'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import {
  Organization,
  MutationCreateOrganizationArgs,
  MutationUpdateOrganizationArgs,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from './_gen/resolvers-type'
import { Organization as DomainEntityOrganization } from '../../../../../domain/entities/codex-v2/Organization'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'

type ResolverOrganizationResponse = Organization

export class OrganizationResolver {
  getUseCase: GetOrganizationsUseCase

  createUseCase: CreateOrganizationUseCase

  updateUseCase: UpdateOrganizationUseCase

  constructor(private readonly appDataSource: DataSource) {
    const organizationRepository = new RdbOrganizationRepository(
      this.appDataSource,
    )
    const datetimeRepository = new SystemDateTimeRepository()
    const districtRepository = new RdbDistrictRepository(this.appDataSource)

    this.getUseCase = new GetOrganizationsUseCase(organizationRepository)
    this.createUseCase = new CreateOrganizationUseCase(
      datetimeRepository,
      districtRepository,
      organizationRepository,
    )
    this.updateUseCase = new UpdateOrganizationUseCase(
      datetimeRepository,
      districtRepository,
      organizationRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<void, QueryResult<Organization>> =
    async (user) => {
      const res = await this.getUseCase.run(user)
      const data = valueOrThrowErr(res)

      return {
        items: data.map(this.transformToGraphqlSchema),
        count: data.length,
      }
    }

  create: ResolverWithAuthenticatedUser<
    MutationCreateOrganizationArgs,
    CreateOrganizationPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      externalLmsOrganizationId: input.externalLmsOrganizationId ?? null,
      classlinkTenantId: input.classlinkTenantId ?? null,
    })

    return {
      organization: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateOrganizationArgs,
    UpdateOrganizationPayload
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      externalLmsOrganizationId: input.externalLmsOrganizationId ?? null,
      classlinkTenantId: input.classlinkTenantId ?? null,
    })

    return {
      organization: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityOrganization,
  ): ResolverOrganizationResponse => {
    return {
      __typename: 'Organization',
      id: domainEntity.id,
      name: domainEntity.name,
      districtId: domainEntity.districtId,
      externalLmsOrganizationId: domainEntity.externalLmsOrganizationId,
      classlinkTenantId: domainEntity.classlinkTenantId,
      createdAt: domainEntity.createdAt.toISOString(),
      updatedAt: domainEntity.updatedAt.toISOString(),
    }
  }
}
