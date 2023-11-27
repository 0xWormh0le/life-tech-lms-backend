import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { RemoveStudentFromStudentGroupUseCase } from '../../../../../domain/usecases/codex/Student/RemoveStudentFromStudentGroupUseCase'

type Response =
  | Paths.DeleteStudentFromStudentGroup.Responses.$200
  | Paths.DeleteStudentFromStudentGroup.Responses.$400
  | Paths.DeleteStudentFromStudentGroup.Responses.$401
  | Paths.DeleteStudentFromStudentGroup.Responses.$403
  | Paths.DeleteStudentFromStudentGroup.Responses.$404
  | Paths.DeleteStudentFromStudentGroup.Responses.$500

export class RemoveStudentFromStudentGroupExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteStudentFromStudentGroup.PathParameters,
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
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )

    const removeStudentUseCase = new RemoveStudentFromStudentGroupUseCase(
      studentRepository,
      studentGroupRepository,
      administratorRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteStudentFromStudentGroup.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteStudentFromStudentGroup.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const studentResult = await removeStudentUseCase.run(
      getUserResult.value,
      params.pathParams.studentGroupId,
      params.pathParams.studentId,
    )

    if (studentResult.hasError) {
      switch (studentResult.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.DeleteStudentFromStudentGroup.Responses.$400 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidStudentId': {
          const response400: Paths.DeleteStudentFromStudentGroup.Responses.$400 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteStudentFromStudentGroup.Responses.$403 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.DeleteStudentFromStudentGroup.Responses.$404 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.DeleteStudentFromStudentGroup.Responses.$404 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'StudentNotFoundError': {
          const response404: Paths.DeleteStudentFromStudentGroup.Responses.$404 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.DeleteStudentFromStudentGroup.Responses.$404 =
            {
              error: studentResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteStudentFromStudentGroup.Responses.$500 =
            {
              error: JSON.stringify(studentResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteStudentFromStudentGroup.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
