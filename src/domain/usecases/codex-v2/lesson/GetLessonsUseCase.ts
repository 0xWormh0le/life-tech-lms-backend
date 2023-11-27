import { Lesson } from '../../../entities/codex-v2/Lesson'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface LessonRepository {
  findAll(): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>>
}

export default class GetLessonsUseCase {
  constructor(private readonly lessonRepository: LessonRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<Lesson[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.lessonRepository.findAll()
  }
}
