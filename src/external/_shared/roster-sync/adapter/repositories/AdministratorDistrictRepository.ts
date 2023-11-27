/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource } from 'typeorm'

import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { IAdministratorDistrictRepository } from '../../domain/usecases/RosterSync'
import { AdministratorDistrict } from '../../domain/entities/AdministratorDistrict'
import { AdministratorDistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/AdministratorDistrict'

export class AdministratorDistrictRepository
  implements IAdministratorDistrictRepository
{
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByDistrictId(
    districtId: string,
  ): Promise<
    Errorable<AdministratorDistrict[], E<'UnknownRuntimeError', string>>
  > {
    const administratorDistrictTypeormRepository =
      this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)

    try {
      const districtAdministrators: AdministratorDistrict[] =
        await administratorDistrictTypeormRepository
          .createQueryBuilder()
          .where('district_id = :districtId', { districtId })
          .select('administrator_id', 'administratorId')
          .addSelect('district_id', 'districtId')
          .getRawMany()

      return {
        hasError: false,
        error: null,
        value: districtAdministrators,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get administrators from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async createAdministratorDistricts(
    administratorDistricts: AdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    const administratorDistrictTypeormRepository =
      this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)

    try {
      const administratorDistrictsData: {
        administrator: string
        district: string
      }[] = []

      administratorDistricts.forEach((administratorDistrict) => {
        administratorDistrictsData.push({
          district: administratorDistrict.districtId,
          administrator: administratorDistrict.administratorId,
        })
      })

      await administratorDistrictTypeormRepository
        .createQueryBuilder('administrator_district')
        .insert()
        .values(
          administratorDistrictsData as QueryDeepPartialEntity<AdministratorDistrictTypeormEntity>[],
        )
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to add administrators into district of Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteAdministratorDistricts(
    administratorDistricts: AdministratorDistrict[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    const administratorDistrictTypeormRepository =
      this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)

    try {
      if (administratorDistricts.length === 0) {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }

      for (const administratorDistrict of administratorDistricts) {
        await administratorDistrictTypeormRepository.delete({
          administrator: { id: administratorDistrict.administratorId },
          district: { id: administratorDistrict.districtId },
        })
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to delete administrators from the Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
