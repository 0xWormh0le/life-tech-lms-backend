import CreateTeacherUseCase, { DatetimeRepository, TeacherRepository, UserRepository, HumanUserRepository } from './CreateTeacherUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Teacher } from '../../../entities/codex-v2/Teacher'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('CreateTeacherUseCase', () => {
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
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const teacherRepository = createSuccessMockTeacherRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const userRepository = createSuccessMockUserRepository()
        const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId',
          firstName: 'testFirstName',
          lastName: 'testLastName',
          externalLmsTeacherId: 'testExternalLmsTeacherId',
          isDeactivated: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(teacherRepository.create.mock.calls.length).toEqual(0)
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
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(teacherRepository.create.mock.calls[0][0]).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testId',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
        firstName: 'testFirstName',
        id: 'test-teacher-id',
        isDeactivated: false,
        lastName: 'testLastName',
        role: 'teacher',
        userId: 'testUserId',
      })
    })

    test('error on user does not exist', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)

      userRepository.findById = jest.fn(async (): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('UserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(teacherRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on human user does not exist', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)

      humanUserRepository.findByUserId = jest.fn(async (): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('HumanUserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(teacherRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on teacherRepository.issueId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(teacherRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      datetimeRepository.now = jest.fn(async (): Promise<Errorable<Date, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(teacherRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on teacherRepository.create', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherRepository.create = jest.fn(async (_teacher: Teacher): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new CreateTeacherUseCase(datetimeRepository, teacherRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        firstName: 'testFirstName',
        lastName: 'testLastName',
        externalLmsTeacherId: 'testExternalLmsTeacherId',
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
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-teacher-id',
        }
      },
      create: async (_teacher) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((teacher: Teacher) => repo.create(teacher)),
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

  const createSuccessMockDatetimeRepository = () => {
    const repo: DatetimeRepository = {
      now: async () => {
        return {
          hasError: false,
          error: null,
          value: new Date(nowStr),
        }
      },
    }

    return {
      now: jest.fn(() => repo.now()),
    }
  }
})
