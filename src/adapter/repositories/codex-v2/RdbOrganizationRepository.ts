import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm'
import { Organization } from '../../../domain/entities/codex-v2/Organization'
import { OrganizationTypeormEntity } from '../../typeorm/entity/Organization'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { OrganizationRepository } from '../../../domain/usecases/codex-v2/_shared/repositories/OrganizationRepository'

export class RdbOrganizationRepository implements OrganizationRepository {
  typeormRepository: Repository<OrganizationTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      OrganizationTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: Organization,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(entity))

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create organization: ${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<Organization[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findByDistrictId = async (
    id: string,
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
    return this.findAllByField({
      district_id: id,
    })
  }

  findById = async (
    id: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
    return this.findOneByField({ id })
  }

  findByIds = async (
    organizationIds: string[],
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> =>
    this.findAllByField({ id: In(organizationIds) })

  findAllByField = async (
    where?: FindOptionsWhere<OrganizationTypeormEntity>,
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
    try {
      const entities = (await this.typeormRepository.find({ where })).map(
        this.transformToDomainEntity,
      )

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get organizations`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<OrganizationTypeormEntity>,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
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
        `failed to get organization. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: Organization,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: entity.id },
        this.transformToTypeormEntity(entity),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update organization. $${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  findByName = async (
    name: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
    return this.findOneByField({ name })
  }

  private transformToDomainEntity = (
    typeormEntity: OrganizationTypeormEntity,
  ): Organization => {
    return {
      id: typeormEntity.id,
      name: typeormEntity.name,
      districtId: typeormEntity.district_id,
      externalLmsOrganizationId: typeormEntity.organization_lms_id,
      classlinkTenantId: typeormEntity.classlink_tenant_id,
      createdAt: typeormEntity.created_date,
      updatedAt: typeormEntity.updated_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: Organization,
  ): QueryDeepPartialEntity<OrganizationTypeormEntity> => {
    return {
      id: domainEntity.id,
      name: domainEntity.name,
      district_id: domainEntity.districtId,
      organization_lms_id: domainEntity.externalLmsOrganizationId,
      classlink_tenant_id: domainEntity.classlinkTenantId,
      created_date: domainEntity.createdAt,
      updated_date: domainEntity.updatedAt,
    }
  }
}
