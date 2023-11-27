import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { TeacherOrganizationAffiliation } from '../../../domain/entities/codex-v2/TeacherOrganizationAffiliation'
import { TeacherOrganizationTypeormEntity } from '../../typeorm/entity/TeacherOrganization'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbTeacherOrganizationAffiliationRepository {
  typeormRepository: Repository<TeacherOrganizationTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      TeacherOrganizationTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    teacherOrganization: TeacherOrganizationAffiliation,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(teacherOrganization),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(teacherOrganization)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({})
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ id })
  }

  findByOrganizationId = async (
    id: string,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({ organization: { id } })
  }

  findByTeacherId = async (
    id: string,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({ teacher: { id } })
  }

  delete = async (
    id: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.delete({ id: id })

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to delete district purchased package. id: ${id}`,
        e,
      )
    }
  }

  private findAllByField = async (
    where?: FindOptionsWhere<TeacherOrganizationTypeormEntity>,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (
        await this.typeormRepository.find({
          where,
          relations: ['organization', 'teacher'],
        })
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to find teacher organizations`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<TeacherOrganizationTypeormEntity>,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOne({
        where,
        relations: ['organization', 'teacher'],
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
        `failed to get teacher organization. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    teacherOrganization: Partial<TeacherOrganizationAffiliation>,
  ): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
    try {
      if (teacherOrganization.id === undefined) {
        return failureErrorable(
          'UnknownRuntimeError',
          'failed to update teacher organization: id is missing',
        )
      }
      await this.typeormRepository.update(
        { id: teacherOrganization.id },
        this.transformToTypeormEntity(teacherOrganization),
      )

      return successErrorable(null)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update teacher organization. $${JSON.stringify(
          teacherOrganization,
        )}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: TeacherOrganizationTypeormEntity,
  ): TeacherOrganizationAffiliation => {
    return {
      id: typeormEntity.id,
      createdUserId: typeormEntity.created_user_id,
      organizationId: typeormEntity.organization.id,
      teacherId: typeormEntity.teacher.id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: Partial<TeacherOrganizationAffiliation>,
  ): QueryDeepPartialEntity<TeacherOrganizationTypeormEntity> => {
    return {
      id: domainEntity.id,
      created_user_id: domainEntity.createdUserId,
      organization: { id: domainEntity.organizationId },
      teacher: { id: domainEntity.teacherId },
      created_date: domainEntity.createdAt,
    }
  }
}
