import GetCodeillusionPackageChapterDefinitionsUseCase, {
  CodeillusionPackageChapterDefinitionRepository,
} from './GetCodeillusionPackageChapterDefinitionsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CodeillusionPackageChapterDefinition } from '../../../entities/codex-v2/CodeillusionPackageChapterDefinition'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCodeillusionPackageChapterDefinitionsUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const codeillusionPackageChapterDefinitionRepository = createSuccessMockCodeillusionPackageChapterDefinitionRepository()
      const useCase = new GetCodeillusionPackageChapterDefinitionsUseCase(codeillusionPackageChapterDefinitionRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser)

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
    })
  })

  describe('run', () => {
    test.each`
      hasStudentRepositoryError | expectUnknownError
      ${false}                  | ${false}
      ${true}                   | ${true}
    `(
      `hasStudentRepositoryError: $hasStudentRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasStudentRepositoryError, expectUnknownError }) => {
        const codeillusionPackageChapterDefinitionRepository = createSuccessMockCodeillusionPackageChapterDefinitionRepository()

        if (hasStudentRepositoryError) {
          codeillusionPackageChapterDefinitionRepository.findAll = jest.fn(
            async (): Promise<Errorable<CodeillusionPackageChapterDefinition[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCodeillusionPackageChapterDefinitionsUseCase(codeillusionPackageChapterDefinitionRepository)
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
              id: 'id1',
              lessonNoteSheetsZipUrl: 'lessonNoteSheetsZipUrl1',
              lessonOverViewPdfUrl: 'lessonOverViewPdfUrl1',
              name: 'name1',
              title: 'title1',
            },
            {
              id: 'id2',
              lessonNoteSheetsZipUrl: 'lessonNoteSheetsZipUrl2',
              lessonOverViewPdfUrl: 'lessonOverViewPdfUrl2',
              name: 'name2',
              title: 'title2',
            },
          ])

          expect(codeillusionPackageChapterDefinitionRepository.findAll.mock.calls.length).toEqual(1)
          expect(codeillusionPackageChapterDefinitionRepository.findAll.mock.calls[0]).toEqual([])
        }
      },
    )
  })

  const createSuccessMockCodeillusionPackageChapterDefinitionRepository = () => {
    const repo: CodeillusionPackageChapterDefinitionRepository = {
      findAll: async (): Promise<Errorable<CodeillusionPackageChapterDefinition[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: `id1`,
              name: `name1`,
              title: `title1`,
              lessonOverViewPdfUrl: `lessonOverViewPdfUrl1`,
              lessonNoteSheetsZipUrl: `lessonNoteSheetsZipUrl1`,
            },
            {
              id: `id2`,
              name: `name2`,
              title: `title2`,
              lessonOverViewPdfUrl: `lessonOverViewPdfUrl2`,
              lessonNoteSheetsZipUrl: `lessonNoteSheetsZipUrl2`,
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
