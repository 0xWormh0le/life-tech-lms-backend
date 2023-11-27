import { User } from '../../../entities/codex/User'
import { MaintenanceStudent } from '../../../entities/maintenance/Student'
import { MaintenanceTeacher } from '../../../entities/maintenance/Teacher'
import { MaintenanceAdministrator } from '../../../entities/maintenance/Administrator'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { UserPerRole } from '../../../entities/maintenance/UserPerRole'

export interface IUserRepository {
  getUsers(
    userIds: string[],
  ): Promise<Errorable<User[], E<'UnknownRuntimeError'> | E<'NotFoundError'>>>
  updateUsers(
    users: User[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>>
}

export interface IStudentRepository {
  deleteStudentsByUserIds(
    userIds: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  createStudents(
    students: (MaintenanceStudent & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
  updateStudentsByUserIds(
    students: (MaintenanceStudent & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>>
}

export interface ITeacherRepository {
  deleteTeachersByUserIds(
    userIds: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  createTeachers(
    teachers: (MaintenanceTeacher & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
  updateTeachersByUserIds(
    teachers: (MaintenanceTeacher & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>>
}

export interface IAdministratorRepository {
  deleteAdministratorsByUserIds(
    userIds: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  createAdministrators(
    administrators: (MaintenanceAdministrator & { userId: string })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
  updateAdministratorsByUserIds(
    administrators: (MaintenanceAdministrator & {
      userId: string
    })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>>
}

export class MaintenanceUpdateUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    users: (UserPerRole & {
      id: string
      loginId: string
      email: string
      password: string
    })[],
  ): Promise<
    Errorable<
      (UserPerRole & {
        id: string
        loginId: string
        email: string
        password: string
      })[],
      E<'UnknownRuntimeError'> | E<'NotFoundError'>
    >
  > {
    //
    // Delete existing Student/Teacher/Administrator
    //
    const getUsersResult = await this.userRepository.getUsers(
      users.map((u) => u.id),
    )

    if (getUsersResult.hasError) {
      return {
        hasError: true,
        error: wrapError(getUsersResult.error, 'failed to getUsers'),
        value: null,
      }
    }

    const existingUsers = getUsersResult.value
    const studentUsersToDelete = existingUsers.filter((exisitingUser) => {
      const correspondingUser = users.find((u) => u.id === exisitingUser.id)

      if (!correspondingUser) {
        return false
      }

      return (
        correspondingUser.role !== 'student' && exisitingUser.role === 'student'
      )
    })
    const deleteStudentsByUserIdsResult =
      await this.studentRepository.deleteStudentsByUserIds(
        studentUsersToDelete.map((s) => s.id),
      )

    if (deleteStudentsByUserIdsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          deleteStudentsByUserIdsResult.error,
          'failed to deleteStudentsByUserIdsResult',
        ),
        value: null,
      }
    }

    const teacherUsersToDelete = existingUsers.filter((exisitingUser) => {
      const correspondingUser = users.find((u) => u.id === exisitingUser.id)

      if (!correspondingUser) {
        return false
      }

      return (
        correspondingUser.role !== 'teacher' && exisitingUser.role === 'teacher'
      )
    })
    const deleteTeachersByUserIdsResult =
      await this.teacherRepository.deleteTeachersByUserIds(
        teacherUsersToDelete.map((s) => s.id),
      )

    if (deleteTeachersByUserIdsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          deleteTeachersByUserIdsResult.error,
          'failed to deleteTeachersByUserIdsResult',
        ),
        value: null,
      }
    }

    const administratorUsersToDelete = existingUsers.filter((exisitingUser) => {
      const correspondingUser = users.find((u) => u.id === exisitingUser.id)

      if (!correspondingUser) {
        return false
      }

      return (
        correspondingUser.role !== 'administrator' &&
        exisitingUser.role === 'administrator'
      )
    })
    const deleteAdministratorsByUserIdsResult =
      await this.administratorRepository.deleteAdministratorsByUserIds(
        administratorUsersToDelete.map((s) => s.id),
      )

    if (deleteAdministratorsByUserIdsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          deleteAdministratorsByUserIdsResult.error,
          'failed to deleteAdministratorsByUserIdsResult',
        ),
        value: null,
      }
    }

    //
    // Create or Update Student/Teacher/Administrator
    //
    const usersPerRole = users.reduce(
      (prev, cur) => {
        switch (cur.role) {
          case 'student': {
            return {
              ...prev,
              students: [
                ...prev.students,
                { userId: cur.id, nickname: cur.nickname, lmsId: cur.lmsId },
              ],
            }
          }
          case 'teacher': {
            return {
              ...prev,
              teachers: [
                ...prev.teachers,
                {
                  userId: cur.id,
                  firstName: cur.firstName,
                  lastName: cur.lastName,
                  lmsId: cur.lmsId,
                },
              ],
            }
          }
          case 'administrator': {
            return {
              ...prev,
              administrators: [
                ...prev.administrators,
                {
                  userId: cur.id,
                  firstName: cur.firstName,
                  lastName: cur.lastName,
                  lmsId: cur.lmsId,
                },
              ],
            }
          }
          default:
            return prev
        }
      },
      {
        students: [],
        teachers: [],
        administrators: [],
      } as {
        students: (MaintenanceStudent & { userId: string })[]
        teachers: (MaintenanceTeacher & { userId: string })[]
        administrators: (MaintenanceAdministrator & { userId: string })[]
      },
    )

    const studentsToUpdate: (MaintenanceStudent & { userId: string })[] = []
    const studentsToCreate: (MaintenanceStudent & { userId: string })[] = []

    for (const e of usersPerRole.students) {
      const existingStudent = existingUsers.find(
        (existingUser) =>
          existingUser.id === e.userId && existingUser.role === 'student',
      )

      if (existingStudent) {
        studentsToUpdate.push(e)
      } else {
        studentsToCreate.push(e)
      }
    }

    const createStudentsResult = await this.studentRepository.createStudents(
      studentsToCreate,
    )

    if (createStudentsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(createStudentsResult.error),
        },
        value: null,
      }
    }

    const updateStudentsResult =
      await this.studentRepository.updateStudentsByUserIds(studentsToUpdate)

    if (updateStudentsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(updateStudentsResult.error),
        },
        value: null,
      }
    }

    const teachersToUpdate: (MaintenanceTeacher & { userId: string })[] = []
    const teachersToCreate: (MaintenanceTeacher & { userId: string })[] = []

    for (const e of usersPerRole.teachers) {
      const existingTeacher = existingUsers.find(
        (existingUser) =>
          existingUser.id === e.userId && existingUser.role === 'teacher',
      )

      if (existingTeacher) {
        teachersToUpdate.push(e)
      } else {
        teachersToCreate.push(e)
      }
    }

    const createTeachersResult = await this.teacherRepository.createTeachers(
      teachersToCreate,
    )

    if (createTeachersResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(createTeachersResult.error),
        },
        value: null,
      }
    }

    const updateTeachersResult =
      await this.teacherRepository.updateTeachersByUserIds(teachersToUpdate)

    if (updateTeachersResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(updateTeachersResult.error),
        },
        value: null,
      }
    }

