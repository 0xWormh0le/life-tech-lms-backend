import { Lesson, Level } from '../../entities/codex/Lesson'
import { User } from '../../entities/codex/User'
import { UserLessonStatus } from '../../entities/codex/UserLessonStatus'
import { UserRoles } from '../shared/Constants'
import { E, Errorable } from '../shared/Errors'
import { UpdateUserLessonStatusUseCase, ILessonRepository, IUserLessonStatusRepository } from './UpdateUserLessonStatusUseCase'

const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: UserRoles.student,
}

describe('test UpdateUserLessonStatusUseCase', () => {
  test('success create UserLessonStatus', async () => {
    const lessonRepository: ILessonRepository = {
      getLessonById: jest.fn(async function (lessonId: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: lessonId,
            url: 'lesson-url-success-1',
            name: 'lesson-name-success-1',
            course: 'basic',
            lessonEnvironment: 'litLessonPlayer',
            lessonDuration: '2-5min',
            description: 'lesson-description-success-1',
            theme: 'lesson-theme-success-1',
            skillsLearnedInThisLesson: 'lesson-skillsLearnedInThisLesson-success-1',
            lessonObjectives: 'lesson-lessonObjectives-success-1',
            thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-1',
            lessonOverViewPdfUrl: 'lesson-lessonOverViewPdfUrl-success-1',
            projectName: 'lesson-projectName-success-1',
            scenarioName: 'lesson-scenarioName-success-1',
            maxStarCount: 3,
            quizCount: 4,
            hintCount: 2,
            level: 'basic' as Level,
          },
        }
      }),
    }
    const userLessonStatusRepository: IUserLessonStatusRepository = {
      updateUserLessonStatus: jest.fn(async function (userLessonStatus: UserLessonStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usecase = new UpdateUserLessonStatusUseCase(lessonRepository, userLessonStatusRepository)

    const result = await usecase.run(VALID_USER_DATA, {
      userId: 'user-id-0001',
      lessonId: 'lesson-id-0001',
      status: 'cleared',
      achievedStarCount: 1,
      correctAnsweredQuizCount: 2,
      usedHintCount: 3,
      stepIdskippingDetected: false,
      finishedAt: '2022-10-05T14:48:00.000Z',
    })

    expect(result.hasError).toEqual(false)

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0001']])

    const createUserLessonStatusSpy = userLessonStatusRepository.updateUserLessonStatus as jest.Mock

    expect(createUserLessonStatusSpy.mock.calls).toEqual([
      [
        {
          userId: 'user-id-0001',
          lessonId: 'lesson-id-0001',
          status: 'cleared',
          achievedStarCount: 1,
          correctAnsweredQuizCount: 2,
          usedHintCount: 3,
          stepIdskippingDetected: false,
          finishedAt: '2022-10-05T14:48:00.000Z',
        },
      ],
    ])
  })

  test('There is no lesson related to given lesson id', async () => {
    const lessonRepository: ILessonRepository = {
      getLessonById: jest.fn(async function (lessonId: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: null, // no lesson exist
        }
      }),
    }
    const userLessonStatusesRepository: IUserLessonStatusRepository = {
      updateUserLessonStatus: jest.fn(async function (userLessonStatus: UserLessonStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usecase = new UpdateUserLessonStatusUseCase(lessonRepository, userLessonStatusesRepository)

    const result = await usecase.run(VALID_USER_DATA, {
      userId: 'user-id-0002',
      lessonId: 'lesson-id-0002',
      status: 'cleared',
      achievedStarCount: 1,
      correctAnsweredQuizCount: 2,
      usedHintCount: 3,
      stepIdskippingDetected: false,
      finishedAt: '2022-10-05T14:48:00.000Z',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('NotFoundError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0002']])

    const createUserLessonStatusSpy = userLessonStatusesRepository.updateUserLessonStatus as jest.Mock

    expect(createUserLessonStatusSpy.mock.calls).toEqual(
      [], // should not called
    )
  })

  test('When lesson repository returns runtime error', async () => {
    const lessonRepository: ILessonRepository = {
      getLessonById: jest.fn(async function (lessonId: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }
    const userLessonStatusesRepository: IUserLessonStatusRepository = {
      updateUserLessonStatus: jest.fn(async function (userLessonStatus: UserLessonStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usecase = new UpdateUserLessonStatusUseCase(lessonRepository, userLessonStatusesRepository)

    const result = await usecase.run(VALID_USER_DATA, {
      userId: 'user-id-0003',
      lessonId: 'lesson-id-0003',
      status: 'cleared',
      achievedStarCount: 1,
      correctAnsweredQuizCount: 2,
      usedHintCount: 3,
      stepIdskippingDetected: false,
      finishedAt: '2022-10-05T14:48:00.000Z',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0003']])

    const createUserLessonStatusSpy = userLessonStatusesRepository.updateUserLessonStatus as jest.Mock

    expect(createUserLessonStatusSpy.mock.calls).toEqual(
      [], // should not called
    )
  })

  test('When UserLessonStatusesRepository returns runtime error', async () => {
    const lessonRepository: ILessonRepository = {
      getLessonById: jest.fn(async function (lessonId: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: lessonId,
            url: 'lesson-url-success-2',
            name: 'lesson-name-success-2',
            course: 'basic',
            lessonEnvironment: 'litLessonPlayer',
            lessonDuration: '2-5min',
            description: 'lesson-description-success-2',
            theme: 'lesson-theme-success-2',
            skillsLearnedInThisLesson: 'lesson-skillsLearnedInThisLesson-success-2',
            lessonObjectives: 'lesson-lessonObjectives-success-2',
            thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-2',
            lessonOverViewPdfUrl: 'lesson-lessonOverViewPdfUrl-success-2',
            projectName: 'lesson-projectName-success-2',
            scenarioName: 'lesson-scenarioName-success-2',
            maxStarCount: 3,
            quizCount: 4,
            hintCount: 2,
            level: 'basic' as Level,
          },
        }
      }),
    }
    const userLessonStatusesRepository: IUserLessonStatusRepository = {
      updateUserLessonStatus: jest.fn(async function (userLessonStatus: UserLessonStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }

    const usecase = new UpdateUserLessonStatusUseCase(lessonRepository, userLessonStatusesRepository)

    const result = await usecase.run(VALID_USER_DATA, {
      userId: 'user-id-0004',
      lessonId: 'lesson-id-0004',
      status: 'cleared',
      achievedStarCount: 1,
      correctAnsweredQuizCount: 2,
      usedHintCount: 3,
      stepIdskippingDetected: false,
      finishedAt: '2022-10-05T14:48:00.000Z',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0004']])

    const createUserLessonStatusSpy = userLessonStatusesRepository.updateUserLessonStatus as jest.Mock

    expect(createUserLessonStatusSpy.mock.calls).toEqual([
      [
        {
          userId: 'user-id-0004',
          lessonId: 'lesson-id-0004',
          status: 'cleared',
          achievedStarCount: 1,
          correctAnsweredQuizCount: 2,
          usedHintCount: 3,
          stepIdskippingDetected: false,
          finishedAt: '2022-10-05T14:48:00.000Z',
        },
      ],
    ])
  })
})
