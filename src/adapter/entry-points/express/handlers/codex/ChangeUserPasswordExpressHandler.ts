import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { ChangeUserPasswordUseCase } from '../../../../../domain/usecases/codex/ChangeUserPasswordUseCase'

type Response =
  | Paths.PutChangePassword.Responses.$200
  | Paths.PutChangePassword.Responses.$400
  | Paths.PutChangePassword.Responses.$403
  | Paths.PutChangePassword.Responses.$404
  | Paths.PutChangePassword.Responses.$500

export class ChangeUserPasswordExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    undefined,
    Paths.PutChangePassword.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)

    const changeUserPasswordUseCase = new ChangeUserPasswordUseCase(
      userRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PutChangePassword.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PutChangePassword.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const reuslt = await changeUserPasswordUseCase.run(
      getUserResult.value,
      params.body.newPassword,
    )

    if (reuslt.hasError) {
      switch (reuslt.error.type) {
        case 'EmptyPassword': {
          const response400: Paths.PutChangePassword.Responses.$400 = {
            error: reuslt.error.message,
          }

          return { statusCode: 400, response: response400 }
        }

        case 'PermissionDenied': {
          const response403: Paths.PutChangePassword.Responses.$403 = {
            error: reuslt.error.message,
          }

          return { statusCode: 403, response: response403 }
        }

        case 'UserDataNotFound': {
          const response403: Paths.PutChangePassword.Responses.$403 = {
            error: reuslt.error.message,
          }

          return { statusCode: 404, response: response403 }
        }

        default: {
          const response500: Paths.PutChangePassword.Responses.$500 = {
            error: JSON.stringify(reuslt.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutChangePassword.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
