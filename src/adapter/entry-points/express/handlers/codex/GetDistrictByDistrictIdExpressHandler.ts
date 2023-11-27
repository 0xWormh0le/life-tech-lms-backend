import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { GetDistrictsUseCase } from '../../../../../domain/usecases/codex/District/GetDistrictsUseCase'
import { GetDistrictByDistrictId } from '../../../../../domain/usecases/codex/District/GetDistrictByDistrictByIdUseCase'

type Response =
  | Paths.GetDistrictByDistrictId.Responses.$200
  | Paths.GetDistrictByDistrictId.Responses.$400
  | Paths.GetDistrictByDistrictId.Responses.$401
  | Paths.GetDistrictByDistrictId.Responses.$404
  | Paths.GetDistrictByDistrictId.Responses.$500

export class GetDistrictByDistrictIdExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetDistrictByDistrictId.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtsRepository = new DistrictsRepository(this.appDataSource)
    const getDistrictsUseCase = new GetDistrictByDistrictId(districtsRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetDistrictByDistrictId.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetDistrictByDistrictId.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getDistrictResult = await getDistrictsUseCase.run(
      params.pathParams.districtId,
    )

    if (getDistrictResult.hasError) {
      switch (getDistrictResult.error.type) {
        case 'DistrictInfoNotFound': {
          const response404: Paths.GetDistrictByDistrictId.Responses.$404 = {
            error: getDistrictResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'InvalidDistrictId': {
          const response400: Paths.GetDistrictByDistrictId.Responses.$400 = {
            error: getDistrictResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        default: {
          const response500: Paths.GetDistrictByDistrictId.Responses.$500 = {
            error: JSON.stringify(getDistrictResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetDistrictByDistrictId.Responses.$200 = {
      ...getDistrictResult.value,
      districtLMSId: getDistrictResult.value.districtLMSId ?? '',
      lmsId: getDistrictResult.value.lmsId ? getDistrictResult.value.lmsId : '',
    }

    return { statusCode: 200, response: response200 }
  }
}
