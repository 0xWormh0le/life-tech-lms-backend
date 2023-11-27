import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbOrganizationRepository } from './RdbOrganizationRepository'
import { Organization } from '../../../domain/entities/codex-v2/Organization'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbOrganizationRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbOrganizationRepository: RdbOrganizationRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbOrganizationRepository = new RdbOrganizationRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbOrganizationRepository.issueId()
      const resultSecond = await rdbOrganizationRepository.issueId()

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
    let organization: Organization
    let organizationToBeUpdated: Organization
    let organizationToBeUntouched: Organization
    let organizationToBeUpdatedWithNullValue: Organization

    test('issue new id', async () => {
      const res = await rdbOrganizationRepository.issueId()

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

    test('create organizationToBeUntouched', async () => {
      const organizationToBeUntouchedIdRes = await rdbOrganizationRepository.issueId()

      if (!organizationToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for organizationToBeUntouched')
      }

      const organizationToBeUntouchedId = organizationToBeUntouchedIdRes.value

      organizationToBeUntouched = {
        id: organizationToBeUntouchedId,
        name: `testOrg1-${organizationToBeUntouchedId}`,
        districtId: `testDistrictId1-${organizationToBeUntouchedId}`,
        externalLmsOrganizationId: `testLmsId1-${organizationToBeUntouchedId}`,
        classlinkTenantId: `testClasslinkTenantId-${organizationToBeUntouchedId}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbOrganizationRepository.create(organizationToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved organization id', async () => {
      const res = await rdbOrganizationRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find by unsaved organization name', async () => {
      const res = await rdbOrganizationRepository.findByName(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other organizations', async () => {
      const res = await rdbOrganizationRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(organizationToBeUntouched)
    })

    test('create', async () => {
      organization = {
        id,
        name: `testOrg1-${id}`,
        districtId: `testDistrictId1-${id}`,
        externalLmsOrganizationId: `testLmsId1-${id}`,
        classlinkTenantId: `testClasslinkTenantId-${id}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbOrganizationRepository.create(organization)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbOrganizationRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(organization)
    })

    test('find by ids', async () => {
      const res = await rdbOrganizationRepository.findByIds([id, organizationToBeUntouched.id])

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toContainAllValues([organization, organizationToBeUntouched])
    })

    test('find by name', async () => {
      const res = await rdbOrganizationRepository.findByName(organization.name)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(organization)
    })

    test('find all', async () => {
      const res = await rdbOrganizationRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(organization)
    })

    test('find by district id', async () => {
      const res = await rdbOrganizationRepository.findByDistrictId(organization.districtId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.districtId === organization.districtId)

      expect(target).toEqual(organization)
    })

    test('update', async () => {
      organizationToBeUpdated = {
        id,
        name: `testOrg1-${id}-update`,
        districtId: `testDistrictId1-${id}-update`,
        externalLmsOrganizationId: `testLmsId1-${id}-update`,
        classlinkTenantId: `testClasslinkTenantId-${id}-update`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(futureStr),
      }

      const res = await rdbOrganizationRepository.update(organizationToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbOrganizationRepository.findById(organizationToBeUntouched.id)

      expect(resUntouched.value).toEqual(organizationToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbOrganizationRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(organizationToBeUpdated)
    })

    test('update with null value', async () => {
      organizationToBeUpdatedWithNullValue = {
        id: id,
        name: `testOrg1-${id}-update`,
        districtId: `testDistrictId1-${id}-update`,
        externalLmsOrganizationId: null,
        classlinkTenantId: null,
        createdAt: new Date(nowStr),
        updatedAt: new Date(futureStr),
      }

      const res = await rdbOrganizationRepository.update(organizationToBeUpdatedWithNullValue)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after update with null value', async () => {
      const res = await rdbOrganizationRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(organizationToBeUpdatedWithNullValue)

      const resUntouched = await rdbOrganizationRepository.findById(organizationToBeUntouched.id)

      expect(resUntouched.value).toEqual(organizationToBeUntouched)
    })
  })
})
