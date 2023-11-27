import GetLessonsUseCase, { LessonRepository } from './GetLessonsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Lesson } from '../../../entities/codex-v2/Lesson'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetLessonsUseCase', () => {
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
        const lessonRepository = createSuccessMockLessonRepository()
        const useCase = new GetLessonsUseCase(lessonRepository)
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
      const lessonRepository = createSuccessMockLessonRepository()

      if (hasRepositoryError) {
        lessonRepository.findAll = jest.fn(async (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetLessonsUseCase(lessonRepository)
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
        expect(result.value).toEqual<typeof result.value>([
          {
            course: 'basic',
            description: 'testDescription1',
            hintCount: 20,
            id: 'testLessonId1',
            theme: 'theme1',
            skillsLearnedInThisLesson: 'skillsLearnedInThisLesson1',
            lessonOverViewPdfUrl: 'lessonOverViewPdfUrl1',
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
          },
          {
            course: 'basic',
            description: 'testDescription2',
            hintCount: 21,
            id: 'testLessonId2',
            theme: 'theme2',
            skillsLearnedInThisLesson: 'skillsLearnedInThisLesson2',
            lessonOverViewPdfUrl: 'lessonOverViewPdfUrl2',
            lessonDuration: 'testLessonDuration2',
            lessonEnvironment: 'litLessonPlayer',
            level: 'advanced',
            maxStarCount: 6,
            name: 'testLesson2',
            projectName: 'testLessonProjectName2',
            quizCount: 11,
            scenarioName: 'testScenarioName2',
            thumbnailImageUrl: 'testThumbnailImageUrl2',
            url: 'testUrl2',
          },
        ])
      }
    })
  })

  const createSuccessMockLessonRepository = () => {
    const repo: LessonRepository = {
      findAll: async (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testLessonId1',
              url: 'testUrl1',
              name: 'testLesson1',
              course: 'basic',
              theme: 'theme1',
              skillsLearnedInThisLesson: 'skillsLearnedInThisLesson1',
              lessonOverViewPdfUrl: 'lessonOverViewPdfUrl1',
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
            {
              id: 'testLessonId2',
              url: 'testUrl2',
              name: 'testLesson2',
              course: 'basic',
              theme: 'theme2',
              skillsLearnedInThisLesson: 'skillsLearnedInThisLesson2',
              lessonOverViewPdfUrl: 'lessonOverViewPdfUrl2',
              lessonEnvironment: 'litLessonPlayer',
              description: 'testDescription2',
              lessonDuration: 'testLessonDuration2',
              thumbnailImageUrl: 'testThumbnailImageUrl2',
              projectName: 'testLessonProjectName2',
              scenarioName: 'testScenarioName2',
              maxStarCount: 6,
              quizCount: 11,
              hintCount: 21,
              level: 'advanced',
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
