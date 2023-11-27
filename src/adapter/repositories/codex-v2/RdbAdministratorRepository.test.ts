import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbAdministratorRepository } from './RdbAdministratorRepository'
import { Administrator } from '../../../domain/entities/codex-v2/Administrator'
import { RdbDistrictRepository } from './RdbDistrictRepository'
import { District } from '../../../domain/entities/codex-v2/District'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbAdministratorRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbAdministratorRepository: RdbAdministratorRepository
  let rdbDistrictRepository: RdbDistrictRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbAdministratorRepository = new RdbAdministratorRepository(appDataSource)
    rdbDistrictRepository = new RdbDistrictRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbAdministratorRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbAdministratorRepository.issueId()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id: string
    let administrator: Administrator
    let administratorToBeUpdated: Administrator
    let administratorToBeUntouched: Administrator
    let administratorToBeUpdatedWithNullValue: Administrator

    test('issue new id', async () => {
      const res = await rdbAdministratorRepository.issueId()

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

    test('create administratorToBeUntouched', async () => {
      const districtToBeUntouchedIdRes = await rdbDistrictRepository.issueId()

      if (!districtToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for districtToBeUntouched')
      }

      const districtId = districtToBeUntouchedIdRes.value
      const district: District = {
        id: districtId,
        name: `name-${districtId}`,
        stateId: `stateId-${districtId}`,
        lmsId: `lmsId-${districtId}`,
        externalLmsDistrictId: `externalLmsDistrictId-${districtId}`,
        enableRosterSync: true,
        createdAt: new Date(nowStr),
        createdUserId: `createdUserId-${districtId}`,
      }

      await rdbDistrictRepository.create(district)

      const administratorToBeUntouchedIdRes = await rdbAdministratorRepository.issueId()

      if (!administratorToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for administratorToBeUntouched')
      }

      const administratorToBeUntouchedId = administratorToBeUntouchedIdRes.value

      administratorToBeUntouched = {
        id: administratorToBeUntouchedId,
        userId: `testUserId1-${administratorToBeUntouchedId}`,
        role: `administrator`,
        districtId: districtId,
        firstName: `testFirstName1-${administratorToBeUntouchedId}`,
        lastName: `testLastName1-${administratorToBeUntouchedId}`,
        externalLmsAdministratorId: `testExternalLmsAdministratorId1-${administratorToBeUntouchedId}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId1-${administratorToBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbAdministratorRepository.create(administratorToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved administrator id', async () => {
      const res = await rdbAdministratorRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find by unsaved administrator name', async () => {
      const res = await rdbAdministratorRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other administrators', async () => {
      const res = await rdbAdministratorRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(administratorToBeUntouched)
    })

    test('create', async () => {
      const districtIdRes = await rdbDistrictRepository.issueId()

      if (!districtIdRes.value) {
        throw new Error('failed to create id for districtToBeUntouched')
      }

      const districtId = districtIdRes.value
      const district: District = {
        id: districtId,
        name: `name-${districtId}`,
        stateId: `stateId-${districtId}`,
        lmsId: `lmsId-${districtId}`,
        externalLmsDistrictId: `externalLmsDistrictId-${districtId}`,
        enableRosterSync: true,
        createdAt: new Date(nowStr),
        createdUserId: `createdUserId-${districtId}`,
      }

      await rdbDistrictRepository.create(district)

      administrator = {
        id,
        userId: `testUserId1-${id}`,
        role: `administrator`,
        districtId: districtId,
        firstName: `testFirstName1-${id}`,
        lastName: `testLastName1-${id}`,
        externalLmsAdministratorId: `testExternalLmsAdministratorId1-${id}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId1-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbAdministratorRepository.create(administrator)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbAdministratorRepository.findById(administratorToBeUntouched.id)

      expect(resUntouched.value).toEqual(administratorToBeUntouched)
    })

    test('find by id', async () => {
      const res = await rdbAdministratorRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(administrator)
    })

    test('find by userId', async () => {
      const res = await rdbAdministratorRepository.findByUserId(administrator.userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(administrator)
    })

    test('find all', async () => {
      const res = await rdbAdministratorRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(administrator)
    })

    test('update', async () => {
      const districtIdRes = await rdbDistrictRepository.issueId()

      if (!districtIdRes.value) {
        throw new Error('failed to create id for districtToBeUntouched')
      }

      const districtId = districtIdRes.value
      const district: District = {
        id: districtId,
        name: `name-${districtId}`,
        stateId: `stateId-${districtId}`,
        lmsId: `lmsId-${districtId}`,
        externalLmsDistrictId: `externalLmsDistrictId-${districtId}`,
        enableRosterSync: true,
        createdAt: new Date(nowStr),
        createdUserId: `createdUserId-${districtId}`,
      }

      await rdbDistrictRepository.create(district)

      administratorToBeUpdated = {
        id: id,
        userId: `testUserId1-${id}-updated1`,
        role: `administrator`,
        districtId: districtId,
        firstName: `testFirstName1-${id}-updated1`,
        lastName: `testLastName1-${id}-updated1`,
        externalLmsAdministratorId: `testExternalLmsAdministratorId1-${id}-updated1`,
        isDeactivated: true,
        createdUserId: `testCreatedUserId1-${id}-updated1`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbAdministratorRepository.update(administratorToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbAdministratorRepository.findById(administratorToBeUntouched.id)

      expect(resUntouched.value).toEqual(administratorToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbAdministratorRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(administratorToBeUpdated)
    })

    test('update with null value', async () => {
      administratorToBeUpdatedWithNullValue = {
        id,
        userId: `testUserId1-${id}-updated1`,
        role: `administrator`,
        districtId: administratorToBeUpdated.districtId,
        firstName: `testFirstName1-${id}-updated1`,
        lastName: `testLastName1-${id}-updated1`,
        externalLmsAdministratorId: null,
        isDeactivated: true,
        createdUserId: `testCreatedUserId1-${id}-updated1`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbAdministratorRepository.update(administratorToBeUpdatedWithNullValue)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after update with null value', async () => {
      const res = await rdbAdministratorRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(administratorToBeUpdatedWithNullValue)

      const resUntouched = await rdbAdministratorRepository.findById(administratorToBeUntouched.id)

      expect(resUntouched.value).toEqual(administratorToBeUntouched)
    })
  })
})
