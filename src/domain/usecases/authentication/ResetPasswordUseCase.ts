import { E, Errorable, wrapError } from '../shared/Errors'
import { UserResetPassword } from '../../entities/authentication/UserResetPassword'

export interface IUserResetPasswordRepository {
  getUserResetPasswordByToken(
    token: string,
  ): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>>
  removeUserResetPassword(
    userId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IUserRepository {
  updateUserPassword(
    userId: string,
    password: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'UserDataNotFound'>>>
}

export class ResetPasswordUseCase {
  constructor(
    private userResetPasswordRepository: IUserResetPasswordRepository,
    private userRepository: IUserRepository,
  ) {}

  async run(
    token: string,
    password: string,
    isValidateToken: boolean,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'TokenNotFound'>
      | E<'UserResetPasswordNotFound'>
      | E<'TokenExpired'>
      | E<'PasswordRequired'>
      | E<'UserDataNotFound'>
    >
  > {
    let isTokenExpire = false

    if (!token) {
      return {
        hasError: true,
        error: {
          type: 'TokenNotFound',
          message: `The specified token not found`,
        },
        value: null,
      }
    }

    const userResetPasswordResult =
      await this.userResetPasswordRepository.getUserResetPasswordByToken(token)

    if (userResetPasswordResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          userResetPasswordResult.error,
          `failed to get user reset password data`,
        ),
        value: null,
      }
    }

    if (!userResetPasswordResult.value) {
      return {
        hasError: true,
        error: {
          type: 'UserResetPasswordNotFound',
          message: `The specified token user reset password data not found`,
        },
        value: null,
      }
    }

    const expiry = userResetPasswordResult.value.expiry

    isTokenExpire = expiry < new Date()

    //401
    if (isTokenExpire) {
      return {
        hasError: true,
        error: {
          type: 'TokenExpired',
          message: `The specified token is expired`,
        },
        value: null,
      }
    }

    if (isValidateToken) {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

    //400
    if (!password) {
      return {
        hasError: true,
        error: {
          type: 'PasswordRequired',
          message: `Password cannot be blank`,
        },
        value: null,
      }
    }

    const userId = userResetPasswordResult.value.userId
    const updateUserResult = await this.userRepository.updateUserPassword(
      userId,
      password,
    )

    if (updateUserResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          updateUserResult.error,
          `failed to update user password`,
        ),
        value: null,
      }
    }

    const removeUserResetPassword =
      await this.userResetPasswordRepository.removeUserResetPassword(userId)

    if (removeUserResetPassword.hasError) {
      return {
        hasError: true,
        error: wrapError(
          removeUserResetPassword.error,
          `failed to delete user reset password for userId: ${userId}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
