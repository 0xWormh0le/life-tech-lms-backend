import {
  CreateTeachersUseCase,
  ITeacherRepository,
  IUserRepository,
  TeacherInfo,
  UserInfo,
  BadRequestEnum,
  IAdministratorRepository,
  IOrganizationRepository,
} from './CreateTeachersUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Organizations } from '../../../entities/codex/Organization'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { Teacher, TeacherOrganization } from '../../../entities/codex/Teacher'

const VALID_ORGANIZATION_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_ORGANIZATION_ID = 'district-id-00001'

const VALID_INPUT_DATA: TeacherInfo[] = [
  {
    email: 'teacher1@email.com',
    firstName: 'teacher_first_name_1',
    lastName: 'teacher_last_name-1',
    teacherLMSId: 'teacher_lms_id_1',
    password: 'password_1',
  },
  {
    email: 'teacher2@email.com',
    firstName: 'teacher_first_name_2',
    lastName: 'teacher_last_name-2',
    teacherLMSId: 'teacher_lms_id_2',
    password: 'password_2',
  },
  {
    email: 'teacher3@email.com',
    password: 'password_3',
  },
]
let INVALID_INPUT_DATA: TeacherInfo[] = [
  {
    email: 'teacher2',
    firstName: 'teacher_first_name_2',
    lastName: 'teacher_last_name-2',
    teacherLMSId: 'teacher_lms_id_2',
    password: '',
  },
  {
    email: 'teacher2@email.com',
    firstName: 'teacher_first_name_2',
    lastName: 'teacher_last_name-2',
    teacherLMSId: 'teacher_lms_id_2',
    password: 'password_2',
  },
  {
    email: 'teacher3',
    password: 'password_3',
  },
]
let TEACHER_DATA = [
  {
    teacherId: '3333fd88-58f4-42f9-a6e8-3b2f90bf149c',
    userId: 'd346590c-bc29-486c-aac7-7bb100a61981',
    firstName: 'firstname',
    lastName: 'lastname',
    teacherLMSId: 'teacherlmsid',
    email: 'teacher@email.com',
    password: 'test',
    createdUserId: 'd346590c-bc29-486c-aac7-7bb100a61987',
    createdDate: '2022-05-17 11:28:47.940039',
  },
]

