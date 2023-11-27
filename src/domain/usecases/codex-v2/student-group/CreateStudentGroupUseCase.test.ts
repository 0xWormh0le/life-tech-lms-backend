import CreateStudentGroupUseCase, { DatetimeRepository, OrganizationRepository, StudentGroupRepository } from './CreateStudentGroupUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'
import { Organization } from '../../../entities/codex-v2/Organization'

describe('CreateStudentGroupUseCase', () => {
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
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          name: 'testStudentGroup1',
          grade: 'testGrade1',
          organizationId: 'testOrganizationId1',
          externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
          classlinkTenantId: 'testClasslinkTenantId1',
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(studentGroupRepository.create.mock.calls.length).toEqual(0)
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
      const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'testStudentGroup1',
        grade: 'testGrade1',
        organizationId: 'testOrganizationId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        classlinkTenantId: 'testClasslinkTenantId1',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(studentGroupRepository.create.mock.calls[0][0]).toEqual({
        classlinkTenantId: 'testClasslinkTenantId1',
        createdUserId: 'testId',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        grade: 'testGrade1',
        id: 'test-studentGroup-id',
        name: 'testStudentGroup1',
        organizationId: 'testOrganizationId1',
        updatedUserId: 'testId',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      })
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

      const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'testStudentGroup1',
        grade: 'testGrade1',
        organizationId: 'testOrganizationId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        classlinkTenantId: 'testClasslinkTenantId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.create.mock.calls.length).toEqual(0)
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

      const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'testStudentGroup1',
        grade: 'testGrade1',
        organizationId: 'testOrganizationId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        classlinkTenantId: 'testClasslinkTenantId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'organization not found. organizationId: testOrganizationId1',
        type: 'OrganizationNotFound',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on studentGroupRepository.issueId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      studentGroupRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'testStudentGroup1',
        grade: 'testGrade1',
        organizationId: 'testOrganizationId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        classlinkTenantId: 'testClasslinkTenantId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.create.mock.calls.length).toEqual(0)
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

      const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'testStudentGroup1',
        grade: 'testGrade1',
        organizationId: 'testOrganizationId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        classlinkTenantId: 'testClasslinkTenantId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentGroupRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on studentGroupRepository.create', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      studentGroupRepository.create = jest.fn(async (_studentGroup: StudentGroup): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupUseCase(datetimeRepository, organizationRepository, studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'testStudentGroup1',
        grade: 'testGrade1',
        organizationId: 'testOrganizationId1',
        externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
        classlinkTenantId: 'testClasslinkTenantId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

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
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-studentGroup-id',
        }
      },
      create: async (_studentGroup) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((studentGroup: StudentGroup) => repo.create(studentGroup)),
    }
  }
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
})