    const administratorsToUpdate: (MaintenanceAdministrator & {
      userId: string
    })[] = []
    const administratorsToCreate: (MaintenanceAdministrator & {
      userId: string
    })[] = []

    for (const e of usersPerRole.administrators) {
      const existingAdministrator = existingUsers.find(
        (existingUser) =>
          existingUser.id === e.userId && existingUser.role === 'administrator',
      )

      if (existingAdministrator) {
        administratorsToUpdate.push(e)
      } else {
        administratorsToCreate.push(e)
      }
    }

    const createAdministratorsResult =
      await this.administratorRepository.createAdministrators(
        administratorsToCreate,
      )

    if (createAdministratorsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(createAdministratorsResult.error),
        },
        value: null,
      }
    }

    const updateAdministratorsResult =
      await this.administratorRepository.updateAdministratorsByUserIds(
        administratorsToUpdate,
      )

    if (updateAdministratorsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: JSON.stringify(updateAdministratorsResult.error),
        },
        value: null,
      }
    }

    const updateUsersResult = await this.userRepository.updateUsers(
      users.map((u) =>
        (() => {
          const ret = {
            id: u.id,
            loginId: u.loginId,
            email: u.email,
            role: u.role,
            password: u.password,
          }

          if (
            u.role === 'student' ||
            u.role === 'teacher' ||
            u.role === 'administrator'
          ) {
            return {
              ...ret,
              lmsId: u.lmsId,
            }
          } else {
            return ret
          }
        })(),
      ),
    )

    if (updateUsersResult.hasError) {
      switch (updateUsersResult.error.type) {
        default: {
          return {
            hasError: true,
            error: wrapError(updateUsersResult.error, 'failed to createUsers'),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: users,
    }
  }
}
