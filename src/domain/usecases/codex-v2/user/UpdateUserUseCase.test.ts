import UpdateUserUseCase, { DatetimeRepository, UserRepository } from './UpdateUserUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('UpdateUserUseCase', () => {
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
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const userRepository = createSuccessMockUserRepository()
        const useCase = new UpdateUserUseCase(datetimeRepository, userRepository)

        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'id',
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
          expect(userRepository.update.mock.calls.length).toEqual(0)
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
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateUserUseCase(datetimeRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testUserId1',
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(userRepository.update.mock.calls[0][0]).toEqual({
        id: 'testUserId1',
        role: 'teacher',
        isDemo: false,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      })
    })

    test('error on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateUserUseCase(datetimeRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testUserId1',
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(userRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateUserUseCase(datetimeRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testUserId1',
        role: 'teacher',
        isDemo: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'user not found. userId: testUserId1',
        type: 'UserNotFound',
      })
      expect(result.value).toBeNull()
      expect(userRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on userRepository.update', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      userRepository.update = jest.fn(async (_user: User): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateUserUseCase(datetimeRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testUserId',
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

  const createSuccessMockUserRepository = () => {
    const repo: UserRepository = {
      findById: async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testUserId1',
            role: 'teacher',
            isDemo: false,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },

      update: async (_user) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      update: jest.fn((user: User) => repo.update(user)),
    }
  }
})
