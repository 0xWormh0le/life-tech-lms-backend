import { E, Errorable } from '../../shared/Errors'
import { Lesson } from '../../../entities/codex/Lesson'
import {
  RemoveUnaccessibleLessonUseCase,
  IUnaccessibleLessonRepository,
  ITeacherRepository,
  ILessonRepository,
  IStudentGroupRepository,
  IAdministratorRepository,
} from './RemoveStudentGroupUnaccessibleLessonUseCase'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

const VALID_STUDENT_GROUP_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const VALID_LESSON_IDS = ['lesson-id-success-1', 'lesson-id-success-2']
const INVALID_STUDENT_GROUP_ID = 'organization-id-00001'

describe('Test RemoveStudentGroupUnaccessibleLessonUseCase', () => {
  test('Test RemoveStudentGroupUnaccessibleLessonUseCase - success', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'lesson-id-success-1',
              url: 'lesson-url-success-1',
              name: 'lesson-name-success-1',
              course: 'basic',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-1',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-1',
              maxStarCount: 3,
              quizCount: 4,
              hintCount: 2,
              level: 'basic',
            },
            {
              id: 'lesson-id-success-2',
              url: 'lesson-url-success-2',
              name: 'lesson-name-success-2',
              course: 'gameDevelopment',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-2',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-2',
              maxStarCount: 5,
              quizCount: 6,
              hintCount: 7,
              level: 'basic',
            },
          ] as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(false)

    const removeUnaccessibleLessonSpy = unaccessibleLessonRepository.removeUnaccessibleLesson as jest.Mock

    expect(removeUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID, VALID_LESSON_IDS]])
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('When teacher repository returns runtime error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'lesson-id-success-1',
              url: 'lesson-url-success-1',
              name: 'lesson-name-success-1',
              course: 'basic',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-1',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-1',
              maxStarCount: 3,
              quizCount: 4,
              hintCount: 2,
              level: 'basic',
            },
            {
              id: 'lesson-id-success-2',
              url: 'lesson-url-success-2',
              name: 'lesson-name-success-2',
              course: 'gameDevelopment',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-2',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-2',
              maxStarCount: 5,
              quizCount: 6,
              hintCount: 7,
              level: 'basic',
            },
          ] as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)

    const removeUnaccessibleLessonSpy = unaccessibleLessonRepository.removeUnaccessibleLesson as jest.Mock

    expect(removeUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID, VALID_LESSON_IDS]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator or administrator or teacher- permission denied', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'lesson-id-success-1',
              url: 'lesson-url-success-1',
              name: 'lesson-name-success-1',
              course: 'basic',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-1',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-1',
              maxStarCount: 3,
              quizCount: 4,
              hintCount: 2,
              level: 'basic',
            },
            {
              id: 'lesson-id-success-2',
              url: 'lesson-url-success-2',
              name: 'lesson-name-success-2',
              course: 'gameDevelopment',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-2',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-2',
              maxStarCount: 5,
              quizCount: 6,
              hintCount: 7,
              level: 'basic',
            },
          ] as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to remove restrict lesson access from provided student group')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid studentGroupId returns invalid error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      INVALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)

    const removeUnaccessibleLessonSpy = unaccessibleLessonRepository.removeUnaccessibleLesson as jest.Mock

    expect(removeUnaccessibleLessonSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.error?.message).toEqual('Invalid studentGroupId')
    expect(result.value).toEqual(null)
  })

  test('When provided lessons is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'lesson-id-success-1',
              url: 'lesson-url-success-1',
              name: 'lesson-name-success-1',
              course: 'basic',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-1',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-1',
              maxStarCount: 3,
              quizCount: 4,
              hintCount: 2,
              level: 'basic',
            },
            {
              id: 'lesson-id-success-3',
              url: 'lesson-url-success-2',
              name: 'lesson-name-success-2',
              course: 'gameDevelopment',
              lessonEnvironment: 'litLessonPlayer',
              lessonDuration: '3-5min',
              description: 'lesson-description-success-2',
              thumbnailImageUrl: 'lesson-thumbnailImageUrl-success-2',
              maxStarCount: 5,
              quizCount: 6,
              hintCount: 7,
              level: 'basic',
            },
          ] as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: `The specified lessons are not found for lesson ids: lesson-id-success-3`,
      type: 'LessonsNotFound',
    })
    expect(result.value).toEqual(null)
  })

  test('When fail to get user data', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
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
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided user is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UserNotFound')
    expect(result.error?.message).toEqual('The specified user not found for requested-user-id')
  })

  test('When provided student group is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupNotFound',
            message: `The specified student group not found for ${VALID_STUDENT_GROUP_ID}.`,
          },
          value: null,
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentGroupNotFound')
    expect(result.value).toEqual(null)
  })

  test('When student group repository return run time error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
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
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When teacher doesnot have permission to restrict lesson', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to remove restrict lesson access from provided student group')
  })

  test('When fail to get teacher data', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When lesson repository return run time error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When administrator doesnot have permission to restrict lesson', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to remove restrict lesson access from provided student group')
  })

  test('When administrator repository return runtime error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
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
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When provided administrator is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      removeUnaccessibleLesson: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'teacher-id-1',
        }
      }),
    }
    const lessonRepository: ILessonRepository = {
      getLessonsByLessonIds: jest.fn(async function (): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Lesson[],
        }
      }),
    }
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new RemoveUnaccessibleLessonUseCase(
      unaccessibleLessonRepository,
      teacherRepository,
      studentGroupRepository,
      lessonRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(
      VALID_STUDENT_GROUP_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_LESSON_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'AdministratorNotFound',
      message: `The specified administrator not found for requested-user-id`,
    })
    expect(result.value).toEqual(null)
  })
})
