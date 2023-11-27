import UpdateHumanUserUseCase, { DatetimeRepository, UserRepository, HumanUserRepository } from './UpdateHumanUserUseCase'
import { E, Errorable } from '../../shared/Errors'
import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'
import { User } from '../../../entities/codex-v2/User'

describe('UpdateHumanUserUseCase', () => {
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
        const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId1',
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
          expect(humanUserRepository.update.mock.calls.length).toEqual(0)
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
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(humanUserRepository.update.mock.calls[0][0]).toEqual({
        email: null,
        hashedPassword: 'test-hashed-password',
        loginId: 'testLoginId',
        userId: 'testUserId1',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      })
    })

    describe(`email | loginId | plainPassword | explainErrorType`, () => {
      test.each`
        email      | loginId      | plainPassword      | explainErrorType
        ${'email'} | ${null}      | ${'plainPassword'} | ${null}
        ${null}    | ${'loginId'} | ${'plainPassword'} | ${null}
        ${null}    | ${null}      | ${null}            | ${null}
      `(
        `$email, $loginId, $plainPassword, $explainErrorType`,
        async ({
          email,
          loginId,
          plainPassword,
          explainErrorType,
        }: {
          email: string | null
          loginId: string | null
          plainPassword: string | null
          explainErrorType: boolean
        }) => {
          const datetimeRepository = createSuccessMockDatetimeRepository()
          const userRepository = createSuccessMockUserRepository()
          const humanUserRepository = createSuccessMockHumanUserRepository()
          const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)

          const authenticatedUser = createTestAuthenticatedUser('internalOperator')
          const result = await useCase.run(authenticatedUser, {
            userId: 'testUserId',
            email: email,
            loginId: loginId,
            plainPassword: plainPassword,
          })

          if (!explainErrorType) {
            expect(result.hasError).toEqual(false)
            expect(result.error).toBeNull()
            expect(result.value).toEqual({
              email: email,
              loginId: loginId,
              userId: 'testUserId',
              hashedPassword: '******',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            })

            if (!plainPassword) {
              expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(0)
            } else {
              expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(1)
              expect(humanUserRepository.hashPassword.mock.calls[0][0]).toEqual(plainPassword)
            }
            expect(humanUserRepository.update.mock.calls[0][0]).toEqual({
              email: email,
              hashedPassword: plainPassword ? 'test-hashed-password' : 'storedTestHashedPassword',
              loginId: loginId,
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
        },
      )
    })

    describe('updating password', () => {
      describe(`savedPassword | inputPassword | expectSavingPassword`, () => {
        test.each`
          savedPassword | inputPassword | expectSavingPassword
          ${''}         | ${''}         | ${''}
          ${null}       | ${null}       | ${null}
          ${'stored'}   | ${null}       | ${'stored'}
          ${'stored'}   | ${'input'}    | ${'input-hashed-password'}
          ${null}       | ${'input'}    | ${'input-hashed-password'}
        `(
          `
      $savedPassword, $inputPassword, $expectSavingPassword
        `,
          async ({
            savedPassword,
            inputPassword,
            expectSavingPassword,
          }: {
            savedPassword: string | null
            inputPassword: string | null
            expectSavingPassword: string | null
          }) => {
            const datetimeRepository = createSuccessMockDatetimeRepository()
            const userRepository = createSuccessMockUserRepository()
            const humanUserRepository = createSuccessMockHumanUserRepository()
            const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)

            humanUserRepository.hashPassword = jest.fn(async (plainPassword: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
              return {
                hasError: false,
                error: null,
                value: `${plainPassword}-hashed-password`,
              }
            })

            const authenticatedUser = createTestAuthenticatedUser('internalOperator')

            humanUserRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
              return {
                hasError: false,
                error: null,
                value: {
                  userId: 'testUserId1',
                  loginId: 'testLoginId',
                  email: null,
                  hashedPassword: savedPassword,
                  createdAt: new Date(nowStr),
                  updatedAt: new Date(nowStr),
                },
              }
            })

            const result = await useCase.run(authenticatedUser, {
              userId: 'testUserId',
              email: 'email',
              loginId: 'loginId',
              plainPassword: inputPassword,
            })

            expect(result.hasError).toEqual(false)
            expect(result.error).toBeNull()
            expect(result.value).toEqual({
              email: 'email',
              loginId: 'loginId',
              userId: 'testUserId',
              hashedPassword: inputPassword || savedPassword ? '******' : null,
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            })

            if (!inputPassword) {
              expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(0)
            } else {
              expect(humanUserRepository.hashPassword.mock.calls.length).toEqual(1)
              expect(humanUserRepository.hashPassword.mock.calls[0][0]).toEqual(inputPassword)
            }
            expect(humanUserRepository.update.mock.calls[0][0]).toEqual({
              email: 'email',
              hashedPassword: expectSavingPassword,
              loginId: 'loginId',
              userId: 'testUserId',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            })
          },
        )
      })
    })

    test('error on humanUserRepository.findByUserId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      const humanUserRepository = createSuccessMockHumanUserRepository()

      humanUserRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
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
      expect(humanUserRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on humanUserRepository.findByUserId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      const humanUserRepository = createSuccessMockHumanUserRepository()

      humanUserRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'humanUser not found. userId: testUserId1',
        type: 'HumanUserNotFound',
      })
      expect(result.value).toBeNull()
      expect(humanUserRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      const humanUserRepository = createSuccessMockHumanUserRepository()

      userRepository.findById = jest.fn(async (_userId: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
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
      expect(humanUserRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found user on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      const humanUserRepository = createSuccessMockHumanUserRepository()

      userRepository.findById = jest.fn(async (_userId: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        email: null,
        loginId: 'testLoginId',
        plainPassword: 'testPassword',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'user not found. userId: testUserId1',
        type: 'UserNotFound',
      })
      expect(result.value).toBeNull()
      expect(humanUserRepository.update.mock.calls.length).toEqual(0)
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

      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
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
      expect(humanUserRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on humanUserRepository.update', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()

      const humanUserRepository = createSuccessMockHumanUserRepository()

      humanUserRepository.update = jest.fn(async (_humanUser: HumanUser): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
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
        const useCase = new UpdateHumanUserUseCase(datetimeRepository, userRepository, humanUserRepository)
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')

        humanUserRepository.credentialExist = jest.fn(async (_loginId: string | null, _email: string | null): Promise<boolean> => {
          if (newLoginId === null && newEmail === null) {
            return false
          }

          return storedLoginId === newLoginId && storedEmail === newEmail
        })

        humanUserRepository.findByUserId = jest.fn(async (_userId: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              userId: 'testUserId1',
              loginId: 'different-testLoginId',
              email: 'different-testEmail',
              hashedPassword: 'storedTestHashedPassword',
              createdAt: new Date(nowStr),
              updatedAt: new Date(nowStr),
            },
          }
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

          expect(humanUserRepository.update.mock.calls[0][0]).toEqual({
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
      findByUserId: async (_userId: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            userId: 'testUserId1',
            loginId: 'testLoginId',
            email: null,
            hashedPassword: 'storedTestHashedPassword',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },

      hashPassword: async (_plainPassword) => {
        return {
          hasError: false,
          error: null,
          value: 'test-hashed-password',
        }
      },

      update: async (_humanUser) => {
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
      findByUserId: jest.fn((userId: string) => repo.findByUserId(userId)),
      hashPassword: jest.fn((plainPassword: string) => repo.hashPassword(plainPassword)),
      update: jest.fn((humanUser: HumanUser) => repo.update(humanUser)),
      credentialExist: jest.fn((_loginId: string | null, _email: string | null) => repo.credentialExist(_loginId, _email)),
    }
  }
})
