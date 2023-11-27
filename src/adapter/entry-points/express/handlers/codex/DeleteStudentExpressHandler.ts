import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { DeleteStudentUseCase } from '../../../../../domain/usecases/codex/Student/DeleteStudentUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'

type Response =
  | Paths.DeleteStudent.Responses.$200
  | Paths.DeleteStudent.Responses.$400
  | Paths.DeleteStudent.Responses.$401
  | Paths.DeleteStudent.Responses.$403
  | Paths.DeleteStudent.Responses.$404
  | Paths.DeleteStudent.Responses.$500

export class DeleteStudentExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteStudent.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const studentRepository = new StudentRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )

    const deleteStudentUseCase = new DeleteStudentUseCase(
      studentRepository,
      administratorRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteStudent.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteStudent.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const studentResult = await deleteStudentUseCase.run(
      getUserResult.value,
      params.pathParams.studentId,
    )

    if (studentResult.hasError) {
      switch (studentResult.error.type) {
        case 'InvalidStudentId': {
          const response400: Paths.DeleteStudent.Responses.$400 = {
            error: studentResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteStudent.Responses.$403 = {
            error: studentResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentNotFoundError': {
          const response404: Paths.DeleteStudent.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.DeleteStudent.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.DeleteStudent.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteStudent.Responses.$500 = {
            error: JSON.stringify(studentResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteStudent.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
