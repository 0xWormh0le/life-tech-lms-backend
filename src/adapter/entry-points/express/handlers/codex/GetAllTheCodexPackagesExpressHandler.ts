import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { GetAllCodexPackagesUseCase } from '../../../../../domain/usecases/codex/GetAllCodexPackagesUseCase'
import { UserCodeillusionPackagesRepository } from '../../../../repositories/UserCodeillusionPackagesRepository'

type Response =
  | Paths.GetAllPackages.Responses.$200
  | Paths.GetAllPackages.Responses.$401
  | Paths.GetAllPackages.Responses.$403
  | Paths.GetAllPackages.Responses.$500

export class GetAllPackagesExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
  ) {}

  handler: HandlerWithToken<undefined, undefined, undefined, Response> = async (
    params,
    token,
  ) => {
    const userRepository = new UserRepository(this.appDataSource)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetAllPackages.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetAllPackages.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const CodeillusionPackagesRepository =
      new UserCodeillusionPackagesRepository(
        this.appDataSource,
        this.staticFilesBaseUrl,
      )
    const getAllCodexPackagesUseCase = new GetAllCodexPackagesUseCase(
      CodeillusionPackagesRepository,
    )
    const getAllCodexPackages = await getAllCodexPackagesUseCase.run(
      getUserResult.value,
    )

    if (getAllCodexPackages.hasError) {
      switch (getAllCodexPackages.error.type) {
        case 'UnknownRuntimeError': {
          const response500: Paths.GetAllPackages.Responses.$500 = {
            error: JSON.stringify(getAllCodexPackages.error),
          }

          return { statusCode: 500, response: response500 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetAllPackages.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
      }
    }

    const response200: Paths.GetAllPackages.Responses.$200 = {
      packages: getAllCodexPackages.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
