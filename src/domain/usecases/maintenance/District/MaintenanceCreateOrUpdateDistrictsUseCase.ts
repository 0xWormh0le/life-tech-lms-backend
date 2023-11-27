import { MaintenanceDistrict } from '../../../entities/maintenance/District'
import { E, Errorable } from '../../shared/Errors'

export interface IDistrictRepository {
  getDistricts(
    districtIds: string[],
  ): Promise<Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError'>>>
  createDistricts(
    districts: Omit<MaintenanceDistrict, 'id'>[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
  updateDistricts(
    districts: MaintenanceDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError'>>>>
}

export class MaintenanceCreateOrUpdateDistrictsUseCase {
  constructor(private districtRepository: IDistrictRepository) {}

  async run(
    districts: (Omit<MaintenanceDistrict, 'id'> & { id: string | null })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const districtsToCreate = districts
      .filter((d) => !d.id)
      .map<Omit<MaintenanceDistrict, 'id'>>((d) => ({
        name: d.name,
        stateId: d.stateId,
        lmsId: d.lmsId,
        enableRosterSync: d.enableRosterSync,
        districtLmsId: d.districtLmsId,
      }))
    const districtsToUpdate = districts.filter(
      (d) => !!d.id,
    ) as MaintenanceDistrict[]
    const getExistingDistrictsResult =
      await this.districtRepository.getDistricts(
        districtsToUpdate.map((d) => d.id),
      )

    if (getExistingDistrictsResult.hasError) {
      return getExistingDistrictsResult
    }

    if (getExistingDistrictsResult.value.length !== districtsToUpdate.length) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'Some of given districts those has id done not exist in DB',
        },
        value: null,
      }
    }

    const createDistrictsResult = await this.districtRepository.createDistricts(
      districtsToCreate,
    )

    if (createDistrictsResult.hasError) {
      return {
        hasError: true,
        error: {
          ...createDistrictsResult.error,
          type: 'UnknownRuntimeError',
        },
        value: null,
      }
    }

    const updateDistrictsResult = await this.districtRepository.updateDistricts(
      districtsToUpdate,
    )

    if (updateDistrictsResult.hasError) {
      return {
        hasError: true,
        error: {
          ...updateDistrictsResult.error,
          type: 'UnknownRuntimeError',
        },
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
