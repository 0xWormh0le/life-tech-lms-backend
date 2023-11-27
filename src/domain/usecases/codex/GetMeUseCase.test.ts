import {
  GetMeUseCase,
  ITeacherRepository,
  IAdministratorRepository,
  IStudentRepository,
  IAdministratorDistrictRepository,
  IOrganizationRepository,
  ITeacherOrganizationRepository,
  IStudentGroupRepository,
  IStudentStudentGroupRepository,
} from './GetMeUseCase'
import { E, Errorable } from '../shared/Errors'
import { MeInfo } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'
import { AdministratorDistrict } from '../../entities/codex/AdministratorDistrict'
import { Organizations } from '../../entities/codex/Organization'
import { TeacherOrganization } from '../../entities/codex/TeacherOrganization'
import { StudentGroup } from '../../entities/codex/StudentGroup'
import { StudentStudentGroup } from '../../entities/codex/StudentStudentGroup'

describe('test GetMeUseCase', () => {
  const successAdministratorRepository: IAdministratorRepository = {
    getAdministratorDetailByUserId: jest.fn(async function (
      userId: string,
    ): Promise<Errorable<Omit<NonNullable<MeInfo['administrator']>, 'districtId'> | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'administrator-id-1',
          userId: 'administrator-userId-1',
          firstName: 'administrator-firstName-1',
          lastName: 'administrator-lastName-1',
          administratorLMSId: 'administrator-administratorLMSId-1',
        },
      }
    }),
  }
  const successAdministratorDistrictRepository: IAdministratorDistrictRepository = {
    getAllByAdministratorId: jest.fn(async function (administaratorId: string): Promise<Errorable<AdministratorDistrict[], E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: [
          {
            administratorId: 'administrator-id-1',
            districtId: 'district-id-1',
          },
          {
            administratorId: 'administrator-id-1',
            districtId: 'district-id-2',
          },
        ],
      }
    }),
  }
  const successTeacherRepository: ITeacherRepository = {
    getTeacherDetailByUserId: jest.fn(async function (
      userId: string,
    ): Promise<Errorable<Omit<NonNullable<MeInfo['teacher']>, 'districtId' | 'organizationIds'> | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'teacher-id-1',
          userId: 'teacher-userId-1',
          firstName: 'teacher-firstName-1',
          lastName: 'teacher-lastName-1',
          teacherLMSId: 'teacher-teacherLMSId-1',
        },
      }
    }),
  }
  const successOrganizationRepository: IOrganizationRepository = {
    getOrganizationById: jest.fn(async function (organizationId: string): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'organization-id-1',
          name: 'organization-name-1',
          districtId: 'district-id-1',
          stateId: 'organization-stateId-1',
          organizationLMSId: 'organization-organizationLMSId-1',
          createdUserId: 'organization-createdUserId-1',
          createdDate: 'organization-createdDate-1',
          updatedDate: 'organization-updatedDate-1',
        },
      }
    }),
  }
  const successTeacherOrganizationRepository: ITeacherOrganizationRepository = {
    getAllByTeacherId: jest.fn(async function (teacherid: string): Promise<Errorable<TeacherOrganization[], E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: [
          {
            teacherId: 'teacher-id-1',
            organizationId: 'organization-id-1',
          },
          {
            teacherId: 'teacher-id-1',
            organizationId: 'organization-id-2',
          },
        ],
      }
    }),
  }
  const successStudentRepository: IStudentRepository = {
    getStudentDetailByUserId: jest.fn(async function (
      userId: string,
    ): Promise<Errorable<Omit<NonNullable<MeInfo['student']>, 'districtId' | 'organizationIds' | 'studentGroupIds'> | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: {
          id: 'student-id-1',
          userId: 'student-userId-1',
          nickName: 'student-nickName-1',
          studentLMSId: 'student-studentLMSId-1',
        },
      }
    }),
  }
  const successStudentGroupRepository: IStudentGroupRepository = {
    getById: jest.fn(async function (id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> {
      switch (id) {
        case 'studentGroup-id-1':
          return {
            hasError: false,
            error: null,
            value: {
              id: 'studentGroup-id-1',
              organizationId: 'organization-id-1',
              name: 'studentGroup-name-1',
              grade: 'studentGroup-grade-1',
              studentGroupLmsId: 'studentGroup-studentGroupLmsId-1',
              createdUserId: 'studentGroup-createdUserId-1',
              updatedUserId: 'studentGroup-updatedUserId-1',
              createdDate: 'studentGroup-createdDate-1',
              updatedDate: 'studentGroup-updatedDate-1',
            },
          }
        case 'studentGroup-id-2':
          return {
            hasError: false,
            error: null,
            value: {
              id: 'studentGroup-id-2',
              organizationId: 'organization-id-2',
              name: 'studentGroup-name-2',
              grade: 'studentGroup-grade-2',
              studentGroupLmsId: 'studentGroup-studentGroupLmsId-2',
              createdUserId: 'studentGroup-createdUserId-2',
              updatedUserId: 'studentGroup-updatedUserId-2',
              createdDate: 'studentGroup-createdDate-2',
              updatedDate: 'studentGroup-updatedDate-2',
            },
          }
        default:
          throw new Error(`unexpected id provided ${id}`)
      }
    }),
  }
  const successStudentStudentGroupRepository: IStudentStudentGroupRepository = {
    getAllByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<StudentStudentGroup[], E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: [
          {
            studentId: 'student-id-1',
            studentGroupId: 'studentGroup-id-1',
          },
          {
            studentId: 'student-id-1',
            studentGroupId: 'studentGroup-id-2',
          },
        ],
      }
    }),
  }

  test('test GetMeUseCase for internal operator- success', async () => {
    const usecase = new GetMeUseCase(
      successAdministratorRepository,
      successAdministratorDistrictRepository,
      successTeacherRepository,
      successOrganizationRepository,
      successTeacherOrganizationRepository,
      successStudentRepository,
      successStudentGroupRepository,
      successStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id-1',
      role: UserRoles.internalOperator,
      email: 'user1@email.com',
    })

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual<typeof result.value>({
      user: {
        id: 'requested-user-id',
        email: 'user1@email.com',
        loginId: 'login-id-1',
        role: UserRoles.internalOperator,
      },
    })
  })

  test('test GetMeUseCase for administrator- success', async () => {
    const usecase = new GetMeUseCase(
      successAdministratorRepository,
      successAdministratorDistrictRepository,
      successTeacherRepository,
      successOrganizationRepository,
      successTeacherOrganizationRepository,
      successStudentRepository,
      successStudentGroupRepository,
      successStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      email: 'user1@email.com',
      role: UserRoles.administrator,
    })

    expect(result.hasError).toEqual(false)

    const getMeSpy = successAdministratorRepository.getAdministratorDetailByUserId as jest.Mock

    expect(getMeSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.value).toEqual<typeof result.value>({
      user: {
        id: 'requested-user-id',
        email: 'user1@email.com',
        loginId: 'login-id',
        role: UserRoles.administrator,
      },
      administrator: {
        id: 'administrator-id-1',
        userId: 'administrator-userId-1',
        administratorLMSId: 'administrator-administratorLMSId-1',
        firstName: 'administrator-firstName-1',
        lastName: 'administrator-lastName-1',
        districtId: 'district-id-1',
      },
      teacher: undefined,
      student: undefined,
    })
  })

  test('test GetMeUseCase for teacher - success', async () => {
    const usecase = new GetMeUseCase(
      successAdministratorRepository,
      successAdministratorDistrictRepository,
      successTeacherRepository,
      successOrganizationRepository,
      successTeacherOrganizationRepository,
      successStudentRepository,
      successStudentGroupRepository,
      successStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      email: 'user1@email.com',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.hasError).toEqual(false)

    const getMeSpy = successTeacherRepository.getTeacherDetailByUserId as jest.Mock

    expect(getMeSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.value).toEqual<typeof result.value>({
      user: {
        id: 'requested-user-id',
        email: 'user1@email.com',
        loginId: 'login-id',
        role: UserRoles.teacher,
      },
      administrator: undefined,
      teacher: {
        id: 'teacher-id-1',
        userId: 'teacher-userId-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
        firstName: 'teacher-firstName-1',
        lastName: 'teacher-lastName-1',
        districtId: 'district-id-1',
        organizationIds: ['organization-id-1', 'organization-id-2'],
      },
      student: undefined,
    })
  })

  test('test GetMeUseCase for student - success', async () => {
    const usecase = new GetMeUseCase(
      successAdministratorRepository,
      successAdministratorDistrictRepository,
      successTeacherRepository,
      successOrganizationRepository,
      successTeacherOrganizationRepository,
      successStudentRepository,
      successStudentGroupRepository,
      successStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(false)

    const getMeSpy = successStudentRepository.getStudentDetailByUserId as jest.Mock

    expect(getMeSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.value).toEqual<typeof result.value>({
      user: {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.student,
      },
      administrator: undefined,
      teacher: undefined,
      student: {
        id: 'student-id-1',
        userId: 'student-userId-1',
        studentLMSId: 'student-studentLMSId-1',
        nickName: 'student-nickName-1',
        districtId: 'district-id-1',
        organizationIds: ['organization-id-1', 'organization-id-2'],
        studentGroupIds: ['studentGroup-id-1', 'studentGroup-id-2'],
      },
    })
  })

  const emptyAdministratorRepository: IAdministratorRepository = {
    getAdministratorDetailByUserId: jest.fn(async function (
      userId: string,
    ): Promise<Errorable<Omit<NonNullable<MeInfo['administrator']>, 'districtId'> | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }),
  }
  const emptyAdministratorDistrictRepository: IAdministratorDistrictRepository = {
    getAllByAdministratorId: jest.fn(async function (administaratorId: string): Promise<Errorable<AdministratorDistrict[], E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: [],
      }
    }),
  }
  const emptyTeacherRepository: ITeacherRepository = {
    getTeacherDetailByUserId: jest.fn(async function (
      userId: string,
    ): Promise<Errorable<Omit<NonNullable<MeInfo['teacher']>, 'districtId' | 'organizationIds'> | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }),
  }
  const emptyOrganizationRepository: IOrganizationRepository = {
    getOrganizationById: jest.fn(async function (organizationId: string): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }),
  }
  const emptyTeacherOrganizationRepository: ITeacherOrganizationRepository = {
    getAllByTeacherId: jest.fn(async function (teacherid: string): Promise<Errorable<TeacherOrganization[], E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: [],
      }
    }),
  }
  const emptyStudentRepository: IStudentRepository = {
    getStudentDetailByUserId: jest.fn(async function (
      userId: string,
    ): Promise<Errorable<Omit<NonNullable<MeInfo['student']>, 'districtId' | 'organizationIds' | 'studentGroupIds'> | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }),
  }
  const emptyStudentGroupRepository: IStudentGroupRepository = {
    getById: jest.fn(async function (id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }),
  }
  const emptyStudentStudentGroupRepository: IStudentStudentGroupRepository = {
    getAllByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<StudentStudentGroup[], E<'UnknownRuntimeError'>>> {
      return {
        hasError: false,
        error: null,
        value: [],
      }
    }),
  }

  test('When repository returns null for administrator', async () => {
    const usecase = new GetMeUseCase(
      emptyAdministratorRepository,
      emptyAdministratorDistrictRepository,
      emptyTeacherRepository,
      emptyOrganizationRepository,
      emptyTeacherOrganizationRepository,
      emptyStudentRepository,
      emptyStudentGroupRepository,
      emptyStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.administrator,
    })

    expect(result.error?.type).toEqual('UserNotFound')
  })

  test('When repository returns null for teacher', async () => {
    const usecase = new GetMeUseCase(
      emptyAdministratorRepository,
      emptyAdministratorDistrictRepository,
      emptyTeacherRepository,
      emptyOrganizationRepository,
      emptyTeacherOrganizationRepository,
      emptyStudentRepository,
      emptyStudentGroupRepository,
      emptyStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.teacher,
    })

    expect(result.error?.type).toEqual('UserNotFound')
  })

  test('When repository returns null for student', async () => {
    const usecase = new GetMeUseCase(
      emptyAdministratorRepository,
      emptyAdministratorDistrictRepository,
      emptyTeacherRepository,
      emptyOrganizationRepository,
      emptyTeacherOrganizationRepository,
      emptyStudentRepository,
      emptyStudentGroupRepository,
      emptyStudentStudentGroupRepository,
    )
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.error?.type).toEqual('UserNotFound')
  })
})
