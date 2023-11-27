import { MaintenanceDistrict } from '../../../entities/maintenance/District'
import { E, Errorable } from '../../shared/Errors'

export interface IDistrictRepository {
  getAllDistricts(): Promise<
    Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetDistrictsUseCase {
  constructor(private districtRepository: IDistrictRepository) {}

  async run(): Promise<
    Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError'>>
  > {
    return this.districtRepository.getAllDistricts()
  }
}
