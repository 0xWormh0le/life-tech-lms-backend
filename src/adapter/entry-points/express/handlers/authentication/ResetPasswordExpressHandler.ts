import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserResetPasswordRepository } from '../../../../repositories/UserResetPasswordRepository'
import { ResetPasswordUseCase } from '../../../../../domain/usecases/authentication/ResetPasswordUseCase'

type Response =
  | Paths.PostResetPassword.Responses.$200
  | Paths.PostResetPassword.Responses.$401
  | Paths.PostResetPassword.Responses.$404
  | Paths.PostResetPassword.Responses.$500

export class ResetPasswordExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostResetPassword.RequestBody,
    Response
  > = async (params) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userResetPasswordRepository = new UserResetPasswordRepository(
      this.appDataSource,
    )
    const resetPasswordUseCase = new ResetPasswordUseCase(
      userResetPasswordRepository,
      userRepository,
    )

    const resetPasswordResult = await resetPasswordUseCase.run(
      params.body.token,
      params.body.password as string,
      params.body.isValidateToken as boolean,
    )

    if (resetPasswordResult.hasError) {
      switch (resetPasswordResult.error.type) {
        case 'PasswordRequired': {
          const response400: Paths.PostResetPassword.Responses.$400 = {
            error: resetPasswordResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'TokenExpired': {
          const response401: Paths.PostResetPassword.Responses.$401 = {
            error: resetPasswordResult.error.message,
          }

          return { statusCode: 401, response: response401 }
        }
        case 'TokenNotFound': {
          const response404: Paths.PostResetPassword.Responses.$404 = {
            error: resetPasswordResult?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'UserResetPasswordNotFound': {
          const response404: Paths.PostResetPassword.Responses.$404 = {
            error: resetPasswordResult?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'UserDataNotFound': {
          const response404: Paths.PostResetPassword.Responses.$404 = {
            error: resetPasswordResult?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostResetPassword.Responses.$500 = {
            error: JSON.stringify(resetPasswordResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostResetPassword.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
