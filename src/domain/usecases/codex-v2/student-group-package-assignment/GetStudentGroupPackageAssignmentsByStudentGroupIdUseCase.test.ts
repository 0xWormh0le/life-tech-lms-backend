import GetStudentGroupPackageAssignmentByStudentGroupPackageAssignmentIdUseCase, {
  StudentGroupPackageAssignmentRepository,
} from './GetStudentGroupPackageAssignmentsByStudentGroupIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetStudentGroupPackageAssignmentByStudentGroupIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()
      const useCase = new GetStudentGroupPackageAssignmentByStudentGroupPackageAssignmentIdUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'studentGroupId')

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
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      if (hasRepositoryError) {
        studentGroupPackageAssignmentRepository.findByStudentGroupId = jest.fn(
          async (_studentGroupId: string): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetStudentGroupPackageAssignmentByStudentGroupPackageAssignmentIdUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'studentGroupId')

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
            curriculumBrandId: 'curriculumBrandId1',
            curriculumPackageId: 'curriculumPackageId1',
            studentGroupId: 'studentGroupId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testStudentGroupPackageAssignmentId2',
            curriculumBrandId: 'curriculumBrandId2',
            curriculumPackageId: 'curriculumPackageId2',
            studentGroupId: 'studentGroupId2',
            createdAt: new Date(nowStr),
          },
        ])
        expect(studentGroupPackageAssignmentRepository.findByStudentGroupId.mock.calls.length).toEqual(1)
        expect(studentGroupPackageAssignmentRepository.findByStudentGroupId.mock.calls[0][0]).toEqual('studentGroupId')
      }
    })
  })

  const createSuccessMockStudentGroupPackageAssignmentRepository = () => {
    const repo: StudentGroupPackageAssignmentRepository = {
      findByStudentGroupId: async (_studentGroupId: string): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: 'curriculumBrandId1',
              curriculumPackageId: 'curriculumPackageId1',
              studentGroupId: 'studentGroupId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentGroupPackageAssignmentId2',
              curriculumBrandId: 'curriculumBrandId2',
              curriculumPackageId: 'curriculumPackageId2',
              studentGroupId: 'studentGroupId2',
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findByStudentGroupId: jest.fn((studentGroupId: string) => repo.findByStudentGroupId(studentGroupId)),
    }
  }
})
