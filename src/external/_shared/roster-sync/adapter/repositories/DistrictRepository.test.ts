import { randomUUID } from 'crypto'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { DistrictRepository } from './DistrictRepository'

const districtId3 = randomUUID()
const districtId4 = randomUUID()
const districtId5 = randomUUID()

beforeAll(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error')
  }

  const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)

  await districtTypeormRepository.save([
    {
      id: districtId3,
      name: 'demo-name3',
      district_lms_id: 'demo-district_lms_id3',
      classlink_tenant_id: 'demo-classlink_tenant_id3',
      classlink_access_token: 'demo-classlink_access_token3',
      classlink_app_id: 'demo-classlink_app_id3',
    },
    {
      id: districtId4,
      name: 'demo-name4',
      district_lms_id: 'demo-district_lms_id4',
      classlink_tenant_id: 'demo-classlink_tenant_id4',
      classlink_access_token: 'demo-classlink_access_token4',
      classlink_app_id: 'demo-classlink_app_id4',
    },
    {
      id: districtId5,
      name: 'demo-name5',
      district_lms_id: 'demo-district_lms_id5',
      classlink_tenant_id: 'demo-classlink_tenant_id5',
      classlink_access_token: 'demo-classlink_access_token5',
      classlink_app_id: 'demo-classlink_app_id5',
    },
  ])
})

afterAll(teardownEnvironment)

describe('test DistrictRepository for Classlink', () => {
  test('success create district', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    const districtRepository = new DistrictRepository(appDataSource)

    const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)
    const districts = await districtRepository.createDistricts([
      {
        name: 'demo-name1',
        classlinkAppId: 'appId1',
        classlinkTenantId: 'tenant-id-1',
        classlinkAccessToken: 'token1',
        districtLMSId: 'district-lms-id-1',
      },
      {
        name: 'demo-name2',
        classlinkAppId: 'appId2',
        classlinkTenantId: 'tenant-id-1',
        classlinkAccessToken: 'token2',
        districtLMSId: 'district-lms-id-2',
      },
    ])

    if (districts.hasError) {
      throw new Error(`failed districtRepository.createDistricts ${JSON.stringify(districts.error)}`)
    }

    const checkCreatedDistrictCheck1 = await districtTypeormRepository.findOne({
      where: {
        name: 'demo-name1',
      },
    })
    const checkCreatedDistrictCheck2 = await districtTypeormRepository.findOne({
      where: {
        name: 'demo-name2',
      },
    })

    if (!checkCreatedDistrictCheck1) {
      throw new Error(`district named demo-name1 was not created`)
    }

    if (!checkCreatedDistrictCheck2) {
      throw new Error(`district named demo-name2 was not created`)
    }

    expect(districts.value).toEqual<typeof districts.value>([
      {
        id: checkCreatedDistrictCheck1.id,
        name: 'demo-name1',
        classlinkAppId: 'appId1',
        classlinkTenantId: 'tenant-id-1',
        classlinkAccessToken: 'token1',
        districtLMSId: 'district-lms-id-1',
      },
      {
        id: checkCreatedDistrictCheck2.id,
        name: 'demo-name2',
        classlinkAppId: 'appId2',
        classlinkTenantId: 'tenant-id-1',
        classlinkAccessToken: 'token2',
        districtLMSId: 'district-lms-id-2',
      },
    ])
  })

  test('success get districts', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictRepository(appDataSource)
    const result = await districtRepository.getById(districtId3)

    if (result.hasError) {
      throw new Error(`distrcit not found somehow`)
    }

    expect(result.value).toEqual<(typeof result)['value']>({
      id: districtId3,
      name: 'demo-name3',
      districtLMSId: 'demo-district_lms_id3',
      classlinkTenantId: 'demo-classlink_tenant_id3',
      classlinkAccessToken: 'demo-classlink_access_token3',
      classlinkAppId: 'demo-classlink_app_id3',
      enableRosterSync: false,
      lmsId: null,
    })
  })

  test('success update district', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictRepository(appDataSource)

    const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)
    const forUpdateData = await districtTypeormRepository.findOne({
      where: {
        name: 'demo-name1',
      },
    })

    if (forUpdateData) {
      const result = await districtRepository.updateDistricts([
        {
          id: forUpdateData.id,
          classlinkAccessToken: 'changedClasslinkAccessToken',
          classlinkAppId: 'changedClasslinkAppId',
          classlinkTenantId: 'changedClassLinkTenantId',
          districtLMSId: 'changedDistrictLmsId',
          name: 'changedName',
        },
      ])

      expect(result.error).toEqual(null)
      expect(result.value).toBe(undefined)
      expect(result.hasError).toBe(false)
    } else {
      throw new Error(`district not found somehow`)
    }

    const afterUpdateResult = await districtTypeormRepository.findOne({
      where: {
        id: forUpdateData.id,
      },
    })

    if (!afterUpdateResult) {
      throw new Error(`afterUpdateResult is null`)
    }

    expect(afterUpdateResult.name).toEqual('changedName')
    expect(afterUpdateResult.district_lms_id).toEqual('changedDistrictLmsId')
    expect(afterUpdateResult.classlink_app_id).toEqual('changedClasslinkAppId')
    expect(afterUpdateResult.classlink_access_token).toEqual('changedClasslinkAccessToken')
    expect(afterUpdateResult.classlink_tenant_id).toEqual('changedClassLinkTenantId')
  })

  test('success delete district', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictRepository(appDataSource)

    const resultDelete = await districtRepository.deleteDistricts([districtId3, districtId4])

    expect(resultDelete.hasError).toEqual(false)

    const resultAfterDelete3 = await districtRepository.getById(districtId3)

    expect(resultAfterDelete3.value).toEqual(null)

    const resultAfterDelete4 = await districtRepository.getById(districtId4)

    expect(resultAfterDelete4.value).toEqual(null)

    const resultAfterDelete5 = await districtRepository.getById(districtId5)

    expect(resultAfterDelete5.value).not.toEqual(null)
  })
})
