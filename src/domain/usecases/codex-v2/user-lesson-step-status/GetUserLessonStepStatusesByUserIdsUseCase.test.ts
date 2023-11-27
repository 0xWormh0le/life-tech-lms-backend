import GetUserLessonStepStatusesByUserIdsUseCase, { UserLessonStepStatusRepository } from './GetUserLessonStepStatusesByUserIdsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { UserLessonStepStatus } from '../../../entities/codex-v2/UserLessonStepStatus'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetUserLessonStepStatusesByUserIdsUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const userLessonStepStatusRepository = createSuccessMockUserLessonStepStatusRepository()
      const useCase = new GetUserLessonStepStatusesByUserIdsUseCase(userLessonStepStatusRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, ['userId1', 'userId2'])

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
      const userLessonStepStatusRepository = createSuccessMockUserLessonStepStatusRepository()

      if (hasRepositoryError) {
        userLessonStepStatusRepository.findByUserIds = jest.fn(
          async (_userIds: string[]): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetUserLessonStepStatusesByUserIdsUseCase(userLessonStepStatusRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, ['userId1', 'userId2'])

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
            id: 'testUserLessonStepStatusId1',
            lessonId: 'testLessonId1',
            status: 'cleared',
            stepId: 'testStepId1',
            userId: 'testUserId1',
            createdAt: new Date(nowStr),
            userLessonStatusId: 'testUserLessonStatusId1',
          },
          {
            id: 'testUserLessonStepStatusId2',
            lessonId: 'testLessonId2',
            status: 'cleared',
            stepId: 'testStepId2',
            userId: 'testUserId2',
            createdAt: new Date(nowStr),
            userLessonStatusId: 'testUserLessonStatusId2',
          },
        ])
        expect(userLessonStepStatusRepository.findByUserIds.mock.calls.length).toEqual(1)
        expect(userLessonStepStatusRepository.findByUserIds.mock.calls[0][0]).toEqual(['userId1', 'userId2'])
      }
    })
  })

  const createSuccessMockUserLessonStepStatusRepository = () => {
    const repo: UserLessonStepStatusRepository = {
      findByUserIds: async (_userIds: string[]): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testUserLessonStepStatusId1',
              userId: 'testUserId1',
              stepId: 'testStepId1',
              userLessonStatusId: 'testUserLessonStatusId1',
              lessonId: 'testLessonId1',
              status: 'cleared',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testUserLessonStepStatusId2',
              userId: 'testUserId2',
              stepId: 'testStepId2',
              userLessonStatusId: 'testUserLessonStatusId2',
              lessonId: 'testLessonId2',
              status: 'cleared',
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findByUserIds: jest.fn((userIds: string[]) => repo.findByUserIds(userIds)),
    }
  }
})
