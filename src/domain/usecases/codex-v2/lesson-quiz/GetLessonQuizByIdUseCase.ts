import { LessonQuiz } from '../../../entities/codex-v2/LessonQuiz'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface LessonQuizRepository {
  findById(
    id: string,
  ): Promise<Errorable<LessonQuiz | null, E<'UnknownRuntimeError'>>>
}

export default class GetLessonQuizByIdUseCase {
  constructor(private readonly lessonQuizRepository: LessonQuizRepository) {}

  run = async (
    authenticatedUser: User,
    id: string,
  ): Promise<
    Errorable<
      LessonQuiz,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'LessonQuizNotFound'>
    >
  > => {
    if (
      authenticatedUser.role !== UserRoles.internalOperator &&
      authenticatedUser.role !== UserRoles.teacher
    ) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const result = await this.lessonQuizRepository.findById(id)

    if (result.hasError) {
      return result
    }

    const lessonQuiz = result.value

    if (!lessonQuiz) {
      return failureErrorable(
        'LessonQuizNotFound',
        `lesson quiz not found. id: ${id}`,
      )
    }

    return successErrorable(lessonQuiz)
  }
}
