import GetStudentGroupsUseCase, { StudentGroupRepository } from './GetStudentGroupsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetStudentsGroupUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const useCase = new GetStudentGroupsUseCase(studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser)

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
      const studentGroupRepository = createSuccessMockStudentGroupRepository()

      if (hasRepositoryError) {
        studentGroupRepository.findAll = jest.fn(async (): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetStudentGroupsUseCase(studentGroupRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser)

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
      }
    })
  })

  const createSuccessMockStudentGroupRepository = () => {
    const repo: StudentGroupRepository = {
      findAll: async (): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
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
      findAll: jest.fn(() => repo.findAll()),
    }
  }
})
