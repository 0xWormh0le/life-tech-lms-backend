import { DataSource } from 'typeorm'
import { UpdateTeacher } from '../../../../../../domain/entities/codex/Teacher'
import { UpdateTeacherUseCase } from '../../../../../../domain/usecases/codex/Teacher/UpdateTeachersUseCase'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { OrganizationsRepository } from '../../../../../repositories/OrganizationRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.PutTeacher.Responses.$200
  | Paths.PutTeacher.Responses.$400
  | Paths.PutTeacher.Responses.$401
  | Paths.PutTeacher.Responses.$403
  | Paths.PutTeacher.Responses.$404
  | Paths.PutTeacher.Responses.$409
  | Paths.PutTeacher.Responses.$500

export class UpdateTeacherExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PutTeacher.PathParameters,
    undefined,
    Paths.PutTeacher.RequestBody,
    Response
  > = async (params, token) => {
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )

    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const updateTeacherUseCase = new UpdateTeacherUseCase(
      teacherRepository,
      administratorRepository,
    )
    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PutTeacher.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PutTeacher.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const UpdateTeacher = await updateTeacherUseCase.run(
      getUserResult.value,
      params.pathParams.teacherId,
      params?.body?.teacher as UpdateTeacher,
    )

    if (UpdateTeacher.hasError) {
      switch (UpdateTeacher.error.type) {
        case 'InvalidTeacherId': {
          const response400: Paths.PutTeacher.Responses.$400 = {
            error: UpdateTeacher.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidEmail': {
          const response400: Paths.PutTeacher.Responses.$400 = {
            error: UpdateTeacher.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PutTeacher.Responses.$403 = {
            error: UpdateTeacher.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.PutTeacher.Responses.$404 = {
            error: UpdateTeacher?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PutTeacher.Responses.$404 = {
            error: UpdateTeacher?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'FailedToLoadAdministratorData': {
          const response404: Paths.PutTeacher.Responses.$404 = {
            error: UpdateTeacher?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'EmailAlreadyExists': {
          const response409: Paths.PutTeacher.Responses.$409 = {
            error: UpdateTeacher.error.message,
          }

          return { statusCode: 409, response: response409 }
        }
        default: {
          const response500: Paths.PutTeacher.Responses.$500 = {
            error: JSON.stringify(UpdateTeacher.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutTeacher.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
