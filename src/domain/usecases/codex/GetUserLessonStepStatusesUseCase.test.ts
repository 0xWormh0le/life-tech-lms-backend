import { Lesson, Level } from '../../entities/codex/Lesson'
import { UserLessonStepStatus } from '../../entities/codex/UserLessonStepStatus'
import { E, Errorable } from '../shared/Errors'
import { GetUserLessonStepStatusesUseCase, ILessonRepository, IUserLessonStepStatusesRepository } from './GetUserLessonStepStatusesUseCase'

describe('test GetUserLessonStepStatusesUseCase', () => {
  test('success', async () => {
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
            lessonDuration: '3-5min',
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      getUserLessonStepStatusesByUserIdAndLessonId: jest.fn(async function (
        userId: string,
        lessonId: string,
      ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId,
              lessonId,
              stepId: '1',
              status: 'cleared',
            },
            {
              userId,
              lessonId,
              stepId: '2',
              status: 'not_cleared',
            },
          ],
        }
      }),
    }
    const usecase = new GetUserLessonStepStatusesUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run(
      {
        id: 'user-id-0001',
        loginId: 'login-id-0001',
        role: 'student',
      },
      'lesson-id-0001',
    )

    expect(result.hasError).toEqual(false)

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0001']])

    const getUserLessonStepStatusesByUserIdAndLessonIdSpy = userLessonStepStatusesRepository.getUserLessonStepStatusesByUserIdAndLessonId as jest.Mock

    expect(getUserLessonStepStatusesByUserIdAndLessonIdSpy.mock.calls).toEqual([['user-id-0001', 'lesson-id-0001']])

    expect(result.value).toEqual<UserLessonStepStatus[]>([
      {
        userId: 'user-id-0001',
        lessonId: 'lesson-id-0001',
        stepId: '1',
        status: 'cleared',
      },
      {
        userId: 'user-id-0001',
        lessonId: 'lesson-id-0001',
        stepId: '2',
        status: 'not_cleared',
      },
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      getUserLessonStepStatusesByUserIdAndLessonId: jest.fn(async function (
        userId: string,
        lessonId: string,
      ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId,
              lessonId,
              stepId: '1',
              status: 'cleared',
            },
            {
              userId,
              lessonId,
              stepId: '2',
              status: 'not_cleared',
            },
          ],
        }
      }),
    }
    const usecase = new GetUserLessonStepStatusesUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run(
      {
        id: 'user-id-0001',
        loginId: 'login-id-0001',
        role: 'student',
      },
      'lesson-id-0001',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('NotFoundError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0001']])

    const getUserLessonStepStatusesByUserIdAndLessonIdSpy = userLessonStepStatusesRepository.getUserLessonStepStatusesByUserIdAndLessonId as jest.Mock

    expect(getUserLessonStepStatusesByUserIdAndLessonIdSpy.mock.calls).toEqual(
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      getUserLessonStepStatusesByUserIdAndLessonId: jest.fn(async function (
        userId: string,
        lessonId: string,
      ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId,
              lessonId,
              stepId: '1',
              status: 'cleared',
            },
            {
              userId,
              lessonId,
              stepId: '2',
              status: 'not_cleared',
            },
          ],
        }
      }),
    }
    const usecase = new GetUserLessonStepStatusesUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run(
      {
        id: 'user-id-0001',
        loginId: 'login-id-0001',
        role: 'student',
      },
      'lesson-id-0001',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0001']])

    const getUserLessonStepStatusesByUserIdAndLessonIdSpy = userLessonStepStatusesRepository.getUserLessonStepStatusesByUserIdAndLessonId as jest.Mock

    expect(getUserLessonStepStatusesByUserIdAndLessonIdSpy.mock.calls).toEqual(
      [], // should not called
    )
  })

  test('When userLessonStepStatusesRepository returns runtime error', async () => {
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
            lessonDuration: '3-5min',
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      getUserLessonStepStatusesByUserIdAndLessonId: jest.fn(async function (
        userId: string,
        lessonId: string,
      ): Promise<Errorable<UserLessonStepStatus[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetUserLessonStepStatusesUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run(
      {
        id: 'user-id-0001',
        loginId: 'login-id-0001',
        role: 'student',
      },
      'lesson-id-0001',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0001']])

    const getUserLessonStepStatusesByUserIdAndLessonIdSpy = userLessonStepStatusesRepository.getUserLessonStepStatusesByUserIdAndLessonId as jest.Mock

    expect(getUserLessonStepStatusesByUserIdAndLessonIdSpy.mock.calls).toEqual([['user-id-0001', 'lesson-id-0001']])
  })
})
