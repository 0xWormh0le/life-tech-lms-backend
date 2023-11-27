import GetTeachersUseCase, { TeacherRepository } from './GetTeachersUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Teacher } from '../../../entities/codex-v2/Teacher'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('GetTeacherUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new GetTeachersUseCase(teacherRepository)
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
      const teacherRepository = createSuccessMockTeacherRepository()

      if (hasRepositoryError) {
        teacherRepository.findAll = jest.fn(async (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetTeachersUseCase(teacherRepository)
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
            id: 'testTeacherId1',
            userId: 'testUserId1',
            role: 'teacher',
            firstName: 'testFirstName1',
            lastName: 'testLastName1',
            externalLmsTeacherId: 'testExternalLmsTeacherId1',
            isDeactivated: true,
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testTeacherId2',
            userId: 'testUserId2',
            role: 'teacher',
            firstName: 'testFirstName2',
            lastName: 'testLastName2',
            externalLmsTeacherId: 'testExternalLmsTeacherId2',
            isDeactivated: true,
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ])
      }
    })
  })

  const createSuccessMockTeacherRepository = () => {
    const repo: TeacherRepository = {
      findAll: async (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testTeacherId1',
              userId: 'testUserId1',
              role: 'teacher',
              firstName: 'testFirstName1',
              lastName: 'testLastName1',
              externalLmsTeacherId: 'testExternalLmsTeacherId1',
              isDeactivated: true,
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testTeacherId2',
              userId: 'testUserId2',
              role: 'teacher',
              firstName: 'testFirstName2',
              lastName: 'testLastName2',
              externalLmsTeacherId: 'testExternalLmsTeacherId2',
              isDeactivated: true,
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
