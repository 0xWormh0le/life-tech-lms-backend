import { UserSoundSettings } from '../../entities/codex/UserSettings'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface IUserSettingsRepository {
  updateUserSoundSettingsByUserId(
    userId: string,
    userSoundSettings: UserSoundSettings,
  ): Promise<Errorable<UserSoundSettings | null, E<'UnknownRuntimeError'>>>
}

export class UpdateUserSoundSettingsUseCase {
  constructor(private userSettingsRepository: IUserSettingsRepository) {}

  async run(
    userId: string,
    userSoundSettings: UserSoundSettings,
  ): Promise<Errorable<UserSoundSettings | null, E<'UnknownRuntimeError'>>> {
    const updateUserSettingsResult =
      await this.userSettingsRepository.updateUserSoundSettingsByUserId(
        userId,
        userSoundSettings,
      )

    if (updateUserSettingsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          updateUserSettingsResult.error,
          'failed to UpdateUserSettingsByUserId',
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: updateUserSettingsResult.value,
    }
  }
}
