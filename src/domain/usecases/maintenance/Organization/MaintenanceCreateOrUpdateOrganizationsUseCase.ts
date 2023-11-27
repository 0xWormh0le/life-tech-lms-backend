import { MaintenanceOrganization } from '../../../entities/maintenance/Organization'
import { E, Errorable } from '../../shared/Errors'

export interface IOrganizationRepository {
  getOrganizations(
    OrganizationIds: string[],
  ): Promise<Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError'>>>
  createOrganizations(
    Organizations: Omit<MaintenanceOrganization, 'id'>[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
  updateOrganizations(
    Organizations: MaintenanceOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError'>>>>
}

export class MaintenanceCreateOrUpdateOrganizationsUseCase {
  constructor(private OrganizationRepository: IOrganizationRepository) {}

  async run(
    Organizations: (Omit<MaintenanceOrganization, 'id'> & {
      id: string | null
    })[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const OrganizationsToCreate = Organizations.filter((d) => !d.id).map<
      Omit<MaintenanceOrganization, 'id'>
    >((d) => ({
      name: d.name,
      districtId: d.districtId,
      stateId: d.stateId,
      organizationLmsId: d.organizationLmsId,
    }))
    const OrganizationsToUpdate = Organizations.filter(
      (d) => !!d.id,
    ) as MaintenanceOrganization[]
    const getExistingOrganizationsResult =
      await this.OrganizationRepository.getOrganizations(
        OrganizationsToUpdate.map((d) => d.id),
      )

    if (getExistingOrganizationsResult.hasError) {
      return getExistingOrganizationsResult
    }

    if (
      getExistingOrganizationsResult.value.length !==
      OrganizationsToUpdate.length
    ) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message:
            'Some of given Organizations those has id done not exist in DB',
        },
        value: null,
      }
    }

    const createOrganizationsResult =
      await this.OrganizationRepository.createOrganizations(
        OrganizationsToCreate,
      )

    if (createOrganizationsResult.hasError) {
      return {
        hasError: true,
        error: {
          ...createOrganizationsResult.error,
          type: 'UnknownRuntimeError',
        },
        value: null,
      }
    }

    const updateOrganizationsResult =
      await this.OrganizationRepository.updateOrganizations(
        OrganizationsToUpdate,
      )

    if (updateOrganizationsResult.hasError) {
      return {
        hasError: true,
        error: {
          ...updateOrganizationsResult.error,
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