describe('Test CreateTeacherUseCase', () => {
  test('Test CreateTeacherUseCase - success', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(false)

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_INPUT_DATA, 'requested-user-id']])
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('Teacher can add another teacher in his organizations only', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherOrganizations: [{ name: 'Rcb', id: 'organization-1' }],
          } as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_INPUT_DATA,
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository getTeacherByUserId method returns teacher not found error', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_INPUT_DATA,
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository getTeacherByUserId method returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_INPUT_DATA,
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_INPUT_DATA, 'requested-user-id']])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator or administrator or teacher- permission denied', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },

      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to add the teachers.')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid emails returns invalid email error', async () => {
    INVALID_INPUT_DATA = [
      {
        email: 'teacher2',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name-2',
        password: 'test',
      },
      {
        email: 'teacher2@email.com',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name-2',
        password: 'password_2',
      },
      {
        email: 'teacher3',
        password: 'password_3',
      },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([
      {
        index: 0,
        message: [BadRequestEnum.emailInvalid],
      },
      {
        index: 2,
        message: [BadRequestEnum.emailInvalid],
      },
    ])
    expect(result.value).toEqual(null)
  })

  test('When provied organization is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'Organization not found',
          },
          value: null,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      VALID_INPUT_DATA,
    )

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('OrganizationNotFound')
    expect(result.error?.message).toEqual(`The specified organization not found for b9484b02-2d71-4b3f-afb0-57057843a59d`)
  })

  test('When provided invalid organizationId returns invalid error', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      INVALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const createTeachersSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeachersSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.error?.message).toEqual('Invalid organizationId')
    expect(result.value).toEqual(null)
  })

  test('When some of the provided emails are already exists in the user', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ email: 'teacher1@email.com' }, { email: 'teacher2@email.com' }],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      VALID_INPUT_DATA,
    )

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.userAlreadyExistWithEmail] },
      { index: 1, message: [BadRequestEnum.userAlreadyExistWithEmail] },
    ])
  })

  test('When duplicate emails are provided', async () => {
    INVALID_INPUT_DATA = [
      { email: 'teacher1@email.com', password: 'password' },
      { email: 'teacher2@email.com', password: 'password' },
      { email: 'teacher1@email.com', password: 'password' },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
      { index: 2, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
    ])
  })

  test('When some emails are not provided', async () => {
    INVALID_INPUT_DATA = [
      { email: '', password: 'password' },
      { email: 'teacher2@email.com', password: 'password' },
      { email: 'teacher1@email.com', password: 'password' },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([{ index: 0, message: [BadRequestEnum.emailNotProvided] }])
  })

  test('When fail to get organization data', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain(`failed to getOrganizationById 'b9484b02-2d71-4b3f-afb0-57057843a59d'`)
  })

  test('When organization data not found', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('OrganizationNotFound')
    expect(result.error?.message).toEqual(`The specified organization not found for b9484b02-2d71-4b3f-afb0-57057843a59d`)
  })

  test('When fail to load administrator data', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain('failed to getDistrictAdministratorByUserId requested-user-id')
  })

  test('When administrator is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.error?.message).toEqual('The specified administrator not found for requested-user-id')
  })

  test('When administrator is not from the same district id as organization', async () => {
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            administratorId: 'test_administratorId_1 administrator_id_1',
            userId: 'test_userId_1 user_id',
            email: 'test_email_1 email',
            firstName: 'test_firstName_1 first_name',
            lastName: 'test_lastName_1 last_name',
            administratorLMSId: 'test_administratorLMSId_1',
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            districtId: 'test_districtId_1',
          },
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'test_id_1',
            name: 'test_name_1',
            districtId: 'test_districtId_2',
            stateId: 'test_stateId_1',
            organizationLMSId: 'test_organizationLMSId_1',
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            updatedDate: 'test_updatedDate_1',
          },
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
  })

  test('When getting the unknown runtime error while fetcher the users data via email', async () => {
    INVALID_INPUT_DATA = [
      { email: '', password: 'password' },
      { email: 'teacher2@email.com', password: 'password' },
      { email: 'teacher1@email.com', password: 'password' },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain(`failed to getUsersByEmails for emails: 'teacher2@email.com, teacher1@email.com'`)
  })

  test('When getting the multiple errors while inserting bulk records', async () => {
    INVALID_INPUT_DATA = [
      { email: '', password: 'password' },
      { email: 'teacher2@email.com', password: 'password' },
      { email: 'teacher1@email.com', password: 'password' },
      { email: 'teacher1', password: 'password' },
      { email: 'teacher1', password: 'password' },
      { email: 'teacher2@email.com', password: 'password' },
      { email: 'teacher3@email.com', password: 'password' },
      { email: 'teacher4@email.com', password: 'password' },
      { email: 'teacher4@email.com', password: '' },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ email: 'teacher3@email.com' }, { email: 'teacher4@email.com' }],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.emailNotProvided] },
      { index: 1, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
      {
        index: 3,
        message: [BadRequestEnum.emailInvalid, BadRequestEnum.duplicateRecordsWithSameEmail],
      },
      {
        index: 4,
        message: [BadRequestEnum.emailInvalid, BadRequestEnum.duplicateRecordsWithSameEmail],
      },
      { index: 5, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
      { index: 6, message: [BadRequestEnum.userAlreadyExistWithEmail] },
      {
        index: 7,
        message: [BadRequestEnum.duplicateRecordsWithSameEmail, BadRequestEnum.userAlreadyExistWithEmail],
      },
      {
        index: 8,
        message: [BadRequestEnum.emptyPassword, BadRequestEnum.duplicateRecordsWithSameEmail, BadRequestEnum.userAlreadyExistWithEmail],
      },
    ])
  })

  test('When provided duplicate teacherLMSID returns invalid email error', async () => {
    INVALID_INPUT_DATA = [
      {
        email: 'teacher1@email.com',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name-2',
        password: 'test',
        teacherLMSId: 'LMS_ID_1',
      },
      {
        email: 'teacher2@email.com',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name-2',
        password: 'password_2',
        teacherLMSId: 'LMS_ID_1',
      },
      {
        email: 'teacher3@email.com',
        firstName: 'teacher_first_name_3',
        lastName: 'teacher_last_name-3',
        password: 'password_2',
        teacherLMSId: 'LMS_ID_1',
      },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([
      {
        index: 0,
        message: [BadRequestEnum.duplicateRecordsWithSameTeacherLMSId],
      },
      {
        index: 1,
        message: [BadRequestEnum.duplicateRecordsWithSameTeacherLMSId],
      },
      {
        index: 2,
        message: [BadRequestEnum.duplicateRecordsWithSameTeacherLMSId],
      },
    ])
    expect(result.value).toEqual(null)
  })

  test('When provided teacherLMSID already existing in the Database error', async () => {
    INVALID_INPUT_DATA = [
      {
        email: 'teacher1@email.com',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name-2',
        password: 'test',
        teacherLMSId: 'teacher_lms_id_1',
      },
      {
        email: 'teacher2@email.com',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name-2',
        password: 'password_2',
        teacherLMSId: 'teacher_lms_id_2',
      },
      {
        email: 'teacher3@email.com',
        firstName: 'teacher_first_name_3',
        lastName: 'teacher_last_name-3',
        password: 'password_2',
        teacherLMSId: 'teacher_lms_id_1',
      },
    ]
    TEACHER_DATA = [
      {
        teacherId: '3333fd88-58f4-42f9-a6e8-3b2f90bf149c',
        userId: 'd346590c-bc29-486c-aac7-7bb100a61981',
        firstName: 'firstname',
        lastName: 'lastname',
        teacherLMSId: 'teacher_lms_id_1',
        email: 'teacher@email.com',
        password: 'test',
        createdUserId: 'd346590c-bc29-486c-aac7-7bb100a61987',
        createdDate: '2022-05-17 11:28:47.940039',
      },
      {
        teacherId: '3333fd88-58f4-42f9-a6e8-3b2f90bf149c',
        userId: 'd346590c-bc29-486c-aac7-7bb100a61981',
        firstName: 'firstname',
        lastName: 'lastname',
        teacherLMSId: 'teacher_lms_id_2',
        email: 'teacher@email.com',
        password: 'test',
        createdUserId: 'd346590c-bc29-486c-aac7-7bb100a61987',
        createdDate: '2022-05-17 11:28:47.940039',
      },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_DATA,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const createTeacherSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeacherSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidTeacherAttributes')
    expect(result.error?.message).toEqual([
      {
        index: 0,
        message: [BadRequestEnum.duplicateRecordsWithSameTeacherLMSId, BadRequestEnum.userAlreadyExistWithTeacherLMSId],
      },
      {
        index: 1,
        message: [BadRequestEnum.userAlreadyExistWithTeacherLMSId],
      },
      {
        index: 2,
        message: [BadRequestEnum.duplicateRecordsWithSameTeacherLMSId, BadRequestEnum.userAlreadyExistWithTeacherLMSId],
      },
    ])
    expect(result.value).toEqual(null)
  })

  test('When getting the unknown runtime error while fetching the teacher data based on teacherLMSIds', async () => {
    INVALID_INPUT_DATA = [
      { email: '', password: 'password', teacherLMSId: 'teacher_lms_id_1' },
      {
        email: 'teacher2@email.com',
        password: 'password',
        teacherLMSId: 'teacher_lms_id_2',
      },
      {
        email: 'teacher1@email.com',
        password: 'password',
        teacherLMSId: 'teacher_lms_id_3',
      },
    ]

    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherLMSIds: jest.fn(async function (): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new CreateTeachersUseCase(teacherRepository, userRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },

      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain(`failed to getTeacherByTeacherLMSIds 'teacher_lms_id_1, teacher_lms_id_2, teacher_lms_id_3'`)
  })
})
