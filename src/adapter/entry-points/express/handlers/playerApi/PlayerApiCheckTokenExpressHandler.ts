import { DataSource } from 'typeorm'
import { URL } from 'url'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { PlayerApiCheckTokenUseCase } from '../../../../../domain/usecases/lesson-player/PlayerApiCheckTokenUseCase'

type Response =
  | Paths.GetCheckToken.Responses.$200
  | Paths.GetCheckToken.Responses.$401
  | Paths.GetCheckToken.Responses.$500

export class PlayerApiCheckTokenExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private codexUsaFronteneBaseUrl: string,
  ) {}

  handler: HandlerWithToken<undefined, {}, undefined, Response> = async (
    _,
    token,
  ) => {
    const userRepository = new UserRepository(this.appDataSource)
    const checkTokenUseCase = new PlayerApiCheckTokenUseCase(userRepository)

    const checkTokenResult = await checkTokenUseCase.run(token)

    if (checkTokenResult.hasError) {
      switch (checkTokenResult.error.type) {
        case 'TokenInvalidError': {
          const response401: Paths.GetCheckToken.Responses.$401 = {
            result: 'invalid',
            isAccessible: false,
            redirect_url: new URL('/', this.codexUsaFronteneBaseUrl).toString(),
          }

          return { statusCode: 401, response: response401 }
        }
        case 'UnknownRuntimeError': {
          const response500: Paths.GetCheckToken.Responses.$500 = {
            error: JSON.stringify(checkTokenResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetCheckToken.Responses.$200 = {
      result: 'valid',
      isAccessible: true,
      name: '', // TODO: get nickname from Student
    }

    return { statusCode: 200, response: response200 }
  }
}
