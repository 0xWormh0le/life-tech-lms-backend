import { Repository } from 'typeorm'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbStudentGroupRepository } from './RdbStudentGroupRepository'
import { StudentGroup } from '../../../domain/entities/codex-v2/StudentGroup'
import { OrganizationTypeormEntity } from '../../typeorm/entity/Organization'
import { v4 as uuidv4 } from 'uuid'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbStudentGroupRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbStudentGroupRepository: RdbStudentGroupRepository
  let organizationTypeormRepo: Repository<OrganizationTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbStudentGroupRepository = new RdbStudentGroupRepository(appDataSource)
    organizationTypeormRepo = appDataSource.getRepository(OrganizationTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbStudentGroupRepository.issueId()
      const resultSecond = await rdbStudentGroupRepository.issueId()

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
    let organizationId: string
    let toBeCreated: StudentGroup
    let toBeUpdated: Partial<StudentGroup>
    let toBeUntouched: StudentGroup
    let toBeUpdatedWithNullValue: StudentGroup

    test('issue new id', async () => {
      const res = await rdbStudentGroupRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbStudentGroupRepository.issueId()
      const organizationIdRes = await rdbStudentGroupRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      if (!organizationIdRes.value) {
        throw new Error('failed to create id for organization of toBeUntouched')
      }

      organizationId = organizationIdRes.value

      await organizationTypeormRepo.insert({
        id: organizationId,
        name: 'test-name',
        district_id: 'test-district-id',
        organization_lms_id: 'test-organization-lms-id',
        created_user_id: 'test-created-user-id',
        state_id: 'test-state-id',
        created_date: nowStr,
        updated_date: nowStr,
        classlink_tenant_id: 'test-classlink-tenent-id',
      })

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        name: 'test-name',
        grade: 'test-grade',
        externalLmsStudentGroupId: 'test-student-group-lms-id',
        createdUserId: `test-created-user-id-${toBeUntouchedId}`,
        updatedUserId: `test-updated-user-id-${toBeUntouchedId}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
        classlinkTenantId: 'test-classlink-tenant-id',
        organizationId,
      }

      const res = await rdbStudentGroupRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved id', async () => {
      const res = await rdbStudentGroupRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all others', async () => {
      const res = await rdbStudentGroupRepository.findAll()

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
        name: 'test-name1',
        grade: 'test-grade1',
        externalLmsStudentGroupId: 'test-student-group-lms-id1',
        createdUserId: 'test-created-user-id1',
        updatedUserId: 'test-updated-user-id1',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
        classlinkTenantId: 'test-classlink-tenant-id1',
        organizationId,
      }

      const res = await rdbStudentGroupRepository.create(toBeCreated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('create with invalid organization id', async () => {
      const idRes = await rdbStudentGroupRepository.issueId()

      if (!idRes.value) {
        throw new Error('failed to create id for organization of toBeUntouched')
      }

      const value = {
        id: idRes.value,
        name: 'test-name1',
        grade: 'test-grade1',
        externalLmsStudentGroupId: 'test-student-group-lms-id1',
        createdUserId: 'test-created-user-id1',
        updatedUserId: 'test-updated-user-id1',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
        classlinkTenantId: 'test-classlink-tenant-id1',
        organizationId: idRes.value,
      }

      const res = await rdbStudentGroupRepository.create(value)

      expect(res.hasError).toEqual(true)
    })

    test('find by id', async () => {
      const res = await rdbStudentGroupRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeCreated)
    })

    test('find by ids', async () => {
      const res = await rdbStudentGroupRepository.findByIds([id, toBeUntouched.id])

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toContainAllValues([toBeCreated, toBeUntouched])
    })

    test('find by name', async () => {
      const res = await rdbStudentGroupRepository.findByName(toBeCreated.name)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeCreated)
    })

    test('find by valid organization id', async () => {
      const res = await rdbStudentGroupRepository.findByOrganizationId(toBeCreated.organizationId)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeDefined()
      expect(res.value?.length).toEqual(2)
      expect(res.value).toContainEqual(toBeCreated)
      expect(res.value).toContainEqual(toBeUntouched)
    })

    test('find by non-existing organization id', async () => {
      const res = await rdbStudentGroupRepository.findByOrganizationId(uuidv4())

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeDefined()
      expect(res.value?.length).toEqual(0)
    })

    test('find all', async () => {
      const res = await rdbStudentGroupRepository.findAll()

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
        name: `test-name-update`,
        organizationId,
        updatedAt: new Date(futureStr),
      }

      const res = await rdbStudentGroupRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const item = await rdbStudentGroupRepository.findById(id)

      if (item.hasError) {
        throw new Error(item.error.message)
      }
      expect(item.error).toBeNull()
      expect(item.value).toEqual({ ...toBeCreated, ...toBeUpdated })
    })

    test('update with invalid organization', async () => {
      const organizationIdRes = await rdbStudentGroupRepository.issueId()

      if (!organizationIdRes.value) {
        throw new Error('failed to create id for organization of toBeUpdated')
      }

      const res = await rdbStudentGroupRepository.update({ id, organizationId: organizationIdRes.value })

      expect(res.hasError).toEqual(true)
    })

    test('update', async () => {
      const organizationIdRes = await rdbStudentGroupRepository.issueId()

      if (!organizationIdRes.value) {
        throw new Error('failed to create id for organization of toBeUpdated')
      }

      organizationId = organizationIdRes.value

      await organizationTypeormRepo.insert({
        id: organizationId,
        name: 'test-name1',
        district_id: 'test-district-id1',
        organization_lms_id: 'test-organization-lms-id1',
        created_user_id: 'test-created-user-id1',
        state_id: 'test-state-id1',
        created_date: nowStr,
        updated_date: nowStr,
        classlink_tenant_id: 'test-classlink-tenent-id1',
      })

      toBeUpdated = {
        id,
        name: 'test-name1-update',
        grade: 'test-grade1-update',
        externalLmsStudentGroupId: 'test-student-group-lms-id1-update',
        createdUserId: 'test-created-user-id1-update',
        updatedUserId: 'test-updated-user-id1-update',
        createdAt: new Date(futureStr),
        updatedAt: new Date(futureStr),
        classlinkTenantId: 'test-classlink-tenant-id1-update',
        organizationId,
      }

      const res = await rdbStudentGroupRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbStudentGroupRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbStudentGroupRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })

    test('update with null value', async () => {
      toBeUpdatedWithNullValue = {
        id,
        name: 'test-name1',
        grade: 'test-grade1',
        externalLmsStudentGroupId: null,
        classlinkTenantId: null,
        createdUserId: 'test-created-user-id1',
        updatedUserId: 'test-updated-user-id1',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
        organizationId,
      }

      const res = await rdbStudentGroupRepository.update(toBeUpdatedWithNullValue)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after update with null value', async () => {
      const res = await rdbStudentGroupRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdatedWithNullValue)

      const resUntouched = await rdbStudentGroupRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })
  })
})
