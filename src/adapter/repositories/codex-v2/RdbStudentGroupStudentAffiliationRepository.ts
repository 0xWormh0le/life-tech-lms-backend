import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { StudentStudentGroupAffiliation } from '../../../domain/entities/codex-v2/StudentStudentGroupAffiliation'
import { StudentGroupStudentTypeormEntity } from '../../typeorm/entity/StudentGroupStudent'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbStudentGroupStudentAffiliationRepository {
  typeormRepository: Repository<StudentGroupStudentTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      StudentGroupStudentTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: StudentStudentGroupAffiliation,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(entity))

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ id })
  }

  findByStudentId = async (
    id: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({ student_id: { id } })
  }

  findByStudentGroupId = async (
    id: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({ student_group_id: { id } })
  }

  private findAllByField = async (
    where?: FindOptionsWhere<StudentGroupStudentTypeormEntity>,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (
        await this.typeormRepository.find({
          where,
          relations: ['student_id', 'student_group_id'],
        })
      ).map(this.transformToDomainEntity)

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to find student group students`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<StudentGroupStudentTypeormEntity>,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOne({
        where,
        relations: ['student_id', 'student_group_id'],
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
        `failed to get student group student. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: Partial<StudentStudentGroupAffiliation>,
  ): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
    try {
      if (entity.id === undefined) {
        return failureErrorable(
          'UnknownRuntimeError',
          'failed to update student group student: id is missing',
        )
      }
      await this.typeormRepository.update(
        { id: entity.id },
        this.transformToTypeormEntity(entity),
      )

      return successErrorable(null)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update student group student. $${JSON.stringify(entity)}`,
        e,
      )
    }
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

  private transformToDomainEntity = (
    typeormEntity: StudentGroupStudentTypeormEntity,
  ): StudentStudentGroupAffiliation => {
    return {
      id: typeormEntity.id,
      createdUserId: typeormEntity.created_user_id,
      studentId: typeormEntity.student_id.id,
      studentGroupId: typeormEntity.student_group_id.id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: Partial<StudentStudentGroupAffiliation>,
  ): QueryDeepPartialEntity<StudentGroupStudentTypeormEntity> => {
    return {
      id: domainEntity.id,
      created_user_id: domainEntity.createdUserId,
      student_id: { id: domainEntity.studentId },
      student_group_id: { id: domainEntity.studentGroupId },
      created_date: domainEntity.createdAt,
    }
  }
}
