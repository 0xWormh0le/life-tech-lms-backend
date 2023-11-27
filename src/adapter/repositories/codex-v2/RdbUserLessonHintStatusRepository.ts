import { DataSource, Repository } from 'typeorm'
import { UserLessonHintStatus } from '../../../domain/entities/codex-v2/UserLessonHintStatus'
import { UserLessonHintStatusTypeormEntity } from '../../typeorm/entity/UserLessonHintStatus'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbUserLessonHintStatusRepository {
  typeormRepository: Repository<UserLessonHintStatusTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      UserLessonHintStatusTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    userLessonHintStatus: UserLessonHintStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(userLessonHintStatus),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(userLessonHintStatus)}`,
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<UserLessonHintStatus | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id,
      })

      if (!result) {
        return successErrorable(null)
      }

      const domainEntity = this.transformToDomainEntity(result)

      return successErrorable(domainEntity)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson hint status. id: ${id}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<UserLessonHintStatus[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const userLessonHintStatuses = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(userLessonHintStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all user lesson hint statuses',
        e,
      )
    }
  }

  findByLessonHintId = async (
    lessonHintId: string,
  ): Promise<Errorable<UserLessonHintStatus[], E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findBy({
        lesson_hint_id: lessonHintId,
      })
      const userLessonHintStatuses = result.map(this.transformToDomainEntity)

      return successErrorable(userLessonHintStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson hint status by lesson hint id: ${lessonHintId}`,
        e,
      )
    }
  }

  findByUserLessonStatusId = async (
    userLessonStatusId: string,
  ): Promise<Errorable<UserLessonHintStatus[], E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findBy({
        user_lesson_status_id: userLessonStatusId,
      })

      const userLessonHintStatuses = result.map(this.transformToDomainEntity)

      return successErrorable(userLessonHintStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson hint status by user lesson status id: ${userLessonStatusId}`,
        e,
      )
    }
  }

  update = async (
    userLessonHintStatus: UserLessonHintStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: userLessonHintStatus.id },
        this.transformToTypeormEntity(userLessonHintStatus),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update user lesson hint status. $${JSON.stringify(
          userLessonHintStatus,
        )}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserLessonHintStatusTypeormEntity,
  ): UserLessonHintStatus => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      lessonHintId: typeormEntity.lesson_hint_id,
      userLessonStatusId: typeormEntity.user_lesson_status_id,
      createdAt: typeormEntity.created_at,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: UserLessonHintStatus,
  ): QueryDeepPartialEntity<UserLessonHintStatusTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      lesson_hint_id: domainEntity.lessonHintId,
      user_lesson_status_id: domainEntity.userLessonStatusId,
      created_at: domainEntity.createdAt,
    }
  }
}
