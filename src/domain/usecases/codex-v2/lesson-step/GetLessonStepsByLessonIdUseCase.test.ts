import GetLessonStepsByLessonIdUseCase, { LessonStepRepository } from './GetLessonStepsByLessonIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { LessonStep } from '../../../entities/codex-v2/LessonStep'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetLessonStepsByLessonIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const useCase = new GetLessonStepsByLessonIdUseCase(lessonStepRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'testStudentGroupId')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasStudentRepositoryError | expectUnknownError
      ${false}                  | ${false}
      ${true}                   | ${true}
    `(
      `hasStudentRepositoryError: $hasStudentRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasStudentRepositoryError, expectUnknownError }) => {
        const lessonStepRepository = createSuccessMockLessonStepRepository()

        if (hasStudentRepositoryError) {
          lessonStepRepository.findByLessonId = jest.fn(async (_lessonId: string): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetLessonStepsByLessonIdUseCase(lessonStepRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, 'testLessonId')

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
              id: 'testLessonStep1',
              lessonId: 'testLessonId',
              orderIndex: 0,
              createdAt: new Date(nowStr),
              externalLessonPlayerStepId: 'stepId1',
            },
            {
              id: 'testLessonStep2',
              lessonId: 'testLessonId',
              orderIndex: 1,
              createdAt: new Date(nowStr),
              externalLessonPlayerStepId: 'stepId2',
            },
          ])
          expect(lessonStepRepository.findByLessonId.mock.calls.length).toEqual(1)
          expect(lessonStepRepository.findByLessonId.mock.calls[0][0]).toEqual('testLessonId')
        }
      },
    )
  })

  const createSuccessMockLessonStepRepository = () => {
    const repo: LessonStepRepository = {
      findByLessonId: async (_lessonId: string): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testLessonStep1',
              lessonId: 'testLessonId',
              orderIndex: 0,
              createdAt: new Date(nowStr),
              externalLessonPlayerStepId: 'stepId1',
            },
            {
              id: 'testLessonStep2',
              lessonId: 'testLessonId',
              orderIndex: 1,
              createdAt: new Date(nowStr),
              externalLessonPlayerStepId: 'stepId2',
            },
          ],
        }
      },
    }

    return {
      findByLessonId: jest.fn((lessonId: string) => repo.findByLessonId(lessonId)),
    }
  }
})
