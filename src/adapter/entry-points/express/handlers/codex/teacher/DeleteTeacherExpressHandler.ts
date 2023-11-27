import { DataSource } from 'typeorm'
import { DeleteTeacherUseCase } from '../../../../../../domain/usecases/codex/Teacher/DeleteTeacherUseCase'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.DeleteTeacher.Responses.$200
  | Paths.DeleteTeacher.Responses.$400
  | Paths.DeleteTeacher.Responses.$401
  | Paths.DeleteTeacher.Responses.$403
  | Paths.DeleteTeacher.Responses.$404
  | Paths.DeleteTeacher.Responses.$500

export class DeleteTeacherExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteTeacher.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )

    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const deleteTeacherUseCase = new DeleteTeacherUseCase(
      teacherRepository,
      administratorRepository,
    )
    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteTeacher.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteTeacher.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const DeleteTeacher = await deleteTeacherUseCase.run(
      getUserResult.value,
      params.pathParams.teacherId,
    )

    if (DeleteTeacher.hasError) {
      switch (DeleteTeacher.error.type) {
        case 'InvalidTeacherId': {
          const response400: Paths.DeleteTeacher.Responses.$400 = {
            error: DeleteTeacher.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteTeacher.Responses.$403 = {
            error: DeleteTeacher?.error?.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.DeleteTeacher.Responses.$404 = {
            error: DeleteTeacher?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.DeleteTeacher.Responses.$404 = {
            error: DeleteTeacher?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'FailedToLoadAdministratorData': {
          const response404: Paths.DeleteTeacher.Responses.$404 = {
            error: DeleteTeacher?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteTeacher.Responses.$500 = {
            error: JSON.stringify(DeleteTeacher.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteTeacher.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
