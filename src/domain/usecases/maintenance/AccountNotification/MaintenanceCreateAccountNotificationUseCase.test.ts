import { E, Errorable } from '../../shared/Errors'
import { MaintenanceCreateAccountNotificationUseCase, IAccountNotificationRepository } from './MaintenanceCreateAccountNotificationUseCase'

describe('test CreateAccountNotificationUseCase', () => {
  test('success', async () => {
    const accountNotificationRepository: IAccountNotificationRepository = {
      createAccountNotification: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateAccountNotificationUseCase(accountNotificationRepository)

    const result = await usecase.run({
      toType: 'email',
      title: 'Test Email ☀️',
      accounts: [
        {
          email: 'user-account-1@example.net',
          password: 'user-password-1',
        },
        {
          email: 'user-account-2@example.net',
          password: 'user-password-2',
        },
      ],
      toEmails: ['user-email-1@foo.io', 'user-email-2@bar.io'],
    })

    expect(result.hasError).toEqual(false)

    const createAccountNotificationSpy = accountNotificationRepository.createAccountNotification as jest.Mock

    expect(createAccountNotificationSpy.mock.calls).toEqual([
      [
        {
          toType: 'email',
          title: 'Test Email ☀️',
          accounts: [
            {
              email: 'user-account-1@example.net',
              password: 'user-password-1',
            },
            {
              email: 'user-account-2@example.net',
              password: 'user-password-2',
            },
          ],
          toEmails: ['user-email-1@foo.io', 'user-email-2@bar.io'],
        },
      ],
    ])
  })

  test('fail with unsupported toType', async () => {
    const accountNotificationRepository: IAccountNotificationRepository = {
      createAccountNotification: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateAccountNotificationUseCase(accountNotificationRepository)

    const result = await usecase.run({
      toType: 'teacherId',
      title: 'Test Email ☀️',
      accounts: [
        {
          email: 'user-account-1@example.net',
          password: 'user-password-1',
        },
        {
          email: 'user-account-2@example.net',
          password: 'user-password-2',
        },
      ],
      toTeacherIds: ['teacher-id-1', 'teacher-id-2'],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnsupportedToType')

    const createAccountNotificationSpy = accountNotificationRepository.createAccountNotification as jest.Mock

    expect(createAccountNotificationSpy.mock.calls).toEqual([]) // Should not be called
  })

  test('fail with UnknownRuntimeError from repository', async () => {
    const accountNotificationRepository: IAccountNotificationRepository = {
      createAccountNotification: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error',
          },
          value: null,
        }
      }),
    }
    const usecase = new MaintenanceCreateAccountNotificationUseCase(accountNotificationRepository)

    const result = await usecase.run({
      toType: 'email',
      title: 'Test Email ☀️',
      accounts: [
        {
          email: 'user-account-1@example.net',
          password: 'user-password-1',
        },
        {
          email: 'user-account-2@example.net',
          password: 'user-password-2',
        },
      ],
      toEmails: ['user-email-1@foo.io', 'user-email-2@bar.io'],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const createAccountNotificationSpy = accountNotificationRepository.createAccountNotification as jest.Mock

    expect(createAccountNotificationSpy.mock.calls).toEqual([
      [
        {
          toType: 'email',
          title: 'Test Email ☀️',
          accounts: [
            {
              email: 'user-account-1@example.net',
              password: 'user-password-1',
            },
            {
              email: 'user-account-2@example.net',
              password: 'user-password-2',
            },
          ],
          toEmails: ['user-email-1@foo.io', 'user-email-2@bar.io'],
        },
      ],
    ])
  })
})
