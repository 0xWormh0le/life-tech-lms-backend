import { Lesson, Level } from '../../entities/codex/Lesson'
import { GetLessonsUseCase, ILessonRepository } from './GetLessonsUseCase'
import { E, Errorable } from '../shared/Errors'
import { User } from '../../entities/codex/User'

let mockLessonRepository: ILessonRepository
let mockValue: Lesson[] = []
let mockResultData: Errorable<Lesson[], E<'UnknownRuntimeError'>>
let mockUser: User
let mockLessonIds: string[]

/**
 * Clear everything before and after each test
 */
beforeEach(resetAll)

afterEach(resetAll)

function resetAll() {
  mockValue = [
    {
      id: 'lesson-id-success-1',
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
    {
      id: 'lesson-id-success-2',
      url: 'lesson-url-success-2',
      name: 'lesson-name-success-2',
      course: 'gameDevelopment',
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
      maxStarCount: 5,
      quizCount: 6,
      hintCount: 7,
      level: 'basic' as Level,
    },
  ]
  mockResultData = { error: null, hasError: false, value: mockValue }
  mockLessonRepository = {
    getLessonsByLessonIds: jest.fn(async function (lessonIds: string[]): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
      return mockResultData
    }),
  }

  mockUser = {
    id: 'user-id',
    loginId: 'login-id',
    role: 'student',
  }
  mockLessonIds = ['lesson-id-0001', 'lesson-id-0002']
}

const getLessonsUseCaseRow = async (user: User, lessonIds: string[]): Promise<Errorable<Lesson[], E<'LessonsNotFoundError'> | E<'UnknownRuntimeError'>>> => {
  const usecase = new GetLessonsUseCase(mockLessonRepository)
  const result = await usecase.run(user, lessonIds)

  return result
}

describe('test GetLeesonsUseCase', () => {
  test('test GetLeesonsUseCase - success', async () => {
    const result = await getLessonsUseCaseRow(mockUser, mockLessonIds)

    expect(result.hasError).toEqual(false)

    const getLessonsByLessonIdsSpy = mockLessonRepository.getLessonsByLessonIds as jest.Mock

    expect(getLessonsByLessonIdsSpy.mock.calls).toEqual([[mockLessonIds]])
    expect(result.value).toEqual(mockValue)
  })

  test('There is no lessons related to lesson ids', async () => {
    mockValue = []
    mockResultData = { error: null, hasError: false, value: mockValue }

    const result = await getLessonsUseCaseRow(mockUser, mockLessonIds)
    const getLessonsByLessonIdsSpy = mockLessonRepository.getLessonsByLessonIds as jest.Mock

    expect(getLessonsByLessonIdsSpy.mock.calls).toEqual([[mockLessonIds]])
    expect(result.error?.type).toEqual('LessonsNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('When lesson repository returns runtime error', async () => {
    mockResultData = {
      hasError: true,
      error: {
        type: 'UnknownRuntimeError',
        message: 'something wrong happened',
      },
      value: null,
    }

    const result = await getLessonsUseCaseRow(mockUser, mockLessonIds)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When some of requested lessonIds are not existent in response', async () => {
    mockValue = [mockValue[0]]
    mockResultData = { error: null, hasError: false, value: mockValue }

    const result = await getLessonsUseCaseRow(mockUser, mockLessonIds)

    expect(result.hasError).toEqual(false)
    expect(result.value?.length).not.toEqual(2)
  })
})
