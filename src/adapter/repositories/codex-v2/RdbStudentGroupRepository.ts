import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm'
import { StudentGroup } from '../../../domain/entities/codex-v2/StudentGroup'
import { StudentGroupTypeormEntity } from '../../typeorm/entity/StudentGroup'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { StudentGroupRepository } from '../../../domain/usecases/codex-v2/_shared/repositories/StudentGroupRepository'

export class RdbStudentGroupRepository implements StudentGroupRepository {
  typeormRepository: Repository<StudentGroupTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: StudentGroup,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const districtEntity = await this.transformToTypeormEntity(entity)

      await this.typeormRepository.insert(districtEntity)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create student group: ${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<StudentGroup[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (
        await this.typeormRepository.find({ relations: ['organization_id'] })
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get all student groups`,
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
    return this.findByField({ id })
  }

  findByIds = async (
    studentGroupIds: string[],
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> =>
    this.findAllByField({ id: In(studentGroupIds) })

  findByName = async (
    name: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
    return this.findByField({ name })
  }

  findByOrganizationId = async (
    organizationId: string,
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
    try {
      const entities = (
        await this.typeormRepository.find({
          where: { organization_id: { id: organizationId } },
          relations: ['organization_id'],
        })
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get student groups by organization id`,
        e,
      )
    }
  }

  private findByField = async (
    where: FindOptionsWhere<StudentGroupTypeormEntity>,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOne({
        where,
        relations: ['organization_id'],
      })

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
        `failed to get student group. ${fields}: ${values}`,
        e,
      )
    }
  }

  findAllByField = async (
    where?: FindOptionsWhere<StudentGroupTypeormEntity>,
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
    try {
      const entities = (
        await this.typeormRepository.find({
          where,

          relations: ['organization_id'],
        })
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson step statuses`,
        e,
      )
    }
  }

  update = async (
    entity: Partial<StudentGroup>,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const typeormEntity = await this.transformToTypeormEntity(entity)

      if (entity.id === undefined) {
        return failureErrorable(
          'UnknownRuntimeError',
          'failed to update student group: id is missing',
        )
      }
      await this.typeormRepository.update({ id: entity.id }, typeormEntity)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update student group. $${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: StudentGroupTypeormEntity,
  ): StudentGroup => {
    return {
      id: typeormEntity.id,
      name: typeormEntity.name,
      grade: typeormEntity.grade,
      externalLmsStudentGroupId: typeormEntity.student_group_lms_id,
      createdUserId: typeormEntity.created_user_id,
      updatedUserId: typeormEntity.updated_user_id,
      createdAt: typeormEntity.created_date,
      updatedAt: typeormEntity.updated_date,
      organizationId: typeormEntity.organization_id.id,
      classlinkTenantId: typeormEntity.classlink_tenant_id,
    }
  }

  private transformToTypeormEntity = async (
    domainEntity: Partial<StudentGroup>,
  ): Promise<QueryDeepPartialEntity<StudentGroupTypeormEntity>> => {
    const result: QueryDeepPartialEntity<StudentGroupTypeormEntity> = {
      id: domainEntity.id,
      name: domainEntity.name,
      grade: domainEntity.grade ?? undefined,
      student_group_lms_id: domainEntity.externalLmsStudentGroupId,
      created_user_id: domainEntity.createdUserId ?? undefined,
      updated_user_id: domainEntity.updatedUserId ?? undefined,
      created_date: domainEntity.createdAt,
      updated_date: domainEntity.updatedAt,
      organization_id: { id: domainEntity.organizationId },
      classlink_tenant_id: domainEntity.classlinkTenantId,
    }

    return result
  }
}
