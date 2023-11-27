import { DataSource, DeepPartial, In } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceCreateAdministratorDistrictsUseCase,
  IAdministratorDistrictRepository,
} from '../../../../../../domain/usecases/maintenance/AdministratorDistrict/MaintenanceCreateAdministratorDistrictsUseCase'
import { AdministratorDistrictTypeormEntity } from '../../../../../typeorm/entity/AdministratorDistrict'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import { AdministratorTypeormEntity } from '../../../../../typeorm/entity/Administrator'

type Response =
  | Paths.MaintenancePostAdministratorDistricts.Responses.$200
  | Paths.MaintenancePostAdministratorDistricts.Responses.$500

export class MaintenanceCreateAdministratorDistrictsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePostAdministratorDistricts.RequestBody,
    Response
  > = async (params) => {
    const createAdministratorDistrictsUseCase =
      new MaintenanceCreateAdministratorDistrictsUseCase({
        createAdministratorDistricts: this.createAdministratorDistricts,
      })
    const createAdministratorDistrictsUseCaseResult =
      await createAdministratorDistrictsUseCase.run(
        params.body.administratorDistricts,
      )

    if (createAdministratorDistrictsUseCaseResult.hasError) {
      const response500: Paths.MaintenancePostAdministratorDistricts.Responses.$500 =
        {
          error: JSON.stringify(
            createAdministratorDistrictsUseCaseResult.error,
          ),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenancePostAdministratorDistricts.Responses.$200 =
      {
        ok: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }

  private createAdministratorDistricts: IAdministratorDistrictRepository['createAdministratorDistricts'] =
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

        const administratorDistrictsToSave: DeepPartial<AdministratorDistrictTypeormEntity>[] =
          []

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
          administratorDistrictsToSave.push({
            administrator: { id: administrator.id },
            district: { id: administratorDistrict.districtId },
          })
        }

        const administratorDistrictTypeormRepository =
          this.appDataSource.getRepository(AdministratorDistrictTypeormEntity)

        await administratorDistrictTypeormRepository.save(
          administratorDistrictsToSave,
        )
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to create AdministratorDistrictTypeormEntity`,
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
