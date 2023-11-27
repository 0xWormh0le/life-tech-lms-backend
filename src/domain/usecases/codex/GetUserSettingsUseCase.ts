import { User } from '../../entities/codex/User'
import { UserSettings } from '../../entities/codex/UserSettings'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserSettingsRepository {
  getUserSettingsByUserId(
    userId: string,
  ): Promise<
    Errorable<UserSettings, E<'NotFoundError'> | E<'UnknownRuntimeError'>>
  >
}

export const DefaultUserSettings: UserSettings = {
  sound: {
    seVolume: 5,
    bgmVolume: 5,
    hintNarrationVolume: 5,
    serifNarrationVolume: 5,
    narrationLanguage: 'en',
  },
}

export class GetUserSettingsUseCase {
  constructor(private userSettingsRepository: IUserSettingsRepository) {}

  async run(
    requestedUser: User,
  ): Promise<Errorable<UserSettings, E<'UnknownRuntimeError'>>> {
    const getUserSettingsResult =
      await this.userSettingsRepository.getUserSettingsByUserId(
        requestedUser.id,
      )

    if (getUserSettingsResult.hasError) {
      switch (getUserSettingsResult.error.type) {
        case 'UnknownRuntimeError': {
          return {
            hasError: true,
            error: wrapError(
              getUserSettingsResult.error,
              'failed to getUserSettingsByUserId',
            ),
            value: null,
          }
        }
        case 'NotFoundError': {
          return {
            hasError: false,
            error: null,
            value: DefaultUserSettings,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: getUserSettingsResult.value,
    }
  }
}
