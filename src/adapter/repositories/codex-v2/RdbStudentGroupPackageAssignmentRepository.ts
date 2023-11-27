import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { StudentGroupPackageAssignment } from '../../../domain/entities/codex-v2/StudentGroupPackageAssignment'
import { StudentGroupPackageAssignmentTypeormEntity } from '../../typeorm/entity/StudentGroupPackageAssignment'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'

export class RdbStudentGroupPackageAssignmentRepository {
  typeormRepository: Repository<StudentGroupPackageAssignmentTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      StudentGroupPackageAssignmentTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: StudentGroupPackageAssignment,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const districtEntity = await this.transformToTypeormEntity(entity)

      await this.typeormRepository.insert(districtEntity)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create student group package assignment: ${JSON.stringify(
          entity,
        )}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ id })
  }

  findByStudentGroupId = async (
    id: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField({ student_group_id: id })
  }

  private findAllByField = async (
    where?: FindOptionsWhere<StudentGroupPackageAssignmentTypeormEntity>,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const entities = (await this.typeormRepository.find({ where })).map(
        this.transformToDomainEntity,
      )

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get student group package assignments`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<StudentGroupPackageAssignmentTypeormEntity>,
  ): Promise<
    Errorable<StudentGroupPackageAssignment | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOne({
        where,
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
        `failed to get student group package assignment. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: Partial<StudentGroupPackageAssignment>,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const typeormEntity = await this.transformToTypeormEntity(entity)

      if (entity.id === undefined) {
        return failureErrorable(
          'UnknownRuntimeError',
          'failed to update student group package assignment: id is missing',
        )
      }
      await this.typeormRepository.update({ id: entity.id }, typeormEntity)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update student group package assignment. $${JSON.stringify(
          entity,
        )}`,
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
    typeormEntity: StudentGroupPackageAssignmentTypeormEntity,
  ): StudentGroupPackageAssignment => {
    return {
      id: typeormEntity.id,
      curriculumBrandId: typeormEntity.package_category_id,
      curriculumPackageId: typeormEntity.package_id,
      studentGroupId: typeormEntity.student_group_id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = async (
    domainEntity: Partial<StudentGroupPackageAssignment>,
  ): Promise<
    QueryDeepPartialEntity<StudentGroupPackageAssignmentTypeormEntity>
  > => {
    const result: QueryDeepPartialEntity<StudentGroupPackageAssignmentTypeormEntity> =
      {
        id: domainEntity.id,
        package_category_id: domainEntity.curriculumBrandId,
        package_id: domainEntity.curriculumPackageId,
        student_group_id: domainEntity.studentGroupId,
        created_date: domainEntity.createdAt,
      }

    return result
  }
}
