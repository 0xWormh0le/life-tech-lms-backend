import GetUserExternalChurnZeroMappingUseCase, { UserExternalChurnZeroMappingRepository } from './GetUserExternalChurnZeroMappingUseCase'
import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'
import { UserExternalChurnZeroMapping } from '../../entities/UserExternalChurnZeroMapping'
import { createTestAuthenticatedUser } from '../../../../../domain/usecases/codex-v2/_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../../../domain/entities/codex-v2/User'

describe('GetUserExternalChurnZeroMappingUseCase', () => {
  describe('Authorization', () => {
    describe(`
      userRole             | userId | requestedUserId | expectAuthorizationError
    `, () => {
      test.each`
        userRole              | userId | requestedUserId | expectAuthorizationError
        ${'student'}          | ${'1'} | ${'1'}          | ${false}
        ${'student'}          | ${'1'} | ${'2'}          | ${true}
        ${'teacher'}          | ${'1'} | ${'1'}          | ${false}
        ${'teacher'}          | ${'1'} | ${'2'}          | ${true}
        ${'administrator'}    | ${'1'} | ${'1'}          | ${false}
        ${'administrator'}    | ${'1'} | ${'2'}          | ${true}
        ${'internalOperator'} | ${'1'} | ${'1'}          | ${false}
        ${'internalOperator'} | ${'1'} | ${'2'}          | ${false}
      `(
        'userRole: $userRole, userId: $userId, requestedUserId: $requestedUserId, expectAuthorizationError: $expectAuthorizationError ',
        async ({
          userRole,
          userId,
          requestedUserId,
          expectAuthorizationError,
        }: {
          userRole: UserRole
          userId: string
          requestedUserId: string
          expectAuthorizationError: boolean
        }) => {
          const userExternalChurnZeroMappingRepository = createSuccessMockUserExternalChurnZeroMappingRepository()
          const useCase = new GetUserExternalChurnZeroMappingUseCase(userExternalChurnZeroMappingRepository)
          const authenticatedUser = {
            ...createTestAuthenticatedUser(userRole),
            id: userId,
          }
          const result = await useCase.run(authenticatedUser, requestedUserId)

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
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const userExternalChurnZeroMappingRepository = createSuccessMockUserExternalChurnZeroMappingRepository()

      if (hasRepositoryError) {
        userExternalChurnZeroMappingRepository.findByUserId = jest.fn(
          async (_userId: string): Promise<Errorable<UserExternalChurnZeroMapping | null, E<'UnknownRuntimeError'>>> => {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: 'something went wrong',
              },
              value: null,
            }
          },
        )
      }

      const useCase = new GetUserExternalChurnZeroMappingUseCase(userExternalChurnZeroMappingRepository)
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
          externalChurnZeroContactExternalId: 'externalChurnZeroContactExternalId1',
          externalChurnZeroAccountExternalId: 'externalChurnZeroAccountExternalId1',
          userId: 'userId1',
        })
      }
    })
  })

  const createSuccessMockUserExternalChurnZeroMappingRepository = () => {
    const repo: UserExternalChurnZeroMappingRepository = {
      findByUserId: async (_userId: string): Promise<Errorable<UserExternalChurnZeroMapping | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            userId: 'userId1',
            externalChurnZeroContactExternalId: 'externalChurnZeroContactExternalId1',
            externalChurnZeroAccountExternalId: 'externalChurnZeroAccountExternalId1',
          },
        }
      },
    }

    return {
      findByUserId: jest.fn((userId: string) => repo.findByUserId(userId)),
    }
  }
})
