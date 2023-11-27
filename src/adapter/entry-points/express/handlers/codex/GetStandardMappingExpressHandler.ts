import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'

import { GetStandardMappingUseCase } from '../../../../../domain/usecases/codex/GetStandardMappingUseCase'

import { StandardMappingRepository } from '../../../../repositories/StandardMappingRepository'

type Response =
  | Paths.GetStandardMapping.Responses.$200
  | Paths.GetStandardMapping.Responses.$401
  | Paths.GetStandardMapping.Responses.$403
  | Paths.GetStandardMapping.Responses.$500

export class GetStandardMappingExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetStandardMapping.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const standardMappingRepository = new StandardMappingRepository(
      this.appDataSource,
    )

    const getStandardMappingUseCase = new GetStandardMappingUseCase(
      standardMappingRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetStandardMapping.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetStandardMapping.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getStandardMappingResult = await getStandardMappingUseCase.run(
      getUserResult.value,
      params.query.stateId,
    )

    if (getStandardMappingResult.hasError) {
      switch (getStandardMappingResult.error.type) {
        case 'PermissionDenied': {
          const response400: Paths.GetStandardMapping.Responses.$403 = {
            error: getStandardMappingResult.error.message,
          }

          return { statusCode: 403, response: response400 }
        }
        default: {
          const response500: Paths.GetStandardMapping.Responses.$500 = {
            error: JSON.stringify(getStandardMappingResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetStandardMapping.Responses.$200 = {
      standardMappings: getStandardMappingResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
