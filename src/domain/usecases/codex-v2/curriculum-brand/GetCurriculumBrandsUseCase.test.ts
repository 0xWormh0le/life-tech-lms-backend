import GetCurriculumBrandsPackageIdUseCase, { CurriculumBrandRepository } from './GetCurriculumBrandsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CurriculumBrand } from '../../../entities/codex-v2/CurriculumBrand'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCurriculumBrandsUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const curriculumBrandRepository = createSuccessMockCurriculumBrandRepository()
      const useCase = new GetCurriculumBrandsPackageIdUseCase(curriculumBrandRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser)

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasCurriculumBrandRepositoryError | expectUnknownError
      ${false}                          | ${false}
      ${true}                           | ${true}
    `(
      `hasCurriculumBrandRepositoryError: $hasCurriculumBrandRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasCurriculumBrandRepositoryError, expectUnknownError }) => {
        const curriculumBrandRepository = createSuccessMockCurriculumBrandRepository()

        if (hasCurriculumBrandRepositoryError) {
          curriculumBrandRepository.findAll = jest.fn(async (): Promise<Errorable<CurriculumBrand[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCurriculumBrandsPackageIdUseCase(curriculumBrandRepository)
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
              id: 'codeillusion',
              name: 'Codeillusion',
            },
            {
              id: 'cse',
              name: 'Computer Science Essentials',
            },
          ])

          expect(curriculumBrandRepository.findAll.mock.calls.length).toEqual(1)
          expect(curriculumBrandRepository.findAll.mock.calls[0]).toEqual([])
        }
      },
    )
  })

  const createSuccessMockCurriculumBrandRepository = () => {
    const repo: CurriculumBrandRepository = {
      findAll: async (): Promise<Errorable<CurriculumBrand[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'codeillusion',
              name: 'Codeillusion',
            },
            {
              id: 'cse',
              name: 'Computer Science Essentials',
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
