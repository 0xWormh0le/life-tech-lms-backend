import { UserSettings } from '../../entities/codex/UserSettings'
import { E, Errorable } from '../shared/Errors'
import { DefaultUserSettings, GetUserSettingsUseCase, IUserSettingsRepository } from './GetUserSettingsUseCase'

describe('test GetUserSettingsUseCase', () => {
  test('success', async () => {
    const userSettingsRepository: IUserSettingsRepository = {
      getUserSettingsByUserId: jest.fn(async function (userId: string): Promise<Errorable<UserSettings, E<'NotFoundError'> | E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            sound: {
              seVolume: 1,
              bgmVolume: 2,
              hintNarrationVolume: 4,
              serifNarrationVolume: 8,
              narrationLanguage: 'es',
            },
          },
        }
      }),
    }
    const usecase = new GetUserSettingsUseCase(userSettingsRepository)

    const result = await usecase.run({
      id: 'user-id-1',
      loginId: 'foo',
      role: 'student',
    })

    expect(result.hasError).toEqual(false)

    const getLessonsByPackageIdSpy = userSettingsRepository.getUserSettingsByUserId as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([['user-id-1']])

    expect(result.value).toEqual<UserSettings>({
      sound: {
        seVolume: 1,
        bgmVolume: 2,
        hintNarrationVolume: 4,
        serifNarrationVolume: 8,
        narrationLanguage: 'es',
      },
    })
  })

  test('there is no UserSettings related to the requested User', async () => {
    const userSettingsRepository: IUserSettingsRepository = {
      getUserSettingsByUserId: jest.fn(async function (userId: string): Promise<Errorable<UserSettings, E<'NotFoundError'> | E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'NotFoundError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetUserSettingsUseCase(userSettingsRepository)

    const result = await usecase.run({
      id: 'user-id-2',
      loginId: 'foo',
      role: 'student',
    })

    expect(result.hasError).toEqual(false)

    const getLessonsByPackageIdSpy = userSettingsRepository.getUserSettingsByUserId as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([['user-id-2']])

    // returns Default Settings
    expect(result.value).toEqual<UserSettings>(DefaultUserSettings)
  })

  test('the repository returns unknown runtime error', async () => {
    const userSettingsRepository: IUserSettingsRepository = {
      getUserSettingsByUserId: jest.fn(async function (userId: string): Promise<Errorable<UserSettings, E<'NotFoundError'> | E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetUserSettingsUseCase(userSettingsRepository)

    const result = await usecase.run({
      id: 'user-id-unkown-error',
      loginId: 'foo',
      role: 'student',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonsByPackageIdSpy = userSettingsRepository.getUserSettingsByUserId as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([['user-id-unkown-error']])
  })
})
