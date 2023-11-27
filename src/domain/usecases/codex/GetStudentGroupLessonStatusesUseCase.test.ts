import { E, Errorable } from '../shared/Errors'
import { StudentGroupLessonStatus } from '../../entities/codex/UserLessonStatus'
import {
  GetStudentGroupLessonStatusesUseCase,
  IUserLessonStatusesRepository,
  ITeacherRepository,
  IStudentGroupRepository,
  IAdministratorRepository,
} from './GetStudentGroupLessonStatusesUseCase'
import { TeacherOrganization } from '../../entities/codex/Teacher'
import { DistrictAdministrator } from '../../entities/codex/DistrictAdministrator'
import { UserRoles } from '../shared/Constants'
import { StudentGroup } from '../../entities/codex/StudentGroup'

const VALID_STUDENT_GROUP_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_GROUP_ID = 'organization-id-00001'
const VALID_LESSON_STATUSES_DATA: StudentGroupLessonStatus[] = [
  {
    userId: 'user-id-1',
    lessonId: 'lesson-id-1',
    status: 'not_cleared',
    achievedStarCount: 2,
    usedHintCount: 1,
    correctAnsweredQuizCount: 1,
    stepIdskippingDetected: false,
    startedAt: 'teacher-started-date-success-1',
    finishedAt: 'teacher-finish-date-success-1',
    quizCount: 1,
  },
  {
    userId: 'user-id-2',
    lessonId: 'lesson-id-2',
    status: 'not_cleared',
    achievedStarCount: 2,
    usedHintCount: 2,
    correctAnsweredQuizCount: 2,
    stepIdskippingDetected: false,
    startedAt: 'teacher-started-date-success-2',
    finishedAt: 'teacher-finish-date-success-2',
    quizCount: 1,
  },
]

describe('Test GetStudentGroupLessonStatusesUseCase', () => {
  test('Test GetStudentGroupLessonStatusesUseCase - success', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_LESSON_STATUSES_DATA,
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(false)

    const getStudentGroupLessonStatusesSpy = userLessonStatusesRepository.getStudentGroupLessonStatuses as jest.Mock

    expect(getStudentGroupLessonStatusesSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
    expect(result.value).toEqual(VALID_LESSON_STATUSES_DATA)
    expect(result.error).toEqual(null)
  })

  test('When user lesson status repository returns runtime error', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)

    const getStudentGroupLessonStatusesSpy = userLessonStatusesRepository.getStudentGroupLessonStatuses as jest.Mock

    expect(getStudentGroupLessonStatusesSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('User role is not internal operator or administrator or teacher - permission denied', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view lesson statuses from provided student group')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid studentGroupId returns invalid error', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(INVALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)

    const getStudentGroupLessonStatusesSpy = userLessonStatusesRepository.getStudentGroupLessonStatuses as jest.Mock

    expect(getStudentGroupLessonStatusesSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.error?.message).toEqual('Invalid studentGroupId')
    expect(result.value).toEqual(null)
  })

  test('When provided student group is not found', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_LESSON_STATUSES_DATA,
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
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
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_LESSON_STATUSES_DATA,
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When administrator repository return run time error', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.administrator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When provided administrator is not found', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.administrator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error).toEqual({
      type: 'AdministratorNotFound',
      message: `The specified administrator not found for requested-user-id`,
    })
  })

  test('When administrator doesnot have permission to view lesson statuses', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.administrator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view lesson statuses from provided student group')
  })

  test('When failed to get teacher id by user id', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When provided user is not found', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
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

  test('When fail to get teacher data', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When teacherByTeacherId() returns undefined', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
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
      getTeacherIdByUserId: jest.fn(async function (userId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })
    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.error?.message).toStrictEqual(`The specified teacher not found for requested-user-id`)
  })

  test('When teacher doesnot have permission to view unaccessible lesson', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as StudentGroupLessonStatus[],
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherId: 'teacher-id-1',
            teacherOrganizations: [{ id: 'organization-id-1', name: 'organization-1' }],
          } as TeacherOrganization,
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
            id: VALID_STUDENT_GROUP_ID,
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual(
      `Teacher with TeacherId : teacher-id-1 is not associated with organization : organization-id-15. Please assign teacher to the organization first.`,
    )
  })

  test('When no lesson statuses found for provided student group id, should return empty array', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getStudentGroupLessonStatuses: jest.fn(async function (): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
    const usecase = new GetStudentGroupLessonStatusesUseCase(
      userLessonStatusesRepository,
      teacherRepository,
      studentGroupRepository,
      districtAdministratorRepositroy,
    )
    const result = await usecase.run(VALID_STUDENT_GROUP_ID, {
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual<NonNullable<typeof result.value>>([])

    const getStudentGroupLessonStatusesSpy = userLessonStatusesRepository.getStudentGroupLessonStatuses as jest.Mock

    expect(getStudentGroupLessonStatusesSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])
  })
})
