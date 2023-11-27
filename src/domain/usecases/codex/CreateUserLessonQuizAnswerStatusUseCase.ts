import { User } from '../../entities/codex/User'
import { UserLessonQuizAnswerStatus } from '../../entities/codex/UserLessonQuizAnswerStatus'
import { UserRoles } from '../shared/Constants'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserLessonQuizAnswerStatusRepository {
  createUserLessonQuizAnswerStatus(
    quizStatus: UserLessonQuizAnswerStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export class CreateUserLessonQuizAnswerStatusUseCase {
  constructor(
    private userLessonQuizAnswerStatusRepo: IUserLessonQuizAnswerStatusRepository,
  ) {}

  async run(
    quizStatus: UserLessonQuizAnswerStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const createQuizStatus =
      await this.userLessonQuizAnswerStatusRepo.createUserLessonQuizAnswerStatus(
        quizStatus,
      )

    if (createQuizStatus.hasError) {
      return {
        hasError: true,
        error: wrapError(
          createQuizStatus.error,
          `failed to add quiz status in database table.`,
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
