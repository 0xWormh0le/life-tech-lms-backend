import { User } from '../../../entities/codex-v2/User'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { UserRoles } from '../../shared/Constants'

export interface UserRepository {
  findById(
    id: string,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>>
}

export default class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  run = async (
    authenticatedUser: User,
    humanUserId: string,
  ): Promise<
    Errorable<
      User,
      E<'UnknownRuntimeError'> | E<'UserNotFound'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const res = await this.userRepository.findById(humanUserId)

    if (res.hasError) {
      return res
    }

    if (!res.value) {
      return failureErrorable(
        'UserNotFound',
        `User not found from human user id ${humanUserId}`,
      )
    }

    return successErrorable(res.value)
  }
}
