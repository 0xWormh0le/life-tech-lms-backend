import GetStudentsUseCase, { StudentRepository } from './GetStudentsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Student } from '../../../entities/codex-v2/Student'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetStudentUseCase', () => {
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
      const useCase = new GetStudentsUseCase(studentRepository)
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
      const studentRepository = createSuccessMockStudentRepository()

      if (hasRepositoryError) {
        studentRepository.findAll = jest.fn(async (): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetStudentsUseCase(studentRepository)
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
        ])
      }
    })
  })

  const createSuccessMockStudentRepository = () => {
    const repo: StudentRepository = {
      findAll: async (): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
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
      findAll: jest.fn(() => repo.findAll()),
    }
  }
})
