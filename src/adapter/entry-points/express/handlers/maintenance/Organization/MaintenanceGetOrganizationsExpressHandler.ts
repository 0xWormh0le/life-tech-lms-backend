import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import { OrganizationTypeormEntity } from '../../../../../typeorm/entity/Organization'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'
import {
  MaintenanceGetOrganizationsUseCase,
  IOrganizationRepository,
} from '../../../../../../domain/usecases/maintenance/Organization/MaintenanceGetOrganizationsUseCase'

type Response =
  | Paths.MaintenanceGetOrganizations.Responses.$200
  | Paths.MaintenanceGetOrganizations.Responses.$500

export class MaintenanceGetOrganizationsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<undefined, undefined, undefined, Response> = async () => {
    const maintenanceGetOrganizationsUseCase =
      new MaintenanceGetOrganizationsUseCase({
        getAllOrganizations: this.getAllOrganizations,
      })
    const getOrganizationsResult =
      await maintenanceGetOrganizationsUseCase.run()

    if (getOrganizationsResult.hasError) {
      const response500: Paths.MaintenanceGetOrganizations.Responses.$500 = {
        error: JSON.stringify(getOrganizationsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenanceGetOrganizations.Responses.$200 = {
      organizations: getOrganizationsResult.value.map((e) => ({
        id: e.id,
        name: e.name,
        districtId: e.districtId,
        stateId: e.stateId ?? '',
        organizationLmsId: e.organizationLmsId ?? undefined,
      })),
    }

    return { statusCode: 200, response: response200 }
  }

  private getAllOrganizations: IOrganizationRepository['getAllOrganizations'] =
    async () => {
      let organizationTypeormRepository: Repository<OrganizationTypeormEntity>
      let organizations: OrganizationTypeormEntity[]

      try {
        organizationTypeormRepository = this.appDataSource.getRepository(
          OrganizationTypeormEntity,
        )
        organizations = await organizationTypeormRepository.find({
          order: {
            created_date: 'ASC',
          },
        })
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get OrganizationTypeormEntity`,
          ),
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: organizations.map((e) => ({
          id: e.id,
          name: e.name,
          districtId: e.district_id,
          stateId: e.state_id ?? '',
          organizationLmsId: e.organization_lms_id ?? null,
        })),
      }
    }
}
