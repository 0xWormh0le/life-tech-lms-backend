import GetUserLessonHintStatusesUseCase, { UserLessonHintStatusRepository } from './GetUserLessonHintStatusesUseCase'
import { E, Errorable } from '../../shared/Errors'
import { UserLessonHintStatus } from '../../../entities/codex-v2/UserLessonHintStatus'
import { createTestAuthenticatedUser, nowStr } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetUserLessonHintStatusesUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${false}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const userLessonHintStatusRepository = createSuccessMockLessonHintRepository()
        const useCase = new GetUserLessonHintStatusesUseCase(userLessonHintStatusRepository)
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
      const userLessonHintStatusRepository = createSuccessMockLessonHintRepository()

      if (hasRepositoryError) {
        userLessonHintStatusRepository.findAll = jest.fn(async (): Promise<Errorable<UserLessonHintStatus[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetUserLessonHintStatusesUseCase(userLessonHintStatusRepository)
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
            id: 'testUserLessonHintStatusId1',
            userId: 'testUserId1',
            lessonHintId: 'testLessonHintId1',
            userLessonStatusId: 'testUserLessonStatusId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testUserLessonHintStatusId2',
            userId: 'testUserId2',
            lessonHintId: 'testLessonHintId2',
            userLessonStatusId: 'testUserLessonStatusId2',
            createdAt: new Date(nowStr),
          },
        ])
      }
    })
  })

  const createSuccessMockLessonHintRepository = () => {
    const repo: UserLessonHintStatusRepository = {
      findAll: async (): Promise<Errorable<UserLessonHintStatus[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testUserLessonHintStatusId1',
              userId: 'testUserId1',
              lessonHintId: 'testLessonHintId1',
              userLessonStatusId: 'testUserLessonStatusId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testUserLessonHintStatusId2',
              userId: 'testUserId2',
              lessonHintId: 'testLessonHintId2',
              userLessonStatusId: 'testUserLessonStatusId2',
              createdAt: new Date(nowStr),
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
