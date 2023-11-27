import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { AdministratorDistrictTypeormEntity } from '../../../../../typeorm/entity/AdministratorDistrict'
import {
  fromNativeError,
  ValueTypeOfPromiseErroableFunc,
} from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetAdministratorDistrictsUseCase,
  IAdministratorDistrictRepository,
} from '../../../../../../domain/usecases/maintenance/AdministratorDistrict/MaintenanceGetAdministratorDistrictsUseCase'
import { AdministratorTypeormEntity } from '../../../../../typeorm/entity/Administrator'

type Response =
  | Paths.MaintenanceGetAdministratorDistricts.Responses.$200
  | Paths.MaintenanceGetAdministratorDistricts.Responses.$500

export class MaintenanceGetAdministratorDistrictsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async () => {
    const maintenanceGetAdministratorDistrictsUseCase =
      new MaintenanceGetAdministratorDistrictsUseCase({
        getAllAdministratorDistricts: this.getAllAdministratorDistricts,
      })
    const getAdministratorDistrictsResult =
      await maintenanceGetAdministratorDistrictsUseCase.run()

    if (getAdministratorDistrictsResult.hasError) {
      const response500: Paths.MaintenanceGetAdministratorDistricts.Responses.$500 =
        {
          error: JSON.stringify(getAdministratorDistrictsResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetAdministratorDistricts.Responses.$200 =
      {
        administratorDistricts: getAdministratorDistrictsResult.value,
      }

    return { statusCode: 200, response: response200 }
  }

  private getAllAdministratorDistricts: IAdministratorDistrictRepository['getAllAdministratorDistricts'] =
    async () => {
      let administratorDistricts: AdministratorDistrictTypeormEntity[]
      let administrators: AdministratorTypeormEntity[]

      try {
        const administratorDistrictTypeormRepository =
          this.appDataSource.getRepository(AdministratorDistrictTypeormEntity)

        administratorDistricts =
          await administratorDistrictTypeormRepository.find({
            order: {
              created_date: 'ASC',
            },
            relations: ['administrator', 'district'],
          })

        const administratorIds: string[] = []

        for (const administratorDistrict of administratorDistricts) {
          if (!administratorDistrict.administrator) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `administratorDistrict.administrator is undefined some how district ${JSON.stringify(
                  administratorDistrict.district,
                )}`,
              },
              value: null,
            }
          }
          administratorIds.push(administratorDistrict.administrator.id)
        }

        const administratorTypeormRepository = this.appDataSource.getRepository(
          AdministratorTypeormEntity,
        )

        administrators = await administratorTypeormRepository.find({
          where: {
            id: In(administratorIds),
          },
        })
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get AdministratorDistrictTypeormEntity`,
          ),
          value: null,
        }
      }

      const value: ValueTypeOfPromiseErroableFunc<
        IAdministratorDistrictRepository['getAllAdministratorDistricts']
      > = []
      const administratorUserIdMap: { [adminisratorId: string]: string } = {}

      for (const administrator of administrators) {
        administratorUserIdMap[administrator.id] = administrator.user_id
      }
      for (const administratorDistrict of administratorDistricts) {
        const userId =
          administratorUserIdMap[administratorDistrict.administrator.id]

        if (!userId) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `corresponding userId not found for administratorId ${administratorDistrict.administrator.id} somehow`,
            },
            value: null,
          }
        }
        value.push({
          districtId: administratorDistrict.district.id,
          userId,
        })
      }

      return {
        hasError: false,
        error: null,
        value,
      }
    }
}
