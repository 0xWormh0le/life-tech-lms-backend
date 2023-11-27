import { AuthenticationInfo } from '../../entities/authentication/AuthenticationInfo'
import { UserWithToken } from '../../entities/authentication/UserWithToken'
import { User } from '../../entities/codex/User'
import { E, Errorable } from '../shared/Errors'
import { IUserRepository, NoCredentialLoginUseCase } from './NoCredentialLoginUseCase'

describe('Test NoCredentialLoginUseCase', () => {
  test('success', async () => {
    const userRepository: IUserRepository = {
      createUser: async function (user: Omit<User, 'id'>): Promise<Errorable<User, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'user-id',
            ...user,
          },
        }
      },
      createAccessToken: async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'access-token',
        }
      },
    }
    const usercase = new NoCredentialLoginUseCase(userRepository)

    const result = await usercase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual<UserWithToken>({
      id: 'user-id',
      accessToken: 'access-token',
      role: 'anonymous', // role will always be anonymous
    })
  })

  test('error createUser failed ', async () => {
    const userRepository: IUserRepository = {
      createUser: async function (user: Omit<User, 'id'>): Promise<Errorable<User, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'createUser failed',
          },
          value: null,
        }
      },
      createAccessToken: async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'access-token',
        }
      },
    }
    const usercase = new NoCredentialLoginUseCase(userRepository)
    const result = await usercase.run()

    expect(result.hasError).toEqual(true)
  })

  test('error createAccessToken failed ', async () => {
    const userRepository: IUserRepository = {
      createUser: async function (user: Omit<User, 'id'>): Promise<Errorable<User, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'user-id',
            ...user,
          },
        }
      },
      createAccessToken: async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'createUser failed',
          },
          value: null,
        }
      },
    }
    const usercase = new NoCredentialLoginUseCase(userRepository)
    const result = await usercase.run()

    expect(result.hasError).toEqual(true)
  })
})
