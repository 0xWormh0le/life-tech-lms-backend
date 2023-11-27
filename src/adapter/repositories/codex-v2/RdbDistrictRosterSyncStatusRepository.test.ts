import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbDistrictRosterSyncStatusRepository } from './RdbDistrictRosterSyncStatusRepository'
import { DistrictRosterSyncStatus } from '../../../domain/entities/codex-v2/DistrictRosterSyncStatus'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbDistrictRosterSyncStatusRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbDistrictRosterSyncStatusRepository: RdbDistrictRosterSyncStatusRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbDistrictRosterSyncStatusRepository = new RdbDistrictRosterSyncStatusRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbDistrictRosterSyncStatusRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbDistrictRosterSyncStatusRepository.issueId()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id: string
    let districtRosterSyncStatus: DistrictRosterSyncStatus
    let toBeUpdated: DistrictRosterSyncStatus
    let toBeUntouched: DistrictRosterSyncStatus

    test('issue new id', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.issueId()

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

    test('create toBeUntouched', async () => {
      const toBeUntouchedIdRes = await rdbDistrictRosterSyncStatusRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        districtId: `test-district-id-${toBeUntouchedId}`,
        startedAt: new Date(nowStr),
        finishedAt: new Date(nowStr),
        errorMessage: `test-error-message-${toBeUntouchedId}`,
      }

      const res = await rdbDistrictRosterSyncStatusRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find by unsaved id', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all others', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is undefined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeUntouched)
    })

    test('create', async () => {
      districtRosterSyncStatus = {
        id,
        districtId: `test-district-id-${id}`,
        startedAt: new Date(nowStr),
        finishedAt: new Date(nowStr),
        errorMessage: `test-error-message-${id}`,
      }

      const res = await rdbDistrictRosterSyncStatusRepository.create(districtRosterSyncStatus)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()

      const resUntouched = await rdbDistrictRosterSyncStatusRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(districtRosterSyncStatus)
    })

    test('find all', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(districtRosterSyncStatus)
    })

    test('find by district id', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.findByDistrictId(`test-district-id-${id}`)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.districtId === `test-district-id-${id}`)

      expect(target).toEqual(districtRosterSyncStatus)
    })

    test('update', async () => {
      toBeUpdated = {
        id,
        districtId: `test-district-id-${id}-updated`,
        startedAt: new Date(futureStr),
        finishedAt: new Date(futureStr),
        errorMessage: `test-error-message-${id}-updated`,
      }

      const res = await rdbDistrictRosterSyncStatusRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()

      const resUntouched = await rdbDistrictRosterSyncStatusRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbDistrictRosterSyncStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })
  })
})
