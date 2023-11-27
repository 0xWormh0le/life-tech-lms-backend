import { User } from '../../../entities/codex/User'
import { MaintenanceStudent } from '../../../entities/maintenance/Student'
import { MaintenanceTeacher } from '../../../entities/maintenance/Teacher'
import { MaintenanceAdministrator } from '../../../entities/maintenance/Administrator'
import { E, Errorable, ErrorTypes, ValueType } from '../../shared/Errors'
import {
  IUserRepository,
  IStudentRepository,
  ITeacherRepository,
  IAdministratorRepository,
  MaintenanceUpdateUsersUseCase,
} from './MaintenanceUpdateUsersUseCase'

describe('test MaintenanceUpdateUsersUseCase', () => {
  test('success', async () => {
    const userRepository: IUserRepository = {
      getUsers: jest.fn(async function (userIds: string[]): Promise<Errorable<User[], E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'user-id-1',
              role: 'student',
              loginId: 'user-login-id-1',
              email: 'user-email-id-1',
            },
            {
              id: 'user-id-2',
              role: 'teacher',
              loginId: 'user-login-id-2',
              email: 'user-email-id-2',
            },
            {
              id: 'user-id-3',
              role: 'administrator',
              loginId: 'user-login-id-3',
              email: 'user-email-id-3',
            },
            {
              id: 'user-id-4',
              role: 'internalOperator',
              loginId: 'user-login-id-4',
              email: 'user-email-id-4',
            },
            {
              id: 'user-id-5',
              role: 'student',
              loginId: 'user-login-id-5',
              email: 'user-email-id-5',
            },
            {
              id: 'user-id-6',
              role: 'teacher',
              loginId: 'user-login-id-6',
              email: 'user-email-id-6',
            },
            {
              id: 'user-id-7',
              role: 'administrator',
              loginId: 'user-login-id-7',
              email: 'user-email-id-7',
            },
            {
              id: 'user-id-8',
              role: 'internalOperator',
              loginId: 'user-login-id-8',
              email: 'user-email-id-8',
            },
          ],
        }
      }),
      updateUsers: jest.fn(async function (users: User[]): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
    }
    const studentRepository: IStudentRepository = {
      deleteStudentsByUserIds: jest.fn(async function (userIds: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
      createStudents: jest.fn(async function (
        students: (MaintenanceStudent & { userId: string })[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
      updateStudentsByUserIds: jest.fn(async function (
        students: (MaintenanceStudent & { userId: string })[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      deleteTeachersByUserIds: jest.fn(async function (userIds: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
      createTeachers: jest.fn(async function (
        teachers: (MaintenanceTeacher & { userId: string })[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
      updateTeachersByUserIds: jest.fn(async function (
        teachers: (MaintenanceTeacher & { userId: string })[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      deleteAdministratorsByUserIds: jest.fn(async function (userIds: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
      createAdministrators: jest.fn(async function (
        administrators: (MaintenanceAdministrator & { userId: string })[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
      updateAdministratorsByUserIds: jest.fn(async function (
        administrators: (MaintenanceAdministrator & { userId: string })[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
        return { hasError: false, error: null, value: undefined }
      }),
    }

    const usecase = new MaintenanceUpdateUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)

    const result = await usecase.run([
      {
        id: 'user-id-1',
        role: 'student',
        nickname: 'user-nickname-1',
        loginId: 'user-login-id-1',
        email: 'user-email-id-1',
        password: 'user-password-1',
        lmsId: 'user-lms-id-1',
      },
      {
        id: 'user-id-2',
        role: 'student', // Changed from teacher
        nickname: 'user-nickname-2',
        loginId: 'user-login-id-2',
        email: 'user-email-id-2',
        password: 'user-password-2',
        lmsId: 'user-lms-id-2',
      },
      {
        id: 'user-id-3',
        role: 'administrator',
        firstName: 'user-firstName-3',
        lastName: 'user-lastName-3',
        loginId: 'user-login-id-3',
        email: 'user-email-id-3',
        password: 'user-password-3',
        lmsId: 'user-lms-id-3',
      },
      {
        id: 'user-id-4',
        role: 'teacher', // Changed from internalOperator
        firstName: 'user-firstName-4',
        lastName: 'user-lastName-4',
        loginId: 'user-login-id-4',
        email: 'user-email-id-4',
        password: 'user-password-4',
        lmsId: 'user-lms-id-4',
      },
      {
        id: 'user-id-5',
        role: 'administrator', // Changed from student
        firstName: 'user-firstName-5',
        lastName: 'user-lastName-5',
        loginId: 'user-login-id-5',
        email: 'user-email-id-5',
        password: 'user-password-5',
        lmsId: 'user-lms-id-5',
      },
      {
        id: 'user-id-6',
        role: 'teacher',
        firstName: 'user-firstName-6',
        lastName: 'user-lastName-6',
        loginId: 'user-login-id-6',
        email: 'user-email-id-6',
        password: 'user-password-6',
        lmsId: 'user-lms-id-6',
      },
      {
        id: 'user-id-7',
        role: 'internalOperator', // Changed from administrator
        loginId: 'user-login-id-7',
        email: 'user-email-id-7',
        password: 'user-password-7',
      },
      {
        id: 'user-id-8',
        role: 'internalOperator',
        loginId: 'user-login-id-8',
        email: 'user-email-id-8',
        password: 'user-password-8',
      },
    ])

    expect(result.hasError).toEqual(false)

    const getUsersSpy = userRepository.getUsers as jest.Mock

    expect(getUsersSpy.mock.calls).toEqual([[['user-id-1', 'user-id-2', 'user-id-3', 'user-id-4', 'user-id-5', 'user-id-6', 'user-id-7', 'user-id-8']]])

    const deleteStudentsByUserIdsSpy = studentRepository.deleteStudentsByUserIds as jest.Mock

    expect(deleteStudentsByUserIdsSpy.mock.calls).toEqual([[['user-id-5']]])

    const createStudentsSpy = studentRepository.createStudents as jest.Mock

    expect(createStudentsSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-id-2',
            nickname: 'user-nickname-2',
            lmsId: 'user-lms-id-2',
          },
        ],
      ],
    ])

    const updateStudentsSpy = studentRepository.updateStudentsByUserIds as jest.Mock

    expect(updateStudentsSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-id-1',
            nickname: 'user-nickname-1',
            lmsId: 'user-lms-id-1',
          },
        ],
      ],
    ])

    const deleteTeachersByUserIdsSpy = teacherRepository.deleteTeachersByUserIds as jest.Mock

    expect(deleteTeachersByUserIdsSpy.mock.calls).toEqual([[['user-id-2']]])

    const createTeachersSpy = teacherRepository.createTeachers as jest.Mock

    expect(createTeachersSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-id-4',
            firstName: 'user-firstName-4',
            lastName: 'user-lastName-4',
            lmsId: 'user-lms-id-4',
          },
        ],
      ],
    ])

    const updateTeachersSpy = teacherRepository.updateTeachersByUserIds as jest.Mock

    expect(updateTeachersSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-id-6',
            firstName: 'user-firstName-6',
            lastName: 'user-lastName-6',
            lmsId: 'user-lms-id-6',
          },
        ],
      ],
    ])

    const deleteAdministratorsByUserIdsSpy = administratorRepository.deleteAdministratorsByUserIds as jest.Mock

    expect(deleteAdministratorsByUserIdsSpy.mock.calls).toEqual([[['user-id-7']]])

    const createAdministratorsSpy = administratorRepository.createAdministrators as jest.Mock

    expect(createAdministratorsSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-id-5',
            firstName: 'user-firstName-5',
            lastName: 'user-lastName-5',
            lmsId: 'user-lms-id-5',
          },
        ],
      ],
    ])

    const updateAdministratorsSpy = administratorRepository.updateAdministratorsByUserIds as jest.Mock

    expect(updateAdministratorsSpy.mock.calls).toEqual([
      [
        [
          {
            userId: 'user-id-3',
            firstName: 'user-firstName-3',
            lastName: 'user-lastName-3',
            lmsId: 'user-lms-id-3',
          },
        ],
      ],
    ])

    const updateUsersSpy = userRepository.updateUsers as jest.Mock

    expect(updateUsersSpy.mock.calls).toEqual([
      [
        [
          {
            id: 'user-id-1',
            role: 'student',
            loginId: 'user-login-id-1',
            email: 'user-email-id-1',
            password: 'user-password-1',
            lmsId: 'user-lms-id-1',
          },
          {
            id: 'user-id-2',
            role: 'student',
            loginId: 'user-login-id-2',
            email: 'user-email-id-2',
            password: 'user-password-2',
            lmsId: 'user-lms-id-2',
          },
          {
            id: 'user-id-3',
            role: 'administrator',
            loginId: 'user-login-id-3',
            email: 'user-email-id-3',
            password: 'user-password-3',
            lmsId: 'user-lms-id-3',
          },
          {
            id: 'user-id-4',
            role: 'teacher',
            loginId: 'user-login-id-4',
            email: 'user-email-id-4',
            password: 'user-password-4',
            lmsId: 'user-lms-id-4',
          },
          {
            id: 'user-id-5',
            role: 'administrator',
            loginId: 'user-login-id-5',
            email: 'user-email-id-5',
            password: 'user-password-5',
            lmsId: 'user-lms-id-5',
          },
          {
            id: 'user-id-6',
            role: 'teacher',
            loginId: 'user-login-id-6',
            email: 'user-email-id-6',
            password: 'user-password-6',
            lmsId: 'user-lms-id-6',
          },
          {
            id: 'user-id-7',
            role: 'internalOperator',
            loginId: 'user-login-id-7',
            email: 'user-email-id-7',
            password: 'user-password-7',
          },
          {
            id: 'user-id-8',
            role: 'internalOperator',
            loginId: 'user-login-id-8',
            email: 'user-email-id-8',
            password: 'user-password-8',
          },
        ],
      ],
    ])
    expect(result.value).toEqual([
      {
        id: 'user-id-1',
        role: 'student',
        nickname: 'user-nickname-1',
        loginId: 'user-login-id-1',
        email: 'user-email-id-1',
        password: 'user-password-1',
        lmsId: 'user-lms-id-1',
      },
      {
        id: 'user-id-2',
        role: 'student',
        nickname: 'user-nickname-2',
        loginId: 'user-login-id-2',
        email: 'user-email-id-2',
        password: 'user-password-2',
        lmsId: 'user-lms-id-2',
      },
      {
        id: 'user-id-3',
        role: 'administrator',
        firstName: 'user-firstName-3',
        lastName: 'user-lastName-3',
        loginId: 'user-login-id-3',
        email: 'user-email-id-3',
        password: 'user-password-3',
        lmsId: 'user-lms-id-3',
      },
      {
        id: 'user-id-4',
        role: 'teacher',
        firstName: 'user-firstName-4',
        lastName: 'user-lastName-4',
        loginId: 'user-login-id-4',
        email: 'user-email-id-4',
        password: 'user-password-4',
        lmsId: 'user-lms-id-4',
      },
      {
        id: 'user-id-5',
        role: 'administrator',
        firstName: 'user-firstName-5',
        lastName: 'user-lastName-5',
        loginId: 'user-login-id-5',
        email: 'user-email-id-5',
        password: 'user-password-5',
        lmsId: 'user-lms-id-5',
      },
      {
        id: 'user-id-6',
        role: 'teacher',
        firstName: 'user-firstName-6',
        lastName: 'user-lastName-6',
        loginId: 'user-login-id-6',
        email: 'user-email-id-6',
        password: 'user-password-6',
        lmsId: 'user-lms-id-6',
      },
      {
        id: 'user-id-7',
        role: 'internalOperator',
        loginId: 'user-login-id-7',
        email: 'user-email-id-7',
        password: 'user-password-7',
      },
      {
        id: 'user-id-8',
        role: 'internalOperator',
        loginId: 'user-login-id-8',
        email: 'user-email-id-8',
        password: 'user-password-8',
      },
    ])
  })

  type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T
  type ReturnValueType<T extends (...args: any) => any> = ValueType<Awaited<ReturnType<T>>>
  type ReturnErrorType<T extends (...args: any) => any> = ErrorTypes<Awaited<ReturnType<T>>>

  const testCases: {
    message: string
    errors: {
      getUsers?: ReturnErrorType<IUserRepository['getUsers']>
      updateUsers?: ReturnErrorType<IUserRepository['updateUsers']>
      createStudents?: ReturnErrorType<IStudentRepository['createStudents']>
      updateStudentsByUserIds?: ReturnErrorType<IStudentRepository['updateStudentsByUserIds']>
      deleteStudentsByUserIds?: ReturnErrorType<IStudentRepository['deleteStudentsByUserIds']>
      createTeachers?: ReturnErrorType<ITeacherRepository['createTeachers']>
      updateTeachersByUserIds?: ReturnErrorType<ITeacherRepository['updateTeachersByUserIds']>
      deleteTeachersByUserIds?: ReturnErrorType<ITeacherRepository['deleteTeachersByUserIds']>
      createAdministrators?: ReturnErrorType<IAdministratorRepository['createAdministrators']>
      updateAdministratorsByUserIds?: ReturnErrorType<IAdministratorRepository['updateAdministratorsByUserIds']>
      deleteAdministratorsByUserIds?: ReturnErrorType<IAdministratorRepository['deleteAdministratorsByUserIds']>
    }
    shouldCalledWith: {
      getUsers?: Parameters<IUserRepository['getUsers']>[]
      updateUsers?: Parameters<IUserRepository['updateUsers']>[]
      createStudents?: Parameters<IStudentRepository['createStudents']>[]
      updateStudentsByUserIds?: Parameters<IStudentRepository['updateStudentsByUserIds']>[]
      deleteStudentsByUserIds?: Parameters<IStudentRepository['deleteStudentsByUserIds']>[]
      createTeachers?: Parameters<ITeacherRepository['createTeachers']>[]
      updateTeachersByUserIds?: Parameters<ITeacherRepository['updateTeachersByUserIds']>[]
      deleteTeachersByUserIds?: Parameters<ITeacherRepository['deleteTeachersByUserIds']>[]
      createAdministrators?: Parameters<IAdministratorRepository['createAdministrators']>[]
      updateAdministratorsByUserIds?: Parameters<IAdministratorRepository['updateAdministratorsByUserIds']>[]
      deleteAdministratorsByUserIds?: Parameters<IAdministratorRepository['deleteAdministratorsByUserIds']>[]
    }
    resultValue: ReturnValueType<MaintenanceUpdateUsersUseCase['run']> | null
    resultError: ReturnErrorType<MaintenanceUpdateUsersUseCase['run']> | null
  }[] = [
    {
      message: 'getUsers spits UnknownRuntimeError',
      errors: {
        getUsers: 'UnknownRuntimeError',
      },
      shouldCalledWith: {
        getUsers: [[['user-id-1', 'user-id-2', 'user-id-3', 'user-id-4', 'user-id-5', 'user-id-6', 'user-id-7', 'user-id-8']]],
      },
      resultValue: null,
      resultError: 'UnknownRuntimeError',
    },
    {
      message: 'getUsers spits NotFoundError',
      errors: {
        getUsers: 'NotFoundError',
      },
      shouldCalledWith: {
        getUsers: [[['user-id-1', 'user-id-2', 'user-id-3', 'user-id-4', 'user-id-5', 'user-id-6', 'user-id-7', 'user-id-8']]],
      },
      resultValue: null,
      resultError: 'NotFoundError',
    },
  ]

  for (const testCase of testCases) {
    test(testCase.message, async () => {
      const userRepository: IUserRepository = {
        getUsers: jest.fn(async function (userIds: string[]): Promise<Errorable<User[], E<'UnknownRuntimeError'> | E<'NotFoundError'>>> {
          return testCase.errors.getUsers
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.getUsers,
                  message: `getUsers ${testCase.errors.getUsers}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: [],
              }
        }),
        updateUsers: jest.fn(async function (users: User[]): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>> {
          return testCase.errors.updateUsers
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.updateUsers,
                  message: `updateUsers ${testCase.errors.updateUsers}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
      }
      const studentRepository: IStudentRepository = {
        deleteStudentsByUserIds: jest.fn(async function (userIds: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
          return testCase.errors.deleteStudentsByUserIds
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.deleteStudentsByUserIds,
                  message: `deleteStudentsByUserIds ${testCase.errors.deleteStudentsByUserIds}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
        createStudents: jest.fn(async function (
          students: (MaintenanceStudent & { userId: string })[],
        ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
          return testCase.errors.createStudents
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.createStudents,
                  message: `createStudents ${testCase.errors.createStudents}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
        updateStudentsByUserIds: jest.fn(async function (
          students: (MaintenanceStudent & { userId: string })[],
        ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
          return testCase.errors.updateStudentsByUserIds
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.updateStudentsByUserIds,
                  message: `updateStudentsByUserIds ${testCase.errors.updateStudentsByUserIds}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
      }
      const teacherRepository: ITeacherRepository = {
        deleteTeachersByUserIds: jest.fn(async function (userIds: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
          return testCase.errors.deleteTeachersByUserIds
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.deleteTeachersByUserIds,
                  message: `deleteTeachersByUserIds ${testCase.errors.deleteTeachersByUserIds}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
        createTeachers: jest.fn(async function (
          teachers: (MaintenanceTeacher & { userId: string })[],
        ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
          return testCase.errors.createTeachers
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.createTeachers,
                  message: `createTeachers ${testCase.errors.createTeachers}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
        updateTeachersByUserIds: jest.fn(async function (
          teachers: (MaintenanceTeacher & { userId: string })[],
        ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
          return testCase.errors.updateTeachersByUserIds
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.updateTeachersByUserIds,
                  message: `updateTeachersByUserIds ${testCase.errors.updateTeachersByUserIds}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
      }
      const administratorRepository: IAdministratorRepository = {
        deleteAdministratorsByUserIds: jest.fn(async function (userIds: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
          return testCase.errors.deleteAdministratorsByUserIds
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.deleteAdministratorsByUserIds,
                  message: `deleteAdministratorsByUserIds ${testCase.errors.deleteAdministratorsByUserIds}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
        createAdministrators: jest.fn(async function (
          administrators: (MaintenanceAdministrator & { userId: string })[],
        ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
          return testCase.errors.createAdministrators
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.createAdministrators,
                  message: `createAdministrators ${testCase.errors.createAdministrators}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
        updateAdministratorsByUserIds: jest.fn(async function (
          administrators: (MaintenanceAdministrator & { userId: string })[],
        ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'NotFoundError', string>>> {
          return testCase.errors.updateAdministratorsByUserIds
            ? {
                hasError: true,
                error: {
                  type: testCase.errors.updateAdministratorsByUserIds,
                  message: `updateAdministratorsByUserIds ${testCase.errors.updateAdministratorsByUserIds}`,
                },
                value: null,
              }
            : {
                hasError: false,
                error: null,
                value: undefined,
              }
        }),
      }
      const usecase = new MaintenanceUpdateUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)

      const result = await usecase.run([
        {
          id: 'user-id-1',
          role: 'student',
          nickname: 'user-nickname-1',
          loginId: 'user-login-id-1',
          email: 'user-email-id-1',
          password: 'user-password-1',
          lmsId: 'user-lms-id-1',
        },
        {
          id: 'user-id-2',
          role: 'student',
          nickname: 'user-nickname-2',
          loginId: 'user-login-id-2',
          email: 'user-email-id-2',
          password: 'user-password-2',
          lmsId: 'user-lms-id-2',
        },
        {
          id: 'user-id-3',
          role: 'teacher',
          firstName: 'user-firstName-3',
          lastName: 'user-lastName-3',
          loginId: 'user-login-id-3',
          email: 'user-email-id-3',
          password: 'user-password-3',
          lmsId: 'user-lms-id-3',
        },
        {
          id: 'user-id-4',
          role: 'teacher',
          firstName: 'user-firstName-4',
          lastName: 'user-lastName-4',
          loginId: 'user-login-id-4',
          email: 'user-email-id-4',
          password: 'user-password-4',
          lmsId: 'user-lms-id-4',
        },
        {
          id: 'user-id-5',
          role: 'administrator',
          firstName: 'user-firstName-5',
          lastName: 'user-lastName-5',
          loginId: 'user-login-id-5',
          email: 'user-email-id-5',
          password: 'user-password-5',
          lmsId: 'user-lms-id-5',
        },
        {
          id: 'user-id-6',
          role: 'administrator',
          firstName: 'user-firstName-6',
          lastName: 'user-lastName-6',
          loginId: 'user-login-id-6',
          email: 'user-email-id-6',
          password: 'user-password-6',
          lmsId: 'user-lms-id-6',
        },
        {
          id: 'user-id-7',
          role: 'internalOperator',
          loginId: 'user-login-id-7',
          email: 'user-email-id-7',
          password: 'user-password-7',
        },
        {
          id: 'user-id-8',
          role: 'internalOperator',
          loginId: 'user-login-id-8',
          email: 'user-email-id-8',
          password: 'user-password-8',
        },
      ])

      expect(result.hasError).toEqual(!!testCase.resultError)
      expect(result.error?.type).toEqual(testCase.resultError)

      const getUsersSpy = userRepository.getUsers as jest.Mock

      expect(getUsersSpy.mock.calls).toEqual(testCase.shouldCalledWith.getUsers ?? [])

      const deleteStudentsByUserIdsSpy = studentRepository.deleteStudentsByUserIds as jest.Mock

      expect(deleteStudentsByUserIdsSpy.mock.calls).toEqual(testCase.shouldCalledWith.deleteStudentsByUserIds ?? [])

      const createStudentsSpy = studentRepository.createStudents as jest.Mock

      expect(createStudentsSpy.mock.calls).toEqual(testCase.shouldCalledWith.createStudents ?? [])

      const deleteTeachersByUserIdsSpy = teacherRepository.deleteTeachersByUserIds as jest.Mock

      expect(deleteTeachersByUserIdsSpy.mock.calls).toEqual(testCase.shouldCalledWith.deleteTeachersByUserIds ?? [])

      const createTeachersSpy = teacherRepository.createTeachers as jest.Mock

      expect(createTeachersSpy.mock.calls).toEqual(testCase.shouldCalledWith.createTeachers ?? [])

      const deleteAdministratorsByUserIdsSpy = administratorRepository.deleteAdministratorsByUserIds as jest.Mock

      expect(deleteAdministratorsByUserIdsSpy.mock.calls).toEqual(testCase.shouldCalledWith.deleteAdministratorsByUserIds ?? [])

      const createAdministratorsSpy = administratorRepository.createAdministrators as jest.Mock

      expect(createAdministratorsSpy.mock.calls).toEqual(testCase.shouldCalledWith.createAdministrators ?? [])

      const updateUsersSpy = userRepository.updateUsers as jest.Mock

      expect(updateUsersSpy.mock.calls).toEqual(testCase.shouldCalledWith.updateUsers ?? [])
    })
  }
})
