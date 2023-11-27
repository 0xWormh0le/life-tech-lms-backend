/* eslint-disable no-type-assertion/no-type-assertion */
import { DataSource, DeepPartial } from 'typeorm'

import {
  Errorable,
  E,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { IDistrictRepository } from '../../domain//usecases/RosterSync'
import { District } from '../../domain//entities/District'

export class DistrictRepository implements IDistrictRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError', string>>> {
    try {
      const districtTypeormRepository = this.typeormDataSource.getRepository(
        DistrictTypeormEntity,
      )
      const districtResult = await districtTypeormRepository.findOne({
        where: { id },
      })

      if (!districtResult) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: {
          id: districtResult.id,
          name: districtResult.name,
          districtLMSId: districtResult.district_lms_id,
          classlinkTenantId: districtResult.classlink_tenant_id,
          classlinkAppId: districtResult.classlink_app_id,
          classlinkAccessToken: districtResult.classlink_access_token,
          enableRosterSync: districtResult.enable_roster_sync,
          lmsId: districtResult.lms_id,
        },
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get districts from Life Is Tech portal for district id: ${id}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async createDistricts(
    districts: Omit<District, 'id'>[],
  ): Promise<Errorable<District[], E<'UnknownRuntimeError', string>>> {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      const districtData: DeepPartial<DistrictTypeormEntity>[] = []

      districts.forEach((district) => {
        districtData.push({
          name: district.name,
          district_lms_id: district.districtLMSId,
          classlink_tenant_id: district.classlinkTenantId ?? undefined,
          classlink_access_token: district.classlinkAccessToken ?? undefined,
          classlink_app_id: district.classlinkAppId ?? undefined,
        })
      })

      const data = await districtTypeormRepository.save(districtData)

      return {
        hasError: false,
        error: null,
        value: data.map((e) => ({
          id: e.id,
          name: e.name,
          districtLMSId: e.district_lms_id,
          classlinkTenantId: e.classlink_tenant_id,
          classlinkAppId: e.classlink_app_id,
          classlinkAccessToken: e.classlink_access_token,
        })),
      }
    } catch (e) {
      return unknownRuntimeError(
        `Failed to create districts into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async updateDistricts(
    districts: District[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | 'NotFoundError'>>> {
    const districtTypeormRepository = this.typeormDataSource.getRepository(
      DistrictTypeormEntity,
    )

    try {
      for (const district of districts) {
        try {
          const districtIdData = await districtTypeormRepository.findOneBy({
            id: district.id,
          })

          if (!districtIdData) {
            return {
              hasError: true,
              error: {
                type: 'NotFoundError',
                message: `Failed to get district in Life Is Tech portal for district id: ${district.id}`,
              },
              value: null,
            }
          }
          await districtTypeormRepository.update(
            {
              id: district.id,
            },
            {
              name: district.name,
              classlink_app_id: district.classlinkAppId ?? undefined,
              classlink_access_token:
                district.classlinkAccessToken ?? undefined,
              classlink_tenant_id: district.classlinkTenantId ?? undefined,
              district_lms_id: district.districtLMSId,
            },
          )
        } catch (e: unknown) {
          return unknownRuntimeError(
            `Failed to update district into Life Is Tech portal by id: ${
              district.id
            } ${JSON.stringify(e)}`,
          )
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update district into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteDistricts(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const districtTypeormRepository = this.typeormDataSource.getRepository(
        DistrictTypeormEntity,
      )

      await districtTypeormRepository.delete(ids)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to delete district from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
