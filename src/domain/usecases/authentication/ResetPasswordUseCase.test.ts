import { UserResetPassword } from '../../entities/authentication/UserResetPassword'
import { E, Errorable } from '../shared/Errors'
import { IUserRepository, ResetPasswordUseCase, IUserResetPasswordRepository } from './ResetPasswordUseCase'

const TOKEN = '1719d15a-2a88-4a4a-ad8d-cfd5065c87ae'
const PASSWORD = 'user-password'

describe('Test ResetPasswordUseCase', () => {
  test('ResetPasswordUseCase success', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, false)

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('When token is not found', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run('', PASSWORD, false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TokenNotFound')
    expect(result.error?.message).toEqual('The specified token not found')
    expect(result.value).toEqual(null)
  })

  test('When failed to get user reset password data', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When user reset password data not found', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UserResetPasswordNotFound')
    expect(result.error?.message).toEqual('The specified token user reset password data not found')
    expect(result.value).toEqual(null)
  })

  test('When provided token is expired', async () => {
    const expiry = new Date()

    expiry.setHours(expiry.getHours() - 1)

    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            expiry,
          } as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TokenExpired')
    expect(result.error?.message).toEqual('The specified token is expired')
    expect(result.value).toEqual(null)
  })

  test('When token is not validate', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, true)

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('When no password is provided', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, '', false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PasswordRequired')
    expect(result.error?.message).toEqual('Password cannot be blank')
    expect(result.value).toEqual(null)
  })

  test('When failed to update user password', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When failed to delete user reset password', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      removeUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const userRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordUseCase(userResetPasswordRepository, userRepository)

    const result = await usercase.run(TOKEN, PASSWORD, false)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
