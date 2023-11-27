import { DataSource } from 'typeorm'
import { GetDistrictAdministratorsUseCase } from '../../../../../domain/usecases/codex/DistrictAdministrator/GetDistrictAdministratorsUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

type Response =
  | Paths.GetAdministrators.Responses.$200
  | Paths.GetAdministrators.Responses.$400
  | Paths.GetAdministrators.Responses.$401
  | Paths.GetAdministrators.Responses.$403
  | Paths.GetAdministrators.Responses.$404
  | Paths.GetAdministrators.Responses.$500

export class GetAdministratorExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetAdministrators.PathParameters,
    Paths.GetAdministrators.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const getDistringAdministratorUseCase =
      new GetDistrictAdministratorsUseCase(administratorRepository)
    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetAdministrators.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetAdministrators.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getAdministrators = await getDistringAdministratorUseCase.run(
      getUserResult.value,
      params?.pathParams?.districtId,
      params.query.administratorIds,
    )

    if (getAdministrators.hasError) {
      switch (getAdministrators.error.type) {
        case 'DistrictAdministratorNotFoundError': {
          const response404: Paths.GetAdministrators.Responses.$404 = {
            error: getAdministrators.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'InvalidDistrictId': {
          const response400: Paths.GetAdministrators.Responses.$400 = {
            error: getAdministrators.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetAdministrators.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.GetAdministrators.Responses.$500 = {
            error: JSON.stringify(getAdministrators.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetAdministrators.Responses.$200 = {
      administrators:
        getAdministrators.value === null
          ? undefined
          : getAdministrators.value.map((e) => ({
              ...e,
              administratorLMSId: e.administratorLMSId ?? '',
            })),
    }

    return { statusCode: 200, response: response200 }
  }
}
