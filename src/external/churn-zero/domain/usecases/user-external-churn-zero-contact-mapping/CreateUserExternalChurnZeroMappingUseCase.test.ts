import { v4 as uuid } from 'uuid'
import CreateUserExternalChurnZeroMappingUseCase, { UserExternalChurnZeroMappingRepository } from './CreateUserExternalChurnZeroMappingUseCase'
import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'
import { UserExternalChurnZeroMapping } from '../../entities/UserExternalChurnZeroMapping'
import { createTestAuthenticatedUser } from '../../../../../domain/usecases/codex-v2/_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../../../domain/entities/codex-v2/User'

describe('CreateUserExternalChurnZeroMappingUseCase', () => {
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
          const input: UserExternalChurnZeroMapping = {
            userId: requestedUserId,
            externalChurnZeroContactExternalId: 'test-external-churn-zero-contact-external-id',
            externalChurnZeroAccountExternalId: 'test-external-churn-zero-account-external-id',
          }

          const authenticatedUser = {
            ...createTestAuthenticatedUser(userRole),
            id: userId,
          }
          const userExternalChurnZeroMappingRepository = createSuccessMockUserExternalChurnZeroMappingRepository()
          const useCase = new CreateUserExternalChurnZeroMappingUseCase(userExternalChurnZeroMappingRepository)
          const result = await useCase.run(authenticatedUser, input)

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
            expect(result.value).toEqual(input)
          }
        },
      )
    })
  })

  describe('run(authenticatedUser, input)', () => {
    test('success', async () => {
      const input: UserExternalChurnZeroMapping = {
        userId: uuid(),
        externalChurnZeroContactExternalId: 'test-external-churn-zero-contact-external-id',
        externalChurnZeroAccountExternalId: 'test-external-churn-zero-account-external-id',
      }

      const userExternalChurnZeroMappingRepository = createSuccessMockUserExternalChurnZeroMappingRepository()
      const useCase = new CreateUserExternalChurnZeroMappingUseCase(userExternalChurnZeroMappingRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual(input)
    })

    test('error on RdbUserExternalChurnZeroMappingRepository.create', async () => {
      const input: UserExternalChurnZeroMapping = {
        userId: uuid(),
        externalChurnZeroContactExternalId: 'test-external-churn-zero-contact-external-id',
        externalChurnZeroAccountExternalId: 'test-external-churn-zero-account-external-id',
      }

      const userExternalChurnZeroMappingRepository = createSuccessMockUserExternalChurnZeroMappingRepository()

      userExternalChurnZeroMappingRepository.create = jest.fn(
        async (_entity: UserExternalChurnZeroMapping): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateUserExternalChurnZeroMappingUseCase(userExternalChurnZeroMappingRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockUserExternalChurnZeroMappingRepository = () => {
    const repo: UserExternalChurnZeroMappingRepository = {
      create: async (_entity: UserExternalChurnZeroMapping): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => ({
        hasError: false,
        error: null,
        value: undefined,
      }),
    }

    return {
      create: jest.fn((entity: UserExternalChurnZeroMapping) => repo.create(entity)),
    }
  }
})
