import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbClasslinkTenantCredentialRepository } from './RdbClasslinkTenantCredentialRepository'
import { ClasslinkTenantCredential } from '../../../domain/entities/codex-v2/ClasslinkTenantCredential'
import { RdbDistrictRepository } from './RdbDistrictRepository'
import { District } from '../../../domain/entities/codex-v2/District'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbClasslinkTenantCredentialRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbClasslinkTenantCredentialRepository: RdbClasslinkTenantCredentialRepository
  let rdbDistrictRepository: RdbDistrictRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbClasslinkTenantCredentialRepository = new RdbClasslinkTenantCredentialRepository(appDataSource)
    rdbDistrictRepository = new RdbDistrictRepository(appDataSource)
  })

  describe('create & find & update', () => {
    let districtId: string
    let classlinkTenantCredential: ClasslinkTenantCredential
    let classlinkTenantCredentialToBeUpdated: ClasslinkTenantCredential
    let classlinkTenantCredentialToBeUntouched: ClasslinkTenantCredential
    let districtToBeUntouched: District
    let targetDistrict: District

    test('create classlinkTenantCredentialToBeUntouched', async () => {
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

      const resDistrict = await rdbDistrictRepository.create(districtToBeUntouched)

      expect(resDistrict.hasError).toEqual(false)
      expect(resDistrict.error).toBeNull()
      expect(resDistrict.value).toBeUndefined()

      classlinkTenantCredentialToBeUntouched = {
        districtId: districtToBeUntouchedId,
        externalLmsAppId: `externalLmsAppId-1-${districtId}`,
        accessToken: `accessToken-1-${districtId}`,
        externalLmsTenantId: `externalLmsTenantId-1-${districtId}`,
      }

      const res = await rdbClasslinkTenantCredentialRepository.create(classlinkTenantCredentialToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by invalid classlinkTenantCredential id', async () => {
      const resUnsavedDistrictId = await rdbDistrictRepository.issueId()

      if (!resUnsavedDistrictId.value) {
        throw new Error(`failed to create new districtId`)
      }

      const unsavedDistrictId = resUnsavedDistrictId.value
      const res = await rdbClasslinkTenantCredentialRepository.findByDistrictId(unsavedDistrictId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other classlinkTenantCredentials', async () => {
      const res = await rdbClasslinkTenantCredentialRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(classlinkTenantCredentialToBeUntouched)
    })

    test('find by new district id before saving classlinkTenantCredential', async () => {
      const resId = await rdbDistrictRepository.issueId()

      if (!resId.value) {
        throw new Error('failed to issue district id.')
      }
      districtId = resId.value
      targetDistrict = {
        id: districtId,
        name: `testDistrict1-${districtId}`,
        stateId: `testStateId1-${districtId}`,
        lmsId: `testLmsId1-${districtId}`,
        externalLmsDistrictId: `testExternalLmsDistrictId1-${districtId}`,
        enableRosterSync: true,
        createdAt: new Date(nowStr),
        createdUserId: `testCreatedUserId1-${districtId}`,
      }
      await rdbDistrictRepository.create(targetDistrict)

      const resDistrict = await rdbDistrictRepository.findById(districtId)

      expect(resDistrict.hasError).toEqual(false)
      expect(resDistrict.error).toBeNull()
      expect(resDistrict.value).toEqual(targetDistrict)

      const res = await rdbClasslinkTenantCredentialRepository.findByDistrictId(districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('create', async () => {
      classlinkTenantCredential = {
        districtId,
        externalLmsAppId: `externalLmsAppId-1-${districtId}`,
        accessToken: `accessToken-1-${districtId}`,
        externalLmsTenantId: `externalLmsTenantId-1-${districtId}`,
      }

      const res = await rdbClasslinkTenantCredentialRepository.create(classlinkTenantCredential)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouchedDistrict = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouchedDistrict.value).toEqual(districtToBeUntouched)

      const resUntouchedClasslinkTenantCredential = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouchedClasslinkTenantCredential.value).toEqual(districtToBeUntouched)
    })

    test('find by districtId after creating', async () => {
      const res = await rdbClasslinkTenantCredentialRepository.findByDistrictId(districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(classlinkTenantCredential)
    })

    test('find all', async () => {
      const res = await rdbClasslinkTenantCredentialRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toEqual(2)

      const target = res.value?.find((e) => e.districtId === districtId)

      expect(target).toEqual(classlinkTenantCredential)
    })

    test('update', async () => {
      classlinkTenantCredentialToBeUpdated = {
        districtId,
        externalLmsAppId: `externalLmsAppId-2-${districtId}`,
        accessToken: `accessToken-2-${districtId}`,
        externalLmsTenantId: `externalLmsTenantId-2-${districtId}`,
      }

      const res = await rdbClasslinkTenantCredentialRepository.update(classlinkTenantCredentialToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouchedDistrict = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouchedDistrict.value).toEqual(districtToBeUntouched)

      const resUntouchedClasslinkTenantCredential = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouchedClasslinkTenantCredential.value).toEqual(districtToBeUntouched)
    })

    test('find by districtId after updating', async () => {
      const res = await rdbClasslinkTenantCredentialRepository.findByDistrictId(districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(classlinkTenantCredentialToBeUpdated)
    })

    test('update after changing fields for district', async () => {
      const districtToBeUpdated = {
        id: districtId,
        name: `testDistrict2-${districtId}`,
        stateId: `testStateId2-${districtId}`,
        lmsId: `testLmsId2-${districtId}`,
        externalLmsDistrictId: `testExternalLmsDistrictId2-${districtId}`,
        enableRosterSync: true,
        createdAt: new Date(futureStr),
        createdUserId: `testCreatedUserId2-${districtId}`,
      }

      await rdbDistrictRepository.update(districtToBeUpdated)

      const resDistrict = await rdbDistrictRepository.findById(districtId)

      expect(resDistrict.hasError).toEqual(false)
      expect(resDistrict.error).toBeNull()
      expect(resDistrict.value).toEqual(districtToBeUpdated)

      const res = await rdbClasslinkTenantCredentialRepository.findByDistrictId(districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(classlinkTenantCredentialToBeUpdated)

      const resUntouchedDistrict = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouchedDistrict.value).toEqual(districtToBeUntouched)

      const resUntouchedClasslinkTenantCredential = await rdbDistrictRepository.findById(districtToBeUntouched.id)

      expect(resUntouchedClasslinkTenantCredential.value).toEqual(districtToBeUntouched)
    })
  })
})
