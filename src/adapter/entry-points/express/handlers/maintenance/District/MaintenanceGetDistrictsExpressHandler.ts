import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { DistrictTypeormEntity } from '../../../../../typeorm/entity/District'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetDistrictsUseCase,
  IDistrictRepository,
} from '../../../../../../domain/usecases/maintenance/District/MaintenanceGetDistrictsUseCase'

type Response =
  | Paths.MaintenanceGetDistricts.Responses.$200
  | Paths.MaintenanceGetDistricts.Responses.$500

export class MaintenanceGetDistrictsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async () => {
    const maintenanceGetDistrictsUseCase = new MaintenanceGetDistrictsUseCase({
      getAllDistricts: this.getAllDistricts,
    })
    const getDistrictsResult = await maintenanceGetDistrictsUseCase.run()

    if (getDistrictsResult.hasError) {
      const response500: Paths.MaintenanceGetDistricts.Responses.$500 = {
        error: JSON.stringify(getDistrictsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetDistricts.Responses.$200 = {
      districts: getDistrictsResult.value.map((e) => ({
        id: e.id,
        name: e.name,
        stateId: e.stateId,
        lmsId: e.lmsId ?? undefined,
        enableRosterSync: e.enableRosterSync,
        districtLmsId: e.districtLmsId ?? undefined,
      })),
    }

    return { statusCode: 200, response: response200 }
  }

  private getAllDistricts: IDistrictRepository['getAllDistricts'] =
    async () => {
      let districtTypeormRepository: Repository<DistrictTypeormEntity>
      let districts: DistrictTypeormEntity[]

      try {
        districtTypeormRepository = this.appDataSource.getRepository(
          DistrictTypeormEntity,
        )
        districts = await districtTypeormRepository.find({
          order: {
            created_at: 'ASC',
          },
        })
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get DistrictTypeormEntity`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: districts.map((e) => ({
          id: e.id,
          name: e.name,
          stateId: e.state_id,
          lmsId: e.lms_id ?? null,
          enableRosterSync: e.enable_roster_sync,
          districtLmsId: e.district_lms_id ?? null,
        })),
      }
    }
}
