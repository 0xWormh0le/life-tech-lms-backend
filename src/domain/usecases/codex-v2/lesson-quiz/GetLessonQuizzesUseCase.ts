import { LessonQuiz } from '../../../entities/codex-v2/LessonQuiz'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface LessonQuizRepository {
  findAll(): Promise<Errorable<LessonQuiz[], E<'UnknownRuntimeError'>>>
}

export default class GetLessonQuizzesUseCase {
  constructor(private readonly lessonQuizRepository: LessonQuizRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<LessonQuiz[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.lessonQuizRepository.findAll()
  }
}
