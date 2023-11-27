import { AuthenticationInfo } from '../../entities/authentication/AuthenticationInfo'
import { UserWithToken } from '../../entities/authentication/UserWithToken'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserRepository {
  getUserWithTokenByAuthenticationInfo(
    authenticationInfo: AuthenticationInfo,
  ): Promise<
    Errorable<
      UserWithToken | null,
      E<'UnknownRuntimeError'> | E<'AuthenticationFailedError'>
    >
  >
}

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async run(
    authenticationInfo: AuthenticationInfo,
  ): Promise<
    Errorable<
      UserWithToken,
      E<'UnknownRuntimeError'> | E<'AuthenticationFailedError'>
    >
  > {
    const getUserWithTokenResult =
      await this.userRepository.getUserWithTokenByAuthenticationInfo(
        authenticationInfo,
      )

    if (getUserWithTokenResult.hasError) {
      switch (getUserWithTokenResult.error.type) {
        case 'UnknownRuntimeError': {
          return {
            hasError: true,
            error: wrapError(
              getUserWithTokenResult.error,
              `failed to getAccessToken with ${JSON.stringify(
                authenticationInfo,
              )}`,
            ),
            value: null,
          }
        }
      }
    }

    if (
      !getUserWithTokenResult.value ||
      getUserWithTokenResult.value === null
    ) {
      return {
        hasError: true,
        error: {
          type: 'AuthenticationFailedError',
          message: `given login ID and password is incorrect ${JSON.stringify(
            authenticationInfo,
          )}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: getUserWithTokenResult.value,
    }
  }
}
