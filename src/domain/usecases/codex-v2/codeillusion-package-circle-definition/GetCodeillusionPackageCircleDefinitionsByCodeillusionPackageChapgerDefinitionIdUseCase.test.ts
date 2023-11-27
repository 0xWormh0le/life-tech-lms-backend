import GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase, {
  CodeillusionPackageCircleDefinitionRepository,
} from './GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CodeillusionPackageCircleDefinition } from '../../../entities/codex-v2/CodeillusionPackageCircleDefinition'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const codeillusionPackageCircleDefinitionRepository = createSuccessMockCodeillusionPackageCircleDefinitionRepository()
      const useCase = new GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase(codeillusionPackageCircleDefinitionRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'codeillusionPackageChapterDefinitionId')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasCodeillusionPackageCircleDefinitionRepositoryError | expectUnknownError
      ${false}                                              | ${false}
      ${true}                                               | ${true}
    `(
      `hasCodeillusionPackageCircleDefinitionRepositoryError: $hasCodeillusionPackageCircleDefinitionRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasCodeillusionPackageCircleDefinitionRepositoryError, expectUnknownError }) => {
        const codeillusionPackageCircleDefinitionRepository = createSuccessMockCodeillusionPackageCircleDefinitionRepository()

        if (hasCodeillusionPackageCircleDefinitionRepositoryError) {
          codeillusionPackageCircleDefinitionRepository.findByCodeillusionPackageChapterDefinitionId = jest.fn(
            async (_codeillusionPackageChapterDefinitionId: string): Promise<Errorable<CodeillusionPackageCircleDefinition[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase(
          codeillusionPackageCircleDefinitionRepository,
        )
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, 'testCodeillusionPackageChapterDefinitionId')

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
              bookImageUrl: 'bookImageUrl1',
              bookName: 'bookName1',
              characterImageUrl: 'characterImageUrl1',
              clearedCharacterImageUrl: 'clearedCharacterImageUrl1',
              codeillusionPackageChapterDefinitionId: 'testCodeillusionPackageChapterDefinitionId',
              course: 'basic',
              id: 'id1',
            },
            {
              bookImageUrl: 'bookImageUrl2',
              bookName: 'bookName2',
              characterImageUrl: 'characterImageUrl2',
              clearedCharacterImageUrl: 'clearedCharacterImageUrl2',
              codeillusionPackageChapterDefinitionId: 'testCodeillusionPackageChapterDefinitionId',
              course: 'webDesign',
              id: 'id2',
            },
          ])

          expect(codeillusionPackageCircleDefinitionRepository.findByCodeillusionPackageChapterDefinitionId.mock.calls.length).toEqual(1)
          expect(codeillusionPackageCircleDefinitionRepository.findByCodeillusionPackageChapterDefinitionId.mock.calls[0][0]).toEqual(
            'testCodeillusionPackageChapterDefinitionId',
          )
        }
      },
    )
  })

  const createSuccessMockCodeillusionPackageCircleDefinitionRepository = () => {
    const repo: CodeillusionPackageCircleDefinitionRepository = {
      findByCodeillusionPackageChapterDefinitionId: async (
        _codeillusionPackageChapterDefinitionId: string,
      ): Promise<Errorable<CodeillusionPackageCircleDefinition[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: `id1`,
              codeillusionPackageChapterDefinitionId: 'testCodeillusionPackageChapterDefinitionId',
              course: 'basic',
              bookName: 'bookName1',
              characterImageUrl: 'characterImageUrl1',
              clearedCharacterImageUrl: 'clearedCharacterImageUrl1',
              bookImageUrl: 'bookImageUrl1',
            },
            {
              id: `id2`,
              codeillusionPackageChapterDefinitionId: 'testCodeillusionPackageChapterDefinitionId',
              course: 'webDesign',
              bookName: 'bookName2',
              characterImageUrl: 'characterImageUrl2',
              clearedCharacterImageUrl: 'clearedCharacterImageUrl2',
              bookImageUrl: 'bookImageUrl2',
            },
          ],
        }
      },
    }

    return {
      findByCodeillusionPackageChapterDefinitionId: jest.fn((codeillusionPackageChapterDefinitionId: string) =>
        repo.findByCodeillusionPackageChapterDefinitionId(codeillusionPackageChapterDefinitionId),
      ),
    }
  }
})
