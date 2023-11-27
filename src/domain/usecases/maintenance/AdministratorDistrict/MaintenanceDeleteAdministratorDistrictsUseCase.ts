import { MaintenanceAdministratorDistrict } from '../../../entities/maintenance/AdministratorDistrict'
import { E, Errorable } from '../../shared/Errors'

export interface IAdministratorDistrictRepository {
  deleteAdministratorDistricts(
    administratorDistricts: MaintenanceAdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError'>>>>
}

export class MaintenanceDeleteAdministratorDistrictsUseCase {
  constructor(
    private administratorDistrictRepository: IAdministratorDistrictRepository,
  ) {}

  async run(
    administratorDistricts: MaintenanceAdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const deleteAdministratorDistrictsResult =
      await this.administratorDistrictRepository.deleteAdministratorDistricts(
        administratorDistricts,
      )

    if (deleteAdministratorDistrictsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: deleteAdministratorDistrictsResult.error.message,
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
