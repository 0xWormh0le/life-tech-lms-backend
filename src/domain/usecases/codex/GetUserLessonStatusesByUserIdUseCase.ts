import { UserLessonStatus } from '../../entities/codex/UserLessonStatus'
import { User } from '../../entities/codex/User'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserLessonStatusesRepository {
  getUserLessonStatusesByUserId(
    userId: string,
    lessonIds?: string[],
  ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>>
}

export class GetUserLessonStatusesByUserIdUseCase {
  constructor(
    private userLessonStatusesRepository: IUserLessonStatusesRepository,
  ) {}

  async run(
    user: User,
    userId: string,
    lessonIds?: string[],
  ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> {
    // Get lesson from some Reposity
    const userLessonStatusesErrorable =
      await this.userLessonStatusesRepository.getUserLessonStatusesByUserId(
        userId,
        lessonIds,
      )

    if (userLessonStatusesErrorable.hasError) {
      return {
        hasError: true,
        error: wrapError(
          userLessonStatusesErrorable.error,
          `failed to getUserLessonStatusesByUserId ${userId}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: userLessonStatusesErrorable.value,
    }
  }
}
