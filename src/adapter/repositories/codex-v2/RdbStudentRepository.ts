import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm'
import { Student } from '../../../domain/entities/codex-v2/Student'
import { StudentTypeormEntity } from '../../typeorm/entity/Student'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbStudentRepository {
  typeormRepository: Repository<StudentTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  findAll = async (): Promise<
    Errorable<Student[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const students = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(students)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all students',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> =>
    this.findOneByField({ id })

  findByUserId = async (
    userId: string,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> =>
    this.findOneByField({ user_id: userId })

  findByIds = async (
    ids: string[],
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.find({
        where: {
          id: In(ids),
        },
      })

      const students = result.map(this.transformToDomainEntity)

      return successErrorable(students)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get students. ids: ${JSON.stringify(ids)}`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<StudentTypeormEntity>,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
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
        `failed to get student. ${fields}: ${values}`,
        e,
      )
    }
  }

  create = async (
    student: Student,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(student),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(student)}`,
        e,
      )
    }
  }

  update = async (
    student: Student,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: student.id },
        this.transformToTypeormEntity(student),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update student. $${JSON.stringify(student)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: StudentTypeormEntity,
  ): Student => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      role: `student`,
      nickName: typeormEntity.nick_name ?? '',
      externalLmsStudentId: typeormEntity.student_lms_id,
      classlinkTenantId: typeormEntity.classlink_tenant_id,
      isDeactivated: typeormEntity.is_deactivated,
      createdUserId: typeormEntity.created_user_id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: Student,
  ): QueryDeepPartialEntity<StudentTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      nick_name: domainEntity.nickName,
      student_lms_id: domainEntity.externalLmsStudentId,
      classlink_tenant_id: domainEntity.classlinkTenantId,
      is_deactivated: domainEntity.isDeactivated,
      created_date: domainEntity.createdAt,
      created_user_id: domainEntity.createdUserId ?? undefined,
    }
  }
}
