import { User } from '../../../entities/codex/User'
import { MaintenanceStudent } from '../../../entities/maintenance/Student'
import { MaintenanceTeacher } from '../../../entities/maintenance/Teacher'
import { MaintenanceAdministrator } from '../../../entities/maintenance/Administrator'
import { UserPerRole } from '../../../entities/maintenance/UserPerRole'
import { E, Errorable } from '../../shared/Errors'
import { IUserRepository, IStudentRepository, ITeacherRepository, IAdministratorRepository, MaintenanceGetUsersUseCase } from './MaintenanceGetUsersUseCase'

describe('test MaintenanceGetUsersUseCase', () => {
  test('success', async () => {
    const userRepository: IUserRepository = {
      getAllUsers: jest.fn(async function (): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'user-id-success-1',
              loginId: 'user-login-id-1',
              email: 'user-email-1',
              role: 'student',
            },
            {
              id: 'user-id-success-2',
              loginId: 'user-login-id-2',
              email: 'user-email-2',
              role: 'teacher',
            },
            {
              id: 'user-id-success-3',
              loginId: 'user-login-id-3',
              email: 'user-email-3',
              role: 'administrator',
            },
            {
              id: 'user-id-success-4',
              loginId: 'user-login-id-4',
              email: 'user-email-4',
              role: 'internalOperator',
            },
            {
              id: 'user-id-success-5',
              loginId: 'user-login-id-5',
              email: 'user-email-5',
              role: 'student',
            },
            {
              id: 'user-id-success-6',
              loginId: 'user-login-id-6',
              email: 'user-email-6',
              role: 'teacher',
            },
            {
              id: 'user-id-success-7',
              loginId: 'user-login-id-7',
              email: 'user-email-7',
              role: 'administrator',
            },
            {
              id: 'user-id-success-8',
              loginId: 'user-login-id-8',
              email: 'user-email-8',
              role: 'internalOperator',
            },
          ],
        }
      }),
    }
    const studentRepository: IStudentRepository = {
      getStudentByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceStudent | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            nickname: `student-nickname-${userId}`,
            lmsId: `student-lms-id-${userId}`,
          },
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceTeacher | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: `teacher-firstName-${userId}`,
            lastName: `teacher-lastName-${userId}`,
            lmsId: `teacher-lms-id-${userId}`,
          },
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceAdministrator | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: `administrator-firstName-${userId}`,
            lastName: `administrator-lastName-${userId}`,
            lmsId: `administrator-lms-id-${userId}`,
          },
        }
      }),
    }
    const usecase = new MaintenanceGetUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)

    const getAllUsersSpy = userRepository.getAllUsers as jest.Mock

    expect(getAllUsersSpy.mock.calls).toEqual([[]])

    const getStudentByUserIdSpy = studentRepository.getStudentByUserId as jest.Mock

    expect(getStudentByUserIdSpy.mock.calls).toEqual([['user-id-success-1'], ['user-id-success-5']])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['user-id-success-2'], ['user-id-success-6']])

    const getAdministratorByUserIdSpy = administratorRepository.getAdministratorByUserId as jest.Mock

    expect(getAdministratorByUserIdSpy.mock.calls).toEqual([['user-id-success-3'], ['user-id-success-7']])

    expect(result.value).toEqual<(UserPerRole & { id: string; loginId: string; email: string })[]>([
      {
        id: 'user-id-success-1',
        loginId: 'user-login-id-1',
        email: 'user-email-1',
        role: 'student',
        nickname: 'student-nickname-user-id-success-1',
        lmsId: 'student-lms-id-user-id-success-1',
      },
      {
        id: 'user-id-success-2',
        loginId: 'user-login-id-2',
        email: 'user-email-2',
        role: 'teacher',
        firstName: 'teacher-firstName-user-id-success-2',
        lastName: 'teacher-lastName-user-id-success-2',
        lmsId: 'teacher-lms-id-user-id-success-2',
      },
      {
        id: 'user-id-success-3',
        loginId: 'user-login-id-3',
        email: 'user-email-3',
        role: 'administrator',
        firstName: 'administrator-firstName-user-id-success-3',
        lastName: 'administrator-lastName-user-id-success-3',
        lmsId: 'administrator-lms-id-user-id-success-3',
      },
      {
        id: 'user-id-success-4',
        loginId: 'user-login-id-4',
        email: 'user-email-4',
        role: 'internalOperator',
      },
      {
        id: 'user-id-success-5',
        loginId: 'user-login-id-5',
        email: 'user-email-5',
        role: 'student',
        nickname: 'student-nickname-user-id-success-5',
        lmsId: 'student-lms-id-user-id-success-5',
      },
      {
        id: 'user-id-success-6',
        loginId: 'user-login-id-6',
        email: 'user-email-6',
        role: 'teacher',
        firstName: 'teacher-firstName-user-id-success-6',
        lastName: 'teacher-lastName-user-id-success-6',
        lmsId: 'teacher-lms-id-user-id-success-6',
      },
      {
        id: 'user-id-success-7',
        loginId: 'user-login-id-7',
        email: 'user-email-7',
        role: 'administrator',
        firstName: 'administrator-firstName-user-id-success-7',
        lastName: 'administrator-lastName-user-id-success-7',
        lmsId: 'administrator-lms-id-user-id-success-7',
      },
      {
        id: 'user-id-success-8',
        loginId: 'user-login-id-8',
        email: 'user-email-8',
        role: 'internalOperator',
      },
    ])
  })

  test('there is no User', async () => {
    const userRepository: IUserRepository = {
      getAllUsers: jest.fn(async function (): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const studentRepository: IStudentRepository = {
      getStudentByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceStudent | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            nickname: `student-nickname-${userId}`,
            lmsId: `student-lms-id-${userId}`,
          },
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceTeacher | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: `teacher-firstName-${userId}`,
            lastName: `teacher-lastName-${userId}`,
            lmsId: `teacher-lms-id-${userId}`,
          },
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceAdministrator | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: `administrator-firstName-${userId}`,
            lastName: `administrator-lastName-${userId}`,
            lmsId: `administrator-lms-id-${userId}`,
          },
        }
      }),
    }
    const usecase = new MaintenanceGetUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)

    const result = await usecase.run()

    // Should succeed
    expect(result.hasError).toEqual(false)

    const getAllUsersSpy = userRepository.getAllUsers as jest.Mock

    expect(getAllUsersSpy.mock.calls).toEqual([[]])

    const getStudentByUserIdSpy = studentRepository.getStudentByUserId as jest.Mock

    expect(getStudentByUserIdSpy.mock.calls).toEqual([])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([])

    const getAdministratorByUserIdSpy = administratorRepository.getAdministratorByUserId as jest.Mock

    expect(getAdministratorByUserIdSpy.mock.calls).toEqual([])

    // Should return empty array
    expect(result.value).toEqual<User[]>([])
  })

  test('the repository returns unknown runtime error', async () => {
    const userRepository: IUserRepository = {
      getAllUsers: jest.fn(async function (): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'Unkown error',
          },
          value: null,
        }
      }),
    }
    const studentRepository: IStudentRepository = {
      getStudentByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceStudent | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            nickname: `student-nickname-${userId}`,
            lmsId: `student-lms-id-${userId}`,
          },
        }
      }),
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceTeacher | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: `teacher-firstName-${userId}`,
            lastName: `teacher-lastName-${userId}`,
            lmsId: `teacher-lms-id-${userId}`,
          },
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<MaintenanceAdministrator | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: `administrator-firstName-${userId}`,
            lastName: `administrator-lastName-${userId}`,
            lmsId: `administrator-lms-id-${userId}`,
          },
        }
      }),
    }
    const usecase = new MaintenanceGetUsersUseCase(userRepository, studentRepository, teacherRepository, administratorRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getAllUsersSpy = userRepository.getAllUsers as jest.Mock

    expect(getAllUsersSpy.mock.calls).toEqual([[]])

    const getStudentByUserIdSpy = studentRepository.getStudentByUserId as jest.Mock

    expect(getStudentByUserIdSpy.mock.calls).toEqual([])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([])

    const getAdministratorByUserIdSpy = administratorRepository.getAdministratorByUserId as jest.Mock

    expect(getAdministratorByUserIdSpy.mock.calls).toEqual([])
  })
})
