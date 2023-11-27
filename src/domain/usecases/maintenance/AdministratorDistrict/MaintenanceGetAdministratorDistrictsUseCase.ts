import { MaintenanceAdministratorDistrict } from '../../../entities/maintenance/AdministratorDistrict'
import { E, Errorable } from '../../shared/Errors'

export interface IAdministratorDistrictRepository {
  getAllAdministratorDistricts(): Promise<
    Errorable<MaintenanceAdministratorDistrict[], E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetAdministratorDistrictsUseCase {
  constructor(
    private administratorDistrictRepository: IAdministratorDistrictRepository,
  ) {}

  async run(): Promise<
    Errorable<MaintenanceAdministratorDistrict[], E<'UnknownRuntimeError'>>
  > {
    return this.administratorDistrictRepository.getAllAdministratorDistricts()
  }
}
