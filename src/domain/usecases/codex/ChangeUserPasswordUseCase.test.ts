import { UserSoundSettings } from '../../entities/codex/UserSettings'
import { UserRoles } from '../shared/Constants'
import { E, Errorable } from '../shared/Errors'
import { ChangeUserPasswordUseCase, IUserRepository } from './ChangeUserPasswordUseCase'

describe('test ChangeUserPasswordUseCase', () => {
  test('ChangeUserPasswordUseCase - success', async () => {
    const changeUserPasswordRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new ChangeUserPasswordUseCase(changeUserPasswordRepository)
    const result = await usecase.run(
      {
        id: 'user-id-1',
        role: UserRoles.teacher,
      },
      'new-Password',
    )

    const chnageUserPasswordRepoSpy = changeUserPasswordRepository.updateUserPassword as jest.Mock

    expect(chnageUserPasswordRepoSpy.mock.calls).toEqual([['user-id-1', 'new-Password']])

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)
  })

  test('when user enter empty password - EmptyPassword error', async () => {
    const changeUserPasswordRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new ChangeUserPasswordUseCase(changeUserPasswordRepository)
    const result = await usecase.run(
      {
        id: 'user-id-1',
        role: 'teacher',
      },
      '',
    )

    const chnageUserPasswordRepoSpy = changeUserPasswordRepository.updateUserPassword as jest.Mock

    expect(chnageUserPasswordRepoSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('EmptyPassword')
    expect(result.error?.message).toEqual('password can not be empty.')
    expect(result.value).toEqual(null)
  })

  test('when user role is student it will not change their password', async () => {
    const changeUserPasswordRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new ChangeUserPasswordUseCase(changeUserPasswordRepository)
    const result = await usecase.run(
      {
        id: 'user-id-1',
        role: UserRoles.student,
      },
      'new-Password',
    )

    const chnageUserPasswordRepoSpy = changeUserPasswordRepository.updateUserPassword as jest.Mock

    expect(chnageUserPasswordRepoSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to change their password.')
    expect(result.value).toEqual(null)
  })

  test('when ChangeUserPasswordUseCase return unknown run time error', async () => {
    const changeUserPasswordRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown run time error.',
          },
          value: null,
        }
      }),
    }
    const usecase = new ChangeUserPasswordUseCase(changeUserPasswordRepository)
    const result = await usecase.run(
      {
        id: 'user-id-1',
        role: UserRoles.teacher,
      },
      'new-Password',
    )

    const chnageUserPasswordRepoSpy = changeUserPasswordRepository.updateUserPassword as jest.Mock

    expect(chnageUserPasswordRepoSpy.mock.calls).toEqual([['user-id-1', 'new-Password']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when ChangeUserPasswordUseCase return UserDataNotFound error', async () => {
    const changeUserPasswordRepository: IUserRepository = {
      updateUserPassword: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'UserDataNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'UserDataNotFound',
            message: 'unknown run time error.',
          },
          value: null,
        }
      }),
    }
    const usecase = new ChangeUserPasswordUseCase(changeUserPasswordRepository)
    const result = await usecase.run(
      {
        id: 'user-id-1',
        role: UserRoles.teacher,
      },
      'new-Password',
    )

    const chnageUserPasswordRepoSpy = changeUserPasswordRepository.updateUserPassword as jest.Mock

    expect(chnageUserPasswordRepoSpy.mock.calls).toEqual([['user-id-1', 'new-Password']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UserDataNotFound')
    expect(result.value).toEqual(null)
  })
})
