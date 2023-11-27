import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import {
  CreateStudentsUseCase,
  StudentInfo,
} from '../../../../../domain/usecases/codex/Student/CreateStudentsUseCase'

type Response =
  | Paths.PostStudents.Responses.$200
  | Paths.PostStudents.Responses.$400
  | Paths.PostStudents.Responses.$401
  | Paths.PostStudents.Responses.$403
  | Paths.PostStudents.Responses.$404
  | Paths.PostStudents.Responses.$500

export class CreateStudentsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PostStudents.PathParameters,
    undefined,
    Paths.PostStudents.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const studentRepository = new StudentRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )

    const createStudentsUseCase = new CreateStudentsUseCase(
      studentRepository,
      userRepository,
      studentGroupRepository,
      administratorRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostStudents.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostStudents.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const studentResult = await createStudentsUseCase.run(
      getUserResult.value,
      params.pathParams.studentGroupId,
      params.body.students as StudentInfo[],
    )

    if (studentResult.hasError) {
      switch (studentResult.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.PostStudents.Responses.$400 = {
            error: studentResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidStudentAttributes': {
          const response400: Paths.PostStudents.Responses.$400 = {
            error: studentResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostStudents.Responses.$403 = {
            error: studentResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.PostStudents.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.PostStudents.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PostStudents.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostStudents.Responses.$500 = {
            error: JSON.stringify(studentResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostStudents.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
