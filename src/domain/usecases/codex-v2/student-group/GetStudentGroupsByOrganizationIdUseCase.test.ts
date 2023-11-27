import GetStudentGroupsByOrganizationIdUseCase, {
  UseCaseAdministratorRepository,
  UseCaseOrganizationRepository,
  UseCaseStudentGroupRepository,
  UseCaseStudentRepository,
  UseCaseTeacherRepository,
} from './GetStudentGroupsByOrganizationIdUseCase'
import { E, Errorable, successErrorable } from '../../shared/Errors'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import * as utility from '../_shared/utility'
import {
  createUtilitySuccessMockAdministratorRepository,
  createUtilitySuccessMockOrganizationRepository,
  createUtilitySuccessMockStudentGroupRepository,
  createUtilitySuccessMockStudentRepository,
  createUtilitySuccessMockStudentStudentGroupAffiliationRepository,
  createUtilitySuccessMockTeacherOrganizationAffiliationRepository,
  createUtilitySuccessMockTeacherRepository,
} from '../_shared/utility.test'
import {
  UseCaseStudentStudentGroupAffiliationRepository,
  UseCaseTeacherOrganizationAffiliationRepository,
} from '../student-group-package-assignment/GetStudentGroupPackageAssignmentsUseCase'
import { User } from '../../../entities/codex-v2/User'
import { Organization } from '../../../entities/codex-v2/Organization'

describe('GetStudentGroupByOrganizationIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    describe(`
            userRole              | belongsToDistrictIds               | targetOrganizationBelongsToDistrictId | expectAuthorizationError
    `, () => {
      test.each`
        userRole              | belongsToDistrictIds               | targetOrganizationBelongsToDistrictId | expectAuthorizationError
        ${'student'}          | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'student'}          | ${['districtId0', 'districtId00']} | ${'districtId0'}                      | ${false}
        ${'student'}          | ${['districtId0']}                 | ${'districtId1'}                      | ${true}
        ${'student'}          | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'student'}          | ${['districtId0']}                 | ${'districtId1'}                      | ${true}
        ${'student'}          | ${[]}                              | ${'districtId1'}                      | ${true}
        ${'student'}          | ${['districtId0']}                 | ${''}                                 | ${true}
        ${'teacher'}          | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'teacher'}          | ${['districtId0', 'districtId00']} | ${'districtId0'}                      | ${false}
        ${'teacher'}          | ${['districtId0']}                 | ${'districtId1'}                      | ${true}
        ${'teacher'}          | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'teacher'}          | ${['districtId0']}                 | ${'districtId1'}                      | ${true}
        ${'teacher'}          | ${[]}                              | ${'districtId1'}                      | ${true}
        ${'teacher'}          | ${['districtId0']}                 | ${''}                                 | ${true}
        ${'administrator'}    | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'administrator'}    | ${['districtId0', 'districtId00']} | ${'districtId0'}                      | ${false}
        ${'administrator'}    | ${['districtId0']}                 | ${'districtId1'}                      | ${true}
        ${'administrator'}    | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'administrator'}    | ${['districtId0']}                 | ${'districtId1'}                      | ${true}
        ${'administrator'}    | ${[]}                              | ${'districtId1'}                      | ${true}
        ${'administrator'}    | ${['districtId0']}                 | ${''}                                 | ${true}
        ${'internalOperator'} | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'internalOperator'} | ${['districtId0', 'districtId00']} | ${'districtId0'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${'districtId1'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${'districtId0'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${'districtId1'}                      | ${false}
        ${'internalOperator'} | ${[]}                              | ${'districtId1'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${''}                                 | ${false}
      `(
        `            $userRole              $belongsToDistrictIds               $targetOrganizationBelongsToDistrictId $expectAuthorizationError
    `,
        async ({
          userRole,
          belongsToDistrictIds,
          targetOrganizationBelongsToDistrictId,
          expectAuthorizationError,
        }: {
          userRole: User['role']
          belongsToDistrictIds: string[]
          targetOrganizationBelongsToDistrictId: string
          expectAuthorizationError: boolean
        }) => {
          const { useCase, organizationRepository } = createUseCaseAndMockRepositories()

          organizationRepository.findById = jest.fn(async (_organizationIds: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
            return {
              hasError: false,
              error: null,
              value: {
                id: 'testOrganizationId1',
                name: 'testOrganization1',
                districtId: targetOrganizationBelongsToDistrictId,
                externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
                classlinkTenantId: 'testClasslinkTenantId1',
                createdAt: new Date(nowStr),
                updatedAt: new Date(nowStr),
              },
            }
          })

          jest.spyOn(utility, 'findDistrictIdsByAuthenticatedUser').mockResolvedValue(successErrorable(belongsToDistrictIds))

          const authenticatedUser = createTestAuthenticatedUser(userRole)
          const result = await useCase.run(authenticatedUser, 'organizationId')

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
        },
      )
    })
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const { useCase, studentGroupRepository } = createUseCaseAndMockRepositories()

      if (hasRepositoryError) {
        studentGroupRepository.findByOrganizationId = jest.fn(async (_organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
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

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'organizationId')

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
          {
            id: 'testStudentGroupId2',
            name: 'testName2',
            grade: 'testGrade2',
            externalLmsStudentGroupId: 'testExternalLmsStudentGroupId2',
            createdUserId: 'testCreatedUserId2',
            updatedUserId: 'testUpdatedUserId2',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            organizationId: 'testOrganizationId2',
            classlinkTenantId: 'testClasslinkTenantId2',
          },
        ])
        expect(studentGroupRepository.findByOrganizationId.mock.calls.length).toEqual(1)
        expect(studentGroupRepository.findByOrganizationId.mock.calls[0][0]).toEqual('organizationId')
      }
    })
  })

  const createSuccessMockStudentGroupRepository = () => {
    const repo: UseCaseStudentGroupRepository = {
      ...createUtilitySuccessMockStudentGroupRepository(),
      findByOrganizationId: async (_organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
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
            {
              id: 'testStudentGroupId2',
              name: 'testName2',
              grade: 'testGrade2',
              externalLmsStudentGroupId: 'testExternalLmsStudentGroupId2',
              createdUserId: 'testCreatedUserId2',
              updatedUserId: 'testUpdatedUserId2',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
              organizationId: 'testOrganizationId2',
              classlinkTenantId: 'testClasslinkTenantId2',
            },
          ],
        }
      },
    }

    return {
      ...repo,
      findByOrganizationId: jest.fn((organizationId: string) => repo.findByOrganizationId(organizationId)),
    }
  }
  const createSuccessMockOrganizationRepository = () => {
    const repo: UseCaseOrganizationRepository = createUtilitySuccessMockOrganizationRepository()

    return repo
  }
  const createSuccessMockAdministratorRepository = () => {
    const repo: UseCaseAdministratorRepository = createUtilitySuccessMockAdministratorRepository()

    return repo
  }
  const createSuccessMockTeacherRepository = () => {
    const repo: UseCaseTeacherRepository = createUtilitySuccessMockTeacherRepository()

    return repo
  }
  const createSuccessMockStudentRepository = () => {
    const repo: UseCaseStudentRepository = createUtilitySuccessMockStudentRepository()

    return repo
  }
  const createSuccessMockTeacherOrganizationAffiliationRepository = () => {
    const repo: UseCaseTeacherOrganizationAffiliationRepository = createUtilitySuccessMockTeacherOrganizationAffiliationRepository()

    return repo
  }
  const createSuccessMockStudentStudentGroupAffiliationRepository = () => {
    const repo: UseCaseStudentStudentGroupAffiliationRepository = createUtilitySuccessMockStudentStudentGroupAffiliationRepository()

    return repo
  }
  const createUseCaseAndMockRepositories = () => {
    const studentGroupRepository = createSuccessMockStudentGroupRepository()
    const organizationRepository = createSuccessMockOrganizationRepository()
    const administratorRepository = createSuccessMockAdministratorRepository()
    const teacherRepository = createSuccessMockTeacherRepository()
    const studentRepository = createSuccessMockStudentRepository()
    const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
    const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

    const useCase = new GetStudentGroupsByOrganizationIdUseCase(
      studentGroupRepository,
      organizationRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      teacherOrganizationAffiliationRepository,
      studentStudentGroupAffiliationRepository,
    )

    return {
      studentGroupRepository,
      organizationRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      teacherOrganizationAffiliationRepository,
      studentStudentGroupAffiliationRepository,
      useCase,
    }
  }
})
