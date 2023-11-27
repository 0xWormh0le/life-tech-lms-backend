import UpdateTeacherUseCase, { TeacherRepository, UserRepository, HumanUserRepository } from './UpdateTeacherUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Teacher } from '../../../entities/codex-v2/Teacher'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('UpdateTeacherUseCase', () => {
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
        const teacherRepository = createSuccessMockTeacherRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const userRepository = createSuccessMockUserRepository()
        const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'testTeacherId1',
          userId: 'testUserId1-updated',
          firstName: 'testFirstName1-updated',
          lastName: 'testLastName1-updated',
          externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
          isDeactivated: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(teacherRepository.update.mock.calls.length).toEqual(0)
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
      const teacherRepository = createSuccessMockTeacherRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testTeacherId1',
        userId: 'testUserId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(teacherRepository.update.mock.calls[0][0]).toEqual({
        createdUserId: 'testCreatedUserId1',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        firstName: 'testFirstName1-updated',
        id: 'testTeacherId1',
        isDeactivated: false,
        lastName: 'testLastName1-updated',
        role: 'teacher',
        userId: 'testUserId1-updated',
        createdAt: new Date(nowStr),
      })
    })

    test('error on user does not exist', async () => {
      const teacherRepository = createSuccessMockTeacherRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')

      userRepository.findById = jest.fn(async (): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const result = await useCase.run(authenticatedUser, {
        id: 'testTeacherId1',
        userId: 'testUserId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('UserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(teacherRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on human user does not exist', async () => {
      const teacherRepository = createSuccessMockTeacherRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')

      humanUserRepository.findByUserId = jest.fn(async (): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const result = await useCase.run(authenticatedUser, {
        id: 'testTeacherId1',
        userId: 'testUserId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('HumanUserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(teacherRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on teacherRepository.findById', async () => {
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testTeacherId1',
        userId: 'testUserId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(teacherRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on teacherRepository.findById', async () => {
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testTeacherId1',
        userId: 'testUserId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'teacher not found. teacherId: testTeacherId1',
        type: 'TeacherNotFound',
      })
      expect(result.value).toBeNull()
      expect(teacherRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on teacherRepository.update', async () => {
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherRepository.update = jest.fn(async (_teacher: Teacher): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateTeacherUseCase(teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testTeacherId1',
        userId: 'testUserId1-updated',
        firstName: 'testFirstName1-updated',
        lastName: 'testLastName1-updated',
        externalLmsTeacherId: 'testExternalLmsTeacherId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockTeacherRepository = () => {
    const repo: TeacherRepository = {
      findById: async (_id: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
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
        }
      },
      update: async (_teacher) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      update: jest.fn((teacher: Teacher) => repo.update(teacher)),
    }
  }

  const createSuccessMockUserRepository = () => {
    const repo: UserRepository = {
      findById: async () => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn(() => repo.findById('dummy-user-id')),
    }
  }

  const createSuccessMockHumanUserRepository = () => {
    const repo: HumanUserRepository = {
      findByUserId: async () => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByUserId: jest.fn(() => repo.findByUserId('dummy-user-id')),
    }
  }
})
