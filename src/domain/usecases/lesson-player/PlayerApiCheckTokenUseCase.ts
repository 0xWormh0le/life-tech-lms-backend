import { User } from '../../entities/codex/User'
import { AccessToken } from '../../entities/authentication/AccessToken'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserRepository {
  getUserByAccessToken: (
    accessToken: AccessToken,
  ) => Promise<Errorable<User | null, E<'UnknownRuntimeError'>>>
}

export class PlayerApiCheckTokenUseCase {
  constructor(private userRepository: IUserRepository) {}

  async run(
    token: AccessToken,
  ): Promise<
    Errorable<null, E<'TokenInvalidError'> | E<'UnknownRuntimeError'>>
  > {
    const getUserResult = await this.userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          getUserResult.error,
          `failed to getUserByAccessToken ${token}`,
        ),
        value: null,
      }
    }

    if (!getUserResult.value) {
      return {
        hasError: true,
        error: {
          type: 'TokenInvalidError',
          message: `given token is invalid ${token}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: null,
    }
  }
}
