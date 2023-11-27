import { Lesson } from '../../entities/codex/Lesson'
import { User } from '../../entities/codex/User'
import { UserLessonStepStatus } from '../../entities/codex/UserLessonStepStatus'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface ILessonRepository {
  getLessonById(
    lessonId: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>>
}

export interface IUserLessonStepStatusesRepository {
  getUserLessonStepStatusesByUserIdAndLessonId(
    userId: string,
    lessonId: string,
  ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>>
}

export class GetUserLessonStepStatusesUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private userLessonStepStatusesRepository: IUserLessonStepStatusesRepository,
  ) {}

  async run(
    requestedUser: User,
    lessonId: string,
  ): Promise<
    Errorable<
      UserLessonStepStatus[],
      E<'NotFoundError'> | E<'UnknownRuntimeError'>
    >
  > {
    const getLessonResult = await this.lessonRepository.getLessonById(lessonId)

    if (getLessonResult.hasError) {
      switch (getLessonResult.error.type) {
        default: {
          return {
            hasError: true,
            error: wrapError(
              getLessonResult.error,
              `failed to getLessonById ${lessonId}`,
            ),
            value: null,
          }
        }
      }
    }

    if (getLessonResult.value === null) {
      return {
        hasError: true,
        error: {
          type: 'NotFoundError',
          message: `lesson not found lesson id ${lessonId}`,
        },
        value: null,
      }
    }

    const getUserLessonStepStatusesResult =
      await this.userLessonStepStatusesRepository.getUserLessonStepStatusesByUserIdAndLessonId(
        requestedUser.id,
        lessonId,
      )

    if (getUserLessonStepStatusesResult.hasError) {
      switch (getUserLessonStepStatusesResult.error.type) {
        default: {
          return {
            hasError: true,
            error: wrapError(
              getUserLessonStepStatusesResult.error,
              'failed to getUserSettingsByUserId',
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: getUserLessonStepStatusesResult.value,
    }
  }
}
