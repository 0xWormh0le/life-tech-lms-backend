import { UpdateStudentUseCase, IUserRepository, IStudentRepository, IAdministratorRepository, ITeacherRepository, StudentInfo } from './UpdateStudentUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex/User'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { OrgnaizationsList, TeacherOrganization } from '../../../entities/codex/Teacher'
import { UserRoles } from '../../shared/Constants'
import { UserInfo } from '../Teacher/CreateTeachersUseCase'

const VALID_STUDENT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_STUDENT_ID = 'student-id-00001'
const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'internalOperator',
}
const INVALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'teacher',
}
const VALID_INPUT_DATA: StudentInfo = {
  nickName: 'parth',
  loginId: 'login-id-1',
  password: 'parth@123',
  emailsToNotify: ['parth@gmail.com', 'parekh@gmail.com'],
  email: 'parth@gmail.com',
  studentLMSId: 'student-lms-1',
}

describe('test UpdateStudentUseCase', () => {
  test('test UpdateStudentUseCase - success', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([[VALID_STUDENT_ID, VALID_INPUT_DATA]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('when requested student id not found', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'StudentNotFoundError'>>> {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'student not found',
          },
          value: null,
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('when user provided invalid studentId', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, INVALID_STUDENT_ID, VALID_INPUT_DATA)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentId')
    expect(result.value).toEqual(null)
  })

  test('when student data has loginId and LMSId AlreadyExists', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (
        studentLMSIds: string[],
        studentId?: string,
      ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: ['student-lms-2'],
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[], studentId?: string): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: ['login-id-2'],
        }
      }),
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ email: 'parth@gmail.com' }],
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, {
      nickName: 'parth',
      loginId: 'login-id-2',
      password: 'parth@123',
      studentLMSId: 'student-lms-2',
      email: 'parth@gmail.com',
    })

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-2'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-2'], VALID_STUDENT_ID]])

    const getUsersByEmailsRepoSpy = userRepository.getUsersByEmails as jest.Mock

    expect(getUsersByEmailsRepoSpy.mock.calls).toEqual([[['parth@gmail.com'], VALID_STUDENT_ID]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistsError')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('loginIdAlreadyExists,studentLMSIdAlreadyExists,userAlreadyExistWithEmail')
  })

  test('when student data has LMSId AlreadyExists', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (
        studentLMSIds: string[],
        studentId?: string,
      ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: ['student-lms-2'],
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[], studentId?: string): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, {
      nickName: 'parth',
      loginId: 'login-id-2',
      password: 'parth@123',
      studentLMSId: 'student-lms-2',
    })

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-2'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-2'], VALID_STUDENT_ID]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistsError')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('studentLMSIdAlreadyExists')
  })

  test('when student data has email AlreadyExists', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (
        studentLMSIds: string[],
        studentId?: string,
      ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[], studentId?: string): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
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
          value: [{ email: 'parth@gmail.com' }],
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, {
      nickName: 'parth',
      loginId: 'login-id-2',
      password: 'parth@123',
      studentLMSId: 'student-lms-2',
      email: 'parth@gmail.com',
    })

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-2'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-2'], VALID_STUDENT_ID]])

    const getUsersByEmailsRepoSpy = userRepository.getUsersByEmails as jest.Mock

    expect(getUsersByEmailsRepoSpy.mock.calls).toEqual([[['parth@gmail.com'], VALID_STUDENT_ID]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistsError')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('userAlreadyExistWithEmail')
  })

  test('when student data has invalid email or duplicate email or nickname not provided', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, {
      nickName: '  ',
      loginId: '',
      password: 'parth@123',
      email: '',
      studentLMSId: '',
      emailsToNotify: ['parth', 'parth@gmail.com', 'parth@gmail.com'],
    })

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentAttributes')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('nickNameNotProvided,invalidEmail,duplicateEmail,atLeastOneFieldIsMandatory')
  })

  test('when student data has invalid email or duplicate email or nickname not provided or studentLmsId not contain only whitespaces', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, {
      nickName: '  ',
      loginId: 'Parth',
      password: 'parth@123',
      email: '',
      studentLMSId: '  ',
      emailsToNotify: ['parth', 'parth@gmail.com', 'parth@gmail.com'],
    })

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentAttributes')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('nickNameNotProvided,invalidEmail,duplicateEmail,studentLmsIdNotProvided')
  })

  test('when student data has duplicateEmail', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (
        studentLMSIds: string[],
        studentId?: string,
      ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[], studentId?: string): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, {
      nickName: 'parth',
      loginId: 'login-id-2',
      password: 'parth@123',
      studentLMSId: 'student-lms-2',
      emailsToNotify: ['parth@gmail.com', 'parth@gmail.com'],
    })

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-2'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-2'], VALID_STUDENT_ID]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidStudentAttributes')
    expect(result.value).toEqual(null)
    expect(result.error?.message).toEqual('duplicateEmail')
  })

  test('student will not allowed to edit student information - permission denied', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.student }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('District administrator can only edit student information to his district only', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: 'district-id-2',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            userId: 'user-id-1',
            administratorId: 'administrator-id-1',
            email: 'administrator@gmail.com',
            createdDate: '',
            firstName: 'parth',
            lastName: 'parekh',
            administratorLMSId: 'lms-id-1',
            createdUserId: 'user-id-1',
            districtId: 'district-id-1',
          } as DistrictAdministrator,
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('when administrator repository returns runtime error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when district id not found of student', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getDistrictIdByStudentIdSpy = studentRepository.getDistrictIdByStudentId as jest.Mock

    expect(getDistrictIdByStudentIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when user repository findAlreadyExistsLoginId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when user repository getUsersByEmails method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (
        studentLMSIds: string[],
        studentId?: string,
      ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[], studentId?: string): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const findAlreadyExistsLoginIdRepoSpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(findAlreadyExistsLoginIdRepoSpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[[VALID_INPUT_DATA.studentLMSId], VALID_STUDENT_ID]])

    const getUsersByEmailsRepoSpy = userRepository.getUsersByEmails as jest.Mock

    expect(getUsersByEmailsRepoSpy.mock.calls).toEqual([[[VALID_INPUT_DATA.email], VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository findAlreadyExistsStudentLMSId method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAlreadyExistsStudentLMSId: jest.fn(async function (
        studentLMSIds: string[],
        studentId?: string,
      ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const userRepository: IUserRepository = {
      findAlreadyExistsLoginId: jest.fn(async function (loginIds: string[], studentId?: string): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when getStudentOrganizationsById method returns student not found error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('StudentNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('when getStudentOrganizationsById method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only update student of his organizations', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ name: 'CSK', id: 'organization-1' }],
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
            teacherOrganizations: [{ name: 'Rcb', id: 'organization-2' }],
          } as TeacherOrganization,
        }
      }),
    }
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ name: 'RCB', id: 'organization-1' }],
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ name: 'RCB', id: 'organization-1' }],
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const getStudentOrganizationsByIdSpy = studentRepository.getStudentOrganizationsById as jest.Mock

    expect(getStudentOrganizationsByIdSpy.mock.calls).toEqual([[VALID_STUDENT_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when student repository updateStudent method returns run time error', async () => {
    const studentRepository: IStudentRepository = {
      updateStudent: jest.fn(async function (studentId: string, data: StudentInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
      getDistrictIdByStudentId: jest.fn(async function (studentId: string): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: '',
        }
      }),
      getStudentOrganizationsById: jest.fn(async function (studentId: string): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateStudentUseCase(studentRepository, districtAdministratorRepositroy, userRepository, teacherRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_STUDENT_ID, VALID_INPUT_DATA)

    const userRepositorySpy = userRepository.findAlreadyExistsLoginId as jest.Mock

    expect(userRepositorySpy.mock.calls).toEqual([[['login-id-1'], VALID_STUDENT_ID]])

    const findAlreadyExistsStudentLMSIdRepoSpy = studentRepository.findAlreadyExistsStudentLMSId as jest.Mock

    expect(findAlreadyExistsStudentLMSIdRepoSpy.mock.calls).toEqual([[['student-lms-1'], VALID_STUDENT_ID]])

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([])

    const updateStudentSpy = studentRepository.updateStudent as jest.Mock

    expect(updateStudentSpy.mock.calls).toEqual([[VALID_STUDENT_ID, VALID_INPUT_DATA]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
