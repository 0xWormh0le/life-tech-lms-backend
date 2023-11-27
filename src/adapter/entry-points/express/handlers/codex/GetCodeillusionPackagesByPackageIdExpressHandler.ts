import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { GetCodeillusionPackagesByPackageIdUseCase } from '../../../../../domain/usecases/codex/GetCodeillusionPackagesByPackageIdUseCase'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserCodeillusionPackagesRepository } from '../../../../repositories/UserCodeillusionPackagesRepository'

type Response =
  | Paths.GetCodeIllusionPackage.Responses.$200
  | Paths.GetCodeIllusionPackage.Responses.$401
  | Paths.GetCodeIllusionPackage.Responses.$403
  | Paths.GetCodeIllusionPackage.Responses.$404
  | Paths.GetCodeIllusionPackage.Responses.$500

export class GetCodeillusionPackagesByPackageIdExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetCodeIllusionPackage.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userCodeillusionPackagesRepository =
      new UserCodeillusionPackagesRepository(
        this.appDataSource,
        this.staticFilesBaseUrl,
      )

    const getCodeillusionPackagesByPackageIdUseCase =
      new GetCodeillusionPackagesByPackageIdUseCase(
        userCodeillusionPackagesRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetCodeIllusionPackage.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetCodeIllusionPackage.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getCodeillusionPackagesResult =
      await getCodeillusionPackagesByPackageIdUseCase.run(
        getUserResult.value,
        params.query.packageId,
      )

    if (getCodeillusionPackagesResult.hasError) {
      switch (getCodeillusionPackagesResult.error.type) {
        case 'CodeIllusionPackageNotFoundError': {
          const response404: Paths.GetCodeIllusionPackage.Responses.$404 = {
            error: getCodeillusionPackagesResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetCodeIllusionPackage.Responses.$500 = {
            error: JSON.stringify(getCodeillusionPackagesResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetCodeIllusionPackage.Responses.$200 = {
      codeIllusionPackage: getCodeillusionPackagesResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
