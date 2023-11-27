import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { AdministratorDistrictRepository } from './AdministratorDistrictRepository'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { AdministratorTypeormEntity } from '../../../../../adapter/typeorm/entity/Administrator'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { AdministratorDistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/AdministratorDistrict'

beforeEach(setupEnvironment)

afterEach(teardownEnvironment)

describe('test AdministratorDistrictRepository for Classlink', () => {
  test('success getAllByDistrictId', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create District */
    const districtRepo = appDataSource.getRepository(DistrictTypeormEntity)
    const district1 = await districtRepo.save({
      name: 'District-1',
      administrator_id: 'administrator-id-1',
    })
    const district2 = await districtRepo.save({
      name: 'District-2',
      administrator_id: 'administrator-id-2',
    })

    /* Create Administrator */
    const administratorRepo = appDataSource.getRepository(AdministratorTypeormEntity)
    const administrator1 = await administratorRepo.save({
      first_name: 'administrator_first_name_1',
      last_name: 'administrator_last_name_1',
      user_id: 'user-id-1',
    })
    const administrator2 = await administratorRepo.save({
      first_name: 'administrator_first_name_2',
      last_name: 'administrator_last_name_2',
      user_id: 'user-id-2',
    })

    const administratorDistrictRepo = appDataSource.getRepository(AdministratorDistrictTypeormEntity)

    await administratorDistrictRepo
      .createQueryBuilder()
      .insert()
      .values([
        {
          administrator: administrator1.id,
          district: district1.id,
        },
        {
          administrator: administrator2.id,
          district: district2.id,
        },
      ] as QueryDeepPartialEntity<AdministratorDistrictTypeormEntity>[])
      .execute()

    const administratorDistrictRepository = new AdministratorDistrictRepository(appDataSource)
    const result = await administratorDistrictRepository.getAllByDistrictId(district1.id)

    if (result.hasError) {
      throw new Error(`failed getAllByDistrictId`)
    }
    expect(result.value).toEqual<typeof result.value>([
      {
        districtId: district1.id,
        administratorId: administrator1.id,
      },
    ])
  })

  test('success createAdministratorDistricts', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create District */
    const districtRepo = appDataSource.getRepository(DistrictTypeormEntity)
    const district3 = await districtRepo.save({
      name: 'District-3',
      administrator_id: 'administrator-id-3',
    })
    const district4 = await districtRepo.save({
      name: 'District-4',
      administrator_id: 'administrator-id-4',
    })

    /* Create Administrator */
    const administratorRepo = appDataSource.getRepository(AdministratorTypeormEntity)
    const administrator3 = await administratorRepo.save({
      first_name: 'administrator_first_name_3',
      last_name: 'administrator_last_name_3',
      user_id: 'user-id-3',
    })
    const administrator4 = await administratorRepo.save({
      first_name: 'administrator_first_name_4',
      last_name: 'administrator_last_name_4',
      user_id: 'user-id-4',
    })

    const administratorDistrictRepository = new AdministratorDistrictRepository(appDataSource)

    const result = await administratorDistrictRepository.createAdministratorDistricts([
      { districtId: district3.id, administratorId: administrator3.id },
      { districtId: district4.id, administratorId: administrator4.id },
    ])

    if (result.hasError) {
      throw new Error(`failed createAdministratorDistricts`)
    }

    const getResult = await administratorDistrictRepository.getAllByDistrictId(district3.id)

    if (getResult.hasError) {
      throw new Error(`failed getAllByDistrictId`)
    }
    expect(getResult.value).toEqual<typeof getResult.value>([
      {
        districtId: district3.id,
        administratorId: administrator3.id,
      },
    ])
  })

  test('success deleteAdministratorDistricts', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create District */
    const districtRepo = appDataSource.getRepository(DistrictTypeormEntity)
    const district5 = await districtRepo.save({
      name: 'District-5',
      administrator_id: 'administrator-id-5',
    })
    const district6 = await districtRepo.save({
      name: 'District-6',
      administrator_id: 'administrator-id-6',
    })

    /* Create Administrator */
    const administratorRepo = appDataSource.getRepository(AdministratorTypeormEntity)
    const administrator5 = await administratorRepo.save({
      first_name: 'administrator_first_name_5',
      last_name: 'administrator_last_name_5',
      user_id: 'user-id-5',
    })
    const administrator6 = await administratorRepo.save({
      first_name: 'administrator_first_name_6',
      last_name: 'administrator_last_name_6',
      user_id: 'user-id-6',
    })

    /* Create AdministratorDistrict */
    const administratorDistrictRepo = appDataSource.getRepository(AdministratorDistrictTypeormEntity)

    await administratorDistrictRepo.save([
      {
        district: { id: district5.id },
        administrator: { id: administrator5.id },
      },
      {
        district: { id: district6.id },
        administrator: { id: administrator6.id },
      },
    ])

    const administratorDistrictRepository = new AdministratorDistrictRepository(appDataSource)

    const result = await administratorDistrictRepository.deleteAdministratorDistricts([{ districtId: district5.id, administratorId: administrator5.id }])

    if (result.hasError) {
      throw new Error(`failed createAdministratorDistricts`)
    }

    const getResultRemoved = await administratorDistrictRepository.getAllByDistrictId(district5.id)

    if (getResultRemoved.hasError) {
      throw new Error(`failed getAllByDistrictId`)
    }
    expect(getResultRemoved.value).toEqual<typeof getResultRemoved.value>([])

    const getResultNotRemoved = await administratorDistrictRepository.getAllByDistrictId(district6.id)

    if (getResultNotRemoved.hasError) {
      throw new Error(`failed getAllByDistrictId`)
    }
    expect(getResultNotRemoved.value).toEqual<typeof getResultNotRemoved.value>([{ districtId: district6.id, administratorId: administrator6.id }])
  })
})
