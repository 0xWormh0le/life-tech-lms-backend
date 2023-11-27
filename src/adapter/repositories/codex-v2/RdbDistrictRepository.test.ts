import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbDistrictRepository } from './RdbDistrictRepository'
import { District } from '../../../domain/entities/codex-v2/District'
import { DistrictTypeormEntity } from '../../typeorm/entity/District'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Repository } from 'typeorm'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbDistrictRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbDistrictRepository: RdbDistrictRepository
  let typeormRepository: Repository<DistrictTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbDistrictRepository = new RdbDistrictRepository(appDataSource)
    typeormRepository = appDataSource.getRepository(DistrictTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbDistrictRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbDistrictRepository.issueId()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id: string
    let district: District
    let districtToBeUpdated: District
    let districtToBeUntouched: District

    test('issue new id', async () => {
      const res = await rdbDistrictRepository.issueId()

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

    test('create districtToBeUntouched', async () => {
      const districtToBeUntouchedIdRes = await rdbDistrictRepository.issueId()

      if (!districtToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for districtToBeUntouched')
      }

      const districtToBeUntouchedId = districtToBeUntouchedIdRes.value

      districtToBeUntouched = {
        id: districtToBeUntouchedId,
        name: `testDistrict1-${districtToBeUntouchedId}`,
        stateId: `testStateId1-${districtToBeUntouchedId}`,
        lmsId: `testLmsId1-${districtToBeUntouchedId}`,
        externalLmsDistrictId: `testExternalLmsDistrictId1-${districtToBeUntouchedId}`,
        enableRosterSync: true,
        createdAt: new Date(nowStr),
        createdUserId: `testCreatedUserId1-${districtToBeUntouchedId}`,
      }

      const res = await rdbDistrictRepository.create(districtToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved district id', async () => {
      const res = await rdbDistrictRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find by unsaved district name', async () => {
      const res = await rdbDistrictRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other districts', async () => {
      const res = await rdbDistrictRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(districtToBeUntouched)
    })

    test('create', async () => {
      district = {
        id,
        name: `testDistrict1-${id}`,
        stateId: `testStateId1-${id}`,
        lmsId: `testLmsId1-${id}`,
        externalLmsDistrictId: `testExternalLmsDistrictId1-${id}`,
        enableRosterSync: true,
        createdAt: new Date(nowStr),
        createdUserId: `testCreatedUserId1-${id}`,
      }

      const res = await rdbDistrictRepository.create(district)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouched.value).toEqual(districtToBeUntouched)
    })

    test('find by id', async () => {
      const res = await rdbDistrictRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(district)
    })

    test('find by name', async () => {
      const res = await rdbDistrictRepository.findByName(district.name)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(district)
    })

    test('find all', async () => {
      const res = await rdbDistrictRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(district)
    })

    test('update', async () => {
      districtToBeUpdated = {
        id: id,
        name: `testDistrict1-${id}-updated1`,
        stateId: `testStateId1-${id}-updated1`,
        lmsId: `testLmsId1-${id}-updated1`,
        externalLmsDistrictId: `testExternalLmsDistrictId1-${id}-updated1`,
        enableRosterSync: false,
        createdAt: new Date(futureStr),
        createdUserId: `testCreatedUserId1-${id}-updated1`,
      }

      const res = await rdbDistrictRepository.update(districtToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouched.value).toEqual(districtToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbDistrictRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(districtToBeUpdated)

      const resUntouched = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouched.value).toEqual(districtToBeUntouched)
    })

    test('update after changing fields for roster sync', async () => {
      const rosterSyncFiledToUpdateTypeormEntity: QueryDeepPartialEntity<DistrictTypeormEntity> = {
        id: id,
        last_roster_sync_event_id: `last_roster_sync_event_id`,
        last_roster_sync_event_date: new Date(nowStr),
        sync_started_date: new Date(nowStr),
        sync_ended_date: new Date(nowStr),
        roster_sync_error: `roster_sync_error`,
        classlink_app_id: `classlink_app_id`,
        classlink_access_token: `classlink_access_token`,
        classlink_tenant_id: `classlink_tenant_id`,
      }

      await typeormRepository.update({ id: district.id }, rosterSyncFiledToUpdateTypeormEntity)

      const result = await typeormRepository.findOneBy({
        id,
      })

      expect(result).toEqual({
        ...rosterSyncFiledToUpdateTypeormEntity,
        id: districtToBeUpdated.id,
        name: districtToBeUpdated.name,
        state_id: districtToBeUpdated.stateId,
        lms_id: districtToBeUpdated.lmsId,
        district_lms_id: districtToBeUpdated.externalLmsDistrictId,
        enable_roster_sync: districtToBeUpdated.enableRosterSync,
        created_user_id: districtToBeUpdated.createdUserId,
        created_at: districtToBeUpdated.createdAt,
      })

      const districtAfterUpdatingRosterSyncField = {
        id: id,
        name: `testDistrict1-${id}-updated2`,
        stateId: `testStateId1-${id}-updated2`,
        lmsId: `testLmsId1-${id}-updated2`,
        externalLmsDistrictId: `testExternalLmsDistrictId1-${id}-updated2`,
        enableRosterSync: true,
        createdAt: new Date('2002-01-01T00:00:00Z'),
        createdUserId: `testCreatedUserId1-${id}-updated2`,
      }

      await rdbDistrictRepository.update(districtAfterUpdatingRosterSyncField)

      const resultAfterUpdate = await typeormRepository.findOneBy({
        id,
      })

      expect(resultAfterUpdate).toEqual({
        ...rosterSyncFiledToUpdateTypeormEntity,
        id: districtAfterUpdatingRosterSyncField.id,
        name: districtAfterUpdatingRosterSyncField.name,
        state_id: districtAfterUpdatingRosterSyncField.stateId,
        lms_id: districtAfterUpdatingRosterSyncField.lmsId,
        district_lms_id: districtAfterUpdatingRosterSyncField.externalLmsDistrictId,
        enable_roster_sync: districtAfterUpdatingRosterSyncField.enableRosterSync,
        created_user_id: districtAfterUpdatingRosterSyncField.createdUserId,
        created_at: districtAfterUpdatingRosterSyncField.createdAt,
      })

      const resUntouched = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouched.value).toEqual(districtToBeUntouched)
    })

    describe('update wit null value', () => {
      let districtToBeUpdatedWithNullValue: District

      test('update', async () => {
        districtToBeUpdatedWithNullValue = {
          id: id,
          name: `testDistrict1-${id}-updated1`,
          stateId: `testStateId1-${id}-updated1`,
          lmsId: null,
          externalLmsDistrictId: null,
          enableRosterSync: false,
          createdAt: new Date(futureStr),
          createdUserId: `testCreatedUserId1-${id}-updated1`,
        }

        const res = await rdbDistrictRepository.update(districtToBeUpdatedWithNullValue)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        const resUntouched = await rdbDistrictRepository.findById(districtToBeUntouched.id)

        expect(resUntouched.value).toEqual(districtToBeUntouched)
      })

      test('find by id after update with null value', async () => {
        const res = await rdbDistrictRepository.findById(id)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toEqual(districtToBeUpdatedWithNullValue)

        const resUntouched = await rdbDistrictRepository.findById(districtToBeUntouched.id)

        expect(resUntouched.value).toEqual(districtToBeUntouched)
      })
    })
  })
})
