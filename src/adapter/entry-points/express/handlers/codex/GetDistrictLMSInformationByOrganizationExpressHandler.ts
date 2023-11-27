import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { GetDistrictLMSInformationByOrganizationUseCase } from '../../../../../domain/usecases/codex/District/GetDistrictLMSInformationByOrganizationUseCase'
import { DistrictsRepository } from '../../../../repositories/DistrictsRepository'
import { Handler } from '../shared/types'

type Response =
  | Paths.GetDistrictLMSInformationByOrganization.Responses.$200
  | Paths.GetDistrictLMSInformationByOrganization.Responses.$400
  | Paths.GetDistrictLMSInformationByOrganization.Responses.$404
  | Paths.GetDistrictLMSInformationByOrganization.Responses.$500

export class GetDistrictLMSInformationByOrganizationExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    Paths.GetDistrictLMSInformationByOrganization.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params) => {
    const districtsRepository = new DistrictsRepository(this.appDataSource)

    const getAllCodexPackagesUseCase =
      new GetDistrictLMSInformationByOrganizationUseCase(districtsRepository)
    const getDistrictLMSInfo = await getAllCodexPackagesUseCase.run(
      params.pathParams.organizationId,
    )

    if (getDistrictLMSInfo.hasError) {
      switch (getDistrictLMSInfo.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.GetDistrictLMSInformationByOrganization.Responses.$400 =
            {
              error: getDistrictLMSInfo.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'DistrictInfoNotFound': {
          const response404: Paths.GetDistrictPurchasedPackagesByDistrictId.Responses.$404 =
            {
              error: getDistrictLMSInfo.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetDistrictLMSInformationByOrganization.Responses.$500 =
            {
              error: JSON.stringify(getDistrictLMSInfo.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetDistrictLMSInformationByOrganization.Responses.$200 =
      getDistrictLMSInfo.value

    return { statusCode: 200, response: response200 }
  }
}
