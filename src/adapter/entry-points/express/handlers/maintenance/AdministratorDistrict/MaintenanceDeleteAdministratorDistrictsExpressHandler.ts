import { DataSource, DeepPartial, In } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceDeleteAdministratorDistrictsUseCase,
  IAdministratorDistrictRepository,
} from '../../../../../../domain/usecases/maintenance/AdministratorDistrict/MaintenanceDeleteAdministratorDistrictsUseCase'
import { AdministratorDistrictTypeormEntity } from '../../../../../typeorm/entity/AdministratorDistrict'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { AdministratorTypeormEntity } from '../../../../../typeorm/entity/Administrator'

type Response =
  | Paths.MaintenanceDeleteAdministratorDistricts.Responses.$200
  | Paths.MaintenanceDeleteAdministratorDistricts.Responses.$500

export class MaintenanceDeleteAdministratorDistrictsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenanceDeleteAdministratorDistricts.RequestBody,
    Response
  > = async (params) => {
    const deleteAdministratorDistrictsUseCase =
      new MaintenanceDeleteAdministratorDistrictsUseCase({
        deleteAdministratorDistricts: this.deleteAdministratorDistricts,
      })
    const deleteAdministratorDistrictsUseCaseResult =
      await deleteAdministratorDistrictsUseCase.run(
        params.body.administratorDistricts,
      )

    if (deleteAdministratorDistrictsUseCaseResult.hasError) {
      const response500: Paths.MaintenanceDeleteAdministratorDistricts.Responses.$500 =
        {
          error: JSON.stringify(
            deleteAdministratorDistrictsUseCaseResult.error,
          ),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceDeleteAdministratorDistricts.Responses.$200 =
      {
        ok: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }

  private deleteAdministratorDistricts: IAdministratorDistrictRepository['deleteAdministratorDistricts'] =
    async (administratorDistricts) => {
      try {
        const administratorTypeormRepository = this.appDataSource.getRepository(
          AdministratorTypeormEntity,
        )
        const administrators = await administratorTypeormRepository.find({
          where: {
            user_id: In(administratorDistricts.map((e) => e.userId)),
          },
        })

        const administratorDistrictTypeormRepository =
          this.appDataSource.getRepository(AdministratorDistrictTypeormEntity)

        for (const administratorDistrict of administratorDistricts) {
          const administrator = administrators.find(
            (e) => e.user_id === administratorDistrict.userId,
          )

          if (!administrator) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `administrator not found for userId ${administratorDistrict.userId}`,
              },
              value: null,
            }
          }
          await administratorDistrictTypeormRepository.delete({
            district: { id: administratorDistrict.districtId },
            administrator: { id: administrator.id },
          })
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to delete AdministratorDistrictTypeormEntity`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }
}
