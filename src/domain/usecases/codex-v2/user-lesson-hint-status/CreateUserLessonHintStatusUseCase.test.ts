import CreateUserLessonHintStatusUseCase, {
  DatetimeRepository,
  LessonHintRepository,
  LessonStepRepository,
  UserLessonHintStatusRepository,
  UserLessonStatusRepository,
} from './CreateUserLessonHintStatusUseCase'
import { E, Errorable } from '../../shared/Errors'
import { UserLessonHintStatus } from '../../../entities/codex-v2/UserLessonHintStatus'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'
import { LessonHint } from '../../../entities/codex-v2/LessonHint'
import { LessonStep } from '../../../entities/codex-v2/LessonStep'
import { UserLessonStatus } from '../../../entities/codex-v2/UserLessonStatus'

describe('CreateUserLessonHintStatusUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${false}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const lessonStepRepository = createSuccessMockLessonStepRepository()
        const lessonHintRepository = createSuccessMockLessonHintRepository()
        const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
        const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()
        const useCase = new CreateUserLessonHintStatusUseCase(
          datetimeRepository,
          lessonStepRepository,
          lessonHintRepository,
          userLessonStatusRepository,
          userLessonHintStatusRepository,
        )

        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          lessonHintId: 'testLessonHintId1',
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(userLessonHintStatusRepository.create.mock.calls.length).toEqual(0)
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
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const lessonHintRepository = createSuccessMockLessonHintRepository()
      const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
      const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()
      const useCase = new CreateUserLessonHintStatusUseCase(
        datetimeRepository,
        lessonStepRepository,
        lessonHintRepository,
        userLessonStatusRepository,
        userLessonHintStatusRepository,
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        lessonHintId: 'testLessonHintId1',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(userLessonHintStatusRepository.create.mock.calls[0][0]).toEqual({
        id: 'test-userLessonHintStatus-id',
        lessonHintId: 'testLessonHintId1',
        userId: 'testId',
        userLessonStatusId: 'testUserLessonStatusId1',
        createdAt: new Date(nowStr),
      })
    })

    test('error on lessonHintRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const lessonHintRepository = createSuccessMockLessonHintRepository()
      const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
      const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()

      lessonHintRepository.findById = jest.fn(async (_id: string): Promise<Errorable<LessonHint | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateUserLessonHintStatusUseCase(
        datetimeRepository,
        lessonStepRepository,
        lessonHintRepository,
        userLessonStatusRepository,
        userLessonHintStatusRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        lessonHintId: 'testLessonHintId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(userLessonHintStatusRepository.create.mock.calls.length).toEqual(0)
    })

    test('not found lessonHint on lessonHintRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const lessonHintRepository = createSuccessMockLessonHintRepository()
      const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
      const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()

      lessonHintRepository.findById = jest.fn(async (_id: string): Promise<Errorable<LessonHint | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateUserLessonHintStatusUseCase(
        datetimeRepository,
        lessonStepRepository,
        lessonHintRepository,
        userLessonStatusRepository,
        userLessonHintStatusRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        lessonHintId: 'testLessonHintId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'lessonHint not found. lessonHintId: testLessonHintId1',
        type: 'LessonHintNotFound',
      })
      expect(result.value).toBeNull()
      expect(userLessonHintStatusRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on userLessonHintStatusRepository.issueId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const lessonHintRepository = createSuccessMockLessonHintRepository()
      const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
      const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()

      userLessonHintStatusRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateUserLessonHintStatusUseCase(
        datetimeRepository,
        lessonStepRepository,
        lessonHintRepository,
        userLessonStatusRepository,
        userLessonHintStatusRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        lessonHintId: 'testLessonHintId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(userLessonHintStatusRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const lessonHintRepository = createSuccessMockLessonHintRepository()
      const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
      const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()

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

      const useCase = new CreateUserLessonHintStatusUseCase(
        datetimeRepository,
        lessonStepRepository,
        lessonHintRepository,
        userLessonStatusRepository,
        userLessonHintStatusRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        lessonHintId: 'testLessonHintId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(userLessonHintStatusRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on userLessonHintStatusRepository.create', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const lessonStepRepository = createSuccessMockLessonStepRepository()
      const lessonHintRepository = createSuccessMockLessonHintRepository()
      const userLessonStatusRepository = createSuccessMockUserLessonStatusRepository()
      const userLessonHintStatusRepository = createSuccessMockUserLessonHintStatusRepository()

      userLessonHintStatusRepository.create = jest.fn(
        async (_userLessonHintStatus: UserLessonHintStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const useCase = new CreateUserLessonHintStatusUseCase(
        datetimeRepository,
        lessonStepRepository,
        lessonHintRepository,
        userLessonStatusRepository,
        userLessonHintStatusRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        lessonHintId: 'testLessonHintId1',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockLessonStepRepository = () => {
    const repo: LessonStepRepository = {
      findById: async (_id: string): Promise<Errorable<LessonStep | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testLessonStepId1',
            lessonId: 'testLessonId1',
            orderIndex: 1,
            externalLessonPlayerStepId: 'testExternalLessonPlayerStepId1',
            createdAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }

  const createSuccessMockLessonHintRepository = () => {
    const repo: LessonHintRepository = {
      findById: async (_id: string): Promise<Errorable<LessonHint | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testLessonHintId1',
            lessonStepId: 'testLessonStepId1',
            label: 'testLabel1',
            description: 'testDescription1',
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
  const createSuccessMockUserLessonStatusRepository = () => {
    const repo: UserLessonStatusRepository = {
      findLatestByUserIdLessonId: async (_userId: string, _lessonId: string): Promise<Errorable<UserLessonStatus | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testUserLessonStatusId1',
            userId: 'testUserId',
            lessonId: 'testLessonId',
            status: 'not_cleared',
            startedAt: new Date(nowStr),
            finishedAt: null,
            achievedStarCount: 0,
            correctAnsweredQuizCount: null,
            usedHintCount: null,
            stepIdSkippingDetected: false,
          },
        }
      },
    }

    return {
      findLatestByUserIdLessonId: jest.fn((userId: string, lessonId: string) => repo.findLatestByUserIdLessonId(userId, lessonId)),
    }
  }
  const createSuccessMockUserLessonHintStatusRepository = () => {
    const repo: UserLessonHintStatusRepository = {
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-userLessonHintStatus-id',
        }
      },
      create: async (_userLessonHintStatus) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((userLessonHintStatus: UserLessonHintStatus) => repo.create(userLessonHintStatus)),
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
