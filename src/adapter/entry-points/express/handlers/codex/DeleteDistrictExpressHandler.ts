import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { DeleteDistrictUseCase } from '../../../../../domain/usecases/codex/District/DeleteDistrictUseCase'

type Response =
  | Paths.DeleteDistrict.Responses.$200
  | Paths.DeleteDistrict.Responses.$401
  | Paths.DeleteDistrict.Responses.$403
  | Paths.DeleteDistrict.Responses.$404
  | Paths.DeleteDistrict.Responses.$500

export class DeleteDistrictExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteDistrict.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtsRepository = new DistrictsRepository(this.appDataSource)
    const deleteDistrictUseCase = new DeleteDistrictUseCase(districtsRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteDistrict.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteDistrict.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const districtsResult = await deleteDistrictUseCase.run(
      getUserResult.value,
      params.pathParams.districtId,
    )

    if (districtsResult.hasError) {
      switch (districtsResult.error.type) {
        case 'InvalidDistrictId': {
          const response400: Paths.DeleteAdministrator.Responses.$400 = {
            error: 'Invalid districtId',
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteDistrict.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        case 'DistrictInfoNotFound': {
          const response404: Paths.DeleteDistrict.Responses.$404 = {
            error: `District information not found for requested districtId : ${params.pathParams.districtId}`,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteDistrict.Responses.$500 = {
            error: JSON.stringify(districtsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteDistrict.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
