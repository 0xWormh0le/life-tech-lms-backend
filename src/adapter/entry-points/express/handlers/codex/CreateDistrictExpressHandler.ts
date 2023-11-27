import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { CreateDistrictUseCase } from '../../../../../domain/usecases/codex/District/CreateDistrictUseCase'

type Response =
  | Paths.PostDistrict.Responses.$200
  | Paths.PostDistrict.Responses.$401
  | Paths.PostDistrict.Responses.$403
  | Paths.PostDistrict.Responses.$404
  | Paths.PostDistrict.Responses.$500

export class CreateDistrictExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    undefined,
    Paths.PostDistrict.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtsRepository = new DistrictsRepository(this.appDataSource)
    const createDistrictsUseCase = new CreateDistrictUseCase(
      districtsRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostDistrict.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostDistrict.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const districtsResult = await createDistrictsUseCase.run(
      getUserResult.value,
      params.body,
    )

    if (districtsResult.hasError) {
      switch (districtsResult.error.type) {
        case 'AlreadyExistError': {
          const response409: Paths.PostDistrict.Responses.$409 = {
            error: `District already exist`,
          }

          return { statusCode: 409, response: response409 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostDistrict.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.PostDistrict.Responses.$500 = {
            error: JSON.stringify(districtsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostDistrict.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
