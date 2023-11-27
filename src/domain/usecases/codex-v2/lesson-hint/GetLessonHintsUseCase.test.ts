import GetLessonHintsUseCase, { LessonHintRepository } from './GetLessonHintsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { LessonHint } from '../../../entities/codex-v2/LessonHint'
import { createTestAuthenticatedUser, nowStr } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetLessonHintsUseCase', () => {
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
        const lessonHintRepository = createSuccessMockLessonHintRepository()
        const useCase = new GetLessonHintsUseCase(lessonHintRepository)
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
      const lessonHintRepository = createSuccessMockLessonHintRepository()

      if (hasRepositoryError) {
        lessonHintRepository.findAll = jest.fn(async (): Promise<Errorable<LessonHint[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetLessonHintsUseCase(lessonHintRepository)
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
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            description: 'testDescription1',
            id: 'testLessonHintId1',
            label: 'testLabel1',
            lessonStepId: 'testLessonStepId1',
          },
          {
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            description: 'testDescription2',
            id: 'testLessonHintId2',
            label: 'testLabel2',
            lessonStepId: 'testLessonStepId2',
          },
        ])
      }
    })
  })

  const createSuccessMockLessonHintRepository = () => {
    const repo: LessonHintRepository = {
      findAll: async (): Promise<Errorable<LessonHint[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testLessonHintId1',
              lessonStepId: 'testLessonStepId1',
              label: 'testLabel1',
              description: 'testDescription1',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            },
            {
              id: 'testLessonHintId2',
              lessonStepId: 'testLessonStepId2',
              label: 'testLabel2',
              description: 'testDescription2',
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
