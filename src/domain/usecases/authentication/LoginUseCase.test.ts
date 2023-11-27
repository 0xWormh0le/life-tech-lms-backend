import { AuthenticationInfo } from '../../entities/authentication/AuthenticationInfo'
import { UserWithToken } from '../../entities/authentication/UserWithToken'
import { E, Errorable } from '../shared/Errors'
import { IUserRepository, LoginUseCase } from './LoginUseCase'

describe('Test LoginUseCase', () => {
  test('with CORRECT pair of ID/Password', async () => {
    const userRepository: IUserRepository = {
      getUserWithTokenByAuthenticationInfo: jest.fn(async function (
        authenticationInfo: AuthenticationInfo,
      ): Promise<Errorable<UserWithToken | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'user-id-001',
            accessToken: 'valid-access-token',
            loginId: 'login-id-001',
            role: 'student',
          },
        }
      }),
    }
    const usercase = new LoginUseCase(userRepository)

    const result = await usercase.run({
      loginId: 'correct-login-id',
      password: 'correct-password',
    })

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual<UserWithToken>({
      id: 'user-id-001',
      accessToken: 'valid-access-token',
      loginId: 'login-id-001',
      role: 'student',
    })
  })

  test('with INCORRECT pair of ID/Password', async () => {
    const userRepository: IUserRepository = {
      getUserWithTokenByAuthenticationInfo: jest.fn(async function (
        authenticationInfo: AuthenticationInfo,
      ): Promise<Errorable<UserWithToken | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }),
    }
    const usercase = new LoginUseCase(userRepository)

    const result = await usercase.run({
      loginId: 'incorrect-login-id',
      password: 'incorrect-password',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AuthenticationFailedError')
  })

  test('with INCORRECT pair of ID/Password returning from user repository', async () => {
    const userRepository: IUserRepository = {
      getUserWithTokenByAuthenticationInfo: jest.fn(async function (
        authenticationInfo: AuthenticationInfo,
      ): Promise<Errorable<UserWithToken | null, E<'UnknownRuntimeError'> | E<'AuthenticationFailedError'>>> {
        return {
          hasError: true,
          error: {
            message: 'invalid info',
            type: 'AuthenticationFailedError',
          },
          value: null,
        }
      }),
    }
    const usercase = new LoginUseCase(userRepository)

    const result = await usercase.run({
      loginId: 'incorrect-login-id',
      password: 'incorrect-password',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AuthenticationFailedError')
  })

  test('with UserRepository spits the UnknownRuntimeError', async () => {
    const userRepository: IUserRepository = {
      getUserWithTokenByAuthenticationInfo: jest.fn(async function (
        authenticationInfo: AuthenticationInfo,
      ): Promise<Errorable<UserWithToken | null, E<'UnknownRuntimeError'>>> {
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
    const usercase = new LoginUseCase(userRepository)

    const result = await usercase.run({
      loginId: 'login-id',
      password: 'password',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })
})
