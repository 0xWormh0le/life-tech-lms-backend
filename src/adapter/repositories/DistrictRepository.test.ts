import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { DistrictPurchasedPackageTypeormEntity } from '../typeorm/entity/DistrictPurchasedPackage'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'

import { DistrictsRepository } from './DistrictsRepository'

const districtId1 = randomUUID()
const districtId2 = randomUUID()
const districtId3 = randomUUID()
const organizationId = randomUUID()
const districtInfo = [
  {
    id: districtId1,
    name: 'demo-name1',
    lms_id: 'google',
    last_roster_sync_event_date: '2022-07-18T09:20:09.048Z',
  },
  {
    id: districtId2,
    name: 'demo-name2',
    lms_id: 'clever',
    enable_roster_sync: true,
    last_roster_sync_event_date: '2022-07-18T09:20:09.048Z',
  },
  {
    id: districtId3,
    name: 'demo-name3',
    lms_id: 'classlink',
    last_roster_sync_event_date: '2022-07-18T09:20:09.048Z',
    district_lms_id: 'district-lms-3',
  },
]
const districtPurchasedInfo = [
  { district_id: districtId1, package_id: 'codeillusion-package-basic-full-premium-heroic' },
  { district_id: districtId1, package_id: 'codeillusion-package-basic-full-premium-adventurous' },
  { district_id: districtId1, package_id: 'codeillusion-package-basic-full-standard' },
  { district_id: districtId1, package_id: 'codeillusion-package-basic-half-premium-heroic' },
  { district_id: districtId2, package_id: 'codeillusion-package-basic-full-premium-heroic' },
  { district_id: districtId2, package_id: 'codeillusion-package-basic-full-premium-adventurous' },
  { district_id: districtId2, package_id: 'codeillusion-package-basic-half-premium-adventurous' },
]

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error')
  }

  const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const districtPurchasedPackageTypeormRepository = appDataSource.getRepository(DistrictPurchasedPackageTypeormEntity)
  const organizationTypeormRepository = appDataSource.getRepository(OrganizationTypeormEntity)

  await districtTypeormRepository.save(districtInfo)
  await organizationTypeormRepository.save({ id: organizationId, name: 'organization-1', district_id: districtId1 })
  await districtPurchasedPackageTypeormRepository.save(districtPurchasedInfo as DeepPartial<DistrictPurchasedPackageTypeormEntity>[])
})

afterEach(teardownEnvironment)

