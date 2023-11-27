import { User } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserRepository {
  updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'UserDataNotFound'>>>
}

export class ChangeUserPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async run(
    user: User,
    newPassword: string,
  ): Promise<
    Errorable<
      void,
      | E<'PermissionDenied'>
      | E<'EmptyPassword'>
      | E<'UnknownRuntimeError'>
      | E<'UserDataNotFound'>
    >
  > {
    // Check authorization for this User
    if (UserRoles.student === user.role) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to change their password.',
        },
        value: null,
      }
    }

    //Check for empty password
    if (!newPassword) {
      return {
        hasError: true,
        error: {
          type: 'EmptyPassword',
          message: 'password can not be empty.',
        },
        value: null,
      }
    }

    const changeUserPasswordResult =
      await this.userRepository.updateUserPassword(user.id, newPassword)

    if (changeUserPasswordResult.hasError) {
      switch (changeUserPasswordResult.error.type) {
        case 'UserDataNotFound':
          return {
            hasError: true,
            error: wrapError(
              changeUserPasswordResult.error,
              `failed to find user of userId :${
                user.id
              }, error: ${JSON.stringify(changeUserPasswordResult)}`,
            ),
            value: null,
          }
        default: {
          return {
            hasError: true,
            error: wrapError(
              changeUserPasswordResult.error,
              `failed to changed password of userId :${
                user.id
              }, error: ${JSON.stringify(changeUserPasswordResult)}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
