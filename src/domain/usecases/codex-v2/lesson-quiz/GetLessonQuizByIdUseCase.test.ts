import GetLessonQuizByIdUseCase, { LessonQuizRepository } from './GetLessonQuizByIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { LessonQuiz } from '../../../entities/codex-v2/LessonQuiz'
import { createTestAuthenticatedUser, nowStr } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetLessonQuizByIdUseCase', () => {
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
        const lessonQuizRepository = createSuccessMockLessonQuizRepository()
        const useCase = new GetLessonQuizByIdUseCase(lessonQuizRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, 'test-id')

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
      const lessonQuizRepository = createSuccessMockLessonQuizRepository()

      if (hasRepositoryError) {
        lessonQuizRepository.findById = jest.fn(async (_id: string): Promise<Errorable<LessonQuiz, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetLessonQuizByIdUseCase(lessonQuizRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'test-id')

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
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
          description: 'testDescription1',
          id: 'testLessonQuizId1',
          label: 'testLabel1',
          lessonStepId: 'testLessonStepId1',
        })
      }
    })
  })

  const createSuccessMockLessonQuizRepository = () => {
    const repo: LessonQuizRepository = {
      findById: async (_id: string): Promise<Errorable<LessonQuiz, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testLessonQuizId1',
            lessonStepId: 'testLessonStepId1',
            label: 'testLabel1',
            description: 'testDescription1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }
})
