import { E, Errorable, wrapError } from '../shared/Errors'
import { isValidEmail } from '../shared/Ensure'
import { User } from '../../../domain/entities/codex/User'
import { v4 as uuidv4 } from 'uuid'

export interface IUserResetPasswordRepository {
  setUserResetPassword(
    userId: string,
    token: string,
    expiry: Date,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface IUserRepository {
  getUserByEmail(
    email: string,
  ): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>>
}

export class ResetPasswordRequestUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userResetPasswordRepository: IUserResetPasswordRepository,
  ) {}

  async run(
    email: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'UserNotFound'>
      | E<'InvalidEmail'>
      | E<'PermissionDenied'>
    >
  > {
    //validate provided email is valid or not
    if (!isValidEmail(email)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidEmail',
          message: 'Invalid email is provided',
        },
        value: null,
      }
    }

    const getUserInfo = await this.userRepository.getUserByEmail(email)

    if (getUserInfo.hasError) {
      switch (getUserInfo.error.type) {
        case 'UnknownRuntimeError': {
          return {
            hasError: true,
            error: wrapError(
              getUserInfo.error,
              `failed to getUser with ${JSON.stringify(email)}`,
            ),
            value: null,
          }
        }
      }
    }

    if (!getUserInfo.value) {
      return {
        hasError: true,
        error: {
          type: 'UserNotFound',
          message: `The specified user not found for ${email}`,
        },
        value: null,
      }
    }

    if (getUserInfo.value.role === 'student') {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'student can not change their password',
        },
        value: null,
      }
    }

    const userId = getUserInfo.value.id
    const token = uuidv4()
    const expiry = new Date()

    expiry.setHours(expiry.getHours() + 1)

    const resetPasswordReqeustResult =
      await this.userResetPasswordRepository.setUserResetPassword(
        userId,
        token,
        expiry,
      )

    if (resetPasswordReqeustResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          resetPasswordReqeustResult.error,
          `failed to set user reset password request`,
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
