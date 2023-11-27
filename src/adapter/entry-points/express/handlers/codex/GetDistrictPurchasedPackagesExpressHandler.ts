import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { GetDistrictPurchasedPackagesByDistrictIdUseCase } from '../../../../../domain/usecases/codex/District/GetDistrictPurchasedPackagesByDistrictIdUseCase'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { DistrictPurchasedPackageRepository } from '../../../../repositories/DistrictPurchasedPackageRepository'

type Response =
  | Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$200
  | Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$400
  | Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$401
  | Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$403
  | Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$404
  | Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$500

export class GetDistrictPurchasedPackagesExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetDistrictPurchasedPackagesByDistrictId.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const districtPurchasedPackageRepository =
      new DistrictPurchasedPackageRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$500 =
        {
          error: JSON.stringify(getUserResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$401 =
        {
          error: `token invalid ${token}`,
        }

      return { statusCode: 401, response: response401 }
    }

    const getAllCodexPackagesUseCase =
      new GetDistrictPurchasedPackagesByDistrictIdUseCase(
        districtPurchasedPackageRepository,
        administratorRepository,
        teacherRepository,
      )
    const districtPurchasedPackages = await getAllCodexPackagesUseCase.run(
      getUserResult.value,
      params.pathParams.districtId,
    )

    if (districtPurchasedPackages.hasError) {
      switch (districtPurchasedPackages.error.type) {
        case 'InvalidDistrictId': {
          const response400: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$400 =
            {
              error: districtPurchasedPackages.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$404 =
            {
              error: districtPurchasedPackages.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$404 =
            {
              error: districtPurchasedPackages.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$403 =
            {
              error: districtPurchasedPackages.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$500 =
            {
              error: JSON.stringify(districtPurchasedPackages.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$200 =
      {
        packages: districtPurchasedPackages.value,
      }

    return { statusCode: 200, response: response200 }
  }
}
