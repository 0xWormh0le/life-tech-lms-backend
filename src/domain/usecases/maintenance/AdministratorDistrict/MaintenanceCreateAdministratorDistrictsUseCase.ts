import { MaintenanceAdministratorDistrict } from '../../../entities/maintenance/AdministratorDistrict'
import { E, Errorable } from '../../shared/Errors'

export interface IAdministratorDistrictRepository {
  createAdministratorDistricts(
    administratorDistricts: Omit<MaintenanceAdministratorDistrict, 'id'>[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export class MaintenanceCreateAdministratorDistrictsUseCase {
  constructor(
    private administratorDistrictRepository: IAdministratorDistrictRepository,
  ) {}

  async run(
    administratorDistricts: MaintenanceAdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const createAdministratorDistrictsResult =
      await this.administratorDistrictRepository.createAdministratorDistricts(
        administratorDistricts,
      )

    if (createAdministratorDistrictsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: createAdministratorDistrictsResult.error.message,
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
