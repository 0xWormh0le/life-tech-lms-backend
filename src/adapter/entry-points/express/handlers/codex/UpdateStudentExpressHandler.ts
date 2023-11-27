import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { UpdateStudentUseCase } from '../../../../../domain/usecases/codex/Student/UpdateStudentUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'

type Response =
  | Paths.PutStudent.Responses.$200
  | Paths.PutStudent.Responses.$400
  | Paths.PutStudent.Responses.$401
  | Paths.PutStudent.Responses.$403
  | Paths.PutStudent.Responses.$404
  | Paths.PutStudent.Responses.$409
  | Paths.PutStudent.Responses.$500

export class UpdateStudentExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PutStudent.PathParameters,
    undefined,
    Paths.PutStudent.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const studentRepository = new StudentRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )

    const updateStudentUseCase = new UpdateStudentUseCase(
      studentRepository,
      administratorRepository,
      userRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PutStudent.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PutStudent.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const studentResult = await updateStudentUseCase.run(
      getUserResult.value,
      params.pathParams.studentId,
      params.body,
    )

    if (studentResult.hasError) {
      switch (studentResult.error.type) {
        case 'InvalidStudentId': {
          const response400: Paths.PutStudent.Responses.$400 = {
            error: studentResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidStudentAttributes': {
          const response400: Paths.PutStudent.Responses.$400 = {
            error: studentResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PutStudent.Responses.$403 = {
            error: studentResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentNotFoundError': {
          const response404: Paths.PutStudent.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.PutStudent.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PutStudent.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AlreadyExistsError': {
          const response409: Paths.PutStudent.Responses.$409 = {
            error: studentResult.error.message,
          }

          return { statusCode: 409, response: response409 }
        }
        default: {
          const response500: Paths.PutStudent.Responses.$500 = {
            error: JSON.stringify(studentResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutStudent.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
