import { DataSource } from 'typeorm'

import { UserLessonStepStatus } from '../../domain/entities/codex/UserLessonStepStatus'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import {
  UserLessonStepStatusTypeormEntity,
  UserLessonStepStatusTypeormEnum,
} from '../typeorm/entity/UserLessonStepStatus'

const convertStatusToEntity = (
  status: UserLessonStepStatusTypeormEnum,
): UserLessonStepStatus['status'] | null => {
  switch (status) {
    case UserLessonStepStatusTypeormEnum.cleared:
      return 'cleared'
    case UserLessonStepStatusTypeormEnum.not_cleared:
      return 'not_cleared'
    default:
      return null
  }
}

const convertStatusToTypeormEnum = (
  status: UserLessonStepStatus['status'],
): UserLessonStepStatusTypeormEnum | null => {
  switch (status) {
    case 'cleared':
      return UserLessonStepStatusTypeormEnum.cleared
    case 'not_cleared':
      return UserLessonStepStatusTypeormEnum.not_cleared
    default:
      return null
  }
}

export class UserLessonStepStatusRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getUserLessonStepStatusesByUserIdAndLessonId(
    userId: string,
    lessonId: string,
  ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> {
    const userLessonStepStatusesTypeormRepository =
      this.typeormDataSource.getRepository(UserLessonStepStatusTypeormEntity)

    try {
      const lessonStepStatuses =
        await userLessonStepStatusesTypeormRepository.findBy({
          user_id: userId,
          lesson_id: lessonId,
        })

      const value: UserLessonStepStatus[] = []

      for (const s of lessonStepStatuses) {
        const status = convertStatusToEntity(s.status)

        if (status === null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown status detected ${s.status}`,
            },
            value: null,
          }
        }
        value.push({
          userId: s.user_id,
          lessonId: s.lesson_id,
          stepId: s.step_id,
          status,
        })
      }

      return {
        hasError: false,
        error: null,
        value,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get UserLessonStepStatus from db by userId ${userId} and lessonId ${lessonId}`,
        ),
        value: null,
      }
    }
  }

  async createUserLessonStepStatus(
    userLessonStepStatus: UserLessonStepStatus,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistsError'>>
  > {
    const userLessonStepStatusesTypeormRepository =
      this.typeormDataSource.getRepository(UserLessonStepStatusTypeormEntity)

    try {
      const lessonStepStatuses =
        await userLessonStepStatusesTypeormRepository.findBy({
          user_id: userLessonStepStatus.userId,
          lesson_id: userLessonStepStatus.lessonId,
          step_id: userLessonStepStatus.stepId,
        })

      if (lessonStepStatuses.length !== 0) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistsError',
            message: `given UserLessonStepStatus already exists ${JSON.stringify(
              userLessonStepStatus,
            )}`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get UserLessonStepStatus from db by userId ${userLessonStepStatus.userId}, lessonId ${userLessonStepStatus.lessonId} and stepId ${userLessonStepStatus.stepId}`,
        ),
        value: null,
      }
    }

    const status = convertStatusToTypeormEnum(userLessonStepStatus.status)

    if (status == null) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `specified status ${userLessonStepStatus.status} is not supported`,
        },
        value: null,
      }
    }

    try {
      await userLessonStepStatusesTypeormRepository.save({
        user_id: userLessonStepStatus.userId,
        lesson_id: userLessonStepStatus.lessonId,
        step_id: userLessonStepStatus.stepId,
        status,
      })

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create UserLessonStepStatus into db by ${JSON.stringify(
            userLessonStepStatus,
          )}`,
        ),
        value: null,
      }
    }
  }
}
