import { DataSource } from 'typeorm'
import { AdministratorDistrict } from '../../domain/entities/codex/AdministratorDistrict'
import { E, Errorable } from '../../domain/usecases/shared/Errors'
import { AdministratorDistrictTypeormEntity } from '../typeorm/entity/AdministratorDistrict'

export class AdministratorDistrictRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getAllByAdministratorId(
    administaratorId: string,
  ): Promise<
    Errorable<AdministratorDistrict[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const administratorDistrictTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)
      const administratorDistricts =
        await administratorDistrictTypeormRepository.find({
          where: {
            administrator: { id: administaratorId },
          },
          relations: ['administrator', 'district'],
        })

      return {
        hasError: false,
        error: null,
        value: administratorDistricts.map((e) => ({
          administratorId: e.administrator.id,
          districtId: e.district.id,
        })),
      }
    } catch (e) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `failed to get administratorDistricts for administratorId ${administaratorId} ${JSON.stringify(
            e,
          )}`,
        },
        value: null,
      }
    }
  }
}
