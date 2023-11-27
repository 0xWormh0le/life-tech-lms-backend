import GetHumanUserByUserIdUseCase, { HumanUserRepository } from './GetHumanUserByUserIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetHumanUserByUserIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const useCase = new GetHumanUserByUserIdUseCase(humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'userId')

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
    })
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const humanUserRepository = createSuccessMockHumanUserRepository()

      if (hasRepositoryError) {
        humanUserRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetHumanUserByUserIdUseCase(humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'userId')

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
        expect(result.value).toEqual({
          email: null,
          hashedPassword: '******',
          loginId: 'testLoginId1',
          userId: 'testUserId1',
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        })
        expect(humanUserRepository.findByUserId.mock.calls.length).toEqual(1)
        expect(humanUserRepository.findByUserId.mock.calls[0][0]).toEqual('userId')
      }
    })
  })

  const createSuccessMockHumanUserRepository = () => {
    const repo: HumanUserRepository = {
      findByUserId: async (_userId: string): Promise<Errorable<HumanUser, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            userId: 'testUserId1',
            loginId: 'testLoginId' + '1',
            email: null,
            hashedPassword: 'testHashedPassword',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findByUserId: jest.fn((userId: string) => repo.findByUserId(userId)),
    }
  }
})
