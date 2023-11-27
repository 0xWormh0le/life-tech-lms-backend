import GetStudentGroupPackageAssignmentsUseCase, {
  UseCaseAdministratorRepository,
  UseCaseOrganizationRepository,
  UseCaseStudentGroupPackageAssignmentRepository,
  UseCaseStudentGroupRepository,
  UseCaseStudentRepository,
  UseCaseStudentStudentGroupAffiliationRepository,
  UseCaseTeacherOrganizationAffiliationRepository,
  UseCaseTeacherRepository,
} from './GetStudentGroupPackageAssignmentsUseCase'
import { E, Errorable, failureErrorable, successErrorable } from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import {
  createUtilitySuccessMockAdministratorRepository,
  createUtilitySuccessMockOrganizationRepository,
  createUtilitySuccessMockStudentGroupRepository,
  createUtilitySuccessMockStudentRepository,
  createUtilitySuccessMockStudentStudentGroupAffiliationRepository,
  createUtilitySuccessMockTeacherOrganizationAffiliationRepository,
  createUtilitySuccessMockTeacherRepository,
} from '../_shared/utility.test'
import * as utility from '../_shared/utility'
import { User } from '../../../entities/codex-v2/User'

describe('GetStudentGroupPackageAssignmentsUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    describe(`
      userRole              | belongsToDistrictIds | targetStudentGroupId | targetStudentGroupBelongsToDistrictId | expectAuthorizationError
    `, () => {
      test.each`
        userRole              | belongsToDistrictIds               | targetStudentGroupId | targetStudentGroupBelongsToDistrictId | expectAuthorizationError
        ${'student'}          | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'student'}          | ${['districtId0', 'districtId00']} | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'student'}          | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId1'}                      | ${true}
        ${'student'}          | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId0'}                      | ${false}
        ${'student'}          | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId1'}                      | ${true}
        ${'student'}          | ${[]}                              | ${'studentGroupId1'} | ${'districtId1'}                      | ${true}
        ${'student'}          | ${['districtId0']}                 | ${null}              | ${''}                                 | ${true}
        ${'teacher'}          | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'teacher'}          | ${['districtId0', 'districtId00']} | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'teacher'}          | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId1'}                      | ${true}
        ${'teacher'}          | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId0'}                      | ${false}
        ${'teacher'}          | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId1'}                      | ${true}
        ${'teacher'}          | ${[]}                              | ${'studentGroupId1'} | ${'districtId1'}                      | ${true}
        ${'teacher'}          | ${['districtId0']}                 | ${null}              | ${''}                                 | ${true}
        ${'administrator'}    | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'administrator'}    | ${['districtId0', 'districtId00']} | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'administrator'}    | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId1'}                      | ${true}
        ${'administrator'}    | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId0'}                      | ${false}
        ${'administrator'}    | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId1'}                      | ${true}
        ${'administrator'}    | ${[]}                              | ${'studentGroupId1'} | ${'districtId1'}                      | ${true}
        ${'administrator'}    | ${['districtId0']}                 | ${null}              | ${''}                                 | ${true}
        ${'internalOperator'} | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'internalOperator'} | ${['districtId0', 'districtId00']} | ${'studentGroupId0'} | ${'districtId0'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${'studentGroupId0'} | ${'districtId1'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId0'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${'studentGroupId1'} | ${'districtId1'}                      | ${false}
        ${'internalOperator'} | ${[]}                              | ${'studentGroupId1'} | ${'districtId1'}                      | ${false}
        ${'internalOperator'} | ${['districtId0']}                 | ${null}              | ${''}                                 | ${false}
      `(
        `
      $userRole              $belongsToDistrictIds $targetStudentGroupId $targetStudentGroupBelongsToDistrictId $expectAuthorizationError
        `,
        async ({
          userRole,
          belongsToDistrictIds,
          targetStudentGroupId,
          targetStudentGroupBelongsToDistrictId,
          expectAuthorizationError,
        }: {
          userRole: User['role']
          belongsToDistrictIds: string[]
          targetStudentGroupId: string | null
          targetStudentGroupBelongsToDistrictId: string | null
          expectAuthorizationError: boolean
        }) => {
          const { useCase } = createUseCaseAndMockRepositories()

          jest.spyOn(utility, 'findDistrictIdsByAuthenticatedUser').mockResolvedValue(successErrorable(belongsToDistrictIds))

          if (targetStudentGroupBelongsToDistrictId) {
            jest.spyOn(utility, 'findDistrictIdByStudentGroupId').mockResolvedValue(successErrorable(targetStudentGroupBelongsToDistrictId))
          }

          const authenticatedUser = createTestAuthenticatedUser(userRole)
          const result = await useCase.run(authenticatedUser, targetStudentGroupId)

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
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

      jest.spyOn(utility, 'findDistrictIdsByAuthenticatedUser').mockResolvedValue(successErrorable([]))
      jest.spyOn(utility, 'findDistrictIdByStudentGroupId').mockResolvedValue(successErrorable('districtId0'))

      if (hasRepositoryError) {
        studentGroupPackageAssignmentRepository.findAll = jest.fn(async (): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetStudentGroupPackageAssignmentsUseCase(
        studentGroupPackageAssignmentRepository,
        studentGroupRepository,
        organizationRepository,
        administratorRepository,
        teacherRepository,
        studentRepository,
        teacherOrganizationAffiliationRepository,
        studentStudentGroupAffiliationRepository,
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const studentGroupId = null
      const result = await useCase.run(authenticatedUser, studentGroupId)

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
            id: 'testStudentGroupPackageAssignmentId1',
            curriculumBrandId: `testPackageCategoryId1`,
            curriculumPackageId: `curriculumPackageId1`,
            studentGroupId: `studentGroupId0`,
            createdAt: new Date(nowStr),
          },
          {
            id: 'testStudentGroupPackageAssignmentId2',
            curriculumBrandId: `testPackageCategoryId2`,
            curriculumPackageId: `curriculumPackageId2`,
            studentGroupId: `studentGroupId2`,
            createdAt: new Date(nowStr),
          },
        ])
      }
    })

    test('error on findDistrictIdsByAuthenticatedUser', async () => {
      const { useCase } = createUseCaseAndMockRepositories()

      jest.spyOn(utility, 'findDistrictIdsByAuthenticatedUser').mockResolvedValue(failureErrorable('UnknownRuntimeError', `some error message`))

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const studentGroupId = 'studentGroupId1'
      const res = await useCase.run(authenticatedUser, studentGroupId)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'some error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })

    test('error on findDistrictIdByStudentGroupId', async () => {
      const { useCase } = createUseCaseAndMockRepositories()

      jest.spyOn(utility, 'findDistrictIdsByAuthenticatedUser').mockResolvedValue(successErrorable([]))
      jest.spyOn(utility, 'findDistrictIdByStudentGroupId').mockResolvedValue(failureErrorable('UnknownRuntimeError', 'some error message'))

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const studentGroupId = 'studentGroupId1'
      const res = await useCase.run(authenticatedUser, studentGroupId)

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        message: 'some error message',
        type: 'UnknownRuntimeError',
      })
      expect(res.value).toBeNull()
    })
  })

  const createSuccessMockStudentGroupPackageAssignmentRepository = () => {
    const repo: UseCaseStudentGroupPackageAssignmentRepository = {
      findAll: async (): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId0`,
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentGroupPackageAssignmentId2',
              curriculumBrandId: `testPackageCategoryId2`,
              curriculumPackageId: `curriculumPackageId2`,
              studentGroupId: `studentGroupId2`,
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
      findByStudentGroupId: async (_studentGroupId: string): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId0`,
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentGroupPackageAssignmentId2',
              curriculumBrandId: `testPackageCategoryId2`,
              curriculumPackageId: `curriculumPackageId2`,
              studentGroupId: `studentGroupId2`,
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findAll: jest.fn(() => repo.findAll()),
      findByStudentGroupId: jest.fn((studentGroupId: string) => repo.findByStudentGroupId(studentGroupId)),
    }
  }
  const createSuccessMockStudentGroupRepository = () => {
    const repo: UseCaseStudentGroupRepository = createUtilitySuccessMockStudentGroupRepository()

    return repo
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
    const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()
    const studentGroupRepository = createSuccessMockStudentGroupRepository()
    const organizationRepository = createSuccessMockOrganizationRepository()
    const administratorRepository = createSuccessMockAdministratorRepository()
    const teacherRepository = createSuccessMockTeacherRepository()
    const studentRepository = createSuccessMockStudentRepository()
    const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
    const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

    const useCase = new GetStudentGroupPackageAssignmentsUseCase(
      studentGroupPackageAssignmentRepository,
      studentGroupRepository,
      organizationRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      teacherOrganizationAffiliationRepository,
      studentStudentGroupAffiliationRepository,
    )

    return {
      studentGroupPackageAssignmentRepository,
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
