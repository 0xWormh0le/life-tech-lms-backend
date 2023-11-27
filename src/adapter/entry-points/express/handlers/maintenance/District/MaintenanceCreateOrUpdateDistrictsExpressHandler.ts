import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceCreateOrUpdateDistrictsUseCase,
  IDistrictRepository,
} from '../../../../../../domain/usecases/maintenance/District/MaintenanceCreateOrUpdateDistrictsUseCase'
import { DistrictTypeormEntity } from '../../../../../typeorm/entity/District'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'

type Response =
  | Paths.MaintenancePutDistricts.Responses.$200
  | Paths.MaintenancePutDistricts.Responses.$500

export class MaintenanceCreateOrUpdateDistrictsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePutDistricts.RequestBody,
    Response
  > = async (params) => {
    const createOrUpdateDistrictsUseCase =
      new MaintenanceCreateOrUpdateDistrictsUseCase({
        getDistricts: this.getDistricts,
        createDistricts: this.createDistricts,
        updateDistricts: this.updateDistricts,
      })
    const createOrUpdateDistrictsResult =
      await createOrUpdateDistrictsUseCase.run(
        params.body.districts.map((e) => ({
          ...e,
          id: e.id ?? null,
          lmsId: e.lmsId ?? null,
          enableRosterSync: e.enableRosterSync ?? false,
          districtLmsId: e.districtLmsId ?? null,
        })),
      )

    if (createOrUpdateDistrictsResult.hasError) {
      const response500: Paths.MaintenancePutDistricts.Responses.$500 = {
        error: JSON.stringify(createOrUpdateDistrictsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenancePutDistricts.Responses.$200 = {
      ok: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }

  private getDistricts: IDistrictRepository['getDistricts'] = async (
    districtIds,
  ) => {
    let districtTypeormRepository: Repository<DistrictTypeormEntity>
    let districts: DistrictTypeormEntity[]

    try {
      districtTypeormRepository = this.appDataSource.getRepository(
        DistrictTypeormEntity,
      )
      districts = await districtTypeormRepository.find({
        where: { id: In(districtIds) },
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

  private createDistricts: IDistrictRepository['createDistricts'] = async (
    districts,
  ) => {
    let districtTypeormRepository: Repository<DistrictTypeormEntity>

    try {
      districtTypeormRepository = this.appDataSource.getRepository(
        DistrictTypeormEntity,
      )
      await districtTypeormRepository.save(
        districts.map<Partial<DistrictTypeormEntity>>((e) => ({
          name: e.name,
          state_id: e.stateId,
          lms_id: e.lmsId ?? undefined,
          enable_roster_sync: e.enableRosterSync,
          district_lms_id: e.districtLmsId ?? undefined,
        })),
      )
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create DistrictTypeormEntity`,
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

  private updateDistricts: IDistrictRepository['updateDistricts'] = async (
    districts,
  ) => {
    let districtTypeormRepository: Repository<DistrictTypeormEntity>

    try {
      districtTypeormRepository = this.appDataSource.getRepository(
        DistrictTypeormEntity,
      )
      await districtTypeormRepository.save(
        districts.map<Partial<DistrictTypeormEntity>>((e) => ({
          id: e.id,
          name: e.name,
          state_id: e.stateId,
          lms_id: e.lmsId ?? undefined,
          enable_roster_sync: e.enableRosterSync,
          district_lms_id: e.districtLmsId ?? undefined,
        })),
      )
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to update DistrictTypeormEntity`,
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
