import GetStudentsByStudentGroupIdUseCase, { StudentRepository, StudentStudentGroupAffiliationRepository } from './GetStudentsByStudentGroupIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Student } from '../../../entities/codex-v2/Student'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'

describe('GetStudentByStudentGroupIdUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const studentRepository = createSuccessMockStudentRepository()
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const useCase = new GetStudentsByStudentGroupIdUseCase(studentRepository, studentStudentGroupAffiliationRepository)
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
      hasStudentRepositoryError | hasStudentStudentGroupAffiliationRepositoryError | expectUnknownError
      ${false}                  | ${false}                                         | ${false}
      ${true}                   | ${false}                                         | ${true}
      ${false}                  | ${true}                                          | ${true}
      ${true}                   | ${true}                                          | ${true}
    `(
      `hasStudentRepositoryError: $hasStudentRepositoryError, hasStudentStudentGroupAffiliationRepositoryError: $hasStudentStudentGroupAffiliationRepositoryError, expectUnknownError: $expectUnknownError`,
      async ({ hasStudentRepositoryError, hasStudentStudentGroupAffiliationRepositoryError, expectUnknownError }) => {
        const studentRepository = createSuccessMockStudentRepository()
        const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

        if (hasStudentRepositoryError) {
          studentRepository.findByIds = jest.fn(async (_ids: string[]): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
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

        if (hasStudentStudentGroupAffiliationRepositoryError) {
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

        const useCase = new GetStudentsByStudentGroupIdUseCase(studentRepository, studentStudentGroupAffiliationRepository)
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
              createdUserId: 'testCreatedUserId1',
              externalLmsStudentId: 'externalLmsStudentId1',
              classlinkTenantId: 'classlinkTenantId1',
              id: 'testStudentId1',
              isDeactivated: false,
              nickName: 'testNickname1',
              role: 'student',
              userId: 'testUserId1',
              createdAt: new Date(nowStr),
            },
            {
              createdUserId: 'testCreatedUserId2',
              externalLmsStudentId: 'externalLmsStudentId2',
              classlinkTenantId: 'classlinkTenantId2',
              id: 'testStudentId2',
              isDeactivated: false,
              nickName: 'testNickname2',
              role: 'student',
              userId: 'testUserId2',
              createdAt: new Date(nowStr),
            },
          ])
          expect(studentRepository.findByIds.mock.calls.length).toEqual(1)
          expect(studentRepository.findByIds.mock.calls[0][0]).toEqual(['testStudentId1', 'testStudentId2'])
        }
      },
    )
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
              studentGroupId: 'testStudentGroupId1',
              studentId: 'testStudentId1',
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentStudentGroupAffiliationId2',
              studentGroupId: 'testStudentGroupId2',
              studentId: 'testStudentId2',
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

  const createSuccessMockStudentRepository = () => {
    const repo: StudentRepository = {
      findByIds: async (_ids: string[]): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentId1',
              userId: 'testUserId1',
              role: 'student',
              nickName: 'testNickname1',
              externalLmsStudentId: 'externalLmsStudentId1',
              classlinkTenantId: 'classlinkTenantId1',
              isDeactivated: false,
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentId2',
              userId: 'testUserId2',
              role: 'student',
              nickName: 'testNickname2',
              externalLmsStudentId: 'externalLmsStudentId2',
              classlinkTenantId: 'classlinkTenantId2',
              isDeactivated: false,
              createdUserId: 'testCreatedUserId2',
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findByIds: jest.fn((ids: string[]) => repo.findByIds(ids)),
    }
  }
})
