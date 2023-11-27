import { E, Errorable } from '../shared/Errors'
import { GetStudentUnaccessibleLessonsUseCase, IUnaccessibleLessonRepository } from './GetStudentUnaccessibleLessonsUseCase'
import { UserRoles } from '../shared/Constants'

const VALID_STUDENT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_ID = 'student-id-00001'
const VALID_STUDENT_UNACCESSIBLE_LESSON_DATA: string[] = ['lesson-id-1', 'lesson-id-2', 'lesson-id-3']

describe('Test GetStudentUnaccessibleLessonsUseCase', () => {
  test('Test GetStudentUnaccessibleLessonsUseCase - success', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getStudentUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_STUDENT_UNACCESSIBLE_LESSON_DATA,
        }
      }),
    }

    const usecase = new GetStudentUnaccessibleLessonsUseCase(unaccessibleLessonRepository)
    const result = await usecase.run(VALID_STUDENT_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(false)

    const getStudentUnaccessibleLessonSpy = unaccessibleLessonRepository.getStudentUnaccessibleLessons as jest.Mock

    expect(getStudentUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])
    expect(result.value).toEqual(VALID_STUDENT_UNACCESSIBLE_LESSON_DATA)
  })

  test('When unaccessible lesson repository returns runtime error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getStudentUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      }),
    }

    const usecase = new GetStudentUnaccessibleLessonsUseCase(unaccessibleLessonRepository)

    const result = await usecase.run(VALID_STUDENT_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(true)

    const getStudentUnaccessibleLessonSpy = unaccessibleLessonRepository.getStudentUnaccessibleLessons as jest.Mock

    expect(getStudentUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When no unaccessible lesson for student', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getStudentUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const usecase = new GetStudentUnaccessibleLessonsUseCase(unaccessibleLessonRepository)
    const result = await usecase.run(VALID_STUDENT_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(false)

    const getStudentUnaccessibleLessonSpy = unaccessibleLessonRepository.getStudentUnaccessibleLessons as jest.Mock

    expect(getStudentUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])
    expect(result.value).toEqual([])
  })

  test('When provided studentId returns invalid error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getStudentUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_STUDENT_UNACCESSIBLE_LESSON_DATA,
        }
      }),
    }

    const usecase = new GetStudentUnaccessibleLessonsUseCase(unaccessibleLessonRepository)
    const result = await usecase.run(INVALID_STUDENT_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(true)

    const getStudentUnaccessibleLessonSpy = unaccessibleLessonRepository.getStudentUnaccessibleLessons as jest.Mock

    expect(getStudentUnaccessibleLessonSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidStudentId')
    expect(result.error?.message).toEqual('Invalid studentId')
    expect(result.value).toEqual(null)
  })
})
