import { Repository } from 'typeorm'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbDistrictPurchasedPackageRepository } from './RdbDistrictPurchasedPackageRepository'
import { DistrictPurchasedPackage } from '../../../domain/entities/codex-v2/DistrictPurchasedPackage'
import { DistrictTypeormEntity } from '../../typeorm/entity/District'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbDistrictPurchasedPackageRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbDistrictPurchasedPackageRepository: RdbDistrictPurchasedPackageRepository
  let districtTypeormRepo: Repository<DistrictTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbDistrictPurchasedPackageRepository = new RdbDistrictPurchasedPackageRepository(appDataSource)
    districtTypeormRepo = appDataSource.getRepository(DistrictTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbDistrictPurchasedPackageRepository.issueId()
      const resultSecond = await rdbDistrictPurchasedPackageRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id: string
    let districtId: string
    let toBeCreated: DistrictPurchasedPackage
    let toBeUpdated: Partial<DistrictPurchasedPackage>
    let toBeUntouched: DistrictPurchasedPackage

    test('issue new id', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.issueId()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()

      if (!res.value) {
        throw new Error()
      }
      id = res.value
    })

    test('create district', async () => {
      const districtIdRes = await rdbDistrictPurchasedPackageRepository.issueId()

      if (!districtIdRes.value) {
        throw new Error('failed to create id for district of toBeUntouched')
      }
      districtId = districtIdRes.value
      await districtTypeormRepo.insert({
        id: districtId,
        name: `test-district-name-${districtId}`,
        lms_id: `test-district-lms-${districtId}`,
        district_lms_id: `test-district-district-lms-id-${districtId}`,
        created_user_id: `test-district-created-user-id-${districtId}`,
        created_at: nowStr,
        enable_roster_sync: false,
      })
    })

    test('create toBeUntouched', async () => {
      const toBeUntouchedIdRes = await rdbDistrictPurchasedPackageRepository.issueId()
      const toBeUntouchedDistrictIdRes = await rdbDistrictPurchasedPackageRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      if (!toBeUntouchedDistrictIdRes.value) {
        throw new Error('failed to create id for district of toBeUntouched')
      }

      const toBeUntouchedDistrictId = toBeUntouchedDistrictIdRes.value

      await districtTypeormRepo.insert({
        id: toBeUntouchedDistrictId,
        name: `test-district-name-${toBeUntouchedDistrictId}`,
        lms_id: `test-district-lms-${toBeUntouchedDistrictId}`,
        district_lms_id: `test-district-district-lms-id-${toBeUntouchedDistrictId}`,
        created_user_id: `test-district-created-user-${toBeUntouchedDistrictId}`,
        created_at: nowStr,
        enable_roster_sync: false,
      })

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        curriculumPackageId: `testPackageId1-${toBeUntouchedId}`,
        districtId: toBeUntouchedDistrictId,
        createdUserId: `testCreatedUserId1-${toBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbDistrictPurchasedPackageRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved id', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find by unsaved districtId', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findByDistrictId(districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)
      expect(res.value).toEqual([])
    })

    test('find all others', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findAll(true)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeUntouched)
    })

    test('create', async () => {
      toBeCreated = {
        id,
        curriculumPackageId: `testPackageId1-${id}`,
        districtId,
        createdUserId: `testCreatedUserId1-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbDistrictPurchasedPackageRepository.create(toBeCreated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('create with invalid district id', async () => {
      const idRes = await rdbDistrictPurchasedPackageRepository.issueId()

      if (!idRes.value) {
        throw new Error('failed to create id for district of toBeUntouched')
      }

      const value = {
        id: idRes.value,
        curriculumPackageId: `testPackageId1-${id}`,
        districtId: idRes.value,
        createdUserId: `testCreatedUserId1-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbDistrictPurchasedPackageRepository.create(value)

      expect(res.hasError).toEqual(true)
    })

    test('find by id', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeCreated)
    })

    test('find by districtId', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findByDistrictId(toBeCreated.districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()

      if (!res.value) {
        throw new Error('failed to load data by districtId')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeCreated)
    })

    test('find all', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findAll(true)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(toBeCreated)

      const withEmptyDistrict = res.value?.find((e) => e.id === toBeUntouched.id)

      expect(withEmptyDistrict).toEqual(toBeUntouched)
    })

    test('partial update', async () => {
      toBeUpdated = {
        id,
        curriculumPackageId: `testPackageId1-${id}-update`,
        districtId,
      }

      const res = await rdbDistrictPurchasedPackageRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()

      const item = await rdbDistrictPurchasedPackageRepository.findById(id)

      if (item.hasError) {
        throw new Error(item.error.message)
      }
      expect(item.error).toBeNull()
      expect(item.value).toEqual({ ...toBeCreated, ...toBeUpdated })
    })

    test('update with invalid district', async () => {
      const districtIdRes = await rdbDistrictPurchasedPackageRepository.issueId()

      if (!districtIdRes.value) {
        throw new Error('failed to create id for district of toBeUpdated')
      }

      const res = await rdbDistrictPurchasedPackageRepository.update({ id, districtId: districtIdRes.value })

      expect(res.hasError).toEqual(true)
    })

    test('update', async () => {
      const districtIdRes = await rdbDistrictPurchasedPackageRepository.issueId()

      if (!districtIdRes.value) {
        throw new Error('failed to create id for district of toBeUpdated')
      }

      districtId = districtIdRes.value

      await districtTypeormRepo.insert({
        id: districtId,
        name: 'test-district-name1',
        lms_id: 'test-district-lms-id1',
        district_lms_id: 'test-district-district-lms-id1',
        created_user_id: 'test-district-created-user-id1',
        created_at: nowStr,
        enable_roster_sync: false,
      })

      toBeUpdated = {
        id,
        curriculumPackageId: `testPackageId1-${id}-update`,
        districtId: districtId,
        createdUserId: `testCreatedUserId1-${id}-update`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbDistrictPurchasedPackageRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()

      const resUntouched = await rdbDistrictPurchasedPackageRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })

    test('delete by id', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.delete(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after delete', async () => {
      const res = await rdbDistrictPurchasedPackageRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(null)
    })
  })
})
