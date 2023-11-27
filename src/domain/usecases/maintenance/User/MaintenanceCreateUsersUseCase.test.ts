jest.mock('uuid', () => ({
  v4: jest.fn(() => 'user-uuid'),
}))

import { AuthenticationInfo } from '../../../entities/authentication/AuthenticationInfo'
import { User } from '../../../entities/codex/User'
import { MaintenanceStudent } from '../../../entities/maintenance/Student'
import { MaintenanceTeacher } from '../../../entities/maintenance/Teacher'
import { MaintenanceAdministrator } from '../../../entities/maintenance/Administrator'
import { E, Errorable } from '../../shared/Errors'
import {
  IUserRepository,
  IStudentRepository,
  ITeacherRepository,
  IAdministratorRepository,
  MaintenanceCreateUsersUseCase,
} from './MaintenanceCreateUsersUseCase'

describe('test MaintenanceCreateUsersUseCase', () => {
  test('success', async () => {
    const userRepository: IUserRepository = {
      createUsers: jest.fn(async function (users: (User & AuthenticationInfo)[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (students: MaintenanceStudent[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (teachers: MaintenanceTeacher[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      createAdministrators: jest.fn(async function (
        administrators: MaintenanceAdministrator[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usecase = new MaintenanceCreateUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)
    const result = await usecase.run([
      {
        role: 'student',
        loginId: 'user-login-id-1',
        lmsId: 'lms-id-1',
        email: 'user-email-id-1',
        password: 'user-password-id-1',
        nickname: 'user-nickname-1',
      },
      {
        role: 'teacher',
        loginId: 'user-login-id-2',
        lmsId: 'lms-id-2',
        email: 'user-email-id-2',
        password: 'user-password-id-2',
        firstName: 'user-first-name-2',
        lastName: 'user-last-name-2',
      },
      {
        role: 'administrator',
        loginId: 'user-login-id-3',
        lmsId: 'lms-id-3',
        email: 'user-email-id-3',
        password: 'user-password-id-3',
        firstName: 'user-first-name-3',
        lastName: 'user-last-name-3',
      },
      {
        role: 'internalOperator',
        loginId: 'user-login-id-4',
        email: 'user-email-id-4',
        password: 'user-password-id-4',
      },
      {
        role: 'student',
        loginId: 'user-login-id-5',
        lmsId: 'lms-id-5',
        email: 'user-email-id-5',
        password: 'user-password-id-5',
        nickname: 'user-nickname-5',
      },
      {
        role: 'teacher',
        loginId: 'user-login-id-6',
        lmsId: 'lms-id-6',
        email: 'user-email-id-6',
        password: 'user-password-id-6',
        firstName: 'user-first-name-6',
        lastName: 'user-last-name-6',
      },
      {
        role: 'administrator',
        loginId: 'user-login-id-7',
        lmsId: 'lms-id-7',
        email: 'user-email-id-7',
        password: 'user-password-id-7',
        firstName: 'user-first-name-7',
        lastName: 'user-last-name-7',
      },
      {
        role: 'internalOperator',
        loginId: 'user-login-id-8',
        email: 'user-email-id-8',
        password: 'user-password-id-8',
      },
    ])

    expect(result.hasError).toEqual(false)

    const createUsersSpy = userRepository.createUsers as jest.Mock

    expect(createUsersSpy.mock.calls).toEqual([
      [
        [
          {
            id: 'user-uuid',
            role: 'student',
            loginId: 'user-login-id-1',
            lmsId: 'lms-id-1',
            email: 'user-email-id-1',
            password: 'user-password-id-1',
            nickname: 'user-nickname-1',
          },
          {
            id: 'user-uuid',
            role: 'teacher',
            loginId: 'user-login-id-2',
            lmsId: 'lms-id-2',
            email: 'user-email-id-2',
            password: 'user-password-id-2',
            firstName: 'user-first-name-2',
            lastName: 'user-last-name-2',
          },
          {
            id: 'user-uuid',
            role: 'administrator',
            loginId: 'user-login-id-3',
            lmsId: 'lms-id-3',
            email: 'user-email-id-3',
            password: 'user-password-id-3',
            firstName: 'user-first-name-3',
            lastName: 'user-last-name-3',
          },
          {
            id: 'user-uuid',
            role: 'internalOperator',
            loginId: 'user-login-id-4',
            email: 'user-email-id-4',
            password: 'user-password-id-4',
          },
          {
            id: 'user-uuid',
            role: 'student',
            loginId: 'user-login-id-5',
            lmsId: 'lms-id-5',
            email: 'user-email-id-5',
            password: 'user-password-id-5',
            nickname: 'user-nickname-5',
          },
          {
            id: 'user-uuid',
            role: 'teacher',
            loginId: 'user-login-id-6',
            lmsId: 'lms-id-6',
            email: 'user-email-id-6',
            password: 'user-password-id-6',
            firstName: 'user-first-name-6',
            lastName: 'user-last-name-6',
          },
          {
            id: 'user-uuid',
            role: 'administrator',
            loginId: 'user-login-id-7',
            lmsId: 'lms-id-7',
            email: 'user-email-id-7',
            password: 'user-password-id-7',
            firstName: 'user-first-name-7',
            lastName: 'user-last-name-7',
          },
          {
            id: 'user-uuid',
            role: 'internalOperator',
            loginId: 'user-login-id-8',
            email: 'user-email-id-8',
            password: 'user-password-id-8',
          },
        ],
      ],
    ])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-uuid',
            nickname: 'user-nickname-1',
            lmsId: 'lms-id-1',
          },
          {
            userId: 'user-uuid',
            nickname: 'user-nickname-5',
            lmsId: 'lms-id-5',
          },
        ],
      ],
    ])

    const createTeachersSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeachersSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-uuid',
            firstName: 'user-first-name-2',
            lastName: 'user-last-name-2',
            lmsId: 'lms-id-2',
          },
          {
            userId: 'user-uuid',
            firstName: 'user-first-name-6',
            lastName: 'user-last-name-6',
            lmsId: 'lms-id-6',
          },
        ],
      ],
    ])

    const createAdministratorsSpy = administratorRepository.createAdministrators as jest.Mock

    expect(createAdministratorsSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-uuid',
            firstName: 'user-first-name-3',
            lastName: 'user-last-name-3',
            lmsId: 'lms-id-3',
          },
          {
            userId: 'user-uuid',
            firstName: 'user-first-name-7',
            lastName: 'user-last-name-7',
            lmsId: 'lms-id-7',
          },
        ],
      ],
    ])

    expect(result.value).toEqual([
      {
        id: 'user-uuid',
        role: 'student',
        loginId: 'user-login-id-1',
        lmsId: 'lms-id-1',
        email: 'user-email-id-1',
        password: 'user-password-id-1',
        nickname: 'user-nickname-1',
      },
      {
        id: 'user-uuid',
        role: 'teacher',
        loginId: 'user-login-id-2',
        lmsId: 'lms-id-2',
        email: 'user-email-id-2',
        password: 'user-password-id-2',
        firstName: 'user-first-name-2',
        lastName: 'user-last-name-2',
      },
      {
        id: 'user-uuid',
        role: 'administrator',
        loginId: 'user-login-id-3',
        lmsId: 'lms-id-3',
        email: 'user-email-id-3',
        password: 'user-password-id-3',
        firstName: 'user-first-name-3',
        lastName: 'user-last-name-3',
      },
      {
        id: 'user-uuid',
        role: 'internalOperator',
        loginId: 'user-login-id-4',
        email: 'user-email-id-4',
        password: 'user-password-id-4',
      },
      {
        id: 'user-uuid',
        role: 'student',
        loginId: 'user-login-id-5',
        lmsId: 'lms-id-5',
        email: 'user-email-id-5',
        password: 'user-password-id-5',
        nickname: 'user-nickname-5',
      },
      {
        id: 'user-uuid',
        role: 'teacher',
        loginId: 'user-login-id-6',
        lmsId: 'lms-id-6',
        email: 'user-email-id-6',
        password: 'user-password-id-6',
        firstName: 'user-first-name-6',
        lastName: 'user-last-name-6',
      },
      {
        id: 'user-uuid',
        role: 'administrator',
        loginId: 'user-login-id-7',
        lmsId: 'lms-id-7',
        email: 'user-email-id-7',
        password: 'user-password-id-7',
        firstName: 'user-first-name-7',
        lastName: 'user-last-name-7',
      },
      {
        id: 'user-uuid',
        role: 'internalOperator',
        loginId: 'user-login-id-8',
        email: 'user-email-id-8',
        password: 'user-password-id-8',
      },
    ])
  })

  test('some of given Users already exiest', async () => {
    const userRepository: IUserRepository = {
      createUsers: jest.fn(async function (users: (User & AuthenticationInfo)[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'already exists',
          },
          value: null,
        }
      }),
    }
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (students: MaintenanceStudent[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (teachers: MaintenanceTeacher[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      createAdministrators: jest.fn(async function (
        administrators: MaintenanceAdministrator[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usecase = new MaintenanceCreateUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)
    const result = await usecase.run([
      {
        role: 'student',
        loginId: 'user-login-id-1',
        lmsId: 'lms-id-1',
        email: 'user-email-id-1',
        password: 'user-password-id-1',
        nickname: 'user-nickname-1',
      },
      {
        role: 'teacher',
        loginId: 'user-login-id-2',
        lmsId: 'lms-id-2',
        email: 'user-email-id-2',
        password: 'user-password-id-2',
        firstName: '',
        lastName: '',
      },
    ])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistError')

    const getLessonsByPackageIdSpy = userRepository.createUsers as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([
      [
        [
          {
            id: 'user-uuid',
            role: 'student',
            loginId: 'user-login-id-1',
            lmsId: 'lms-id-1',
            email: 'user-email-id-1',
            password: 'user-password-id-1',
            nickname: 'user-nickname-1',
          },
          {
            id: 'user-uuid',
            role: 'teacher',
            loginId: 'user-login-id-2',
            lmsId: 'lms-id-2',
            email: 'user-email-id-2',
            password: 'user-password-id-2',
            firstName: '',
            lastName: '',
          },
        ],
      ],
    ])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([])

    const createTeachersSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeachersSpy.mock.calls).toEqual([])

    const createAdministratorsSpy = administratorRepository.createAdministrators as jest.Mock

    expect(createAdministratorsSpy.mock.calls).toEqual([])
  })

  test('the repository returns unknown runtime error', async () => {
    const userRepository: IUserRepository = {
      createUsers: jest.fn(async function (users: (User & AuthenticationInfo)[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'Something wrong happened',
          },
          value: null,
        }
      }),
    }
    const studentRepository: IStudentRepository = {
      createStudents: jest.fn(async function (students: MaintenanceStudent[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      createTeachers: jest.fn(async function (teachers: MaintenanceTeacher[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      createAdministrators: jest.fn(async function (
        administrators: MaintenanceAdministrator[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    const usecase = new MaintenanceCreateUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)
    const result = await usecase.run([
      {
        role: 'student',
        loginId: 'user-login-id-1',
        lmsId: 'lms-id-1',
        email: 'user-email-id-1',
        password: 'user-password-id-1',
        nickname: 'user-nickname-1',
      },
      {
        role: 'teacher',
        loginId: 'user-login-id-2',
        lmsId: 'lms-id-2',
        email: 'user-email-id-2',
        password: 'user-password-id-2',
        firstName: '',
        lastName: '',
      },
    ])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getLessonsByPackageIdSpy = userRepository.createUsers as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([
      [
        [
          {
            id: 'user-uuid',
            role: 'student',
            loginId: 'user-login-id-1',
            lmsId: 'lms-id-1',
            email: 'user-email-id-1',
            password: 'user-password-id-1',
            nickname: 'user-nickname-1',
          },
          {
            id: 'user-uuid',
            role: 'teacher',
            loginId: 'user-login-id-2',
            lmsId: 'lms-id-2',
            email: 'user-email-id-2',
            password: 'user-password-id-2',
            firstName: '',
            lastName: '',
          },
        ],
      ],
    ])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([])

    const createTeachersSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeachersSpy.mock.calls).toEqual([])

    const createAdministratorsSpy = administratorRepository.createAdministrators as jest.Mock

    expect(createAdministratorsSpy.mock.calls).toEqual([])
  })
})
