import { DataSource, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetUsersUseCase,
  IStudentRepository,
  ITeacherRepository,
  IAdministratorRepository,
} from '../../../../../../domain/usecases/maintenance/User/MaintenanceGetUsersUseCase'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { StudentTypeormEntity } from '../../../../../typeorm/entity/Student'
import { TeacherTypeormEntity } from '../../../../../typeorm/entity/Teacher'
import { AdministratorTypeormEntity } from '../../../../../typeorm/entity/Administrator'

type Response =
  | Paths.MaintenanceGetUsers.Responses.$200
  | Paths.MaintenanceGetUsers.Responses.$500

export class MaintenanceGetUsersExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async (
    params,
  ) => {
    const userRepository = new UserRepository(this.appDataSource)
    const studentRepository: IStudentRepository = {
      getStudentByUserId: this.getStudentByUserId,
    }
    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: this.getTeacherByUserId,
    }
    const administratorRepository: IAdministratorRepository = {
      getAdministratorByUserId: this.getAdministratorByUserId,
    }
    const getUsersUsecase = new MaintenanceGetUsersUseCase(
      userRepository,
      studentRepository,
      teacherRepository,
      administratorRepository,
    )

    const getUsersResult = await getUsersUsecase.run()

    if (getUsersResult.hasError) {
      switch (getUsersResult.error.type) {
        default: {
          const response500: Paths.MaintenanceGetUsers.Responses.$500 = {
            error: JSON.stringify(getUsersResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.MaintenanceGetUsers.Responses.$200 = {
      users: getUsersResult.value.map((e) =>
        (() => {
          if (
            e.role === 'student' ||
            e.role === 'teacher' ||
            e.role === 'administrator'
          ) {
            return {
              ...e,
              lmsId: e.lmsId ?? undefined,
              password: '',
            }
          } else {
            return { ...e, password: '' }
          }
        })(),
      ),
    }

    return { statusCode: 200, response: response200 }
  }

  private getStudentByUserId: IStudentRepository['getStudentByUserId'] = async (
    userId,
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
          `failed to get StudentTypeormEntity`,
        ),
        value: null,
      }
    }

    const student = await studentTypeormRepository.findOne({
      where: { user_id: userId },
    })

    if (!student) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `student with user id ${userId} not exist`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: {
        nickname: student.nick_name,
        lmsId: student.student_lms_id ?? null,
      },
    }
  }

  private getTeacherByUserId: ITeacherRepository['getTeacherByUserId'] = async (
    userId,
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
          `failed to get TeacherTypeormEntity`,
        ),
        value: null,
      }
    }

    const teacher = await teacherTypeormRepository.findOne({
      where: { user_id: userId },
    })

    if (!teacher) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `teacher with user id ${userId} not exist`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: {
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        lmsId: teacher.teacher_lms_id ?? null,
      },
    }
  }

  private getAdministratorByUserId: IAdministratorRepository['getAdministratorByUserId'] =
    async (userId) => {
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
            `failed to get AdministratorTypeormEntity`,
          ),
          value: null,
        }
      }

      const administrator = await administratorTypeormRepository.findOne({
        where: { user_id: userId },
      })

      if (!administrator) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `administrator with user id ${userId} not exist`,
          },
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: {
          firstName: administrator.first_name,
          lastName: administrator.last_name,
          lmsId: administrator.administrator_lms_id ?? null,
        },
      }
    }
}
