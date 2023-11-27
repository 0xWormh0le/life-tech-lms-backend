import GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase, {
  CurriculumPackageLessonConfigurationRepository,
} from './GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CurriculumPackageLessonConfiguration } from '../../../entities/codex-v2/CurriculumPackageLessonConfiguration'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const curriculumPackageLessonConfigurationRepository = createSuccessMockCurriculumPackageLessonConfigurationRepository()
      const useCase = new GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase(curriculumPackageLessonConfigurationRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'testCurriculumPackageId')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasCurriculumPackageLessonConfigurationRepositoryError | expectUnknownError
      ${false}                                               | ${false}
      ${true}                                                | ${true}
    `(
      `hasCurriculumPackageLessonConfigurationRepositoryError: $hasCurriculumPackageLessonConfigurationRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasCurriculumPackageLessonConfigurationRepositoryError, expectUnknownError }) => {
        const curriculumPackageLessonConfigurationRepository = createSuccessMockCurriculumPackageLessonConfigurationRepository()

        if (hasCurriculumPackageLessonConfigurationRepositoryError) {
          curriculumPackageLessonConfigurationRepository.findByCurriculumPackageId = jest.fn(
            async (_curriculumPackageCircleDefinitionId: string): Promise<Errorable<CurriculumPackageLessonConfiguration[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase(curriculumPackageLessonConfigurationRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, 'testCurriculumPackageCircleDefinitionId')

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
              curriculumPackageId: 'testCurriculumPackageId1',
              lessonId: 'testCurriculumPackageLessonConfigurationLessonId1',
            },
            {
              curriculumPackageId: 'testCurriculumPackageId2',
              lessonId: 'testCurriculumPackageLessonConfigurationLessonId2',
            },
          ])

          expect(curriculumPackageLessonConfigurationRepository.findByCurriculumPackageId.mock.calls.length).toEqual(1)
          expect(curriculumPackageLessonConfigurationRepository.findByCurriculumPackageId.mock.calls[0][0]).toEqual('testCurriculumPackageCircleDefinitionId')
        }
      },
    )
  })

  const createSuccessMockCurriculumPackageLessonConfigurationRepository = () => {
    const repo: CurriculumPackageLessonConfigurationRepository = {
      findByCurriculumPackageId: async (
        _curriculumPackageCircleDefinitionId: string,
      ): Promise<Errorable<CurriculumPackageLessonConfiguration[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              curriculumPackageId: 'testCurriculumPackageId1',
              lessonId: 'testCurriculumPackageLessonConfigurationLessonId1',
            },
            {
              curriculumPackageId: 'testCurriculumPackageId2',
              lessonId: 'testCurriculumPackageLessonConfigurationLessonId2',
            },
          ],
        }
      },
    }

    return {
      findByCurriculumPackageId: jest.fn((curriculumPackageCircleDefinitionId: string) => repo.findByCurriculumPackageId(curriculumPackageCircleDefinitionId)),
    }
  }
})
