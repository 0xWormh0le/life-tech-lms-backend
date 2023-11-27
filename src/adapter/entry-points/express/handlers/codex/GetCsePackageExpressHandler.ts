import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { GetCsePackageUseCase } from '../../../../../domain/usecases/codex/CsePackage/GetCsePackageUseCase'
import { UserRepository } from '../../../../repositories/UserRepository'
import { CsePackageRepository } from '../../../../repositories/CsePackageRepository'
import { PackageLessonConfigurationRepository } from '../../../../repositories/PackageLessonConfigurationRepository'
import { CsePackageUnitDefinitionRepository } from '../../../../repositories/CsePackageUnitDefinitionRepository'
import { CsePackageLessonDefinitionRepository } from '../../../../repositories/CsePackageLessonDefinitionRepository'

type Response =
  | Paths.GetCsePackage.Responses.$200
  | Paths.GetCsePackage.Responses.$401
  | Paths.GetCsePackage.Responses.$404
  | Paths.GetCsePackage.Responses.$500

export class GetCsePackageExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetCsePackage.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
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

    const csePackageRepository = new CsePackageRepository()
    const packageLessonConfigurationRepository =
      new PackageLessonConfigurationRepository()
    const csePackageUnitDefinitionRepository =
      new CsePackageUnitDefinitionRepository()
    const csePackageLessonDefinitionRepository =
      new CsePackageLessonDefinitionRepository()

    const getCsePackageUseCase = new GetCsePackageUseCase(
      csePackageRepository,
      packageLessonConfigurationRepository,
      csePackageUnitDefinitionRepository,
      csePackageLessonDefinitionRepository,
    )
    const getCsePackageUseCaseResult = await getCsePackageUseCase.run(
      params.pathParams.packageId,
    )

    if (getCsePackageUseCaseResult.hasError) {
      switch (getCsePackageUseCaseResult.error.type) {
        case 'NotFoundError':
          const response404: Paths.GetCsePackage.Responses.$404 = {
            error: getCsePackageUseCaseResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        default:
          const response500: Paths.GetCsePackage.Responses.$500 = {
            error: JSON.stringify(getCsePackageUseCaseResult.error),
          }

          return { statusCode: 500, response: response500 }
      }
    }

    const response200: Paths.GetCsePackage.Responses.$200 = {
      csePackage: getCsePackageUseCaseResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
