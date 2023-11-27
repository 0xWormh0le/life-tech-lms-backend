import GetCsePackageUnitDefinitionsUseCase, { CsePackageUnitDefinitionRepository } from './GetCsePackageUnitDefinitionsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { CsePackageUnitDefinition } from '../../../entities/codex-v2/CsePackageUnitDefinition'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetCsePackageUnitDefinitionsUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole
      ${'student'}
      ${'teacher'}
      ${'administrator'}
      ${'internalOperator'}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole }) => {
      const csePackageUnitDefinitionRepository = createSuccessMockCsePackageUnitDefinitionRepository()
      const useCase = new GetCsePackageUnitDefinitionsUseCase(csePackageUnitDefinitionRepository)
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
        const csePackageUnitDefinitionRepository = createSuccessMockCsePackageUnitDefinitionRepository()

        if (hasStudentRepositoryError) {
          csePackageUnitDefinitionRepository.findAll = jest.fn(async (): Promise<Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>> => {
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

        const useCase = new GetCsePackageUnitDefinitionsUseCase(csePackageUnitDefinitionRepository)
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
              name: 'name1',
              description: `description1`,
            },
            {
              id: 'id2',
              name: 'name2',
              description: `description2`,
            },
          ])

          expect(csePackageUnitDefinitionRepository.findAll.mock.calls.length).toEqual(1)
          expect(csePackageUnitDefinitionRepository.findAll.mock.calls[0]).toEqual([])
        }
      },
    )
  })

  const createSuccessMockCsePackageUnitDefinitionRepository = () => {
    const repo: CsePackageUnitDefinitionRepository = {
      findAll: async (): Promise<Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: `id1`,
              name: `name1`,
              description: `description1`,
            },
            {
              id: `id2`,
              name: `name2`,
              description: `description2`,
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
