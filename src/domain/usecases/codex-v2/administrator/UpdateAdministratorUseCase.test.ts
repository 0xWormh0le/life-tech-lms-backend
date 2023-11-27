import UpdateAdministratorUseCase, { AdministratorRepository, DistrictRepository } from './UpdateAdministratorUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Administrator } from '../../../entities/codex-v2/Administrator'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'
import { District } from '../../../entities/codex-v2/District'

describe('UpdateAdministratorUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const administratorRepository = createSuccessMockAdministratorRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'testAdministratorId1',
          userId: 'testUserId1-updated',
          districtId: 'testDistrictId1-updated',
          firstName: 'testFirstName1-updated',
          lastName: 'testLastName1-updated',
          externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
          isDeactivated: true,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(administratorRepository.update.mock.calls.length).toEqual(0)
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeDefined()
        }
      },
    )
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testAdministratorId1',
        userId: 'testUserId1-updated',
        districtId: 'testDistrictId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        isDeactivated: true,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(administratorRepository.update.mock.calls[0][0]).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testCreatedUserId1',
        districtId: 'testDistrictId1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        firstName: 'testFirstName1-updated',
        id: 'testAdministratorId1',
        isDeactivated: true,
        lastName: 'testLastName1-updated',
        role: 'administrator',
        userId: 'testUserId1-updated',
      })
    })

    test('error on administratorRepository.findById', async () => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      administratorRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testAdministratorId1',
        userId: 'testUserId1-updated',
        districtId: 'testDistrictId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        isDeactivated: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on administratorRepository.findById', async () => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      administratorRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testAdministratorId1',
        userId: 'testUserId1-updated',
        districtId: 'testDistrictId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        isDeactivated: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'administrator not found. administratorId: testAdministratorId1',
        type: 'AdministratorNotFound',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.findById', async () => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testAdministratorId1',
        userId: 'testUserId1-updated',
        districtId: 'testDistrictId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        isDeactivated: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on districtRepository.findById', async () => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testAdministratorId1',
        userId: 'testUserId1-updated',
        districtId: 'testDistrictId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        isDeactivated: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district not found. districtId: testDistrictId1-updated',
        type: 'DistrictNotFound',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on administratorRepository.update', async () => {
      const administratorRepository = createSuccessMockAdministratorRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      administratorRepository.update = jest.fn(async (_administrator: Administrator): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateAdministratorUseCase(districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testAdministratorId1',
        userId: 'testUserId1-updated',
        districtId: 'testDistrictId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1-updated',
        isDeactivated: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockDistrictRepository = () => {
    const repo: DistrictRepository = {
      findById: async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testDistrictId1',
            name: 'testDistrict1',
            stateId: 'testStateId1',
            lmsId: 'testLmsId1',
            externalLmsDistrictId: 'testExternalLmsDistrictId1',
            enableRosterSync: true,
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId1',
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }
  const createSuccessMockAdministratorRepository = () => {
    const repo: AdministratorRepository = {
      findById: async (_id: string): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
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
        }
      },
      update: async (_administrator) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      update: jest.fn((administrator: Administrator) => repo.update(administrator)),
    }
  }
})
