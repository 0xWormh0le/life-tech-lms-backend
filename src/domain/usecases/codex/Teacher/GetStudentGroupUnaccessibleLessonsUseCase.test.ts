import { E, Errorable } from '../../shared/Errors'
import {
  GetUnaccessibleLessonsUseCase,
  IUnaccessibleLessonRepository,
  ITeacherRepository,
  IStudentGroupRepository,
  IAdministratorRepository,
} from './GetStudentGroupUnaccessibleLessonsUseCase'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { UnaccessibleLesson } from '../../../entities/codex/UnaccessibleLesson'
import { UserRoles } from '../../shared/Constants'
import { StudentGroup } from '../../../entities/codex/StudentGroup'

const VALID_STUDENT_GROUP_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_GROUP_ID = 'organization-id-00001'
const VALID_UNACCESSIBLE_LESSON_DATA: UnaccessibleLesson[] = [
  {
    studentGroupId: 'student-group-id-1',
    packageId: 'package-id-1',
    lessonId: 'lesson-id-1',
    createdUserId: 'user-id-1',
    createdDate: '2022-05-17T11:54:02.141Z',
  },
  {
    studentGroupId: 'student-group-id-2',
    packageId: 'package-id-2',
    lessonId: 'lesson-id-2',
    createdUserId: 'user-id-2',
    createdDate: '2022-05-17T11:54:02.141Z',
  },
]

describe('Test GetStudentGroupUnaccessibleLessonUseCase', () => {
  test('Test GetStudentGroupUnaccessibleLessonUseCase - success', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_UNACCESSIBLE_LESSON_DATA,
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(false)

    const getUnaccessibleLessonSpy = unaccessibleLessonRepository.getUnaccessibleLessons as jest.Mock

    expect(getUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
    expect(result.value).toEqual(VALID_UNACCESSIBLE_LESSON_DATA)
  })

  test('When unaccessible lesson repository returns runtime error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)

    const getUnaccessibleLessonSpy = unaccessibleLessonRepository.getUnaccessibleLessons as jest.Mock

    expect(getUnaccessibleLessonSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('User role is student - success', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(false)
  })

  test('When provided invalid studentGroupId returns invalid error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(INVALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)

    const getUnaccessibleLessonSpy = unaccessibleLessonRepository.getUnaccessibleLessons as jest.Mock

    expect(getUnaccessibleLessonSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.error?.message).toEqual('Invalid studentGroupId')
    expect(result.value).toEqual(null)
  })

  test('When fail to get user data', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
            message: 'something went wrong',
          },
          value: null,
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided user is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-1',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UserNotFound')
    expect(result.error?.message).toEqual('The specified user not found for requested-user-id')
  })

  test('When provided student group is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentGroupNotFound')
    expect(result.value).toEqual(null)
  })

  test('When student group repository return run time error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (
        studentGroupId: string,
      ): Promise<Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When teacher doesnot have permission to view unaccessible lesson', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherOrganizations: [{ id: 'organization-id-1', name: 'organization-1' }],
          } as TeacherOrganization,
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            organizationId: 'organization-id-15',
          } as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view restrict lesson access from provided student group.')
  })

  test('When fail to teacherByTeacherId() returns undefined ', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('TeacherNotFound')
  })

  test('When fail to get teacher data', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When administrator doesnot have permission to view unaccessible lesson', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: 'administrator',
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view restrict lesson access from provided student group')
  })

  test('When administrator repository return runtime error', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: 'administrator',
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When provided administrator is not found', async () => {
    const unaccessibleLessonRepository: IUnaccessibleLessonRepository = {
      getUnaccessibleLessons: jest.fn(async function (): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UnaccessibleLesson[],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as StudentGroup,
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
    const usecase = new GetUnaccessibleLessonsUseCase(unaccessibleLessonRepository, teacherRepository, studentGroupRepository, districtAdministratorRepositroy)
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: 'administrator',
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'AdministratorNotFound',
      message: `The specified administrator not found for requested-user-id`,
    })
    expect(result.value).toEqual(null)
  })
})
