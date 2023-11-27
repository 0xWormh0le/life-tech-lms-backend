import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { EditDistrictUseCase } from '../../../../../domain/usecases/codex/District/EditDistrictUseCase'

type Response =
  | Paths.PutDistrict.Responses.$200
  | Paths.PutDistrict.Responses.$401
  | Paths.PutDistrict.Responses.$403
  | Paths.PutDistrict.Responses.$404
  | Paths.PutDistrict.Responses.$500

export class UpdateDistrictExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PutDistrict.PathParameters,
    undefined,
    Paths.PutDistrict.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtsRepository = new DistrictsRepository(this.appDataSource)
    const editDistrictUseCase = new EditDistrictUseCase(districtsRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PutDistrict.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PutDistrict.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const districtsResult = await editDistrictUseCase.run(
      getUserResult.value,
      params.body,
      params.pathParams.districtId,
    )

    if (districtsResult.hasError) {
      switch (districtsResult.error.type) {
        case 'DistrictInfoNotFound': {
          const response404: Paths.PutDistrict.Responses.$404 = {
            error: `District information not found`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AlreadyExistError': {
          const response409: Paths.PutDistrict.Responses.$409 = {
            error: `${params.body.name} is already exists.`,
          }

          return { statusCode: 409, response: response409 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PutDistrict.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.PutDistrict.Responses.$500 = {
            error: JSON.stringify(districtsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutDistrict.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
