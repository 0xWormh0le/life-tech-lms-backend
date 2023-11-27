import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'
import { UserResetPasswordRepository } from '../../../../repositories/UserResetPasswordRepository'
import { ResetPasswordRequestResendUseCase } from '../../../../../domain/usecases/authentication/ResetPasswordRequestResendUseCase'

type Response =
  | Paths.PostUserResetPasswordRequestResend.Responses.$200
  | Paths.PostUserResetPasswordRequestResend.Responses.$400
  | Paths.PostUserResetPasswordRequestResend.Responses.$404
  | Paths.PostUserResetPasswordRequestResend.Responses.$500

export class ResetPasswordRequestResendExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostUserResetPasswordRequestResend.RequestBody,
    Response
  > = async (params) => {
    const userResetPasswordRepository = new UserResetPasswordRepository(
      this.appDataSource,
    )
    const resetPasswordRequestResendUseCase =
      new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const resetPasswordRequestResendResult =
      await resetPasswordRequestResendUseCase.run(params.body.token)

    if (resetPasswordRequestResendResult.hasError) {
      switch (resetPasswordRequestResendResult.error.type) {
        case 'InvalidToken': {
          const response400: Paths.PostUserResetPasswordRequestResend.Responses.$400 =
            {
              error: resetPasswordRequestResendResult.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'TokenNotFound': {
          const response404: Paths.PostUserResetPasswordRequestResend.Responses.$404 =
            {
              error: resetPasswordRequestResendResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'UserResetPasswordNotFound': {
          const response404: Paths.PostUserResetPasswordRequestResend.Responses.$404 =
            {
              error: resetPasswordRequestResendResult?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostUserResetPasswordRequestResend.Responses.$500 =
            {
              error: JSON.stringify(resetPasswordRequestResendResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostUserResetPasswordRequestResend.Responses.$200 =
      {
        message: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }
}
