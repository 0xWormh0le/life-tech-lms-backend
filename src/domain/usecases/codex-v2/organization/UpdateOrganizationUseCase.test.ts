import UpdateOrganizationUseCase, { DatetimeRepository, DistrictRepository, OrganizationRepository } from './UpdateOrganizationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Organization } from '../../../entities/codex-v2/Organization'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'
import { District } from '../../../entities/codex-v2/District'

describe('UpdateOrganizationUseCase', () => {
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
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'testOrganizationId1',
          name: 'testOrganization1-updated',
          districtId: 'testDistrictId1-updated',
          externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
          classlinkTenantId: 'testClasslinkTenantId1-updated',
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(organizationRepository.update.mock.calls.length).toEqual(0)
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
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(organizationRepository.update.mock.calls[0][0]).toEqual({
        classlinkTenantId: 'testClasslinkTenantId1-updated',
        createdAt: new Date(nowStr),
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        updatedAt: new Date(nowStr),
      })
    })

    test('error on organizationRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      const organizationRepository = createSuccessMockOrganizationRepository()

      organizationRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(organizationRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on organizationRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      const organizationRepository = createSuccessMockOrganizationRepository()

      organizationRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'organization not found. organizationId: testOrganizationId1',
        type: 'OrganizationNotFound',
      })
      expect(result.value).toBeNull()
      expect(organizationRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      const organizationRepository = createSuccessMockOrganizationRepository()

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

      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(organizationRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found district on districtRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      const organizationRepository = createSuccessMockOrganizationRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district not found. districtId: testDistrictId1-updated',
        type: 'DistrictNotFound',
      })
      expect(result.value).toBeNull()
      expect(organizationRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      const organizationRepository = createSuccessMockOrganizationRepository()

      datetimeRepository.now = jest.fn(async (): Promise<Errorable<Date, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(organizationRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on organizationRepository.update', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      const organizationRepository = createSuccessMockOrganizationRepository()

      organizationRepository.update = jest.fn(async (_organization: Organization): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateOrganizationUseCase(datetimeRepository, districtRepository, organizationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testOrganizationId1',
        name: 'testOrganization1-updated',
        districtId: 'testDistrictId1-updated',
        externalLmsOrganizationId: 'testExternalLmsOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockDatetimeRepository = () => {
    const repo: DatetimeRepository = {
      now: async () => {
        return {
          hasError: false,
          error: null,
          value: new Date(nowStr),
        }
      },
    }

    return {
      now: jest.fn(() => repo.now()),
    }
  }
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

  const createSuccessMockOrganizationRepository = () => {
    const repo: OrganizationRepository = {
      findById: async (_id: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testOrganizationId1',
            name: 'testOrganization1',
            districtId: 'testDistrictId1',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },

      update: async (_organization) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      update: jest.fn((organization: Organization) => repo.update(organization)),
    }
  }
})
