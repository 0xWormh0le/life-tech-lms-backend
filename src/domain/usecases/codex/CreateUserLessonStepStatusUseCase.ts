import { Lesson } from '../../entities/codex/Lesson'
import { UserLessonStepStatus } from '../../entities/codex/UserLessonStepStatus'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface ILessonRepository {
  getLessonById(
    lessonId: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>>
}

export interface IUserLessonStepStatusesRepository {
  createUserLessonStepStatus(
    userLessonStepStatus: UserLessonStepStatus,
  ): Promise<
    Errorable<void, E<'AlreadyExistsError'> | E<'UnknownRuntimeError'>>
  >
}

export class CreateUserLessonStepStatusUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private userLessonStepStatusesRepository: IUserLessonStepStatusesRepository,
  ) {}

  async run(
    userLessonStepStatus: UserLessonStepStatus,
  ): Promise<
    Errorable<
      void,
      E<'AlreadyExistsError'> | E<'NotFoundError'> | E<'UnknownRuntimeError'>
    >
  > {
    // Check if the lesson related to given userLessonStepStatus exists
    const getLessonResult = await this.lessonRepository.getLessonById(
      userLessonStepStatus.lessonId,
    )

    if (getLessonResult.hasError) {
      switch (getLessonResult.error.type) {
        default: {
          return {
            hasError: true,
            error: wrapError(
              getLessonResult.error,
              `failed to getLessonById ${userLessonStepStatus.lessonId}`,
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
          message: `lesson not found for lessonId ${userLessonStepStatus.lessonId}`,
        },
        value: null,
      }
    }

    const createUserLessonStepStatusResult =
      await this.userLessonStepStatusesRepository.createUserLessonStepStatus(
        userLessonStepStatus,
      )

    if (createUserLessonStepStatusResult.hasError) {
      switch (createUserLessonStepStatusResult.error.type) {
        case 'AlreadyExistsError': {
          return {
            hasError: true,
            error: wrapError(
              createUserLessonStepStatusResult.error,
              `UserLessonStepStatus already exists for userId: ${userLessonStepStatus.userId} lessonId: ${userLessonStepStatus.lessonId} stepId: ${userLessonStepStatus.stepId}`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              createUserLessonStepStatusResult.error,
              `failed to createUserLessonStepStatus ${JSON.stringify(
                userLessonStepStatus,
              )}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
