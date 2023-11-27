import DeleteDistrictPurchasedPackageUseCase, { DistrictPurchasedPackageRepository } from './DeleteDistrictPurchasedPackageUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('DeleteDistrictPurchasedPackageUseCase', () => {
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
      const useCase = new DeleteDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'id')

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(districtPurchasedPackageRepository.delete.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeUndefined()
        expect(districtPurchasedPackageRepository.delete.mock.calls.length).toEqual(1)
      }
    })
  })

  describe('.run(authenticatedUser, id)', () => {
    test('success', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const useCase = new DeleteDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeUndefined()
      expect(districtPurchasedPackageRepository.delete.mock.calls.length).toEqual(1)
      expect(districtPurchasedPackageRepository.delete.mock.calls[0][0]).toEqual('id')
    })

    test('error on districtPurchasedPackageRepository.findById', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()

      districtPurchasedPackageRepository.findById = jest.fn(async (_id: string): Promise<Errorable<DistrictPurchasedPackage, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      })

      const useCase = new DeleteDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(districtPurchasedPackageRepository.delete.mock.calls.length).toEqual(0)
    })

    test('not found saved data on districtPurchasedPackageRepository.findById', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()

      districtPurchasedPackageRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<DistrictPurchasedPackage | null, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        },
      )

      const useCase = new DeleteDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DistrictPurchasedPackageNotFound',
        message: 'districtPurchasedPackage not found. id: id',
      })
      expect(result.value).toBeNull()

      expect(districtPurchasedPackageRepository.delete.mock.calls.length).toEqual(0)
    })

    test('error on districtPurchasedPackageRepository.delete', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()

      districtPurchasedPackageRepository.delete = jest.fn(async (_id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      })

      const useCase = new DeleteDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(districtPurchasedPackageRepository.delete.mock.calls.length).toEqual(1)
    })
  })

  const createSuccessMockDistrictPurchasedPackageRepository = () => {
    const repo: DistrictPurchasedPackageRepository = {
      findById: async (_id: string): Promise<Errorable<DistrictPurchasedPackage | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testDistrictPurchasedPackageId1',
            curriculumPackageId: 'testPackageId1',
            districtId: 'testDistrictId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
        }
      },
      delete: async (_id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      delete: jest.fn((id: string) => repo.delete(id)),
    }
  }
})
