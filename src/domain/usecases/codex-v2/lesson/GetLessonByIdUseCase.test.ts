import GetLessonByIdUseCase, { LessonRepository } from './GetLessonByIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Lesson } from '../../../entities/codex-v2/Lesson'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetLessonByIdUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${false}
      ${'teacher'}          | ${false}
      ${'administrator'}    | ${false}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const lessonRepository = createSuccessMockLessonRepository()
        const useCase = new GetLessonByIdUseCase(lessonRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, 'lessonId')

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
      const lessonRepository = createSuccessMockLessonRepository()

      if (hasRepositoryError) {
        lessonRepository.findById = jest.fn(async (_lessonId: Lesson['id']): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetLessonByIdUseCase(lessonRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'lessonId')

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
        expect(result.value).toEqual<typeof result.value>({
          course: 'basic',
          description: 'testDescription1',
          hintCount: 20,
          id: 'testLessonId1',
          theme: 'theme',
          skillsLearnedInThisLesson: 'skillsLearnedInThisLesson',
          lessonOverViewPdfUrl: 'lessonOverViewPdfUrl',
          lessonDuration: 'testLessonDuration1',
          lessonEnvironment: 'litLessonPlayer',
          level: 'advanced',
          maxStarCount: 5,
          name: 'testLesson1',
          projectName: 'testLessonProjectName1',
          quizCount: 10,
          scenarioName: 'testScenarioName1',
          thumbnailImageUrl: 'testThumbnailImageUrl1',
          url: 'testUrl1',
        })
      }
    })

    test('returns null value from lessonRepository.findById', async () => {
      const lessonRepository = createSuccessMockLessonRepository()

      lessonRepository.findById = jest.fn(async (_lessonId: Lesson['id']): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new GetLessonByIdUseCase(lessonRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'lessonId')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'lesson not found. lessonId: lessonId',
        type: 'LessonNotFound',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockLessonRepository = () => {
    const repo: LessonRepository = {
      findById: async (_lessonId: Lesson['id']): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testLessonId1',
            url: 'testUrl1',
            name: 'testLesson1',
            course: 'basic',
            theme: 'theme',
            skillsLearnedInThisLesson: 'skillsLearnedInThisLesson',
            lessonOverViewPdfUrl: 'lessonOverViewPdfUrl',
            lessonEnvironment: 'litLessonPlayer',
            description: 'testDescription1',
            lessonDuration: 'testLessonDuration1',
            thumbnailImageUrl: 'testThumbnailImageUrl1',
            projectName: 'testLessonProjectName1',
            scenarioName: 'testScenarioName1',
            maxStarCount: 5,
            quizCount: 10,
            hintCount: 20,
            level: 'advanced',
          },
        }
      },
    }

    return {
      findById: jest.fn((lessonId: Lesson['id']) => repo.findById(lessonId)),
    }
  }
})
