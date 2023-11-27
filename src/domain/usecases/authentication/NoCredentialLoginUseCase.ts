import { AccessToken } from '../../entities/authentication/AccessToken'
import { AuthenticationInfo } from '../../entities/authentication/AuthenticationInfo'
import { UserWithToken } from '../../entities/authentication/UserWithToken'
import { User } from '../../entities/codex/User'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserRepository {
  createUser(
    user: Omit<User, 'id'>,
  ): Promise<Errorable<User, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
  createAccessToken(
    userId: string,
  ): Promise<Errorable<AccessToken, E<'UnknownRuntimeError'>>>
}

export class NoCredentialLoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async run(): Promise<Errorable<UserWithToken, E<'UnknownRuntimeError'>>> {
    const createUserResult = await this.userRepository.createUser({
      role: 'anonymous',
    })

    if (createUserResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to createUser ${JSON.stringify(
            createUserResult.error,
          )}`,
        },
        value: null,
      }
    }

    const createAccessTokenResult = await this.userRepository.createAccessToken(
      createUserResult.value.id,
    )

    if (createAccessTokenResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to createAccessToken ${JSON.stringify(
            createAccessTokenResult.error,
          )}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: {
        ...createUserResult.value,
        accessToken: createAccessTokenResult.value,
      },
    }
  }
}
