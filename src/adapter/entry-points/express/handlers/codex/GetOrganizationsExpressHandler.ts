import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { OrganizationsRepository } from '../../../../repositories/OrganizationRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { GetOrganizationsUseCase } from '../../../../../domain/usecases/codex/Organization/GetOrganizationsUseCase'

type Response =
  | Paths.GetOrganizations.Responses.$200
  | Paths.GetOrganizations.Responses.$401
  | Paths.GetOrganizations.Responses.$403
  | Paths.GetOrganizations.Responses.$500

export class GetOrganizationsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetOrganizations.PathParameters,
    Paths.GetOrganizations.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const getOrganizationsUseCase = new GetOrganizationsUseCase(
      organizationRepository,
      administratorRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetOrganizations.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetOrganizations.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getOrganizationsResult = await getOrganizationsUseCase.run(
      getUserResult.value,
      params.pathParams.districtId,
      params.query.organizationIds,
    )

    if (getOrganizationsResult.hasError) {
      switch (getOrganizationsResult.error.type) {
        case 'PermissionDenied': {
          const response403: Paths.GetOrganizations.Responses.$403 = {
            error: getOrganizationsResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.GetOrganizations.Responses.$500 = {
            error: JSON.stringify(getOrganizationsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetOrganizations.Responses.$200 = {
      organizations: getOrganizationsResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
