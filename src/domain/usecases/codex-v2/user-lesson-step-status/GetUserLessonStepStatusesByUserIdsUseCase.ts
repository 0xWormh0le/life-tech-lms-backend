import { UserLessonStepStatus } from '../../../entities/codex-v2/UserLessonStepStatus'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface UserLessonStepStatusRepository {
  findByUserIds(
    userIds: string[],
  ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>>
}

export default class GetUserLessonStepStatusesByUserIdsUseCase {
  constructor(
    private readonly userLessonStepStatusRepository: UserLessonStepStatusRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    userIds: string[],
  ): Promise<
    Errorable<
      UserLessonStepStatus[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.userLessonStepStatusRepository.findByUserIds(userIds)
  }
}
