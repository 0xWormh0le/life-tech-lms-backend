import { User } from '../../../entities/codex/User'
import { MaintenanceAdministrator } from '../../../entities/maintenance/Administrator'
import { MaintenanceStudent } from '../../../entities/maintenance/Student'
import { MaintenanceTeacher } from '../../../entities/maintenance/Teacher'
import { UserPerRole } from '../../../entities/maintenance/UserPerRole'
import { E, Errorable, wrapError } from '../../shared/Errors'

export interface IUserRepository {
  getAllUsers(): Promise<Errorable<User[], E<'UnknownRuntimeError'>>>
}

export interface IStudentRepository {
  getStudentByUserId(
    userId: string,
  ): Promise<Errorable<MaintenanceStudent | null, E<'UnknownRuntimeError'>>>
}

export interface ITeacherRepository {
  getTeacherByUserId(
    userId: string,
  ): Promise<Errorable<MaintenanceTeacher | null, E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<MaintenanceAdministrator | null, E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(): Promise<
    Errorable<
      (UserPerRole & { id: string; loginId: string; email: string })[],
      E<'UnknownRuntimeError'>
    >
  > {
    const getUsersResult = await this.userRepository.getAllUsers()

    if (getUsersResult.hasError) {
      switch (getUsersResult.error.type) {
        case 'UnknownRuntimeError': {
          return {
            hasError: true,
            error: wrapError(getUsersResult.error, 'failed to getAllUsers'),
            value: null,
          }
        }
      }
    }

    const usersPerRole: (UserPerRole & {
      id: string
      loginId: string
      email: string
    })[] = []

    for (const user of getUsersResult.value) {
      switch (user.role) {
        case 'student': {
          const getStudentResult =
            await this.studentRepository.getStudentByUserId(user.id)

          if (getStudentResult.hasError) {
            return getStudentResult
          }

          if (!getStudentResult.value) {
            usersPerRole.push({
              id: user.id,
              loginId: user.loginId ?? '',
              email: user.email ?? '',
              role: 'student',
              nickname: '',
              lmsId: null,
            })
            continue
          }
          usersPerRole.push({
            id: user.id,
            loginId: user.loginId ?? '',
            email: user.email ?? '',
            role: 'student',
            nickname: getStudentResult.value.nickname,
            lmsId: getStudentResult.value.lmsId,
          })
          break
        }
        case 'teacher': {
          const getTeacherResult =
            await this.teacherRepository.getTeacherByUserId(user.id)

          if (getTeacherResult.hasError) {
            return getTeacherResult
          }

          if (!getTeacherResult.value) {
            usersPerRole.push({
              id: user.id,
              loginId: user.loginId ?? '',
              email: user.email ?? '',
              role: 'teacher',
              firstName: '',
              lastName: '',
              lmsId: null,
            })
            continue
          }
          usersPerRole.push({
            id: user.id,
            loginId: user.loginId ?? '',
            email: user.email ?? '',
            role: 'teacher',
            firstName: getTeacherResult.value.firstName,
            lastName: getTeacherResult.value.lastName,
            lmsId: getTeacherResult.value.lmsId,
          })
          break
        }
        case 'administrator': {
          const getAdministratorResult =
            await this.administratorRepository.getAdministratorByUserId(user.id)

          if (getAdministratorResult.hasError) {
            return getAdministratorResult
          }

          if (!getAdministratorResult.value) {
            usersPerRole.push({
              id: user.id,
              loginId: user.loginId ?? '',
              email: user.email ?? '',
              role: 'administrator',
              firstName: '',
              lastName: '',
              lmsId: null,
            })
            continue
          }
          usersPerRole.push({
            id: user.id,
            loginId: user.loginId ?? '',
            email: user.email ?? '',
            role: 'administrator',
            firstName: getAdministratorResult.value.firstName,
            lastName: getAdministratorResult.value.lastName,
            lmsId: getAdministratorResult.value.lmsId,
          })
          break
        }
        case 'internalOperator':
          usersPerRole.push({
            id: user.id,
            loginId: user.loginId ?? '',
            email: user.email ?? '',
            role: 'internalOperator',
          })
          break
      }
    }

    return {
      hasError: false,
      error: null,
      value: usersPerRole,
    }
  }
}
