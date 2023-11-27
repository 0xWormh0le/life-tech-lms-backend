import CreateUserUseCase, { DatetimeRepository, UserRepository } from './CreateUserUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('CreateUserUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const userRepository = createSuccessMockUserRepository()
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const useCase = new CreateUserUseCase(userRepository, datetimeRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          role: 'teacher',
          isDemo: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(userRepository.create.mock.calls.length).toEqual(0)
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeDefined()
        }
      },
    )
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const userRepository = createSuccessMockUserRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const useCase = new CreateUserUseCase(userRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(userRepository.create.mock.calls[0][0]).toEqual({
        role: 'teacher',
        isDemo: false,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
        id: 'test-user-id',
      })
    })

    test('error on userRepository.issueId', async () => {
      const userRepository = createSuccessMockUserRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      userRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateUserUseCase(userRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(userRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const userRepository = createSuccessMockUserRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      datetimeRepository.now = jest.fn(async (): Promise<Errorable<Date, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateUserUseCase(userRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(userRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on userRepository.create', async () => {
      const userRepository = createSuccessMockUserRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      userRepository.create = jest.fn(async (_user: User): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateUserUseCase(userRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockUserRepository = () => {
    const repo: UserRepository = {
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-user-id',
        }
      },
      create: async (_user) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((user: User) => repo.create(user)),
    }
  }
  const createSuccessMockDatetimeRepository = () => {
    const repo: DatetimeRepository = {
      now: async () => {
        return {
          hasError: false,
          error: null,
          value: new Date(nowStr),
        }
      },
    }

    return {
      now: jest.fn(() => repo.now()),
    }
  }
})
