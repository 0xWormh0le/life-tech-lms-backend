import {
  CreateStudentsUseCase,
  IStudentGroupRepository,
  IUserRepository,
  IStudentRepository,
  IAdministratorRepository,
  ITeacherRepository,
  BadRequestEnum,
  StudentInfo,
} from './CreateStudentsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex/User'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { UserRoles } from '../../shared/Constants'
import { UserInfo } from '../Teacher/CreateTeachersUseCase'

const VALID_STUDENT_GROUP_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_GROUP_ID = 'student-id-00001'
const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'internalOperator',
}
const INVALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'student',
}
const VALID_INPUT_DATA: StudentInfo[] = [
  {
    nickName: 'parth',
    loginId: 'login-id-1',
    password: 'parth@123',
    emailsToNotify: ['parth@gmail.com', 'parekh@gmail.com'],
    studentLMSId: 'student-lms-1',
  },
  {
    nickName: 'chirag',
    loginId: 'login-id-2',
    password: 'chirag@123',
    emailsToNotify: ['chirag@gmail.com', 'parekh@gmail.com'],
    studentLMSId: 'student-lms-2',
  },
]
const INVALID_INPUT_DATA: StudentInfo[] = [
  {
    nickName: '',
    loginId: '',
    password: '',
    emailsToNotify: ['parth@gmail.com', 'parth@gmail.com'],
    studentLMSId: 'student-lms-1',
  },
  {
    nickName: 'chirag',
    loginId: 'login-id-3',
    password: 'chirag@123',
    emailsToNotify: ['parth@gmail.com', 'parth@gmail.com', '123@gmail.c'],
    studentLMSId: 'student-lms-2',
    email: 'student@gmail.com',
  },
  {
    nickName: 'parth',
    loginId: 'login-id-3',
    password: 'parth@123',
    studentLMSId: 'student-lms-2',
    email: 'student@gmail.com',
  },
  {
    nickName: '',
    loginId: '',
    password: '',
  },
  {
    nickName: '',
    loginId: 'login-id-4',
    password: 'parth@123',
    studentLMSId: '',
  },
  {
    nickName: 'user-4',
    loginId: 'login id',
    password: 'user-4',
    email: 'user1@gmail.com',
  },
]
const loginIds: string[] = [VALID_INPUT_DATA[0].loginId, VALID_INPUT_DATA[1].loginId]
const DISTRICT_ADMINISTRATOR: DistrictAdministrator = {
  userId: 'user-id-1',
  administratorId: 'administrator-id-1',
  email: 'administrator@gmail.com',
  createdDate: '',
  firstName: 'parth',
  lastName: 'parekh',
  administratorLMSId: 'lms-id-1',
  createdUserId: 'user-id-1',
  districtId: 'district-id-1',
}

describe('test CreateStudentsUseCase', () => {
  test('test CreateStudentsUseCase - success', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[loginIds]])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([[VALID_INPUT_DATA, VALID_USER_DATA.id, VALID_STUDENT_GROUP_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1', 'student-lms-2']]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('when studentGroupId student group not found', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'StudentGroupNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupNotFound',
            message: 'student group not found',
          },
          value: null,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentGroupNotFound')
    expect(result.value).toEqual(null)
  })

  test('when user provided invalid studentGroupId', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, INVALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentGroupId')
    expect(result.value).toEqual(null)
  })

  test('when Create students use case return InvalidStudentAttributes error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: ['student-lms-1'],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: ['login-id-3'],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ email: 'user1@gmail.com' }],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, INVALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-3', 'login-id-3', 'login-id-4', 'login id']]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1', 'student-lms-2', 'student-lms-2']]])

    const getUsersByEmailsRepoSpy = userRepository.getUsersByEmails as jest.Mock

    expect(getUsersByEmailsRepoSpy.mock.calls).toEqual([[['student@gmail.com', 'student@gmail.com', 'user1@gmail.com']]])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentAttributes')
    expect(result.error?.message).toEqual([
      {
        index: 0,
        message: ['nickNameNotProvided', 'duplicateEmail', 'studentLMSIdAlreadyExists'],
      },
      {
        index: 1,
        message: [
          'duplicateRecordsWithSameLoginId',
          'duplicateRecordsWithStudentLMSId',
          'duplicateRecordsWithSameEmail',
          'invalidEmail',
          'duplicateEmail',
          'loginIdAlreadyExists',
        ],
      },
      {
        index: 2,
        message: ['duplicateRecordsWithSameLoginId', 'duplicateRecordsWithStudentLMSId', 'duplicateRecordsWithSameEmail', 'loginIdAlreadyExists'],
      },
      {
        index: 3,
        message: ['nickNameNotProvided', 'atLeastOneFieldIsMandatory'],
      },
      { index: 4, message: ['nickNameNotProvided'] },
      {
        index: 5,
        message: ['loginIdSholdNotContainedWhiteSpace', 'userAlreadyExistWithEmail'],
      },
    ])

    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator or teacher - permission denied', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(INVALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('District administrator can only add students to his district only', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-5',
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: 'administrator' }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)
    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when administrator repository returns run time', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: 'administrator' }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: 'administrator' }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('when user repository findAlreadyExistsLoginId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[loginIds]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when user repository findAlreadyExistsLoginId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[loginIds]])

    const getUsersByEmailsRepoSpy = userRepository.getUsersByEmails as jest.Mock

    expect(getUsersByEmailsRepoSpy.mock.calls).toEqual([[[]]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when getDistrictIdByStudentGroupId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const studentGroupRepository: IStudentGroupRepository = {
      getDistrictIdByStudentGroupId: jest.fn(async function (studentGroupId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when getStudentGroupById method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occured',
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only add students to his organizations only', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { organizationId: 'organization-3' } as StudentGroup,
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

    const teacherRepository: ITeacherRepository = {
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
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getStudentGroupByIdSpy = studentGroupRepository.getStudentGroupById as jest.Mock

    expect(getStudentGroupByIdSpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository createStudents method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[loginIds]])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([[VALID_INPUT_DATA, VALID_USER_DATA.id, VALID_STUDENT_GROUP_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository findAlreadyExistsStudentLMSId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (
        data: StudentInfo[],
        createdUserId: string,
        studentGroupId: string,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (studentLMSIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }
    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[]): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
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
      getStudentGroupById: jest.fn(async function (studentGroupId: string): Promise<Errorable<StudentGroup, E<'UnknownRuntimeError'>>> {
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
          value: DISTRICT_ADMINISTRATOR,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new CreateStudentsUseCase(studentRepository, userRepository, studentGroupRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_GROUP_ID, VALID_INPUT_DATA)

    const studentGroupRepositorySpy = studentGroupRepository.getDistrictIdByStudentGroupId as jest.Mock

    expect(studentGroupRepositorySpy.mock.calls).toEqual([[VALID_STUDENT_GROUP_ID]])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[loginIds]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1', 'student-lms-2']]])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
