import { UserResetPassword } from '../../entities/authentication/UserResetPassword'
import { E, Errorable } from '../shared/Errors'
import { ResetPasswordRequestResendUseCase, IUserResetPasswordRepository } from './ResetPasswordRequestResendUseCase'

const TOKEN = '1719d15a-2a88-4a4a-ad8d-cfd5065c87ae'

describe('Test ResetPasswordRequestResendUseCase', () => {
  test('ResetPasswordRequestResendUseCase success', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const result = await usercase.run(TOKEN)

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('When provided token is invalid', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const result = await usercase.run('user-token')

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidToken')
    expect(result.error?.message).toEqual('Invalid token is provided')
    expect(result.value).toEqual(null)
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
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usercase = new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const result = await usercase.run('')

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
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const result = await usercase.run(TOKEN)

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
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const result = await usercase.run(TOKEN)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UserResetPasswordNotFound')
    expect(result.error?.message).toEqual('The specified token user reset password data not found')
    expect(result.value).toEqual(null)
  })

  test('When failed to create user reset password request resend', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      getUserResetPasswordByToken: jest.fn(async function (): Promise<Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as UserResetPassword,
        }
      }),
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usercase = new ResetPasswordRequestResendUseCase(userResetPasswordRepository)

    const result = await usercase.run(TOKEN)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
