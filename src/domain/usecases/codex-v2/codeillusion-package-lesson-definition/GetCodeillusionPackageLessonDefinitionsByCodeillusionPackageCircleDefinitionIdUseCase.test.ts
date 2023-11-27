import GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase, {
  CodeillusionPackageLessonDefinitionRepository,
} from './GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CodeillusionPackageLessonDefinition } from '../../../entities/codex-v2/CodeillusionPackageLessonDefinition'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const codeillusionPackageLessonDefinitionRepository = createSuccessMockCodeillusionPackageLessonDefinitionRepository()
      const useCase = new GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase(codeillusionPackageLessonDefinitionRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'testCodeillusionPackageCircleDefinitionId')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasCodeillusionPackageLessonDefinitionRepositoryError | expectUnknownError
      ${false}                                              | ${false}
      ${true}                                               | ${true}
    `(
      `hasCodeillusionPackageLessonDefinitionRepositoryError: $hasCodeillusionPackageLessonDefinitionRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasCodeillusionPackageLessonDefinitionRepositoryError, expectUnknownError }) => {
        const codeillusionPackageLessonDefinitionRepository = createSuccessMockCodeillusionPackageLessonDefinitionRepository()

        if (hasCodeillusionPackageLessonDefinitionRepositoryError) {
          codeillusionPackageLessonDefinitionRepository.findByCodeillusionPackageCircleDefinitionId = jest.fn(
            async (_codeillusionPackageCircleDefinitionId: string): Promise<Errorable<CodeillusionPackageLessonDefinition[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase(codeillusionPackageLessonDefinitionRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, 'testCodeillusionPackageCircleDefinitionId')

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
              codeillusionPackageCircleDefinitionId: 'testCodeillusionPackageCircleDefinitionId',
              lessonId: 'testCodeillusionPackageLessonDefinitionLessonId1',
              uiType: 'gem',
            },
            {
              codeillusionPackageCircleDefinitionId: 'testCodeillusionPackageCircleDefinitionId',
              lessonId: 'testCodeillusionPackageLessonDefinitionLessonId2',
              uiType: 'book',
            },
          ])
          expect(codeillusionPackageLessonDefinitionRepository.findByCodeillusionPackageCircleDefinitionId.mock.calls.length).toEqual(1)
          expect(codeillusionPackageLessonDefinitionRepository.findByCodeillusionPackageCircleDefinitionId.mock.calls[0][0]).toEqual(
            'testCodeillusionPackageCircleDefinitionId',
          )
        }
      },
    )
  })

  const createSuccessMockCodeillusionPackageLessonDefinitionRepository = () => {
    const repo: CodeillusionPackageLessonDefinitionRepository = {
      findByCodeillusionPackageCircleDefinitionId: async (
        _codeillusionPackageCircleDefinitionId: string,
      ): Promise<Errorable<CodeillusionPackageLessonDefinition[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              lessonId: 'testCodeillusionPackageLessonDefinitionLessonId1',
              codeillusionPackageCircleDefinitionId: 'testCodeillusionPackageCircleDefinitionId',
              uiType: 'gem',
            },
            {
              lessonId: 'testCodeillusionPackageLessonDefinitionLessonId2',
              codeillusionPackageCircleDefinitionId: 'testCodeillusionPackageCircleDefinitionId',
              uiType: 'book',
            },
          ],
        }
      },
    }

    return {
      findByCodeillusionPackageCircleDefinitionId: jest.fn((codeillusionPackageCircleDefinitionId: string) =>
        repo.findByCodeillusionPackageCircleDefinitionId(codeillusionPackageCircleDefinitionId),
      ),
    }
  }
})
