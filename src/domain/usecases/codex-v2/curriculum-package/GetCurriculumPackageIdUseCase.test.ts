import GetCurriculumPackageIdUseCase, { CurriculumPackageRepository } from './GetCurriculumPackageIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CurriculumPackage } from '../../../entities/codex-v2/CurriculumPackage'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCurriculumPackageIdUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const useCase = new GetCurriculumPackageIdUseCase(curriculumPackageRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'codeillusion')

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
        const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()

        if (hasCsePackageLessonDefinitionRepositoryError) {
          curriculumPackageRepository.findAllByPackageCategoryId = jest.fn(
            async (_curriculumBrandId: string): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCurriculumPackageIdUseCase(curriculumPackageRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, 'codeillusion')

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
              id: 'codeillusion-package-basic-full-premium-heroic',
              curriculumBrandId: 'codeillusion',
              name: 'Full Book - Premium (Hero)',
              level: 'basic',
            },
            {
              id: 'codeillusion-package-basic-full-premium-adventurous',
              curriculumBrandId: 'codeillusion',
              name: 'Full Book - Premium (Adventurous)',
              level: 'basic',
            },
          ])

          expect(curriculumPackageRepository.findAllByPackageCategoryId.mock.calls.length).toEqual(1)
          expect(curriculumPackageRepository.findAllByPackageCategoryId.mock.calls[0][0]).toEqual('codeillusion')
        }
      },
    )
  })

  const createSuccessMockCurriculumPackageRepository = () => {
    const repo: CurriculumPackageRepository = {
      findAllByPackageCategoryId: async (_curriculumBrandId: string): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'codeillusion-package-basic-full-premium-heroic',
              curriculumBrandId: 'codeillusion',
              name: 'Full Book - Premium (Hero)',
              level: 'basic',
            },
            {
              id: 'codeillusion-package-basic-full-premium-adventurous',
              curriculumBrandId: 'codeillusion',
              name: 'Full Book - Premium (Adventurous)',
              level: 'basic',
            },
          ],
        }
      },
    }

    return {
      findAllByPackageCategoryId: jest.fn((curriculumBrandId: string) => repo.findAllByPackageCategoryId(curriculumBrandId)),
    }
  }
})
