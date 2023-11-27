import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { DistrictPurchasedPackageTypeormEntity } from '../typeorm/entity/DistrictPurchasedPackage'
import { packagesMapById } from '../typeorm/hardcoded-data/Pacakges/Packages'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { DistrictPurchasedPackageRepository } from './DistrictPurchasedPackageRepository'

const districtId1 = randomUUID()
const districtId2 = randomUUID()
const districtId3 = randomUUID()
const districtInfo = [
  {
    id: districtId1,
    name: 'demo-name1',
    lms_id: 'google',
    last_roster_sync_event_date: '2022-07-18 09:20:09.048',
  },
  {
    id: districtId2,
    name: 'demo-name2',
    lms_id: 'clever',
    enable_roster_sync: true,
    last_roster_sync_event_date: '2022-07-18 09:20:09.048',
  },
  {
    id: districtId3,
    name: 'demo-name3',
    lms_id: 'classlink',
    last_roster_sync_event_date: '2022-07-18 09:20:09.048',
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

  await districtTypeormRepository.save(districtInfo)

  await districtPurchasedPackageTypeormRepository.save(districtPurchasedInfo as DeepPartial<DistrictPurchasedPackageTypeormEntity>[])
})

afterEach(teardownEnvironment)

describe('test DistrictRepository for Codex', () => {
  test('success getDistrictPurchasedPackagesByDistrictId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const districtPurchasedPackageRepository = new DistrictPurchasedPackageRepository(appDataSource)
    const result = await districtPurchasedPackageRepository.getDistrictPurchasedPackagesByDistrictId(districtId1)

    if (result.hasError) {
      throw new Error(`district purchased package not found somehow`)
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)

    expect(result.value).toEqual(
      districtPurchasedInfo
        .map((item) => {
          if (item.district_id === districtId1) {
            return {
              packageCategoryId: packagesMapById[item.package_id].packageCategoryId,
              packageId: packagesMapById[item.package_id].id,
              packageName: packagesMapById[item.package_id].name,
            }
          }
        })
        .filter((item) => item !== undefined),
    )
  })
})
