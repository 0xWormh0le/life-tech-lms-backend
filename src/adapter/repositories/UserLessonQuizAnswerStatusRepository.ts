import { DataSource } from 'typeorm'

import { UserLessonQuizAnswerStatus } from '../../domain/entities/codex/UserLessonQuizAnswerStatus'
import { IUserLessonQuizAnswerStatusRepository } from '../../domain/usecases/codex/CreateUserLessonQuizAnswerStatusUseCase'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { UserLessonQuizAnswerStatusTypeormEntity } from '../typeorm/entity/UserLessonQuizAnswerStatus'

export class UserLessonQuizAnswerStatusRepository
  implements IUserLessonQuizAnswerStatusRepository
{
  constructor(private typeormDataSource: DataSource) {}

  async getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryId(
    userLessonStatusHistoryId: string,
  ): Promise<
    Errorable<UserLessonQuizAnswerStatus[], E<'UnknownRuntimeError'>>
  > {
    const userLessonQuizAnswerStatusesTypeormRepository =
      this.typeormDataSource.getRepository(
        UserLessonQuizAnswerStatusTypeormEntity,
      )

    try {
      const lessonQuizAnswerStatuses =
        await userLessonQuizAnswerStatusesTypeormRepository.findBy({
          user_lesson_status_history_id: userLessonStatusHistoryId,
        })

      const value: UserLessonQuizAnswerStatus[] = []

      for (const s of lessonQuizAnswerStatuses) {
        value.push({
          userId: s.user_id,
          lessonId: s.lesson_id,
          stepId: s.step_id,
          userLessonStatusHistoryId: s.user_lesson_status_history_id,
          isCorrect: s.is_correct,
          selectedChoice: s.selected_choice,
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
          `failed to get UserLessonQuizAnswerStatus from db by userLessonStatusHistoryId ${userLessonStatusHistoryId}`,
        ),
        value: null,
      }
    }
  }

  async createUserLessonQuizAnswerStatus(
    userLessonQuizAnswerStatus: UserLessonQuizAnswerStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const userLessonQuizAnswerStatusesTypeormRepository =
      this.typeormDataSource.getRepository(
        UserLessonQuizAnswerStatusTypeormEntity,
      )

    try {
      await userLessonQuizAnswerStatusesTypeormRepository.save({
        user_id: userLessonQuizAnswerStatus.userId,
        lesson_id: userLessonQuizAnswerStatus.lessonId,
        user_lesson_status_history_id:
          userLessonQuizAnswerStatus.userLessonStatusHistoryId,
        is_correct: userLessonQuizAnswerStatus.isCorrect,
        step_id: userLessonQuizAnswerStatus.stepId,
        selected_choice: userLessonQuizAnswerStatus.selectedChoice,
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
          `failed to create UserLessonQuizAnswerStatus into db by ${JSON.stringify(
            userLessonQuizAnswerStatus,
          )}`,
        ),
        value: null,
      }
    }
  }
}
