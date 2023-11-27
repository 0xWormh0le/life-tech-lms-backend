import { DataSource } from 'typeorm'
import { LoginUseCase } from '../../../../../domain/usecases/authentication/LoginUseCase'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'

type Response =
  | Paths.PostLogin.Responses.$200
  | Paths.PostLogin.Responses.$401
  | Paths.PostLogin.Responses.$500

export class LoginExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostLogin.RequestBody,
    Response
  > = async (params) => {
    const userRepository = new UserRepository(this.appDataSource)
    const loginUseCase = new LoginUseCase(userRepository)

    const loginResult = await loginUseCase.run({
      loginId: params.body.loginId,
      password: params.body.password,
    })

    if (loginResult.hasError) {
      switch (loginResult.error.type) {
        case 'AuthenticationFailedError': {
          const response401: Paths.PostLogin.Responses.$401 = {
            error: loginResult.error.message,
          }

          return { statusCode: 401, response: response401 }
        }
        case 'UnknownRuntimeError': {
          const response500: Paths.PostLogin.Responses.$500 = {
            error: JSON.stringify(loginResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostLogin.Responses.$200 = {
      user: {
        id: loginResult.value.id,
        accessToken: loginResult.value.accessToken,
        role: loginResult.value.role,
      },
    }

    return { statusCode: 200, response: response200 }
  }
}
