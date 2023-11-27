import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm'
import { Teacher } from '../../../domain/entities/codex-v2/Teacher'
import { TeacherTypeormEntity } from '../../typeorm/entity/Teacher'
import { TeacherOrganizationTypeormEntity } from '../../typeorm/entity/TeacherOrganization'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { TeacherRepository } from '../../../domain/usecases/codex-v2/_shared/repositories/TeacherRepository'

export class RdbTeacherRepository implements TeacherRepository {
  typeormRepository: Repository<TeacherTypeormEntity>

  teacherOrganizationRepository: Repository<TeacherOrganizationTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)
    this.teacherOrganizationRepository = this.typeormDataSource.getRepository(
      TeacherOrganizationTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    teacher: Teacher,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(teacher),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(teacher)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<Teacher[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const teachers = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(teachers)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all teachers',
        e,
      )
    }
  }

  findByOrganizationId = async (
    organizationId: string,
  ): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> => {
    try {
      const teacherOrganizations =
        await this.teacherOrganizationRepository.find({
          where: { organization: { id: organizationId } },
          relations: ['teacher'],
        })

      const teachers = await this.typeormRepository.findBy({
        id: In(teacherOrganizations.map((val) => val.teacher.id)),
      })
      const value = teachers.map(this.transformToDomainEntity)

      return successErrorable(value)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get teachers by organization id',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> =>
    this.findOneByField({ id })

  findByUserId = async (
    userId: string,
  ): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> =>
    this.findOneByField({ user_id: userId })

  private findOneByField = async (
    where: FindOptionsWhere<TeacherTypeormEntity>,
  ): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
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
        `failed to get teacher. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    teacher: Teacher,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: teacher.id },
        this.transformToTypeormEntity(teacher),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update teacher. $${JSON.stringify(teacher)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: TeacherTypeormEntity,
  ): Teacher => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      role: `teacher`,
      firstName: typeormEntity.first_name ?? '',
      lastName: typeormEntity.last_name ?? '',
      externalLmsTeacherId: typeormEntity.teacher_lms_id,
      isDeactivated: typeormEntity.is_deactivated,
      createdUserId: typeormEntity.created_user_id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: Teacher,
  ): QueryDeepPartialEntity<TeacherTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      first_name: domainEntity.firstName,
      last_name: domainEntity.lastName,
      teacher_lms_id: domainEntity.externalLmsTeacherId,
      is_deactivated: domainEntity.isDeactivated,
      created_date: domainEntity.createdAt,
      created_user_id: domainEntity.createdUserId ?? undefined,
    }
  }
}
