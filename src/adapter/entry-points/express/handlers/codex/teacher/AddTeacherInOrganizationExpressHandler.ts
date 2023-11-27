import { DataSource } from 'typeorm'
import { AddTeacherInOrganizationUseCase } from '../../../../../../domain/usecases/codex/Teacher/AddTeacherInOrganizationUseCase'
import { OrganizationsRepository } from '../../../../../repositories/OrganizationRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.PostTeacherInOrganization.Responses.$200
  | Paths.PostTeacherInOrganization.Responses.$400
  | Paths.PostTeacherInOrganization.Responses.$401
  | Paths.PostTeacherInOrganization.Responses.$403
  | Paths.PostTeacherInOrganization.Responses.$404
  | Paths.PostTeacherInOrganization.Responses.$409
  | Paths.PostTeacherInOrganization.Responses.$500

export class AddTeacherInOrganizationExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PostTeacherInOrganization.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const AddTeacherInOrganizationsUseCase =
      new AddTeacherInOrganizationUseCase(
        teacherRepository,
        organizationRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostTeacherInOrganization.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostTeacherInOrganization.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const AddTeacherInOrganization = await AddTeacherInOrganizationsUseCase.run(
      params.pathParams.organizationId,
      getUserResult.value,
      params.pathParams.teacherId,
    )

    if (AddTeacherInOrganization.hasError) {
      switch (AddTeacherInOrganization.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.PostTeacherInOrganization.Responses.$400 = {
            error: AddTeacherInOrganization.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidTeacherId': {
          const response400: Paths.PostTeacherInOrganization.Responses.$400 = {
            error: AddTeacherInOrganization.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostTeacherInOrganization.Responses.$403 = {
            error: AddTeacherInOrganization.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'OrganizationNotFound': {
          const response404: Paths.PostTeacherInOrganization.Responses.$404 = {
            error: AddTeacherInOrganization?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.PostTeacherInOrganization.Responses.$404 = {
            error: AddTeacherInOrganization?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherAlreadyExists': {
          const response409: Paths.PostTeacherInOrganization.Responses.$409 = {
            error: AddTeacherInOrganization?.error?.message,
          }

          return { statusCode: 409, response: response409 }
        }
        default: {
          const response500: Paths.PostTeacherInOrganization.Responses.$500 = {
            error: JSON.stringify(AddTeacherInOrganization.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostTeacherInOrganization.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
