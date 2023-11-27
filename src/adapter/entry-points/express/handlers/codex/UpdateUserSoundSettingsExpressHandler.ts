import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserSettingsRepository } from '../../../../repositories/UserSettingsRepository'
import { UpdateUserSoundSettingsUseCase } from '../../../../../domain/usecases/codex/UpdateUserSoundSettingsUseCase'
import { UserSoundSettings } from '../../../../../domain/entities/codex/UserSettings'

type Response =
  | Paths.UpdateUserSoundSettings.Responses.$200
  | Paths.UpdateUserSoundSettings.Responses.$401
  | Paths.UpdateUserSoundSettings.Responses.$404
  | Paths.UpdateUserSoundSettings.Responses.$500

export class UpdateUserSoundSettingsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.UpdateUserSoundSettings.PathParameters,
    undefined,
    Paths.UpdateUserSoundSettings.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userSettingsRepository = new UserSettingsRepository(
      this.appDataSource,
    )
    const updateUserSoundSettings = new UpdateUserSoundSettingsUseCase(
      userSettingsRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetLessons.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetLessons.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const updatedSoundSettingsResult = await updateUserSoundSettings.run(
      params.pathParams.userId,
      params.body,
    )

    if (updatedSoundSettingsResult.hasError) {
      const response500: Paths.UpdateUserSoundSettings.Responses.$500 = {
        error: JSON.stringify(updatedSoundSettingsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.UpdateUserSoundSettings.Responses.$200 = {
      soundSettings: updatedSoundSettingsResult.value as UserSoundSettings,
    }

    return { statusCode: 200, response: response200 }
  }
}
