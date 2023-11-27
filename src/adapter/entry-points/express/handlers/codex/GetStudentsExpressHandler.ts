import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { GetStudentsUseCase } from '../../../../../domain/usecases/codex/Student/GetStudentsUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { Option } from '../../../../../domain/usecases/shared/Constants'

type Response =
  | Paths.GetStudents.Responses.$200
  | Paths.GetStudents.Responses.$400
  | Paths.GetStudents.Responses.$401
  | Paths.GetStudents.Responses.$403
  | Paths.GetStudents.Responses.$404
  | Paths.GetStudents.Responses.$500

export class GetStudentsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetStudents.PathParameters,
    Paths.GetStudents.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const studentRepository = new StudentRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )

    const getStudentsUseCase = new GetStudentsUseCase(
      studentRepository,
      studentGroupRepository,
      administratorRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetStudents.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetStudents.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const studentResult = await getStudentsUseCase.run(
      getUserResult.value,
      params.pathParams.studentGroupId,
      params.query.studentIds,
      params.query.name,
      params.query.option as Option,
    )

    if (studentResult.hasError) {
      switch (studentResult.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.GetStudents.Responses.$400 = {
            error: studentResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetStudents.Responses.$403 = {
            error: studentResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.GetStudents.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.GetStudents.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.GetStudents.Responses.$404 = {
            error: studentResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetStudents.Responses.$500 = {
            error: JSON.stringify(studentResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetStudents.Responses.$200 = {
      students: studentResult.value.map((e) => ({
        ...e,
        studentLMSId: e.studentLMSId ?? '',
      })),
    }

    return { statusCode: 200, response: response200 }
  }
}
