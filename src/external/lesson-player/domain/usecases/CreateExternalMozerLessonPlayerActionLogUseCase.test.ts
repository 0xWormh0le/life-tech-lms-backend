import CreateExternalMozerLessonPlayerActionLogUseCase, {
  DatetimeRepository,
  ExternalMozerLessonPlayerActionLogRepository,
} from './CreateExternalMozerLessonPlayerActionLogUseCase'
import { E, Errorable } from '../../../../domain/usecases/shared/Errors'
import { ExternalMozerLessonPlayerActionLog } from '../entities/ExternalMozerLessonPlayerActionLog'
import { UserRole } from '../../../../domain/entities/codex-v2/User'
import { createTestAuthenticatedUser } from '../../../../domain/usecases/codex-v2/_testShaerd/UseCaseTestUtility.test'

describe('CreateExternalMozerLessonPlayerActionLogUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${false}
      ${'teacher'}          | ${false}
      ${'administrator'}    | ${false}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const externalMozerLessonPlayerActionLogRepository = createSuccessMockExternalMozerLessonPlayerActionLogRepository()
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const useCase = new CreateExternalMozerLessonPlayerActionLogUseCase(externalMozerLessonPlayerActionLogRepository, datetimeRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          log: {
            url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
            unix_time: 1671008340671,
            date: '2022-12-14T08:59:00.671Z',
            event_name: 'stepPassed',
            step_id: 7,
            is_lesson: true,
            step_name: 'step_name',
            step_type: {
              type: 'lesson',
              snap_type: 'begin',
              layout: 'ERH1',
            },
            unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
            snap: 'step000-begin',
            timezone_offset: -540,
          },
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(externalMozerLessonPlayerActionLogRepository.create.mock.calls.length).toEqual(0)
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
      const externalMozerLessonPlayerActionLogRepository = createSuccessMockExternalMozerLessonPlayerActionLogRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const useCase = new CreateExternalMozerLessonPlayerActionLogUseCase(externalMozerLessonPlayerActionLogRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
          unix_time: 1671008340671,
          date: '2022-12-14T08:59:00.671Z',
          event_name: 'stepPassed',
          step_id: 7,
          is_lesson: true,
          step_name: 'step_name',
          step_type: {
            type: 'lesson',
            snap_type: 'begin',
            layout: 'ERH1',
          },
          unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
          snap: 'step000-begin',
          timezone_offset: -540,
        },
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(externalMozerLessonPlayerActionLogRepository.create.mock.calls[0][0]).toEqual({
        createdAt: new Date(nowStr),
        id: 'test-externalMozerLessonPlayerActionLog-id',
        log: {
          date: '2022-12-14T08:59:00.671Z',
          event_name: 'stepPassed',
          is_lesson: true,
          snap: 'step000-begin',
          step_id: 7,
          step_name: 'step_name',
          step_type: {
            layout: 'ERH1',
            snap_type: 'begin',
            type: 'lesson',
          },
          timezone_offset: -540,
          unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
          unix_time: 1671008340671,
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
        },
        userId: 'testId',
      })
    })

    test('error on externalMozerLessonPlayerActionLogRepository.issueId', async () => {
      const externalMozerLessonPlayerActionLogRepository = createSuccessMockExternalMozerLessonPlayerActionLogRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      externalMozerLessonPlayerActionLogRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateExternalMozerLessonPlayerActionLogUseCase(externalMozerLessonPlayerActionLogRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
          unix_time: 1671008340671,
          date: '2022-12-14T08:59:00.671Z',
          event_name: 'stepPassed',
          step_id: 7,
          is_lesson: true,
          step_name: 'step_name',
          step_type: {
            type: 'lesson',
            snap_type: 'begin',
            layout: 'ERH1',
          },
          unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
          snap: 'step000-begin',
          timezone_offset: -540,
        },
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(externalMozerLessonPlayerActionLogRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const externalMozerLessonPlayerActionLogRepository = createSuccessMockExternalMozerLessonPlayerActionLogRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

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

      const useCase = new CreateExternalMozerLessonPlayerActionLogUseCase(externalMozerLessonPlayerActionLogRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
          unix_time: 1671008340671,
          date: '2022-12-14T08:59:00.671Z',
          event_name: 'stepPassed',
          step_id: 7,
          is_lesson: true,
          step_name: 'step_name',
          step_type: {
            type: 'lesson',
            snap_type: 'begin',
            layout: 'ERH1',
          },
          unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
          snap: 'step000-begin',
          timezone_offset: -540,
        },
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(externalMozerLessonPlayerActionLogRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on externalMozerLessonPlayerActionLogRepository.create', async () => {
      const externalMozerLessonPlayerActionLogRepository = createSuccessMockExternalMozerLessonPlayerActionLogRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      externalMozerLessonPlayerActionLogRepository.create = jest.fn(
        async (_externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateExternalMozerLessonPlayerActionLogUseCase(externalMozerLessonPlayerActionLogRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        log: {
          url: 'http://localhost:9000/player/step?project_name=test_case_spreadsheet&scenario_path=lesson/MOZP223&step_id=8',
          unix_time: 1671008340671,
          date: '2022-12-14T08:59:00.671Z',
          event_name: 'stepPassed',
          step_id: 7,
          is_lesson: true,
          step_name: 'step_name',
          step_type: {
            type: 'lesson',
            snap_type: 'begin',
            layout: 'ERH1',
          },
          unique_id: 'rS+PdhZGVxhj1KwB9jIDmw6R/CU3cigkrb4aEl/XoF8RnSgaQVTVUEUIJFJPtBaiENjENCf+/Zlv6AXfgKDJ/Q==20221213055608',
          snap: 'step000-begin',
          timezone_offset: -540,
        },
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockExternalMozerLessonPlayerActionLogRepository = () => {
    const repo: ExternalMozerLessonPlayerActionLogRepository = {
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-externalMozerLessonPlayerActionLog-id',
        }
      },

      create: async (_externalMozerLessonPlayerActionLog) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog) => repo.create(externalMozerLessonPlayerActionLog)),
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
