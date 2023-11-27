import { DataSource } from 'typeorm'
import GetClasslinkTenantCredentialByDistrictIdUseCase from '../../../../../domain/usecases/codex-v2/classlink-tenant-credential/GetClasslinkTenantCredentialByDistrictIdUseCase'
import { RdbClasslinkTenantCredentialRepository } from '../../../../repositories/codex-v2/RdbClasslinkTenantCredentialRepository'
import {
  ClasslinkTenantCredential,
  CreateClasslinkTenantCredentialPayload,
  District,
  MutationCreateClasslinkTenantCredentialArgs,
  UpdateClasslinkTenantCredentialPayload,
  MutationUpdateClasslinkTenantCredentialArgs,
} from './_gen/resolvers-type'
import { ClasslinkTenantCredential as DomainEntityClasslinkTenantCredential } from '../../../../../domain/entities/codex-v2/ClasslinkTenantCredential'
import CreateClasslinkTenantCredentialUseCase from '../../../../../domain/usecases/codex-v2/classlink-tenant-credential/CreateClasslinkTenantCredentialUseCase'
import UpdateClasslinkTenantCredentialUseCase from '../../../../../domain/usecases/codex-v2/classlink-tenant-credential/UpdateClasslinkTenantCredentialUseCase'
import { RdbDistrictRepository } from '../../../../repositories/codex-v2/RdbDistrictRepository'
import { ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'

export class ClasslinkTenantCredentialResolver {
  getUseCase: GetClasslinkTenantCredentialByDistrictIdUseCase

  createUseCase: CreateClasslinkTenantCredentialUseCase

  updateUseCase: UpdateClasslinkTenantCredentialUseCase

  constructor(private readonly appDataSource: DataSource) {
    const districtRepository = new RdbDistrictRepository(this.appDataSource)
    const classlinkTenantCredentialRepository =
      new RdbClasslinkTenantCredentialRepository(this.appDataSource)

    this.getUseCase = new GetClasslinkTenantCredentialByDistrictIdUseCase(
      classlinkTenantCredentialRepository,
    )
    this.createUseCase = new CreateClasslinkTenantCredentialUseCase(
      classlinkTenantCredentialRepository,
      districtRepository,
    )
    this.updateUseCase = new UpdateClasslinkTenantCredentialUseCase(
      classlinkTenantCredentialRepository,
      districtRepository,
    )
  }

  getClasslinkTenantCredentialByDistrictIdFromDistrict: ResolverWithAuthenticatedUser<
    void,
    ClasslinkTenantCredential | null,
    District
  > = async (user, district: District) => {
    const res = await this.getUseCase.run(user, district.id)
    const value = valueOrThrowErr(res)

    if (!value) {
      return null
    }

    return this.transformToGraphqlSchema(value)
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateClasslinkTenantCredentialArgs,
    CreateClasslinkTenantCredentialPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, input)

    return {
      classlinkTenantCredential: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateClasslinkTenantCredentialArgs,
    UpdateClasslinkTenantCredentialPayload
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, input)

    return {
      classlinkTenantCredential: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityClasslinkTenantCredential,
  ): ClasslinkTenantCredential => {
    return {
      __typename: 'ClasslinkTenantCredential',
      accessToken: domainEntity.accessToken,
      districtId: domainEntity.districtId,
      externalLmsAppId: domainEntity.externalLmsAppId,
      externalLmsTenantId: domainEntity.externalLmsTenantId,
    }
  }
}
