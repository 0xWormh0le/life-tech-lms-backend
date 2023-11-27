import { User } from '../../entities/codex/User'
import { PlayerApiCheckTokenUseCase, IUserRepository } from './PlayerApiCheckTokenUseCase'
import { E, Errorable } from '../shared/Errors'

//
// FIXME: This is Just example
//
describe('test PlayerApiCheckTokenUseCase', () => {
  test('with VALID access token', async () => {
    const userRepository: IUserRepository = {
      getUserByAccessToken: jest.fn(async function (_accessToken: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'user-id',
            loginId: 'login-id',
            role: 'student',
          },
        }
      }),
    }
    const usecase = new PlayerApiCheckTokenUseCase(userRepository)

    const result = await usecase.run('valid-access-token')

    expect(result.hasError).toEqual(false)

    const getUserByAccessTokenSpy = userRepository.getUserByAccessToken as jest.Mock

    expect(getUserByAccessTokenSpy.mock.calls).toEqual([['valid-access-token']])
  })

  test('with INVALID access token', async () => {
    const userRepository: IUserRepository = {
      getUserByAccessToken: jest.fn(async function (_accessToken: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }),
    }
    const usecase = new PlayerApiCheckTokenUseCase(userRepository)

    const result = await usecase.run('invalid-access-token')

    const getUserByAccessTokenSpy = userRepository.getUserByAccessToken as jest.Mock

    expect(getUserByAccessTokenSpy.mock.calls).toEqual([['invalid-access-token']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TokenInvalidError')
  })

  test('with repository emitting runtime error', async () => {
    const userRepository: IUserRepository = {
      getUserByAccessToken: jest.fn(async function (_accessToken: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }
    const usecase = new PlayerApiCheckTokenUseCase(userRepository)

    const result = await usecase.run('access-token')

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })
})
