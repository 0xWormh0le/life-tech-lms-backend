import { MaintenanceOrganization } from '../../../entities/maintenance/Organization'
import { E, Errorable } from '../../shared/Errors'

export interface IOrganizationRepository {
  getAllOrganizations(): Promise<
    Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetOrganizationsUseCase {
  constructor(private OrganizationRepository: IOrganizationRepository) {}

  async run(): Promise<
    Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError'>>
  > {
    return this.OrganizationRepository.getAllOrganizations()
  }
}
