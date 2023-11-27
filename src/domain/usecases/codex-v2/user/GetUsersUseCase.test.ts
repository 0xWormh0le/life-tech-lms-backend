import GetUsersUseCase, { UserRepository } from './GetUsersUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetUsersUseCase', () => {
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
        const useCase = new GetUsersUseCase(userRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser)

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeDefined()
        }
      },
    )
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const userRepository = createSuccessMockUserRepository()

      if (hasRepositoryError) {
        userRepository.findAll = jest.fn(async (): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'something went wrong',
            },
            value: null,
          }
        })
      }

      const useCase = new GetUsersUseCase(userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser)

      if (expectUnknownError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'UnknownRuntimeError',
          message: 'something went wrong',
        })
        expect(result.value).toBeNull()
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toEqual([
          {
            id: 'testUserId1',
            role: 'teacher',
            isDemo: false,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
          {
            id: 'testUserId2',
            role: 'teacher',
            isDemo: true,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        ])
      }
    })
  })

  const createSuccessMockUserRepository = () => {
    const repo: UserRepository = {
      findAll: async (): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testUserId1',
              role: 'teacher',
              isDemo: false,
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            },
            {
              id: 'testUserId2',
              role: 'teacher',
              isDemo: true,
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findAll: jest.fn(() => repo.findAll()),
    }
  }
})
