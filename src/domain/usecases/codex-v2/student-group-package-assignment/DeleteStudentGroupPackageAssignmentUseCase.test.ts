import DeleteStudentGroupPackageAssignmentUseCase, { StudentGroupPackageAssignmentRepository } from './DeleteStudentGroupPackageAssignmentUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('DeleteStudentGroupPackageAssignmentUseCase', () => {
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
      const useCase = new DeleteStudentGroupPackageAssignmentUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'id')

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(studentGroupPackageAssignmentRepository.delete.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeUndefined()
        expect(studentGroupPackageAssignmentRepository.delete.mock.calls.length).toEqual(1)
      }
    })
  })

  describe('.run(authenticatedUser, id)', () => {
    test('success', async () => {
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()
      const useCase = new DeleteStudentGroupPackageAssignmentUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeUndefined()
      expect(studentGroupPackageAssignmentRepository.delete.mock.calls.length).toEqual(1)
      expect(studentGroupPackageAssignmentRepository.delete.mock.calls[0][0]).toEqual('id')
    })

    test('error on studentGroupPackageAssignmentRepository.findById', async () => {
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      studentGroupPackageAssignmentRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new DeleteStudentGroupPackageAssignmentUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(studentGroupPackageAssignmentRepository.delete.mock.calls.length).toEqual(0)
    })

    test('not found saved data on studentGroupPackageAssignmentRepository.findById', async () => {
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      studentGroupPackageAssignmentRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<StudentGroupPackageAssignment | null, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        },
      )

      const useCase = new DeleteStudentGroupPackageAssignmentUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'StudentGroupPackageAssignmentNotFound',
        message: 'studentGroupPackageAssignment not found. id: id',
      })
      expect(result.value).toBeNull()

      expect(studentGroupPackageAssignmentRepository.delete.mock.calls.length).toEqual(0)
    })

    test('error on studentGroupPackageAssignmentRepository.delete', async () => {
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      studentGroupPackageAssignmentRepository.delete = jest.fn(async (_id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      })

      const useCase = new DeleteStudentGroupPackageAssignmentUseCase(studentGroupPackageAssignmentRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(studentGroupPackageAssignmentRepository.delete.mock.calls.length).toEqual(1)
    })
  })

  const createSuccessMockStudentGroupPackageAssignmentRepository = () => {
    const repo: StudentGroupPackageAssignmentRepository = {
      findById: async (_id: string): Promise<Errorable<StudentGroupPackageAssignment | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testStudentGroupPackageAssignmentId1',
            curriculumBrandId: `testPackageCategoryId1`,
            curriculumPackageId: `curriculumPackageId1`,
            studentGroupId: `studentGroupId1`,
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
