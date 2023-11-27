import { DataSource, Repository } from 'typeorm'
import { ClasslinkTenantCredential } from '../../../domain/entities/codex-v2/ClasslinkTenantCredential'
import { DistrictTypeormEntity } from '../../typeorm/entity/District'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbClasslinkTenantCredentialRepository {
  typeormRepository: Repository<DistrictTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )
  }

  create = async (
    classlinkTenantCredential: ClasslinkTenantCredential,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> =>
    this.update(classlinkTenantCredential)

  findAll = async (): Promise<
    Errorable<ClasslinkTenantCredential[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const classlinkTenantCredentials = (
        await this.typeormRepository.find()
      ).map(this.transformToDomainEntity)

      return successErrorable(classlinkTenantCredentials)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all classlinkTenantCredentials',
        e,
      )
    }
  }

  findByDistrictId = async (
    districtId: string,
  ): Promise<
    Errorable<ClasslinkTenantCredential | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id: districtId,
      })

      if (!result) {
        return successErrorable(null)
      }

      const classlinkTenantCredential = this.transformToDomainEntity(result)

      if (
        !classlinkTenantCredential.externalLmsAppId &&
        !classlinkTenantCredential.accessToken &&
        !classlinkTenantCredential.externalLmsTenantId
      ) {
        return successErrorable(null)
      }

      return successErrorable(classlinkTenantCredential)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get classlinkTenantCredential. districtId: ${districtId}`,
        e,
      )
    }
  }

  update = async (
    classlinkTenantCredential: ClasslinkTenantCredential,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: classlinkTenantCredential.districtId },
        this.transformToTypeormEntity(classlinkTenantCredential),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update classlinkTenantCredential. $${JSON.stringify(
          classlinkTenantCredential,
        )}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: DistrictTypeormEntity,
  ): ClasslinkTenantCredential => {
    return {
      districtId: typeormEntity.id,
      externalLmsAppId: typeormEntity.classlink_app_id,
      accessToken: typeormEntity.classlink_access_token,
      externalLmsTenantId: typeormEntity.classlink_tenant_id,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: ClasslinkTenantCredential,
  ): QueryDeepPartialEntity<DistrictTypeormEntity> => {
    return {
      id: domainEntity.districtId,
      classlink_app_id: domainEntity.externalLmsAppId,
      classlink_access_token: domainEntity.accessToken,
      classlink_tenant_id: domainEntity.externalLmsTenantId,
    }
  }
}
