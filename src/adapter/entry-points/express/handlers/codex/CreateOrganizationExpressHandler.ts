import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { CreateOrganizationUseCase } from '../../../../../domain/usecases/codex/Organization/CreateOrganizationUseCase'

type Response =
  | Paths.PostOrganization.Responses.$200
  | Paths.PostOrganization.Responses.$401
  | Paths.PostOrganization.Responses.$403
  | Paths.PostOrganization.Responses.$409
  | Paths.PostOrganization.Responses.$500

export class CreateOrganizationExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    undefined,
    Paths.PostOrganization.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const createOrganizationUseCase = new CreateOrganizationUseCase(
      organizationRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostOrganization.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostOrganization.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const organizationResult = await createOrganizationUseCase.run(
      getUserResult.value,
      params.body,
    )

    if (organizationResult.hasError) {
      switch (organizationResult.error.type) {
        case 'AlreadyExistError': {
          const response409: Paths.PostOrganization.Responses.$409 = {
            error: `Organization already exist in same district`,
          }

          return { statusCode: 409, response: response409 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostOrganization.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.PostOrganization.Responses.$500 = {
            error: JSON.stringify(organizationResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostOrganization.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
