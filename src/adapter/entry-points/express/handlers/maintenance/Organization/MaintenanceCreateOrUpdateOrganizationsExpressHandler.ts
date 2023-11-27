import { DataSource, In, Repository } from 'typeorm'

import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { Handler } from '../../shared/types'
import {
  MaintenanceCreateOrUpdateOrganizationsUseCase,
  IOrganizationRepository,
} from '../../../../../../domain/usecases/maintenance/Organization/MaintenanceCreateOrUpdateOrganizationsUseCase'
import { OrganizationTypeormEntity } from '../../../../../typeorm/entity/Organization'
import { fromNativeError } from '../../../../../../domain/usecases/shared/Errors'

type Response =
  | Paths.MaintenancePutOrganizations.Responses.$200
  | Paths.MaintenancePutOrganizations.Responses.$500

export class MaintenanceCreateOrUpdateOrganizationsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: Handler<
    undefined,
    undefined,
    Paths.MaintenancePutOrganizations.RequestBody,
    Response
  > = async (params) => {
    const createOrUpdateOrganizationsUseCase =
      new MaintenanceCreateOrUpdateOrganizationsUseCase({
        getOrganizations: this.getOrganizations,
        createOrganizations: this.createOrganizations,
        updateOrganizations: this.updateOrganizations,
      })
    const createOrUpdateOrganizationsResult =
      await createOrUpdateOrganizationsUseCase.run(
        params.body.organizations.map((e) => ({
          ...e,
          id: e.id ?? null,
          organizationLmsId: e.organizationLmsId ?? null,
        })),
      )

    if (createOrUpdateOrganizationsResult.hasError) {
      const response500: Paths.MaintenancePutOrganizations.Responses.$500 = {
        error: JSON.stringify(createOrUpdateOrganizationsResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.MaintenancePutOrganizations.Responses.$200 = {
      ok: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }

  private getOrganizations: IOrganizationRepository['getOrganizations'] =
    async (organizationIds) => {
      let organizationTypeormRepository: Repository<OrganizationTypeormEntity>
      let organizations: OrganizationTypeormEntity[]

      try {
        organizationTypeormRepository = this.appDataSource.getRepository(
          OrganizationTypeormEntity,
        )
        organizations = await organizationTypeormRepository.find({
          where: { id: In(organizationIds) },
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
          districtId: e.district_id,
          stateId: e.state_id ?? '',
          name: e.name,
          organizationLmsId: e.organization_lms_id ?? null,
        })),
      }
    }

  private createOrganizations: IOrganizationRepository['createOrganizations'] =
    async (organizations) => {
      let organizationTypeormRepository: Repository<OrganizationTypeormEntity>

      try {
        organizationTypeormRepository = this.appDataSource.getRepository(
          OrganizationTypeormEntity,
        )
        await organizationTypeormRepository.save(
          organizations.map<Partial<OrganizationTypeormEntity>>((e) => ({
            district_id: e.districtId,
            state_id: e.stateId,
            name: e.name,
            organization_lms_id: e.organizationLmsId ?? undefined,
          })),
        )
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to create OrganizationTypeormEntity`,
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

  private updateOrganizations: IOrganizationRepository['updateOrganizations'] =
    async (organizations) => {
      let organizationTypeormRepository: Repository<OrganizationTypeormEntity>

      try {
        organizationTypeormRepository = this.appDataSource.getRepository(
          OrganizationTypeormEntity,
        )
        await organizationTypeormRepository.save(
          organizations.map<Partial<OrganizationTypeormEntity>>((e) => ({
            id: e.id,
            district_id: e.districtId,
            state_id: e.stateId,
            name: e.name,
            organization_lms_id: e.organizationLmsId ?? undefined,
          })),
        )
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to create OrganizationTypeormEntity`,
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
