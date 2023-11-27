import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { GetDistrictsUseCase } from '../../../../../domain/usecases/codex/District/GetDistrictsUseCase'

type Response =
  | Paths.GetDistricts.Responses.$200
  | Paths.GetDistricts.Responses.$401
  | Paths.GetDistricts.Responses.$403
  | Paths.GetDistricts.Responses.$404
  | Paths.GetDistricts.Responses.$500

export class GetDistrictsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetDistricts.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtsRepository = new DistrictsRepository(this.appDataSource)
    const getDistrictsUseCase = new GetDistrictsUseCase(districtsRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetDistricts.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetDistricts.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getDistrictsResult = await getDistrictsUseCase.run(
      getUserResult.value,
      params.query.districtIds,
      params.query.LMSId,
      params.query.enabledRosterSync,
    )

    if (getDistrictsResult.hasError) {
      switch (getDistrictsResult.error.type) {
        case 'UnknownRuntimeError': {
          const response500: Paths.GetDistricts.Responses.$500 = {
            error: JSON.stringify(getDistrictsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetDistricts.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
      }
    }

    const response200: Paths.GetDistricts.Responses.$200 = {
      districts: getDistrictsResult.value.map((e) => ({
        ...e,
        districtLMSId: e.districtLMSId ?? '',
        lmsId: e.lmsId ?? undefined,
      })),
    }

    return { statusCode: 200, response: response200 }
  }
}
