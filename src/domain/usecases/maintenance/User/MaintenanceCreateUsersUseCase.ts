import { v4 as uuidv4 } from 'uuid'

import { E, Errorable, wrapError } from '../../shared/Errors'
import { AuthenticationInfo } from '../../../entities/authentication/AuthenticationInfo'
import { User, UserRole } from '../../../entities/codex/User'
import { MaintenanceStudent } from '../../../entities/maintenance/Student'
import { MaintenanceTeacher } from '../../../entities/maintenance/Teacher'
import { MaintenanceAdministrator } from '../../../entities/maintenance/Administrator'
import { UserPerRole } from '../../../entities/maintenance/UserPerRole'

export interface IUserRepository {
  createUsers(
    users: (User & AuthenticationInfo)[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export interface IStudentRepository {
  createStudents(
    students: (MaintenanceStudent & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export interface ITeacherRepository {
  createTeachers(
    teachers: (MaintenanceTeacher & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export interface IAdministratorRepository {
  createAdministrators(
    administrators: (MaintenanceAdministrator & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export class MaintenanceCreateUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    users: ({
      loginId: string
      email: string
      password: string
    } & UserPerRole)[],
  ): Promise<
    Errorable<
      ({ id: string } & UserPerRole)[],
      E<'UnknownRuntimeError'> | E<'AlreadyExistError'>
    >
  > {
    const usersWithId = users.map((u) => ({
      ...u,
      id: uuidv4(),
    }))
    const getUsersResult = await this.userRepository.createUsers(usersWithId)

    if (getUsersResult.hasError) {
      switch (getUsersResult.error.type) {
        default: {
          return {
            hasError: true,
            error: wrapError(getUsersResult.error, 'failed to createUsers'),
            value: null,
          }
        }
      }
    }

    const userListsPerRole = usersWithId.reduce(
      (prev, cur) => {
        switch (cur.role) {
          case 'student': {
            const studentsObj = prev[cur.role] ?? {
              students: [],
            }

            return {
              ...prev,
              [cur.role]: {
                ...studentsObj,
                students: [...studentsObj.students, cur],
              },
            }
          }
          case 'teacher': {
            const teachersObj = prev[cur.role] ?? {
              teachers: [],
            }

            return {
              ...prev,
              [cur.role]: {
                ...teachersObj,
                teachers: [...teachersObj.teachers, cur],
              },
            }
          }
          case 'administrator': {
            const administratorsObj = prev[cur.role] ?? {
              administrators: [],
            }

            return {
              ...prev,
              [cur.role]: {
                ...administratorsObj,
                administrators: [...administratorsObj.administrators, cur],
              },
            }
          }
          default:
            return prev
        }
      },
      {} as {
        student: { students: (MaintenanceStudent & { id: string })[] }
        teacher: { teachers: (MaintenanceTeacher & { id: string })[] }
        administrator: {
          administrators: (MaintenanceAdministrator & { id: string })[]
        }
      },
    )

    for (const role of Object.keys(userListsPerRole) as UserRole[]) {
      switch (role) {
        case 'student': {
          const getStudentsResult = await this.studentRepository.createStudents(
            userListsPerRole.student.students.map((s) => ({
              userId: s.id,
              nickname: s.nickname,
              lmsId: s.lmsId,
            })),
          )

          if (getStudentsResult.hasError) {
            switch (getStudentsResult.error.type) {
              default: {
                return {
                  hasError: true,
                  error: wrapError(
                    getStudentsResult.error,
                    'failed to createStudents',
                  ),
                  value: null,
                }
              }
            }
          }
          break
        }
        case 'teacher': {
          const getTeachersResult = await this.teacherRepository.createTeachers(
            userListsPerRole.teacher.teachers.map((t) => ({
              userId: t.id,
              firstName: t.firstName,
              lastName: t.lastName,
              lmsId: t.lmsId,
            })),
          )

          if (getTeachersResult.hasError) {
            switch (getTeachersResult.error.type) {
              default: {
                return {
                  hasError: true,
                  error: wrapError(
                    getTeachersResult.error,
                    'failed to createTeachers',
                  ),
                  value: null,
                }
              }
            }
          }
          break
        }
        case 'administrator': {
          const getAdministratorsResult =
            await this.administratorRepository.createAdministrators(
              userListsPerRole.administrator.administrators.map((a) => ({
                userId: a.id,
                firstName: a.firstName,
                lastName: a.lastName,
                lmsId: a.lmsId,
              })),
            )

          if (getAdministratorsResult.hasError) {
            switch (getAdministratorsResult.error.type) {
              default: {
                return {
                  hasError: true,
                  error: wrapError(
                    getAdministratorsResult.error,
                    'failed to createAdministrators',
                  ),
                  value: null,
                }
              }
            }
          }
          break
        }
        default:
        // do nothing
      }
    }

    return {
      hasError: false,
      error: null,
      value: usersWithId,
    }
  }
}
