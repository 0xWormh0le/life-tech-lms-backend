import { UserLessonHintStatus } from '../../../entities/codex-v2/UserLessonHintStatus'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface UserLessonHintStatusRepository {
  findAll(): Promise<
    Errorable<UserLessonHintStatus[], E<'UnknownRuntimeError'>>
  >
}

export default class GetUserLessonHintStatusesUseCase {
  constructor(
    private readonly userLessonHintStatusRepository: UserLessonHintStatusRepository,
  ) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<
      UserLessonHintStatus[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
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

    return await this.userLessonHintStatusRepository.findAll()
  }
}
