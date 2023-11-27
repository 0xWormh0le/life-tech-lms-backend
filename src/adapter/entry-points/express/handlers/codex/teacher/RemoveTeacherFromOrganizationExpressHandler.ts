import { DataSource } from 'typeorm'
import { RemoveTeacherFromOrganizationUseCase } from '../../../../../../domain/usecases/codex/Teacher/RemoveTeacherFromOrganizationUseCase'
import { OrganizationsRepository } from '../../../../../repositories/OrganizationRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.DeleteTeacherFromOrganization.Responses.$200
  | Paths.DeleteTeacherFromOrganization.Responses.$400
  | Paths.DeleteTeacherFromOrganization.Responses.$401
  | Paths.DeleteTeacherFromOrganization.Responses.$403
  | Paths.DeleteTeacherFromOrganization.Responses.$404
  | Paths.DeleteTeacherFromOrganization.Responses.$500

export class RemoveTeacherFromOrganizationExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteTeacherFromOrganization.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const RemoveTeacherFromOrganizationsUseCase =
      new RemoveTeacherFromOrganizationUseCase(
        teacherRepository,
        organizationRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteTeacherFromOrganization.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteTeacherFromOrganization.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const RemoveTeacherFromOrganization =
      await RemoveTeacherFromOrganizationsUseCase.run(
        params.pathParams.organizationId,
        getUserResult.value,
        params.pathParams.teacherId,
      )

    if (RemoveTeacherFromOrganization.hasError) {
      switch (RemoveTeacherFromOrganization.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.DeleteTeacherFromOrganization.Responses.$400 =
            {
              error: RemoveTeacherFromOrganization.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidTeacherId': {
          const response400: Paths.DeleteTeacherFromOrganization.Responses.$400 =
            {
              error: RemoveTeacherFromOrganization.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteTeacherFromOrganization.Responses.$403 =
            {
              error: RemoveTeacherFromOrganization.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        case 'OrganizationNotFound': {
          const response404: Paths.DeleteTeacherFromOrganization.Responses.$404 =
            {
              error: RemoveTeacherFromOrganization?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.DeleteTeacherFromOrganization.Responses.$404 =
            {
              error: RemoveTeacherFromOrganization?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteTeacherFromOrganization.Responses.$500 =
            {
              error: JSON.stringify(RemoveTeacherFromOrganization.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteTeacherFromOrganization.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
