import { DataSource } from 'typeorm'
import { NoCredentialLoginUseCase } from '../../../../../domain/usecases/authentication/NoCredentialLoginUseCase'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { Handler } from '../shared/types'

type Response =
  | Paths.PostNoCredentialLogin.Responses.$200
  | Paths.PostNoCredentialLogin.Responses.$500

export class NoCredentialLoginExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.PostNoCredentialLogin.RequestBody,
    Response
  > = async (_) => {
    const userRepository = new UserRepository(this.appDataSource)
    const noCredentialLoginUseCase = new NoCredentialLoginUseCase(
      userRepository,
    )
    const noCredentialLoginResult = await noCredentialLoginUseCase.run()

    if (noCredentialLoginResult.hasError) {
      const response500: Paths.PostNoCredentialLogin.Responses.$500 = {
        error: JSON.stringify(noCredentialLoginResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.PostNoCredentialLogin.Responses.$200 = {
      user: {
        id: noCredentialLoginResult.value.id,
        accessToken: noCredentialLoginResult.value.accessToken,
        role: noCredentialLoginResult.value.role,
      },
    }

    return { statusCode: 200, response: response200 }
  }
}
