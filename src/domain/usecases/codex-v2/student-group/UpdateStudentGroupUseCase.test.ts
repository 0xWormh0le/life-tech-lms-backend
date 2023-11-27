import UpdateStudentGroupUseCase, { DatetimeRepository, OrganizationRepository, StudentGroupRepository } from './UpdateStudentGroupUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'
import { Organization } from '../../../entities/codex-v2/Organization'

describe('UpdateStudentGroupUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-02T00:00:00Z'

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
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'testStudentGroupId1',
          name: 'testName1-updated',
          grade: 'testGrade1-updated',
          externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
          organizationId: 'testOrganizationId1-updated',
          classlinkTenantId: 'testClasslinkTenantId1-updated',
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(studentGroupRepository.update.mock.calls.length).toEqual(0)
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
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(studentGroupRepository.update.mock.calls[0][0]).toEqual({
        classlinkTenantId: 'testClasslinkTenantId1-updated',
        createdAt: new Date(nowStr),
        createdUserId: 'testCreatedUserId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        grade: 'testGrade1-updated',
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        organizationId: 'testOrganizationId1-updated',
        updatedAt: new Date(futureStr),
        updatedUserId: 'testId',
      })
    })

    test('error on studentGroupRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()

      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      studentGroupRepository.findById = jest.fn(async (_id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on studentGroupRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()

      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      studentGroupRepository.findById = jest.fn(async (_id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'studentGroup not found. studentGroupId: testStudentGroupId1',
        type: 'StudentGroupNotFound',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on organizationRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()

      const studentGroupRepository = createSuccessMockStudentGroupRepository()

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

      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found organization on organizationRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()

      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      organizationRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'organization not found. organizationId: testOrganizationId1-updated',
        type: 'OrganizationNotFound',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()

      const studentGroupRepository = createSuccessMockStudentGroupRepository()

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

      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
        classlinkTenantId: 'testClasslinkTenantId1-updated',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on studentGroupRepository.update', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()

      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      studentGroupRepository.update = jest.fn(async (_studentGroup: StudentGroup): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentGroupId1',
        name: 'testName1-updated',
        grade: 'testGrade1-updated',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1-updated',
        organizationId: 'testOrganizationId1-updated',
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
          value: new Date(futureStr),
        }
      },
    }

    return {
      now: jest.fn(() => repo.now()),
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
            name: 'testName1',
            districtId: 'testDistrictId1',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }

  const createSuccessMockStudentGroupRepository = () => {
    const repo: StudentGroupRepository = {
      findById: async (_id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testStudentGroupId1',
            name: 'testName1',
            grade: 'testGrade1',
            externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            updatedUserId: 'testUpdatedUserId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            organizationId: 'testOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
          },
        }
      },

      update: async (_studentGroup) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      update: jest.fn((studentGroup: StudentGroup) => repo.update(studentGroup)),
    }
  }
})
