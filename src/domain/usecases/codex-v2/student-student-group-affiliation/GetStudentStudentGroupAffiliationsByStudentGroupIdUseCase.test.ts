import GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase, {
  StudentStudentGroupAffiliationRepository,
} from './GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetStudentStudentGroupAffiliationByStudentGroupIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const useCase = new GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase(studentStudentGroupAffiliationRepository)
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
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

      if (hasRepositoryError) {
        studentStudentGroupAffiliationRepository.findByStudentGroupId = jest.fn(
          async (_studentGroupId: string): Promise<Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase(studentStudentGroupAffiliationRepository)
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
            id: 'testStudentStudentGroupAffiliationId1',
            studentId: 'testStudentId1',
            studentGroupId: 'testStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testStudentStudentGroupAffiliationId2',
            studentId: 'testStudentId2',
            studentGroupId: 'testStudentGroupId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ])
        expect(studentStudentGroupAffiliationRepository.findByStudentGroupId.mock.calls.length).toEqual(1)
        expect(studentStudentGroupAffiliationRepository.findByStudentGroupId.mock.calls[0][0]).toEqual('studentGroupId')
      }
    })
  })

  const createSuccessMockStudentStudentGroupAffiliationRepository = () => {
    const repo: StudentStudentGroupAffiliationRepository = {
      findByStudentGroupId: async (_studentGroupId: string): Promise<Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentStudentGroupAffiliationId1',
              studentId: 'testStudentId1',
              studentGroupId: 'testStudentGroupId1',
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentStudentGroupAffiliationId2',
              studentId: 'testStudentId2',
              studentGroupId: 'testStudentGroupId2',
              createdUserId: 'testCreatedUserId2',
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
