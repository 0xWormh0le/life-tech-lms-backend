import { Lesson, Level } from '../../entities/codex/Lesson'
import { UserLessonStepStatus } from '../../entities/codex/UserLessonStepStatus'
import { E, Errorable } from '../shared/Errors'
import { CreateUserLessonStepStatusUseCase, ILessonRepository, IUserLessonStepStatusesRepository } from './CreateUserLessonStepStatusUseCase'

describe('test createUserLessonStepStatusesUseCase', () => {
  test('success create UserLessonStepStatus', async () => {
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      createUserLessonStepStatus: jest.fn(async function (
        userLessonStepStatus: UserLessonStepStatus,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistsError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateUserLessonStepStatusUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run({
      userId: 'user-id-0001',
      lessonId: 'lesson-id-0001',
      stepId: 'step-id-0001',
      status: 'cleared',
    })

    expect(result.hasError).toEqual(false)

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0001']])

    const createUserLessonStepStatusSpy = userLessonStepStatusesRepository.createUserLessonStepStatus as jest.Mock

    expect(createUserLessonStepStatusSpy.mock.calls).toEqual([
      [
        {
          userId: 'user-id-0001',
          lessonId: 'lesson-id-0001',
          stepId: 'step-id-0001',
          status: 'cleared',
        },
      ],
    ])
  })

  test('Returns AlreadyExistsError if there exists corresponding UserLessonStepStatus already', async () => {
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      createUserLessonStepStatus: jest.fn(async function (
        userLessonStepStatus: UserLessonStepStatus,
      ): Promise<Errorable<void, E<'AlreadyExistsError'> | E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistsError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }
    const usecase = new CreateUserLessonStepStatusUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run({
      userId: 'user-id-0005',
      lessonId: 'lesson-id-0005',
      stepId: 'step-id-0005',
      status: 'cleared',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistsError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0005']])

    const createUserLessonStepStatusSpy = userLessonStepStatusesRepository.createUserLessonStepStatus as jest.Mock

    expect(createUserLessonStepStatusSpy.mock.calls).toEqual([
      [
        {
          userId: 'user-id-0005',
          lessonId: 'lesson-id-0005',
          stepId: 'step-id-0005',
          status: 'cleared',
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      createUserLessonStepStatus: jest.fn(async function (userLessonStepStatus: UserLessonStepStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateUserLessonStepStatusUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run({
      userId: 'user-id-0002',
      lessonId: 'lesson-id-0002',
      stepId: 'step-id-0002',
      status: 'cleared',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('NotFoundError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0002']])

    const createUserLessonStepStatusSpy = userLessonStepStatusesRepository.createUserLessonStepStatus as jest.Mock

    expect(createUserLessonStepStatusSpy.mock.calls).toEqual(
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
      createUserLessonStepStatus: jest.fn(async function (userLessonStepStatus: UserLessonStepStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateUserLessonStepStatusUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run({
      userId: 'user-id-0003',
      lessonId: 'lesson-id-0003',
      stepId: 'step-id-0003',
      status: 'cleared',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0003']])

    const createUserLessonStepStatusSpy = userLessonStepStatusesRepository.createUserLessonStepStatus as jest.Mock

    expect(createUserLessonStepStatusSpy.mock.calls).toEqual(
      [], // should not called
    )
  })

  test('When UserLessonStepStatusesRepository returns runtime error', async () => {
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
    const userLessonStepStatusesRepository: IUserLessonStepStatusesRepository = {
      createUserLessonStepStatus: jest.fn(async function (userLessonStepStatus: UserLessonStepStatus): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new CreateUserLessonStepStatusUseCase(lessonRepository, userLessonStepStatusesRepository)

    const result = await usecase.run({
      userId: 'user-id-0004',
      lessonId: 'lesson-id-0004',
      stepId: 'step-id-0004',
      status: 'cleared',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonByIdSpy = lessonRepository.getLessonById as jest.Mock

    expect(getLessonByIdSpy.mock.calls).toEqual([['lesson-id-0004']])

    const createUserLessonStepStatusSpy = userLessonStepStatusesRepository.createUserLessonStepStatus as jest.Mock

    expect(createUserLessonStepStatusSpy.mock.calls).toEqual([
      [
        {
          userId: 'user-id-0004',
          lessonId: 'lesson-id-0004',
          stepId: 'step-id-0004',
          status: 'cleared',
        },
      ],
    ])
  })
})
