import { LessonHint } from '../../../entities/codex-v2/LessonHint'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface LessonHintRepository {
  findById(
    id: string,
  ): Promise<Errorable<LessonHint | null, E<'UnknownRuntimeError'>>>
}

export default class GetLessonHintByIdUseCase {
  constructor(private readonly lessonHintRepository: LessonHintRepository) {}

  run = async (
    authenticatedUser: User,
    id: string,
  ): Promise<
    Errorable<
      LessonHint,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'LessonHintNotFound'>
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

    const result = await this.lessonHintRepository.findById(id)

    if (result.hasError) {
      return result
    }

    const lessonHint = result.value

    if (!lessonHint) {
      return failureErrorable(
        'LessonHintNotFound',
        `lesson hint not found. id: ${id}`,
      )
    }

    return successErrorable(lessonHint)
  }
}
