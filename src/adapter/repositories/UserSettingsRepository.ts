import { DataSource, EntityNotFoundError } from 'typeorm'

import {
  UserSettings,
  UserSoundSettings,
} from '../../domain/entities/codex/UserSettings'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { UserSoundSettingsTypeormEntity } from '../typeorm/entity/UserSoundSettings'

export class UserSettingsRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getUserSettingsByUserId(
    userId: string,
  ): Promise<
    Errorable<UserSettings, E<'NotFoundError'> | E<'UnknownRuntimeError'>>
  > {
    const userSoundSettingsTypeormRepository =
      this.typeormDataSource.getRepository(UserSoundSettingsTypeormEntity)

    try {
      const userSoundSettings =
        await userSoundSettingsTypeormRepository.findOneBy({
          user_id: userId,
        })

      if (userSoundSettings === null) {
        return {
          hasError: true,
          error: {
            type: 'NotFoundError',
            message: `UserSoundSettings not found by user id ${userId}`,
          },
          value: null,
        }
      }

      const narrationLanguage = userSoundSettings.narration_language

      return {
        hasError: false,
        error: null,
        value: {
          sound: {
            seVolume: userSoundSettings.se_volume,
            bgmVolume: userSoundSettings.bgm_volume,
            hintNarrationVolume: userSoundSettings.hint_narration_volume,
            serifNarrationVolume: userSoundSettings.serif_narration_volume,
            narrationLanguage:
              narrationLanguage === 'en' || narrationLanguage === 'es'
                ? narrationLanguage
                : 'en',
          },
        },
      }
    } catch (e: unknown) {
      if (e instanceof EntityNotFoundError) {
        return {
          hasError: true,
          error: {
            type: 'NotFoundError',
            message: `UserSoundSettings not found by user id ${userId}`,
          },
          value: null,
        }
      }

      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to get user_sound_settings from db by user id ${userId}`,
        },
        value: null,
      }
    }
  }

  async updateUserSoundSettingsByUserId(
    userId: string,
    userSoundSettings: UserSoundSettings,
  ): Promise<Errorable<UserSoundSettings | null, E<'UnknownRuntimeError'>>> {
    const userSoundSettingsTypeormRepository =
      this.typeormDataSource.getRepository(UserSoundSettingsTypeormEntity)

    try {
      const userSoundSettingsByIdResult =
        await userSoundSettingsTypeormRepository.findOneBy({
          user_id: userId,
        })

      if (userSoundSettingsByIdResult) {
        const userSoundSettingsResult = await userSoundSettingsTypeormRepository
          .createQueryBuilder()
          .update(UserSoundSettingsTypeormEntity, {
            se_volume: userSoundSettings.seVolume,
            bgm_volume: userSoundSettings.bgmVolume,
            hint_narration_volume: userSoundSettings.hintNarrationVolume,
            serif_narration_volume: userSoundSettings.serifNarrationVolume,
            narration_language: userSoundSettings.narrationLanguage,
          })
          .where('user_id=:id', { id: userId })
          .returning('*')
          .updateEntity(true)
          .execute()

        if (userSoundSettingsResult?.raw[0] === undefined) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `failed to update user settings of user id ${userId}`,
            },
            value: null,
          }
        }

        const narrationLanguage = userSoundSettingsResult?.raw[0]
          .narration_language as string

        return {
          hasError: false,
          error: null,
          value: {
            seVolume: userSoundSettingsResult?.raw[0].se_volume,
            bgmVolume: userSoundSettingsResult?.raw[0].bgm_volume,
            hintNarrationVolume:
              userSoundSettingsResult?.raw[0].hint_narration_volume,
            serifNarrationVolume:
              userSoundSettingsResult?.raw[0].serif_narration_volume,
            narrationLanguage:
              narrationLanguage === 'en' || narrationLanguage === 'es'
                ? narrationLanguage
                : 'en',
          },
        }
      } else {
        await userSoundSettingsTypeormRepository.save({
          user_id: userId,
          se_volume: userSoundSettings.seVolume,
          bgm_volume: userSoundSettings.bgmVolume,
          hint_narration_volume: userSoundSettings.hintNarrationVolume,
          serif_narration_volume: userSoundSettings.serifNarrationVolume,
          narration_language: userSoundSettings.narrationLanguage,
        })

        return {
          hasError: false,
          error: null,
          value: {
            seVolume: userSoundSettings.seVolume,
            bgmVolume: userSoundSettings.bgmVolume,
            hintNarrationVolume: userSoundSettings.hintNarrationVolume,
            serifNarrationVolume: userSoundSettings.serifNarrationVolume,
            narrationLanguage: userSoundSettings.narrationLanguage,
          },
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to update user settings of user id ${userId}`,
        ),
        value: null,
      }
    }
  }
}
