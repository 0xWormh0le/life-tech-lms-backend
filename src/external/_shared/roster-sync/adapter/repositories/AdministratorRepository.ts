/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource, DeepPartial, In } from 'typeorm'

import { IAdministratorRepository } from '../../domain/usecases/RosterSync'
import { Administrator } from '../../domain/entities/Administrator'
import {
  E,
  Errorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { AdministratorDistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/AdministratorDistrict'
import { AdministratorTypeormEntity } from '../../../../../adapter/typeorm/entity/Administrator'

export class AdministratorRepository implements IAdministratorRepository {
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByDistrictId(
    districtId: string,
  ): Promise<Errorable<Administrator[], E<'UnknownRuntimeError', string>>> {
    try {
      const administratorDistrictTypeormEntity =
        this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)
      const administratorDistrictsResult =
        await administratorDistrictTypeormEntity.find({
          where: {
            district: { id: districtId },
          },
          order: {
            created_date: 'ASC',
          },
          relations: ['administrator'],
        })
      const administratorTypeormEntity = this.typeormDataSource.getRepository(
        AdministratorTypeormEntity,
      )
      const administratorsResult = await administratorTypeormEntity.find({
        where: {
          id: In(administratorDistrictsResult.map((e) => e.administrator.id)),
        },
        order: {
          created_date: 'ASC',
        },
      })
      const administratorData: Administrator[] = []

      for (const u of administratorsResult) {
        administratorData.push({
          id: u.id,
          userId: u.user_id,
          firstName: u.first_name,
          lastName: u.last_name,
          administratorLMSId: u.administrator_lms_id,
          classlinkTenantId: u.classlink_tenant_id,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: administratorData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get administrators in Life Is Tech portal for district id: ${districtId} ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async getAllByLmsId(
    lmsIds: string[],
    tenantId: string | null,
  ): Promise<Errorable<Administrator[], E<'UnknownRuntimeError', string>>> {
    try {
      const administratorTypeormEntity = this.typeormDataSource.getRepository(
        AdministratorTypeormEntity,
      )
      const administratorsResult = await administratorTypeormEntity.find({
        where: {
          administrator_lms_id: In(lmsIds),
          classlink_tenant_id: tenantId ?? undefined,
        },
        order: {
          created_date: 'ASC',
        },
      })
      const administratorData: Administrator[] = []

      for (const u of administratorsResult) {
        administratorData.push({
          id: u.id,
          userId: u.user_id,
          firstName: u.first_name,
          lastName: u.last_name,
          administratorLMSId: u.administrator_lms_id,
          classlinkTenantId: u.classlink_tenant_id,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: administratorData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get administrators in Life Is Tech portal for lmsIds: ${JSON.stringify(
          lmsIds,
        )} ${JSON.stringify(e)}`,
      )
    }
  }

  async createAdministrators(
    administrators: Administrator[],
  ): Promise<
    Errorable<
      Administrator[],
      E<'UnknownRuntimeError'> | E<'AlreadyExistError'>
    >
  > {
    try {
      const administratorTypeormEntity = this.typeormDataSource.getRepository(
        AdministratorTypeormEntity,
      )
      const administratorsToCreate: DeepPartial<AdministratorTypeormEntity>[] =
        administrators.map((e) => ({
          id: e.id,
          user_id: e.userId,
          first_name: e.firstName,
          last_name: e.lastName,
          administrator_lms_id: e.administratorLMSId,
          classlink_tenant_id: e.classlinkTenantId,
          is_deactivated: e.isDeactivated,
        }))
      const createResult = await administratorTypeormEntity.save(
        administratorsToCreate,
      )

      return {
        hasError: false,
        error: null,
        value: createResult.map((e) => ({
          id: e.id,
          userId: e.user_id,
          firstName: e.first_name,
          lastName: e.last_name,
          administratorLMSId: e.administrator_lms_id,
          classlinkTenantId: e.classlink_tenant_id,
          isDeactivated: e.is_deactivated,
        })),
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to create administrators into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async updateAdministrators(
    administrators: Administrator[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const administratorTypeormEntity = this.typeormDataSource.getRepository(
        AdministratorTypeormEntity,
      )
      const administratorsToUpdate: DeepPartial<AdministratorTypeormEntity>[] =
        administrators.map((e) => ({
          id: e.id,
          user_id: e.userId,
          first_name: e.firstName,
          last_name: e.lastName,
          administrator_lms_id: e.administratorLMSId,
          classlink_tenant_id: e.classlinkTenantId,
          is_deactivated: e.isDeactivated,
        }))

      await administratorTypeormEntity.save(administratorsToUpdate)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update administrators into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteAdministrators(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const administratorTypeormEntity = this.typeormDataSource.getRepository(
        AdministratorTypeormEntity,
      )

      await administratorTypeormEntity.update(
        { id: In(ids) },
        {
          is_deactivated: true,
        },
      )

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to deactivate administrators from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
