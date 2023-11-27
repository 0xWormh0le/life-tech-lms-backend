import { User } from '../../../entities/codex-v2/User'
import { E, Errorable } from '../../shared/Errors'
import { UserRoles } from '../../shared/Constants'

export interface UserRepository {
  findAll(): Promise<Errorable<User[], E<'UnknownRuntimeError'>>>
}

export default class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<User[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    return await this.userRepository.findAll()
  }
}
