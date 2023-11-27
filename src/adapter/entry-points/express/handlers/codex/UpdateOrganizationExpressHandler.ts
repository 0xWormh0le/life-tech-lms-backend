import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { UpdateOrganizationUseCase } from '../../../../../domain/usecases/codex/Organization/UpdateOrganizationUseCase'

type Response =
  | Paths.PutOrganization.Responses.$200
  | Paths.PutOrganization.Responses.$400
  | Paths.PutOrganization.Responses.$401
  | Paths.PutOrganization.Responses.$403
  | Paths.PutOrganization.Responses.$404
  | Paths.PutOrganization.Responses.$409
  | Paths.PutOrganization.Responses.$500

export class UpdateOrganizationExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PutOrganization.PathParameters,
    undefined,
    Paths.PutOrganization.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const updateOrganizationUseCase = new UpdateOrganizationUseCase(
      organizationRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PutOrganization.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PutOrganization.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const organizationResult = await updateOrganizationUseCase.run(
      getUserResult.value,
      params.pathParams.organizationId,
      params.body,
    )

    if (organizationResult.hasError) {
      switch (organizationResult.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.PutOrganization.Responses.$400 = {
            error: 'invalid organizationId',
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PutOrganization.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        case 'OrganizationNotFoundError': {
          const response404: Paths.PutOrganization.Responses.$404 = {
            error: `organization information not found`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AlreadyExistError': {
          const response409: Paths.PutOrganization.Responses.$409 = {
            error: `${params.body.name} is already exists in same district.`,
          }

          return { statusCode: 409, response: response409 }
        }
        default: {
          const response500: Paths.PutOrganization.Responses.$500 = {
            error: JSON.stringify(organizationResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutOrganization.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
