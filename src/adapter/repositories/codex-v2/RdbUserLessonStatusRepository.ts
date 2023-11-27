import { DataSource, Repository } from 'typeorm'
import { UserLessonStatus } from '../../../domain/entities/codex-v2/UserLessonStatus'
import {
  UserLessonStatusTypeormEntity,
  UserLessonStatusTypeormEnum,
} from '../../typeorm/entity/UserLessonStatus'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { UserLessonStatusHistoryTypeormEntity } from '../../typeorm/entity/UserLessonStatusHistory'

export class RdbUserLessonStatusRepository {
  typeormRepository: Repository<UserLessonStatusHistoryTypeormEntity>

  typeormOldUserLessonStatusRepository: Repository<UserLessonStatusTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      UserLessonStatusHistoryTypeormEntity,
    )
    this.typeormOldUserLessonStatusRepository =
      this.typeormDataSource.getRepository(UserLessonStatusTypeormEntity)
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    userLessonStatus: UserLessonStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(userLessonStatus),
      )
      await this.createOrUpdateStatusTable(userLessonStatus)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(userLessonStatus)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const userLessonStatuses = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(userLessonStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all user lesson statuses',
        e,
      )
    }
  }

  findByUserId = async (
    userId: string,
  ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> => {
    try {
      const userLessonStatuses = (
        await this.typeormRepository.findBy({ user_id: userId })
      ).map(this.transformToDomainEntity)

      return successErrorable(userLessonStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get user lesson statuses by user id',
        e,
      )
    }
  }

  findByLessonId = async (
    lessonId: string,
  ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> => {
    try {
      const userLessonStatuses = (
        await this.typeormRepository.findBy({ lesson_id: lessonId })
      ).map(this.transformToDomainEntity)

      return successErrorable(userLessonStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get user lesson statuses by user id',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<UserLessonStatus | null, E<'UnknownRuntimeError'>>> => {
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
        `failed to get user lesson status. id: ${id}`,
        e,
      )
    }
  }

  findLatest = async (
    userId: string,
    lessonId: string,
  ): Promise<Errorable<UserLessonStatus | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOne({
        where: {
          user_id: userId,
          lesson_id: lessonId,
        },
        order: {
          started_at: 'desc',
        },
      })

      if (!result) {
        return successErrorable(null)
      }

      const student = this.transformToDomainEntity(result)

      return successErrorable(student)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson status. userId: ${userId}, lessonId: ${lessonId}`,
        e,
      )
    }
  }

  update = async (
    userLessonStatus: UserLessonStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: userLessonStatus.id },
        this.transformToTypeormEntity(userLessonStatus),
      )

      await this.createOrUpdateStatusTable(userLessonStatus)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update user lesson status. $${JSON.stringify(
          userLessonStatus,
        )}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserLessonStatusHistoryTypeormEntity,
  ): UserLessonStatus => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      lessonId: typeormEntity.lesson_id,
      status: typeormEntity.status,
      startedAt: typeormEntity.started_at,
      finishedAt: typeormEntity.finished_at,
      achievedStarCount: typeormEntity.achieved_star_count,
      correctAnsweredQuizCount: typeormEntity.correct_answered_quiz_count,
      usedHintCount: typeormEntity.used_hint_count,
      stepIdSkippingDetected: typeormEntity.step_id_skipping_detected,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: UserLessonStatus,
  ): QueryDeepPartialEntity<UserLessonStatusHistoryTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      lesson_id: domainEntity.lessonId,
      status:
        domainEntity.status === 'cleared'
          ? UserLessonStatusTypeormEnum.cleared
          : UserLessonStatusTypeormEnum.not_cleared,
      started_at: domainEntity.startedAt,
      finished_at: domainEntity.finishedAt ?? undefined,
      achieved_star_count: domainEntity.achievedStarCount,
      correct_answered_quiz_count:
        domainEntity.correctAnsweredQuizCount ?? undefined,
      used_hint_count: domainEntity.usedHintCount ?? undefined,
      step_id_skipping_detected: domainEntity.stepIdSkippingDetected,
    }
  }

  private transformToOldStatusTypeormEntity = (
    domainEntity: UserLessonStatus,
  ): QueryDeepPartialEntity<UserLessonStatusTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      lesson_id: domainEntity.lessonId,
      status:
        domainEntity.status === 'cleared'
          ? UserLessonStatusTypeormEnum.cleared
          : UserLessonStatusTypeormEnum.not_cleared,
      started_at: domainEntity.startedAt,
      finished_at: domainEntity.finishedAt ?? undefined,
      achieved_star_count: domainEntity.achievedStarCount,
      correct_answered_quiz_count:
        domainEntity.correctAnsweredQuizCount ?? undefined,
      used_hint_count: domainEntity.usedHintCount ?? undefined,
      step_id_skipping_detected: domainEntity.stepIdSkippingDetected,
    }
  }

  private createOrUpdateStatusTable = async (
    userLessonStatus: UserLessonStatus,
  ) => {
    const storedInOldStatusTableByUserId =
      await this.typeormOldUserLessonStatusRepository.findOne({
        where: { user_id: userLessonStatus.userId },
      })

    if (storedInOldStatusTableByUserId) {
      await this.typeormOldUserLessonStatusRepository.update(
        {
          id: storedInOldStatusTableByUserId.id,
        },
        this.transformToOldStatusTypeormEntity(userLessonStatus),
      )
    } else {
      await this.typeormOldUserLessonStatusRepository.insert(
        this.transformToOldStatusTypeormEntity(userLessonStatus),
      )
    }
  }
}
