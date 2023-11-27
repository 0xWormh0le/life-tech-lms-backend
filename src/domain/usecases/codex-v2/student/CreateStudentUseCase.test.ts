import CreateStudentUseCase, { DatetimeRepository, StudentRepository, UserRepository, HumanUserRepository } from './CreateStudentUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Student } from '../../../entities/codex-v2/Student'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('CreateStudentUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'student'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const studentRepository = createSuccessMockStudentRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const userRepository = createSuccessMockUserRepository()
        const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId',
          nickName: 'testNickName',

          externalLmsStudentId: 'testExternalLmsStudentId',
          isDeactivated: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(studentRepository.create.mock.calls.length).toEqual(0)
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
      const studentRepository = createSuccessMockStudentRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        nickName: 'testNickName',

        externalLmsStudentId: 'testExternalLmsStudentId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(studentRepository.create.mock.calls[0][0]).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testId',
        externalLmsStudentId: 'testExternalLmsStudentId',
        classlinkTenantId: null,
        nickName: 'testNickName',
        id: 'test-student-id',
        isDeactivated: false,

        role: 'student',
        userId: 'testUserId',
      })
    })

    test('error on user does not exist', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)

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
        nickName: 'testNickName',

        externalLmsStudentId: 'testExternalLmsStudentId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('UserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(studentRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on human user does not exist', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)

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
        nickName: 'testNickName',

        externalLmsStudentId: 'testExternalLmsStudentId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('HumanUserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(studentRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on studentRepository.issueId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentRepository = createSuccessMockStudentRepository()

      studentRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        nickName: 'testNickName',

        externalLmsStudentId: 'testExternalLmsStudentId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentRepository = createSuccessMockStudentRepository()

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
      const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        nickName: 'testNickName',

        externalLmsStudentId: 'testExternalLmsStudentId',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on studentRepository.create', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentRepository = createSuccessMockStudentRepository()

      studentRepository.create = jest.fn(async (_student: Student): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new CreateStudentUseCase(datetimeRepository, studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        nickName: 'testNickName',

        externalLmsStudentId: 'testExternalLmsStudentId',
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

  const createSuccessMockStudentRepository = () => {
    const repo: StudentRepository = {
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-student-id',
        }
      },
      create: async (_student) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((student: Student) => repo.create(student)),
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
