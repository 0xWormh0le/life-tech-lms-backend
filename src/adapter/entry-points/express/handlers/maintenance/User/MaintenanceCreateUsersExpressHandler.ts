import { DataSource, DeepPartial, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'

import {
  MaintenanceCreateUsersUseCase,
  IStudentRepository,
  ITeacherRepository,
  IAdministratorRepository,
} from '../../../../../../domain/usecases/maintenance/User/MaintenanceCreateUsersUseCase'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { StudentTypeormEntity } from '../../../../../typeorm/entity/Student'
import { TeacherTypeormEntity } from '../../../../../typeorm/entity/Teacher'
import { AdministratorTypeormEntity } from '../../../../../typeorm/entity/Administrator'

type Response =
  | Paths.MaintenancePostUsers.Responses.$200
  | Paths.MaintenancePostUsers.Responses.$409
  | Paths.MaintenancePostUsers.Responses.$500

export class MaintenanceCreateUsersExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePostUsers.RequestBody,
    Response
  > = async (params) => {
    const userRepository = new UserRepository(this.appDataSource)
    const studentRepository: IStudentRepository = {
      createStudents: this.createStudents,
    }
    const teacherRepository: ITeacherRepository = {
      createTeachers: this.createTeachers,
    }
    const administratorRepository: IAdministratorRepository = {
      createAdministrators: this.createAdministrators,
    }
    const createUsersUsecase = new MaintenanceCreateUsersUseCase(
      userRepository,
      studentRepository,
      teacherRepository,
      administratorRepository,
    )

    const createUsersResult = await createUsersUsecase.run(
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

    if (createUsersResult.hasError) {
      switch (createUsersResult.error.type) {
        case 'AlreadyExistError':
          const response409: Paths.MaintenancePostUsers.Responses.$409 = {
            error: JSON.stringify(createUsersResult.error),
          }

          return { statusCode: 409, response: response409 }

        default: {
          const response500: Paths.MaintenancePostUsers.Responses.$500 = {
            error: JSON.stringify(createUsersResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.MaintenancePostUsers.Responses.$200 = {
      users: createUsersResult.value.map((e) =>
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

  private createStudents: IStudentRepository['createStudents'] = async (
    students,
  ) => {
    let studentTypeormRepository: Repository<StudentTypeormEntity>

    try {
      studentTypeormRepository =
        this.appDataSource.getRepository(StudentTypeormEntity)
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get UserTypeormEntity`,
        ),
        value: null,
      }
    }

    // Check if given users already exist
    try {
      const existingCount = await studentTypeormRepository.countBy({
        user_id: In(students.map((s) => s.userId)),
      })

      if (existingCount > 0) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'some of given student already exist',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get user from db`,
        ),
        value: null,
      }
    }

    // Create new users
    try {
      const studentTypeormEntities: DeepPartial<StudentTypeormEntity>[] = []

      for (const student of students) {
        studentTypeormEntities.push({
          user_id: student.userId,
          nick_name: student.nickname,
          student_lms_id: student.lmsId ?? undefined,
        })
      }
      await studentTypeormRepository.save(studentTypeormEntities)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create users into db`,
        ),
        value: null,
      }
    }
  }

  private createTeachers: ITeacherRepository['createTeachers'] = async (
    teachers,
  ) => {
    let teacherTypeormRepository: Repository<TeacherTypeormEntity>

    try {
      teacherTypeormRepository =
        this.appDataSource.getRepository(TeacherTypeormEntity)
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get UserTypeormEntity`,
        ),
        value: null,
      }
    }

    // Check if given users already exist
    try {
      const existingCount = await teacherTypeormRepository.countBy({
        user_id: In(teachers.map((t) => t.userId)),
      })

      if (existingCount > 0) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'some of given teacher already exist',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get user from db`,
        ),
        value: null,
      }
    }

    // Create new users
    try {
      const teacherTypeormEntities: DeepPartial<TeacherTypeormEntity>[] = []

      for (const teacher of teachers) {
        teacherTypeormEntities.push({
          user_id: teacher.userId,
          first_name: teacher.firstName,
          last_name: teacher.lastName,
          teacher_lms_id: teacher.lmsId ?? undefined,
        })
      }
      await teacherTypeormRepository.save(teacherTypeormEntities)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create users into db`,
        ),
        value: null,
      }
    }
  }

  private createAdministrators: IAdministratorRepository['createAdministrators'] =
    async (administrators) => {
      let administratorTypeormRepository: Repository<AdministratorTypeormEntity>

      try {
        administratorTypeormRepository = this.appDataSource.getRepository(
          AdministratorTypeormEntity,
        )
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get UserTypeormEntity`,
          ),
          value: null,
        }
      }

      // Check if given users already exist
      try {
        const existingCount = await administratorTypeormRepository.countBy({
          user_id: In(administrators.map((a) => a.userId)),
        })

        if (existingCount > 0) {
          return {
            hasError: true,
            error: {
              type: 'AlreadyExistError',
              message: 'some of given administrator already exist',
            },
            value: null,
          }
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get user from db`,
          ),
          value: null,
        }
      }

      // Create new users
      try {
        const administratorTypeormEntities: DeepPartial<AdministratorTypeormEntity>[] =
          []

        for (const administrator of administrators) {
          administratorTypeormEntities.push({
            user_id: administrator.userId,
            first_name: administrator.firstName,
            last_name: administrator.lastName,
            administrator_lms_id: administrator.lmsId ?? undefined,
          })
        }
        await administratorTypeormRepository.save(administratorTypeormEntities)

        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to create users into db`,
          ),
          value: null,
        }
      }
    }
}
