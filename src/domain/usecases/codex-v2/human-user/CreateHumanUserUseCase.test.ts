import CreateHumanUserUseCase, { DatetimeRepository, HumanUserRepository, UserRepository } from './CreateHumanUserUseCase'
import { E, Errorable } from '../../shared/Errors'
import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { User, UserRole } from '../../../entities/codex-v2/User'

describe('CreateHumanUserUseCase', () => {
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
        const userRepository = createSuccessMockUserRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId',
          email: null,
          loginId: 'testLoginId',
          plainPassword: 'testPassword',
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(humanUserRepository.create.mock.calls.length).toEqual(0)
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeDefined()
        }
      },
    )
  })

  describe('.run(authenticatedUser, input)', () => {
    describe(`email | loginId | plainPassword | explainErrorType`, () => {
      test.each`
        email      | loginId      | plainPassword      | explainErrorType
        ${'email'} | ${null}      | ${'plainPassword'} | ${null}
        ${null}    | ${'loginId'} | ${'plainPassword'} | ${null}
        ${null}    | ${null}      | ${null}            | ${null}
      `(`$email, $loginId, $plainPassword, $explainErrorType`, async ({ email, loginId, plainPassword, explainErrorType }) => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const userRepository = createSuccessMockUserRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)

        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId',
          email: email ? (email as string) : null,
          loginId: loginId ? (loginId as string) : null,
          plainPassword: plainPassword ? (plainPassword as string) : null,
        })

        if (!explainErrorType) {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toEqual({
            email: email ? (email as string) : null,
            loginId: loginId ? (loginId as string) : null,
            userId: 'testUserId',
            hashedPassword: plainPassword ? '******' : null,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          })

          if (!plainPassword) {
            expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(0)
          } else {
            expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(1)
            expect(humanUserRepository.hashPassword.mock.calls[0][0]).toEqual(plainPassword)
          }
          expect(humanUserRepository.create.mock.calls[0][0]).toEqual({
            email: email ? (email as string) : null,
            hashedPassword: plainPassword ? 'test-hashed-password' : null,
            loginId: loginId ? (loginId as string) : null,
            userId: 'testUserId',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          })
        } else {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({})
          expect(result.value).toBeNull()
          expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(0)
        }
      })
    })

    test('error on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(humanUserRepository.create.mock.calls.length).toEqual(0)
    })

    test('not found user on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'user not found. userId: testUserId',
        type: 'UserNotFound',
      })
      expect(result.value).toBeNull()
      expect(humanUserRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()

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

      const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(humanUserRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on humanUserRepository.hashPassword', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()

      humanUserRepository.hashPassword = jest.fn(async (_plainPassword: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(humanUserRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on humanUserRepository.create', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()

      humanUserRepository.create = jest.fn(async (_humanUser: HumanUser): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  describe('.checkDuplicateError', () => {
    test.each`
      storedLoginId | storedEmail | newLoginId             | newEmail             | expectDuplicatedError
      ${null}       | ${null}     | ${null}                | ${null}              | ${false}
      ${'loginid'}  | ${null}     | ${null}                | ${null}              | ${false}
      ${null}       | ${'email'}  | ${null}                | ${null}              | ${false}
      ${null}       | ${null}     | ${'loginid'}           | ${null}              | ${false}
      ${null}       | ${null}     | ${null}                | ${'email'}           | ${false}
      ${'loginid'}  | ${null}     | ${'loginid-different'} | ${null}              | ${false}
      ${null}       | ${'email'}  | ${null}                | ${'email-different'} | ${false}
      ${'loginid'}  | ${null}     | ${'loginid'}           | ${null}              | ${true}
      ${null}       | ${'email'}  | ${null}                | ${'email'}           | ${true}
    `(
      '$storedLoginId, $storedEmail, $newLoginId, $newEmail, $expectDuplicatedError',
      async ({
        storedLoginId,
        storedEmail,
        newLoginId,
        newEmail,
        expectDuplicatedError,
      }: {
        storedLoginId: string | null
        storedEmail: string | null
        newLoginId: string | null
        newEmail: string | null
        expectDuplicatedError: boolean
      }) => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const userRepository = createSuccessMockUserRepository()
        const useCase = new CreateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')

        humanUserRepository.credentialExist = jest.fn(async (_loginId: string | null, _email: string | null): Promise<boolean> => {
          if (newLoginId === null && newEmail === null) {
            return false
          }

          return storedLoginId === newLoginId && storedEmail === newEmail
        })

        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId',
          email: newEmail,
          loginId: newLoginId,
          plainPassword: 'password',
        })

        if (expectDuplicatedError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toMatchObject({ type: 'UnknownRuntimeError' })
          expect(result.error?.message).toMatch(/user duplicated/)
          expect(result.value).toBeNull()
        } else {
          expect(result.error).toBeNull()
          expect(result.hasError).toEqual(false)
          expect(result.value).toEqual({
            email: newEmail,
            loginId: newLoginId,
            userId: 'testUserId',
            hashedPassword: '******',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          })

          expect(humanUserRepository.create.mock.calls[0][0]).toEqual({
            email: newEmail,
            loginId: newLoginId,
            userId: 'testUserId',
            hashedPassword: 'test-hashed-password',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          })
        }
      },
    )
  })

  const createSuccessMockUserRepository = () => {
    const repo: UserRepository = {
      findById: async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testUserId1',
            role: 'teacher',
            isDemo: false,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }

  const createSuccessMockHumanUserRepository = () => {
    const repo: HumanUserRepository = {
      hashPassword: async (_plainPassword) => {
        return {
          hasError: false,
          error: null,
          value: 'test-hashed-password',
        }
      },
      create: async (_humanUser) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
      credentialExist: async (_loginId, _email) => {
        return false
      },
    }

    return {
      hashPassword: jest.fn((plainPassword: string) => repo.hashPassword(plainPassword)),
      create: jest.fn((humanUser: HumanUser) => repo.create(humanUser)),
      credentialExist: jest.fn((_loginId: string | null, _email: string | null) => repo.credentialExist(_loginId, _email)),
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