describe('test DistrictRepository for Codex', () => {
  test('success getById', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getById(districtId3)

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(result.value).toEqual({
      id: districtId3,
      name: 'demo-name3',
      districtLMSId: 'district-lms-3',
      lmsId: 'classlink',
      enableRosterSync: false,
      lastRosterSyncEventDate: '2022-07-18T09:20:09.048Z',
      lastRosterSyncEventId: null,
    })
  })

  test('success getDistricts', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getDistricts()

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(
      result.value.map((item) => {
        return {
          id: item.id,
          name: item.name,
          lmsId: item.lmsId,
        }
      }),
    ).toEqual(
      districtInfo.map((item) => {
        return {
          id: item.id,
          name: item.name,
          lmsId: item.lms_id,
        }
      }),
    )
  })

  test('success checkDistrictIsExistsByDistrictLmsId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.checkDistrictIsExistsByDistrictLmsId('district-id-3', false)

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(false)
  })

  test('success getDistrictByDistrictLmsId for clever', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getDistrictByDistrictLmsId('district-lms-3', false)

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual({
      id: districtId3,
      districtLMSId: 'district-lms-3',
      enableRosterSync: false,
      lastRosterSyncEventDate: '2022-07-18T09:20:09.048Z',
      lastRosterSyncEventId: null,
      lmsId: 'classlink',
      name: 'demo-name3',
    })
  })

  test('success getRosterSyncDistrictByDistrictId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getRosterSyncDistrictByDistrictId(districtId2)

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual({
      id: districtId2,
      eventId: null,
    })
  })

  test('success updateLastRosterSyncEventId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)
    const result = await districtRepository.updateLastRosterSyncEventId({
      districtId: districtId2,
      eventId: 'event-id-1',
    })

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)

    const checkUpdateLastRosterSyncEventId = await districtTypeormRepository.findOne({ where: { id: districtId2 } })

    if (!checkUpdateLastRosterSyncEventId) {
      throw new Error(`district not found of id :${districtId2}`)
    }
    expect({ districtId: checkUpdateLastRosterSyncEventId['id'], eventId: checkUpdateLastRosterSyncEventId['last_roster_sync_event_id'] }).toEqual({
      districtId: districtId2,
      eventId: 'event-id-1',
    })
  })

  test('success getDistrictByDistrictLmsId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getDistrictByDistrictLMSId('district-lms-3')

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual({
      id: districtId3,
      districtLMSId: 'district-lms-3',
      enableRosterSync: false,
      lastRosterSyncEventDate: '2022-07-18T09:20:09.048Z',
      lastRosterSyncEventId: null,
      lmsId: 'classlink',
      name: 'demo-name3',
    })
  })

  test('success getDistrictLMSInformationByOrganizationId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getDistrictLMSInformationByOrganizationId(organizationId)

    if (result.hasError) {
      throw new Error(`District lms information not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(
      districtInfo
        .map((item) => {
          if (item.id === districtId1) {
            return {
              districtId: districtId1,
              lmsId: item.lms_id,
              districtName: item.name,
            }
          }
        })
        .filter((item) => item !== undefined)[0],
    )
  })

  test('success getDistrictByDistrictId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const result = await districtRepository.getDistrictByDistrictId(districtId3)

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }
    expect({ ...result.value, lastRosterSyncEventDate: new Date(result.value.lastRosterSyncEventDate).toUTCString() }).toEqual({
      id: districtId3,
      name: 'demo-name3',
      districtLMSId: 'district-lms-3',
      lmsId: 'classlink',
      enableRosterSync: false,
      lastRosterSyncEventDate: 'Mon, 18 Jul 2022 09:20:09 GMT',
      lastRosterSyncEventId: null,
      stateId: null,
    })
  })

  test('success updateStateId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)

    const result = await districtRepository.updateStateId('district-lms-3', 'AL')

    if (result.hasError) {
      throw new Error(`district not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)

    const districtResult = await districtTypeormRepository.findOneBy({
      district_lms_id: 'district-lms-3',
    })

    if (!districtResult) {
      throw new Error(`district not found somehow`)
    }
    expect(districtResult['district_lms_id']).toEqual('district-lms-3')
    expect(districtResult['state_id']).toEqual('AL')
  })

  test('success create district', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)

    const createDistrict = await districtRepository.createDistrict(
      { id: 'user-id-1', role: 'internalOperator' },
      {
        name: 'demo-name4',
        lmsId: 'google',
      },
    )

    if (createDistrict.hasError) {
      throw new Error(`failed districtRepository.createDistricts ${JSON.stringify(createDistrict.error)}`)
    }
    expect(createDistrict.hasError).toEqual(false)
    expect(createDistrict.error).toEqual(null)
    expect(createDistrict.value).toEqual(undefined)

    const checkCreatedDistrictCheck = await districtTypeormRepository.findOne({
      where: {
        name: 'demo-name4',
      },
    })

    if (!checkCreatedDistrictCheck) {
      throw new Error(`district named demo-name4 was not created`)
    }

    expect({
      name: checkCreatedDistrictCheck['name'],
      lmsId: checkCreatedDistrictCheck['lms_id'],
    }).toEqual({
      name: 'demo-name4',
      lmsId: 'google',
    })
  })

  test('success update district', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)
    const districtTypeormRepository = appDataSource.getRepository(DistrictTypeormEntity)

    const result = await districtRepository.editDistrict(
      {
        id: 'user-id-1',
        role: 'internalOperator',
      },
      {
        name: 'Demo-name-3',
        lmsId: 'clever',
      },
      districtId3,
    )

    expect(result.hasError).toBe(false)
    expect(result.error).toEqual(null)
    expect(result.value).toBe(undefined)

    const checkUpdatedDistrictCheck = await districtTypeormRepository.findOne({
      where: {
        id: districtId3,
      },
    })

    if (!checkUpdatedDistrictCheck) {
      throw new Error(`district named demo-name4 was not created`)
    }

    expect({
      name: checkUpdatedDistrictCheck['name'],
      lmsId: checkUpdatedDistrictCheck['lms_id'],
    }).toEqual({
      name: 'Demo-name-3',
      lmsId: 'clever',
    })
  })

  test('success delete district', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtRepository = new DistrictsRepository(appDataSource)

    const resultDelete = await districtRepository.deleteDistrict(districtId3)

    expect(resultDelete.hasError).toEqual(false)

    const resultAfterDelete3 = await districtRepository.getById(districtId3)

    expect(resultAfterDelete3.value).toEqual(null)
  })
})
