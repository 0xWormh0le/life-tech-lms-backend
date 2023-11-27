import GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase, {
  CsePackageLessonDefinitionRepository,
} from './GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CsePackageLessonDefinition } from '../../../entities/codex-v2/CsePackageLessonDefinition'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const csePackageLessonDefinitionRepository = createSuccessMockCsePackageLessonDefinitionRepository()
      const useCase = new GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase(csePackageLessonDefinitionRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'testCsePackageUnitDefinitionId')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasCsePackageLessonDefinitionRepositoryError | expectUnknownError
      ${false}                                     | ${false}
      ${true}                                      | ${true}
    `(
      `hasCsePackageLessonDefinitionRepositoryError: $hasCsePackageLessonDefinitionRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasCsePackageLessonDefinitionRepositoryError, expectUnknownError }) => {
        const csePackageLessonDefinitionRepository = createSuccessMockCsePackageLessonDefinitionRepository()

        if (hasCsePackageLessonDefinitionRepositoryError) {
          csePackageLessonDefinitionRepository.findByCsePackageUnitDefinitionId = jest.fn(
            async (_csePackageUnitDefinitionId: string): Promise<Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase(csePackageLessonDefinitionRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, 'testCsePackageUnitDefinitionId')

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
              csePackageUnitDefinitionId: 'testCsePackageUnitDefinitionId1',
              isQuizLesson: false,
              lessonId: 'testCsePackageLessonDefinitionLessonId1',
            },
            {
              csePackageUnitDefinitionId: 'testCsePackageUnitDefinitionId2',
              isQuizLesson: true,
              lessonId: 'testCsePackageLessonDefinitionLessonId2',
            },
          ])

          expect(csePackageLessonDefinitionRepository.findByCsePackageUnitDefinitionId.mock.calls.length).toEqual(1)
          expect(csePackageLessonDefinitionRepository.findByCsePackageUnitDefinitionId.mock.calls[0][0]).toEqual('testCsePackageUnitDefinitionId')
        }
      },
    )
  })

  const createSuccessMockCsePackageLessonDefinitionRepository = () => {
    const repo: CsePackageLessonDefinitionRepository = {
      findByCsePackageUnitDefinitionId: async (
        _csePackageUnitDefinitionId: string,
      ): Promise<Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              lessonId: 'testCsePackageLessonDefinitionLessonId1',
              csePackageUnitDefinitionId: 'testCsePackageUnitDefinitionId1',
              isQuizLesson: false,
            },
            {
              lessonId: 'testCsePackageLessonDefinitionLessonId2',
              csePackageUnitDefinitionId: 'testCsePackageUnitDefinitionId2',
              isQuizLesson: true,
            },
          ],
        }
      },
    }

    return {
      findByCsePackageUnitDefinitionId: jest.fn((csePackageUnitDefinitionId: string) => repo.findByCsePackageUnitDefinitionId(csePackageUnitDefinitionId)),
    }
  }
})
