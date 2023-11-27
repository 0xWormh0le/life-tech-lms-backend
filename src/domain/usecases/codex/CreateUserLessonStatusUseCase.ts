import { Lesson } from '../../entities/codex/Lesson'
import { User } from '../../entities/codex/User'
import { UserLessonStatus } from '../../entities/codex/UserLessonStatus'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface ILessonRepository {
  getLessonById(
    lessonId: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>>
}

export interface IUserLessonStatusRepository {
  createUserLessonStatus(
    userLessonStatus: UserLessonStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export class CreateUserLessonStatusUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private userLessonStatuseRepository: IUserLessonStatusRepository,
  ) {}

  async run(
    user: User,
    userLessonStatusInfo: UserLessonStatus,
  ): Promise<Errorable<void, E<'NotFoundError'> | E<'UnknownRuntimeError'>>> {
    // Check if the lesson related to given UserLessonStatus exists
    const getLessonResult = await this.lessonRepository.getLessonById(
      userLessonStatusInfo.lessonId,
    )

    if (getLessonResult.hasError) {
      switch (getLessonResult.error.type) {
        default: {
          return {
            hasError: true,
            error: wrapError(
              getLessonResult.error,
              `failed to getLessonById ${userLessonStatusInfo.lessonId}`,
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
          message: `The specified lesson not found lessonId ${userLessonStatusInfo.lessonId}`,
        },
        value: null,
      }
    }

    const createUserLessonStatusResult =
      await this.userLessonStatuseRepository.createUserLessonStatus({
        ...userLessonStatusInfo,
      })

    if (createUserLessonStatusResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          createUserLessonStatusResult.error,
          `failed to createOrUpdateUserLessonStatusResult ${JSON.stringify(
            userLessonStatusInfo,
          )}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
