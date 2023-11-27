import GetClasslinkTenantCredentialByDistrictIdUseCase, { ClasslinkTenantCredentialRepository } from './GetClasslinkTenantCredentialByDistrictIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { ClasslinkTenantCredential } from '../../../entities/codex-v2/ClasslinkTenantCredential'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetClasslinkTenantCredentialUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const useCase = new GetClasslinkTenantCredentialByDistrictIdUseCase(classlinkTenantCredentialRepository)
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
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()

      if (hasRepositoryError) {
        classlinkTenantCredentialRepository.findByDistrictId = jest.fn(
          async (_districtId: string): Promise<Errorable<ClasslinkTenantCredential, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetClasslinkTenantCredentialByDistrictIdUseCase(classlinkTenantCredentialRepository)
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
        expect(result.value).toEqual({
          districtId: 'testClasslinkTenantCredentialId1',
          externalLmsAppId: 'testExternalLmsAppId1',
          accessToken: 'testAccessToken1',
          externalLmsTenantId: 'testExternalLmsTenantId1',
        })
        expect(classlinkTenantCredentialRepository.findByDistrictId.mock.calls.length).toEqual(1)
        expect(classlinkTenantCredentialRepository.findByDistrictId.mock.calls[0][0]).toEqual('districtId')
      }
    })
  })

  const createSuccessMockClasslinkTenantCredentialRepository = () => {
    const repo: ClasslinkTenantCredentialRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<ClasslinkTenantCredential, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            districtId: 'testClasslinkTenantCredentialId1',
            externalLmsAppId: 'testExternalLmsAppId1',
            accessToken: 'testAccessToken1',
            externalLmsTenantId: 'testExternalLmsTenantId1',
          },
        }
      },
    }

    return {
      findByDistrictId: jest.fn((districtId: string) => repo.findByDistrictId(districtId)),
    }
  }
})
