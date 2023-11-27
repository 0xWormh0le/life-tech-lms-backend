import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { GetUserSettingsUseCase } from '../../../../../domain/usecases/codex/GetUserSettingsUseCase'
import { UserSettingsRepository } from '../../../../repositories/UserSettingsRepository'
import { UserRepository } from '../../../../repositories/UserRepository'

type Response =
  | Paths.GetUserSettings.Responses.$200
  | Paths.GetUserSettings.Responses.$401
  | Paths.GetUserSettings.Responses.$404
  | Paths.GetUserSettings.Responses.$500

export class GetUserSettingsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetUserSettings.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userSettingsRepository = new UserSettingsRepository(
      this.appDataSource,
    )
    const getUserSettingsUseCase = new GetUserSettingsUseCase(
      userSettingsRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetUserSettings.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetUserSettings.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getUserSettingsResult = await getUserSettingsUseCase.run(
      getUserResult.value,
    )

    if (getUserSettingsResult.hasError) {
      switch (getUserSettingsResult.error.type) {
        case 'UnknownRuntimeError': {
          const response500: Paths.GetUserSettings.Responses.$500 = {
            error: JSON.stringify(getUserSettingsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetUserSettings.Responses.$200 = {
      settings: getUserSettingsResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
