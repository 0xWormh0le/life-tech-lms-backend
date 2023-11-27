import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { DistrictRosterSyncStatusRepository } from '../../../../repositories/DistrictRosterSyncStatusRepository'
import { GetDistrictRosterSyncStatusUseCase } from '../../../../../domain/usecases/codex/GetDistrictRosterSyncStatusUseCase'

type Response =
  | Paths.GetDistrictRosterSyncStatus.Responses.$200
  | Paths.GetDistrictRosterSyncStatus.Responses.$401
  | Paths.GetDistrictRosterSyncStatus.Responses.$403
  | Paths.GetDistrictRosterSyncStatus.Responses.$500

export class GetDistrictRosterSyncStatusExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetDistrictRosterSyncStatus.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtRosterSyncStatusRepository =
      new DistrictRosterSyncStatusRepository(this.appDataSource)

    const getDistrictRosterSyncStatusUseCase =
      new GetDistrictRosterSyncStatusUseCase(districtRosterSyncStatusRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetDistrictRosterSyncStatus.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetDistrictRosterSyncStatus.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const result = await getDistrictRosterSyncStatusUseCase.run(
      getUserResult.value,
      params.query.districtId,
    )

    if (result.hasError) {
      switch (result.error.type) {
        case 'InvalidDistrictId': {
          const response400: Paths.GetDistrictRosterSyncStatus.Responses.$400 =
            {
              error: result.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetDistrictRosterSyncStatus.Responses.$403 =
            {
              error: result.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.GetDistrictRosterSyncStatus.Responses.$500 =
            {
              error: JSON.stringify(result.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetDistrictRosterSyncStatus.Responses.$200 = {
      districtRosterSyncStatuses: result.value ? [result.value] : [],
    }

    return { statusCode: 200, response: response200 }
  }
}
