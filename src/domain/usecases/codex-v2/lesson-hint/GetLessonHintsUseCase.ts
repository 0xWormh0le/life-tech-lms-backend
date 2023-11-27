import { LessonHint } from '../../../entities/codex-v2/LessonHint'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface LessonHintRepository {
  findAll(): Promise<Errorable<LessonHint[], E<'UnknownRuntimeError'>>>
}

export default class GetLessonHintsUseCase {
  constructor(private readonly lessonHintRepository: LessonHintRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<LessonHint[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.lessonHintRepository.findAll()
  }
}
