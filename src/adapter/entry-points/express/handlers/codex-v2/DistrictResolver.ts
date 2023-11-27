import { DataSource } from 'typeorm'
import GetDistrictsUseCase from '../../../../../domain/usecases/codex-v2/district/GetDistrictsUseCase'
import { RdbDistrictRepository } from '../../../../repositories/codex-v2/RdbDistrictRepository'
import {
  CreateDistrictPayload,
  District,
  MutationCreateDistrictArgs,
  MutationUpdateDistrictArgs,
  UpdateDistrictPayload,
} from './_gen/resolvers-type'
import { District as DomainEntityDistrict } from '../../../../../domain/entities/codex-v2/District'
import CreateDistrictUseCase from '../../../../../domain/usecases/codex-v2/district/CreateDistrictUseCase'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import UpdateDistrictUseCase from '../../../../../domain/usecases/codex-v2/district/UpdateDistrictUseCase'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'

type HandlerDistrictResponse = Omit<
  District,
  'districtPurchasedPackages' | 'administrators'
>

export class DistrictResolver {
  getUseCase: GetDistrictsUseCase

  createUseCase: CreateDistrictUseCase

  updateUseCase: UpdateDistrictUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const districtRepository = new RdbDistrictRepository(this.appDataSource)

    this.getUseCase = new GetDistrictsUseCase(districtRepository)
    this.createUseCase = new CreateDistrictUseCase(
      districtRepository,
      datetimeRepository,
    )
    this.updateUseCase = new UpdateDistrictUseCase(districtRepository)
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<HandlerDistrictResponse>
  > = async (user) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateDistrictArgs,
    Omit<CreateDistrictPayload, 'district'> & {
      district: HandlerDistrictResponse
    }
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      lmsId: input.lmsId ?? null,
      externalLmsDistrictId: input.externalLmsDistrictId ?? null,
    })

    return {
      district: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId ?? null,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateDistrictArgs,
    Omit<UpdateDistrictPayload, 'district'> & {
      district: HandlerDistrictResponse
    }
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      lmsId: input.lmsId ?? null,
      externalLmsDistrictId: input.externalLmsDistrictId ?? null,
    })

    return {
      district: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId ?? null,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityDistrict,
  ): HandlerDistrictResponse => {
    return {
      __typename: 'District',
      id: domainEntity.id,
      name: domainEntity.name,
      stateId: domainEntity.stateId,
      lmsId: domainEntity.lmsId,
      externalLmsDistrictId: domainEntity.externalLmsDistrictId,
      enableRosterSync: domainEntity.enableRosterSync,
      createdAt: domainEntity.createdAt.toISOString(),
      createdUserId: domainEntity.createdUserId,
    }
  }
}
