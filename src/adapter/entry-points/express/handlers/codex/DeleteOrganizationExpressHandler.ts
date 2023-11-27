import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { DeleteOrganizationUseCase } from '../../../../../domain/usecases/codex/Organization/DeleteOrganizationUseCase'

type Response =
  | Paths.DeleteOrganization.Responses.$200
  | Paths.DeleteOrganization.Responses.$400
  | Paths.DeleteOrganization.Responses.$401
  | Paths.DeleteOrganization.Responses.$403
  | Paths.DeleteOrganization.Responses.$404
  | Paths.DeleteOrganization.Responses.$500

export class DeleteOrganizationExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteOrganization.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const deleteOrganizationUseCase = new DeleteOrganizationUseCase(
      organizationRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteOrganization.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteOrganization.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const organizationResult = await deleteOrganizationUseCase.run(
      getUserResult.value,
      params.pathParams.organizationId,
    )

    if (organizationResult.hasError) {
      switch (organizationResult.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.DeleteAdministrator.Responses.$400 = {
            error: 'invalid organizationId',
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteOrganization.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        case 'OrganizationIdNotFound': {
          const response404: Paths.DeleteOrganization.Responses.$404 = {
            error: `organization not found of organizationId : ${params.pathParams.organizationId}`,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteOrganization.Responses.$500 = {
            error: JSON.stringify(organizationResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteOrganization.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
