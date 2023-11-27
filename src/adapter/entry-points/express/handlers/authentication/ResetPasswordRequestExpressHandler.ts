import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserResetPasswordRepository } from '../../../../repositories/UserResetPasswordRepository'
import { ResetPasswordRequestUseCase } from '../../../../../domain/usecases/authentication/ResetPasswordRequestUseCase'

type Response =
  | Paths.PostUserResetPasswordRequest.Responses.$200
  | Paths.PostUserResetPasswordRequest.Responses.$400
  | Paths.PostUserResetPasswordRequest.Responses.$403
  | Paths.PostUserResetPasswordRequest.Responses.$404
  | Paths.PostUserResetPasswordRequest.Responses.$500

export class ResetPasswordRequestExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostUserResetPasswordRequest.RequestBody,
    Response
  > = async (params) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userResetPasswordRepository = new UserResetPasswordRepository(
      this.appDataSource,
    )
    const resetPasswordRequestUseCase = new ResetPasswordRequestUseCase(
      userRepository,
      userResetPasswordRepository,
    )

    const resetPasswordRequestResult = await resetPasswordRequestUseCase.run(
      params.body.email,
    )

    if (resetPasswordRequestResult.hasError) {
      switch (resetPasswordRequestResult.error.type) {
        case 'InvalidEmail': {
          const response400: Paths.PostUserResetPasswordRequest.Responses.$400 =
            {
              error: resetPasswordRequestResult.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostUserResetPasswordRequest.Responses.$403 =
            {
              error: resetPasswordRequestResult.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        case 'UserNotFound': {
          const response404: Paths.PostUserResetPasswordRequest.Responses.$404 =
            {
              error: resetPasswordRequestResult?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostUserResetPasswordRequest.Responses.$500 =
            {
              error: JSON.stringify(resetPasswordRequestResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostUserResetPasswordRequest.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
