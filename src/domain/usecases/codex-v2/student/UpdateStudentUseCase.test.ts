import UpdateStudentUseCase, { StudentRepository, HumanUserRepository, UserRepository } from './UpdateStudentUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Student } from '../../../entities/codex-v2/Student'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('UpdateStudentUseCase', () => {
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
        const studentRepository = createSuccessMockStudentRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const userRepository = createSuccessMockUserRepository()
        const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'testStudentId1',
          userId: 'testUserId1-updated',
          nickName: 'testFirstName1-updated',
          externalLmsStudentId: 'testExternalLmsStudentId1-updated',
          isDeactivated: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(studentRepository.update.mock.calls.length).toEqual(0)
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
      const studentRepository = createSuccessMockStudentRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentId1',
        userId: 'testUserId1-updated',
        nickName: 'testFirstName1-updated',

        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(studentRepository.update.mock.calls[0][0]).toEqual({
        createdUserId: 'testCreatedUserId1',
        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
        classlinkTenantId: 'classlinkTenantId1',
        nickName: 'testFirstName1-updated',
        id: 'testStudentId1',
        isDeactivated: false,

        role: 'student',
        userId: 'testUserId1-updated',
        createdAt: new Date(nowStr),
      })
    })

    test('error on user does not exist', async () => {
      const studentRepository = createSuccessMockStudentRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')

      userRepository.findById = jest.fn(async (): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentId1',
        userId: 'testUserId1-updated',
        nickName: 'testFirstName1-updated',
        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('UserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(studentRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on human user does not exist', async () => {
      const studentRepository = createSuccessMockStudentRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')

      humanUserRepository.findByUserId = jest.fn(async (): Promise<Errorable<null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentId1',
        userId: 'testUserId1-updated',
        nickName: 'testFirstName1-updated',
        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error?.type).toEqual('HumanUserNotFoundError')
      expect(result.error?.message).toMatch(/User not found from input.userId:/)
      expect(result.value).toBeNull()
      expect(studentRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on studentRepository.findById', async () => {
      const studentRepository = createSuccessMockStudentRepository()

      studentRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentId1',
        userId: 'testUserId1-updated',
        nickName: 'testFirstName1-updated',

        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(studentRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on studentRepository.findById', async () => {
      const studentRepository = createSuccessMockStudentRepository()

      studentRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const humanUserRepository = createSuccessMockHumanUserRepository()
      const userRepository = createSuccessMockUserRepository()
      const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentId1',
        userId: 'testUserId1-updated',
        nickName: 'testFirstName1-updated',

        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'student not found. studentId: testStudentId1',
        type: 'StudentNotFound',
      })
      expect(result.value).toBeNull()
      expect(studentRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on studentRepository.update', async () => {
      const studentRepository = createSuccessMockStudentRepository()

      studentRepository.update = jest.fn(async (_student: Student): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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
      const useCase = new UpdateStudentUseCase(studentRepository, humanUserRepository, userRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testStudentId1',
        userId: 'testUserId1-updated',
        nickName: 'testFirstName1-updated',
        externalLmsStudentId: 'testExternalLmsStudentId1-updated',
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
      findById: async (_id: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
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
        }
      },
      update: async (_student) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      update: jest.fn((student: Student) => repo.update(student)),
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
