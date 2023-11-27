import { User } from '../../entities/codex/User'
import { E, Errorable } from '../shared/Errors'
import { IUserRepository, ResetPasswordRequestUseCase, IUserResetPasswordRepository } from './ResetPasswordRequestUseCase'
import { UserRoles } from '../shared/Constants'

const USER_ID = 'user-id-001'
const VALID_EMAIL = 'user@email.com'
const INVALID_EMAIL = 'useremail.com'

describe('Test ResetPasswordRequestUseCase', () => {
  test('ResetPasswordRequestUseCase success', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUserByEmail: jest.fn(async function (): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: USER_ID,
            role: UserRoles.teacher,
          },
        }
      }),
    }
    const usercase = new ResetPasswordRequestUseCase(userRepository, userResetPasswordRepository)

    const result = await usercase.run(VALID_EMAIL)

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('When provided email is invalid', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUserByEmail: jest.fn(async function (): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: USER_ID,
            role: UserRoles.teacher,
          },
        }
      }),
    }
    const usercase = new ResetPasswordRequestUseCase(userRepository, userResetPasswordRepository)

    const result = await usercase.run(INVALID_EMAIL)

    expect(result.hasError).toEqual(true)

    const createUserResetPasswordSpy = userResetPasswordRepository.setUserResetPassword as jest.Mock

    expect(createUserResetPasswordSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidEmail')
    expect(result.error?.message).toEqual('Invalid email is provided')
    expect(result.value).toEqual(null)
  })

  test('When failed to getUser', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUserByEmail: jest.fn(async function (): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
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
    const usercase = new ResetPasswordRequestUseCase(userRepository, userResetPasswordRepository)

    const result = await usercase.run(VALID_EMAIL)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When specified user not found', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUserByEmail: jest.fn(async function (): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usercase = new ResetPasswordRequestUseCase(userRepository, userResetPasswordRepository)

    const result = await usercase.run(VALID_EMAIL)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UserNotFound')
    expect(result.error?.message).toEqual('The specified user not found for user@email.com')
    expect(result.value).toEqual(null)
  })

  test('When user role student can not change their password', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
      setUserResetPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUserByEmail: jest.fn(async function (): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: USER_ID,
            role: UserRoles.student,
          },
        }
      }),
    }
    const usercase = new ResetPasswordRequestUseCase(userRepository, userResetPasswordRepository)

    const result = await usercase.run(VALID_EMAIL)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('student can not change their password')
    expect(result.value).toEqual(null)
  })

  test('When UserResetPasswordRepository return run time error', async () => {
    const userResetPasswordRepository: IUserResetPasswordRepository = {
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
    const userRepository: IUserRepository = {
      getUserByEmail: jest.fn(async function (): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: USER_ID,
            role: UserRoles.teacher,
          },
        }
      }),
    }
    const usercase = new ResetPasswordRequestUseCase(userRepository, userResetPasswordRepository)

    const result = await usercase.run(VALID_EMAIL)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
