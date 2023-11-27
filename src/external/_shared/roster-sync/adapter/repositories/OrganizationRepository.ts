/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource } from 'typeorm'

import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'
import { IOrganizationRepository } from '../../domain//usecases/RosterSync'
import { Organization } from '../../domain//entities/Organization'

export class OrganizationRepository implements IOrganizationRepository {
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByDistrictId(
    districtId: string,
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError', string>>> {
    try {
      const organizationTypeormRepository =
        this.typeormDataSource.getRepository(OrganizationTypeormEntity)
      const organizationResult = await organizationTypeormRepository.find({
        where: {
          district_id: districtId,
        },
        order: { created_date: 'ASC' },
      })

      return {
        hasError: false,
        error: null,
        value: organizationResult.map((e) => ({
          id: e.id,
          name: e.name,
          districtId: e.district_id,
          organizationLMSId: e.organization_lms_id,
          classlinkTenantId: e.classlink_tenant_id,
        })),
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get organizations in Life Is Tech portal for district id: ${districtId}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async createOrganizations(
    organizations: Organization[],
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError', string>>> {
    try {
      const organizationTypeormRepository =
        this.typeormDataSource.getRepository(OrganizationTypeormEntity)
      const organizationData: Pick<
        OrganizationTypeormEntity,
        | 'id'
        | 'district_id'
        | 'organization_lms_id'
        | 'classlink_tenant_id'
        | 'name'
      >[] = []

      organizations.forEach((organization) => {
        organizationData.push({
          id: organization.id,
          district_id: organization.districtId,
          name: organization.name,
          organization_lms_id: organization.organizationLMSId,
          classlink_tenant_id: organization.classlinkTenantId,
        })
      })

      const data = await organizationTypeormRepository.save(organizationData)

      const res = data.map<Organization>((organization) => {
        return {
          id: organization.id,
          districtId: organization.district_id,
          name: organization.name,
          organizationLMSId: organization.organization_lms_id,
          classlinkTenantId: organization.classlink_tenant_id,
        }
      })

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e) {
      return unknownRuntimeError(
        `Failed to create Organizations into Life Is Tech portal ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async updateOrganizations(
    organizations: Organization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const organizationTypeormRepository =
        this.typeormDataSource.getRepository(OrganizationTypeormEntity)

      for (const organization of organizations) {
        const organizationData = await organizationTypeormRepository.findOneBy({
          id: organization.id,
        })

        if (organizationData == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `Failed to get organization in Life Is Tech portal for organization id: ${organization.id}.`,
            },
            value: null,
          }
        }

        await organizationTypeormRepository.save({
          id: organization.id,
          name: organization.name,
          organization_lms_id: organization.organizationLMSId,
          district_id: organization.districtId,
          classlink_tenant_id: organization.classlinkTenantId,
        })
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update organizations into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteOrganizations(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    if (ids.length === 0) {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }
    try {
      const organizationTypeormRepository =
        this.typeormDataSource.getRepository(OrganizationTypeormEntity)

      await organizationTypeormRepository.delete(ids)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to delete Organizations from Life Is Tech. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
