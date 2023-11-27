import { E, Errorable, wrapError } from '../shared/Errors'
import { isValidUUID } from '../shared/Ensure'
import { v4 as uuidv4 } from 'uuid'
import { UserResetPassword } from '../../entities/authentication/UserResetPassword'

export interface IUserResetPasswordRepository {
  getUserResetPasswordByToken(
    token: string,
  ): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>>
  setUserResetPassword(
    userId: string,
    token: string,
    expiry: Date,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export class ResetPasswordRequestResendUseCase {
  constructor(
    private userResetPasswordRepository: IUserResetPasswordRepository,
  ) {}

  async run(
    token: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'InvalidToken'>
      | E<'TokenNotFound'>
      | E<'UserResetPasswordNotFound'>
    >
  > {
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

    // Validate with provided token
    if (!isValidUUID(token)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidToken',
          message: 'Invalid token is provided',
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

    const newToken = uuidv4()
    const expiry = new Date()

    expiry.setHours(expiry.getHours() + 1)

    const userId = userResetPasswordResult?.value?.userId

    const resetPasswordReqeustResendResult =
      await this.userResetPasswordRepository.setUserResetPassword(
        userId,
        newToken,
        expiry,
      )

    if (resetPasswordReqeustResendResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          resetPasswordReqeustResendResult.error,
          `failed to set user reset password request resend`,
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
