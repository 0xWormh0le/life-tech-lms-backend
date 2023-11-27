import GetOrganizationsByDistrictIdUseCase, { OrganizationRepository } from './GetOrganizationsByDistrictIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Organization } from '../../../entities/codex-v2/Organization'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetOrganizationByDistrictIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const organizationRepository = createSuccessMockOrganizationRepository()
      const useCase = new GetOrganizationsByDistrictIdUseCase(organizationRepository)
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
      const organizationRepository = createSuccessMockOrganizationRepository()

      if (hasRepositoryError) {
        organizationRepository.findByDistrictId = jest.fn(async (_districtId: string): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetOrganizationsByDistrictIdUseCase(organizationRepository)
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
            id: 'testOrganizationId1',
            name: 'testName1',
            districtId: 'testDistrictId1',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
          {
            id: 'testOrganizationId2',
            name: 'testName2',
            districtId: 'testDistrictId2',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId2',
            classlinkTenantId: 'testClasslinkTenantId2',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        ])
        expect(organizationRepository.findByDistrictId.mock.calls.length).toEqual(1)
        expect(organizationRepository.findByDistrictId.mock.calls[0][0]).toEqual('districtId')
      }
    })
  })

  const createSuccessMockOrganizationRepository = () => {
    const repo: OrganizationRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testOrganizationId1',
              name: 'testName1',
              districtId: 'testDistrictId1',
              externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
              classlinkTenantId: 'testClasslinkTenantId1',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            },
            {
              id: 'testOrganizationId2',
              name: 'testName2',
              districtId: 'testDistrictId2',
              externalLmsOrganizationId: 'testExternalLmsOrganizationId2',
              classlinkTenantId: 'testClasslinkTenantId2',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
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
