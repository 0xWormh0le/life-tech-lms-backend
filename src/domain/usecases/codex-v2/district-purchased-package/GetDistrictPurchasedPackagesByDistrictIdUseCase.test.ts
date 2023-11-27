import GetDistrictPurchasedPackagesByDistrictIdUseCase, { DistrictPurchasedPackageRepository } from './GetDistrictPurchasedPackagesByDistrictIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetDistrictPurchasedPackageUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const useCase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository)
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
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()

      if (hasRepositoryError) {
        districtPurchasedPackageRepository.findByDistrictId = jest.fn(
          async (_districtId: string): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository)
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
            id: 'testDistrictPurchasedPackageId1',
            curriculumPackageId: 'testPackageId1',
            districtId: 'testDistrictId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testDistrictPurchasedPackageId2',
            curriculumPackageId: 'testPackageId2',
            districtId: 'testDistrictId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ])
        expect(districtPurchasedPackageRepository.findByDistrictId.mock.calls.length).toEqual(1)
        expect(districtPurchasedPackageRepository.findByDistrictId.mock.calls[0][0]).toEqual('districtId')
      }
    })
  })

  const createSuccessMockDistrictPurchasedPackageRepository = () => {
    const repo: DistrictPurchasedPackageRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testDistrictPurchasedPackageId1',
              curriculumPackageId: 'testPackageId1',
              districtId: 'testDistrictId1',
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testDistrictPurchasedPackageId2',
              curriculumPackageId: 'testPackageId2',
              districtId: 'testDistrictId2',
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
