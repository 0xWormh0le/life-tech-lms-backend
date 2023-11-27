import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'

import { UserRepository } from '../../../../../repositories/UserRepository'
import {
  MaintenanceUpdateUsersUseCase,
  IStudentRepository,
  ITeacherRepository,
  IAdministratorRepository,
} from '../../../../../../domain/usecases/maintenance/User/MaintenanceUpdateUsersUseCase'
import { StudentTypeormEntity } from '../../../../../typeorm/entity/Student'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { AdministratorTypeormEntity } from '../../../../../typeorm/entity/Administrator'
import { TeacherTypeormEntity } from '../../../../../typeorm/entity/Teacher'

type Response =
  | Paths.MaintenancePutUsers.Responses.$200
  | Paths.MaintenancePutUsers.Responses.$404
  | Paths.MaintenancePutUsers.Responses.$500

export class MaintenanceUpdateUsersExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePutUsers.RequestBody,
    Response
  > = async (params) => {
    let studentTypeormRepository: Repository<StudentTypeormEntity>

    try {
      studentTypeormRepository =
        this.appDataSource.getRepository(StudentTypeormEntity)
    } catch (e: unknown) {
      const response500: Paths.MaintenancePutUsers.Responses.$500 = {
        error: JSON.stringify(
          fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get StudentTypeormEntity`,
          ),
        ),
      }

      return { statusCode: 500, response: response500 }
    }

    let teacherTypeormRepository: Repository<TeacherTypeormEntity>

    try {
      teacherTypeormRepository =
        this.appDataSource.getRepository(TeacherTypeormEntity)
    } catch (e: unknown) {
      const response500: Paths.MaintenancePutUsers.Responses.$500 = {
        error: JSON.stringify(
          fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get TeacherTypeormEntity`,
          ),
        ),
      }

      return { statusCode: 500, response: response500 }
    }

    let administratorTypeormRepository: Repository<AdministratorTypeormEntity>

    try {
      administratorTypeormRepository = this.appDataSource.getRepository(
        AdministratorTypeormEntity,
      )
    } catch (e: unknown) {
      const response500: Paths.MaintenancePutUsers.Responses.$500 = {
        error: JSON.stringify(
          fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get AdministratorTypeormEntity`,
          ),
        ),
      }

      return { statusCode: 500, response: response500 }
    }

    const userRepository = new UserRepository(this.appDataSource)
    const studentRepository: IStudentRepository = {
      deleteStudentsByUserIds: this.deleteStudentsByUserIds(
        studentTypeormRepository,
      ),
      createStudents: this.createStudents(studentTypeormRepository),
      updateStudentsByUserIds: this.updateStudentsByUserIds(
        studentTypeormRepository,
      ),
    }
    const teacherRepository: ITeacherRepository = {
      deleteTeachersByUserIds: this.deleteTeachersByUserIds(
        teacherTypeormRepository,
      ),
      createTeachers: this.createTeachers(teacherTypeormRepository),
      updateTeachersByUserIds: this.updateTeachersByUserIds(
        teacherTypeormRepository,
      ),
    }
    const administratorRepository: IAdministratorRepository = {
      deleteAdministratorsByUserIds: this.deleteAdministratorsByUserIds(
        administratorTypeormRepository,
      ),
      createAdministrators: this.createAdministrators(
        administratorTypeormRepository,
      ),
      updateAdministratorsByUserIds: this.updateAdministratorsByUserIds(
        administratorTypeormRepository,
      ),
    }
    const updateUsersUsecase = new MaintenanceUpdateUsersUseCase(
      userRepository,
      studentRepository,
      teacherRepository,
      administratorRepository,
    )

    const updateUsersResult = await updateUsersUsecase.run(
      params.body.users.map((e) =>
        (() => {
          if (
            e.role === 'student' ||
            e.role === 'teacher' ||
            e.role === 'administrator'
          ) {
            return {
              ...e,
              lmsId: e.lmsId ?? null,
            }
          } else {
            return e
          }
        })(),
      ),
    )

    if (updateUsersResult.hasError) {
      switch (updateUsersResult.error.type) {
        case 'NotFoundError':
          const response404: Paths.MaintenancePutUsers.Responses.$404 = {
            error: JSON.stringify(updateUsersResult.error),
          }

          return { statusCode: 404, response: response404 }

        default: {
          const response500: Paths.MaintenancePutUsers.Responses.$500 = {
            error: JSON.stringify(updateUsersResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.MaintenancePutUsers.Responses.$200 = {
      users: updateUsersResult.value.map((e) =>
        (() => {
          if (
            e.role === 'student' ||
            e.role === 'teacher' ||
            e.role === 'administrator'
          ) {
            return {
              ...e,
              lmsId: e.lmsId ?? undefined,
            }
          } else {
            return e
          }
        })(),
      ),
    }

    return { statusCode: 200, response: response200 }
  }

  private deleteStudentsByUserIds: (
    studentTypeormRepository: Repository<StudentTypeormEntity>,
  ) => IStudentRepository['deleteStudentsByUserIds'] =
    (studentTypeormRepository) => async (userIds) => {
      try {
        await studentTypeormRepository.delete({ user_id: In(userIds) })
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to deleteStudentsByUserIds`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private createStudents: (
    studentTypeormRepository: Repository<StudentTypeormEntity>,
  ) => IStudentRepository['createStudents'] =
    (studentTypeormRepository) => async (students) => {
      try {
        await studentTypeormRepository.save(
          students.map((s) => ({
            user_id: s.userId,
            nick_name: s.nickname,
            student_lms_id: s.lmsId ?? undefined,
          })),
        )
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to createStudents`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private updateStudentsByUserIds: (
    studentTypeormRepository: Repository<StudentTypeormEntity>,
  ) => IStudentRepository['updateStudentsByUserIds'] =
    (studentTypeormRepository) => async (students) => {
      try {
        for (const s of students) {
          studentTypeormRepository.update(
            { user_id: s.userId },
            {
              nick_name: s.nickname,
              student_lms_id: s.lmsId ?? undefined,
            },
          )
        }
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to updateStudentsByUserIds`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private deleteTeachersByUserIds: (
    teacherTypeormRepository: Repository<TeacherTypeormEntity>,
  ) => ITeacherRepository['deleteTeachersByUserIds'] =
    (teacherTypeormRepository) => async (userIds) => {
      try {
        await teacherTypeormRepository.delete({ user_id: In(userIds) })
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to deleteTeachersByUserIds`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private createTeachers: (
    teacherTypeormRepository: Repository<TeacherTypeormEntity>,
  ) => ITeacherRepository['createTeachers'] =
    (teacherTypeormRepository) => async (teachers) => {
      try {
        await teacherTypeormRepository.save(
          teachers.map((t) => ({
            user_id: t.userId,
            first_name: t.firstName,
            last_name: t.lastName,
            teacher_lms_id: t.lmsId ?? undefined,
          })),
        )
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to createTeachers`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private updateTeachersByUserIds: (
    teacherTypeormRepository: Repository<TeacherTypeormEntity>,
  ) => ITeacherRepository['updateTeachersByUserIds'] =
    (teacherTypeormRepository) => async (teachers) => {
      try {
        for (const s of teachers) {
          teacherTypeormRepository.update(
            { user_id: s.userId },
            {
              first_name: s.firstName,
              last_name: s.lastName,
              teacher_lms_id: s.lmsId ?? undefined,
            },
          )
        }
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to updateTeachersByUserIds`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private deleteAdministratorsByUserIds: (
    administratorTypeormRepository: Repository<AdministratorTypeormEntity>,
  ) => IAdministratorRepository['deleteAdministratorsByUserIds'] =
    (administratorTypeormRepository) => async (userIds) => {
      try {
        await administratorTypeormRepository.delete({ user_id: In(userIds) })
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to deleteAdministratorsByUserIds`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private createAdministrators: (
    administratorTypeormRepository: Repository<AdministratorTypeormEntity>,
  ) => IAdministratorRepository['createAdministrators'] =
    (administratorTypeormRepository) => async (administrators) => {
      try {
        await administratorTypeormRepository.save(
          administrators.map((a) => ({
            user_id: a.userId,
            first_name: a.firstName,
            last_name: a.lastName,
            administrator_lms_id: a.lmsId ?? undefined,
          })),
        )
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to createAdministrators`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

  private updateAdministratorsByUserIds: (
    administratorTypeormRepository: Repository<AdministratorTypeormEntity>,
  ) => IAdministratorRepository['updateAdministratorsByUserIds'] =
    (administratorTypeormRepository) => async (administrators) => {
      try {
        for (const s of administrators) {
          administratorTypeormRepository.update(
            { user_id: s.userId },
            {
              first_name: s.firstName,
              last_name: s.lastName,
              administrator_lms_id: s.lmsId ?? undefined,
            },
          )
        }
      } catch (e) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to updateAdministratorsByUserIds`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }
}
