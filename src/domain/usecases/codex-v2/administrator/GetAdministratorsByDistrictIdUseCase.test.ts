import GetAdministratorsByDistrictIdUseCase, { AdministratorRepository } from './GetAdministratorsByDistrictIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Administrator } from '../../../entities/codex-v2/Administrator'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetAdministratorByDistrictIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const useCase = new GetAdministratorsByDistrictIdUseCase(administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'districtId')

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
    })
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const administratorRepository = createSuccessMockAdministratorRepository()

      if (hasRepositoryError) {
        administratorRepository.findByDistrictId = jest.fn(async (_districtId: string): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetAdministratorsByDistrictIdUseCase(administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'districtId')

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
            id: 'testAdministratorId1',
            userId: 'testUserId1',
            role: 'administrator',
            districtId: 'testDistrictId1',
            firstName: 'testFirstName1',
            lastName: 'testLastName1',
            externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
            isDeactivated: false,
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testAdministratorId2',
            userId: 'testUserId2',
            role: 'administrator',
            districtId: 'testDistrictId2',
            firstName: 'testFirstName2',
            lastName: 'testLastName2',
            externalLmsAdministratorId: 'testExternalLmsAdministratorId2',
            isDeactivated: false,
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ])
        expect(administratorRepository.findByDistrictId.mock.calls.length).toEqual(1)
        expect(administratorRepository.findByDistrictId.mock.calls[0][0]).toEqual('districtId')
      }
    })
  })

  const createSuccessMockAdministratorRepository = () => {
    const repo: AdministratorRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testAdministratorId1',
              userId: 'testUserId1',
              role: 'administrator',
              districtId: 'testDistrictId1',
              firstName: 'testFirstName1',
              lastName: 'testLastName1',
              externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
              isDeactivated: false,
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testAdministratorId2',
              userId: 'testUserId2',
              role: 'administrator',
              districtId: 'testDistrictId2',
              firstName: 'testFirstName2',
              lastName: 'testLastName2',
              externalLmsAdministratorId: 'testExternalLmsAdministratorId2',
              isDeactivated: false,
              createdUserId: 'testCreatedUserId2',
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findByDistrictId: jest.fn((districtId: string) => repo.findByDistrictId(districtId)),
    }
  }
})
