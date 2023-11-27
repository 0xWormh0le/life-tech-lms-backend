import { DataSource, FindOptionsWhere, Repository, In } from 'typeorm'
import { UserLessonStepStatus } from '../../../domain/entities/codex-v2/UserLessonStepStatus'
import {
  UserLessonStepStatusTypeormEntity,
  UserLessonStepStatusTypeormEnum,
} from '../../typeorm/entity/UserLessonStepStatus'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'

export class RdbUserLessonStepStatusRepository {
  typeormRepository: Repository<UserLessonStepStatusTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      UserLessonStepStatusTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: UserLessonStepStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(entity))

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create user lesson step status: ${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<UserLessonStepStatus | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ id })
  }

  findByUserLessonStatusId = async (
    userLessonStatusId: string,
  ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> =>
    this.findAllByField({ user_lesson_status_id: userLessonStatusId })

  findByUserIds = async (
    userIds: string[],
  ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> =>
    this.findAllByField({ user_id: In(userIds) })

  findAllByField = async (
    where?: FindOptionsWhere<UserLessonStepStatusTypeormEntity>,
  ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> => {
    try {
      const entities = (await this.typeormRepository.find({ where })).map(
        this.transformToDomainEntity,
      )

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson step statuses`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<UserLessonStepStatusTypeormEntity>,
  ): Promise<
    Errorable<UserLessonStepStatus | null, E<'UnknownRuntimeError'>>
  > => {
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
        `failed to get user lesson step status. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: UserLessonStepStatus,
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
        `failed to update user lesson step status. $${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserLessonStepStatusTypeormEntity,
  ): UserLessonStepStatus => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      lessonId: typeormEntity.lesson_id,
      stepId: typeormEntity.step_id,
      userLessonStatusId: typeormEntity.user_lesson_status_id,
      status:
        typeormEntity.status === UserLessonStepStatusTypeormEnum.cleared
          ? 'cleared'
          : 'not_cleared',
      createdAt: typeormEntity.created_at,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: UserLessonStepStatus,
  ): QueryDeepPartialEntity<UserLessonStepStatusTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      lesson_id: domainEntity.lessonId,
      step_id: domainEntity.stepId,
      user_lesson_status_id: domainEntity.userLessonStatusId,
      status:
        domainEntity.status === 'cleared'
          ? UserLessonStepStatusTypeormEnum.cleared
          : UserLessonStepStatusTypeormEnum.not_cleared,
      created_at: domainEntity.createdAt,
    }
  }
}
