import { UserSoundSettings } from '../../entities/codex/UserSettings'
import { E, Errorable } from '../shared/Errors'
import { UpdateUserSoundSettingsUseCase, IUserSettingsRepository } from './UpdateUserSoundSettingsUseCase'

describe('test UpdateUserSoundSettingsUseCase', () => {
  test('UpdateUserSoundSettingsUseCase - success', async () => {
    const updateUserSettingsRepository: IUserSettingsRepository = {
      updateUserSoundSettingsByUserId: jest.fn(async function (): Promise<Errorable<UserSoundSettings | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            seVolume: 5,
            bgmVolume: 5,
            hintNarrationVolume: 5,
            serifNarrationVolume: 5,
            narrationLanguage: 'es',
          },
        }
      }),
    }
    const usecase = new UpdateUserSoundSettingsUseCase(updateUserSettingsRepository)
    const result = await usecase.run('user-id-1', {
      seVolume: 5,
      bgmVolume: 5,
      hintNarrationVolume: 5,
      serifNarrationVolume: 5,
      narrationLanguage: 'es',
    })

    expect(result.hasError).toEqual(false)

    const updateUserByUserIdSpy = updateUserSettingsRepository.updateUserSoundSettingsByUserId as jest.Mock

    expect(updateUserByUserIdSpy.mock.calls).toEqual([
      [
        'user-id-1',
        {
          seVolume: 5,
          bgmVolume: 5,
          hintNarrationVolume: 5,
          serifNarrationVolume: 5,
          narrationLanguage: 'es',
        },
      ],
    ])

    expect(result.value).toEqual<UserSoundSettings>({
      seVolume: 5,
      bgmVolume: 5,
      hintNarrationVolume: 5,
      serifNarrationVolume: 5,
      narrationLanguage: 'es',
    })
  })

  test('the repository returns unknown runtime error', async () => {
    const updateUserSettingsRepository: IUserSettingsRepository = {
      updateUserSoundSettingsByUserId: jest.fn(async function (): Promise<Errorable<UserSoundSettings | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const usecase = new UpdateUserSoundSettingsUseCase(updateUserSettingsRepository)
    const result = await usecase.run('user-id-1', {
      seVolume: 5,
      bgmVolume: 5,
      hintNarrationVolume: 5,
      serifNarrationVolume: 5,
      narrationLanguage: 'es',
    })

    const updateUserByUserIdSpy = updateUserSettingsRepository.updateUserSoundSettingsByUserId as jest.Mock

    expect(result.hasError).toEqual(true)
    expect(updateUserByUserIdSpy.mock.calls).toEqual([
      [
        'user-id-1',
        {
          seVolume: 5,
          bgmVolume: 5,
          hintNarrationVolume: 5,
          serifNarrationVolume: 5,
          narrationLanguage: 'es',
        },
      ],
    ])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('there is no UserSettings related to the requested User', async () => {
    const updateUserSettingsRepository: IUserSettingsRepository = {
      updateUserSoundSettingsByUserId: jest.fn(async function (): Promise<Errorable<UserSoundSettings, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            seVolume: 5,
            bgmVolume: 5,
            hintNarrationVolume: 5,
            serifNarrationVolume: 5,
            narrationLanguage: 'es',
          },
        }
      }),
    }
    const usecase = new UpdateUserSoundSettingsUseCase(updateUserSettingsRepository)
    const result = await usecase.run('user-id-1', {
      seVolume: 5,
      bgmVolume: 5,
      hintNarrationVolume: 5,
      serifNarrationVolume: 5,
      narrationLanguage: 'es',
    })

    const updateUserByUserIdSpy = updateUserSettingsRepository.updateUserSoundSettingsByUserId as jest.Mock

    expect(result.hasError).toEqual(false)

    expect(updateUserByUserIdSpy.mock.calls).toEqual([
      [
        'user-id-1',
        {
          seVolume: 5,
          bgmVolume: 5,
          hintNarrationVolume: 5,
          serifNarrationVolume: 5,
          narrationLanguage: 'es',
        },
      ],
    ])
    expect(result.error).toEqual(null)
    expect(result.value).toEqual({
      seVolume: 5,
      bgmVolume: 5,
      hintNarrationVolume: 5,
      serifNarrationVolume: 5,
      narrationLanguage: 'es',
    })
  })
})
