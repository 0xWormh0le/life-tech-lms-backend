import { Repository } from 'typeorm'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbTeacherOrganizationAffiliationRepository } from './RdbTeacherOrganizationAffiliationRepository'
import { TeacherOrganizationAffiliation } from '../../../domain/entities/codex-v2/TeacherOrganizationAffiliation'
import { OrganizationTypeormEntity } from '../../typeorm/entity/Organization'
import { TeacherTypeormEntity } from '../../typeorm/entity/Teacher'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbTeacherOrganizationAffiliationRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbTeacherOrganizationRepository: RdbTeacherOrganizationAffiliationRepository
  let organizationTypeormRepo: Repository<OrganizationTypeormEntity>
  let teacherTypeormRepo: Repository<TeacherTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbTeacherOrganizationRepository = new RdbTeacherOrganizationAffiliationRepository(appDataSource)
    organizationTypeormRepo = appDataSource.getRepository(OrganizationTypeormEntity)
    teacherTypeormRepo = appDataSource.getRepository(TeacherTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbTeacherOrganizationRepository.issueId()
      const resultSecond = await rdbTeacherOrganizationRepository.issueId()

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
    let teacherId: string
    let toBeCreated: TeacherOrganizationAffiliation
    let toBeUpdated: Partial<TeacherOrganizationAffiliation>
    let toBeUntouched: TeacherOrganizationAffiliation

    test('issue new id', async () => {
      const res = await rdbTeacherOrganizationRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbTeacherOrganizationRepository.issueId()
      const organizationIdRes = await rdbTeacherOrganizationRepository.issueId()
      const teacherIdRes = await rdbTeacherOrganizationRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      if (!organizationIdRes.value) {
        throw new Error('failed to create id for organization of toBeUntouched')
      }

      if (!teacherIdRes.value) {
        throw new Error('failed to create id for teacher of toBeUntouched')
      }

      organizationId = organizationIdRes.value
      teacherId = teacherIdRes.value

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

      await teacherTypeormRepo.insert({
        id: teacherId,
        user_id: 'test-user-id',
        first_name: 'test-first-name',
        last_name: 'test-last-name',
        teacher_lms_id: 'test-teacher-lms-id',
        created_user_id: 'test-created-user-id',
        created_date: nowStr,
        classlink_tenant_id: 'test-classlink-tenant-id',
        is_deactivated: false,
      })

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        createdUserId: 'test-user-id',
        organizationId,
        teacherId,
        createdAt: new Date(nowStr),
      }

      const res = await rdbTeacherOrganizationRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved id', async () => {
      const res = await rdbTeacherOrganizationRepository.findById(id)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeNull()
    })

    test('find all others', async () => {
      const res = await rdbTeacherOrganizationRepository.findAll()

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeUntouched)
    })

    test('create', async () => {
      const teacherIdRes = await rdbTeacherOrganizationRepository.issueId()

      if (!teacherIdRes.value) {
        throw new Error('failed to create id for teacher of toBeUntouched')
      }

      teacherId = teacherIdRes.value

      await teacherTypeormRepo.insert({
        id: teacherIdRes.value,
        user_id: 'test-user-id1',
        first_name: 'test-first-name',
        last_name: 'test-last-name',
        teacher_lms_id: 'test-teacher-lms-id1',
        created_user_id: 'test-created-user-id1',
        created_date: nowStr,
        classlink_tenant_id: 'test-classlink-tenant-id1',
        is_deactivated: false,
      })

      toBeCreated = {
        id,
        createdUserId: 'test-user-id1',
        organizationId,
        teacherId,
        createdAt: new Date(nowStr),
      }

      const res = await rdbTeacherOrganizationRepository.create(toBeCreated)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('create with invalid organization and teacher id', async () => {
      const idRes = await rdbTeacherOrganizationRepository.issueId()

      if (!idRes.value) {
        throw new Error('failed to create id for organization of toBeUntouched')
      }

      const value = {
        id: idRes.value,
        createdUserId: 'test-user2-id',
        isPrimary: true,
        organizationId: idRes.value,
        teacherId: idRes.value,
        createdAt: new Date(nowStr),
      }

      const res = await rdbTeacherOrganizationRepository.create(value)

      expect(res.hasError).toEqual(true)
    })

    test('find by id', async () => {
      const res = await rdbTeacherOrganizationRepository.findById(id)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(toBeCreated)
    })

    test('find by teacher id', async () => {
      const res = await rdbTeacherOrganizationRepository.findByTeacherId(teacherId)

      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeCreated)
      expect(res.value[0].teacherId).toEqual(teacherId)
    })

    test('find by organization id', async () => {
      const res = await rdbTeacherOrganizationRepository.findByOrganizationId(organizationId)

      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(2)
      expect(res.value[0].organizationId).toEqual(toBeCreated.organizationId)
      expect(res.value[1].organizationId).toEqual(toBeCreated.organizationId)
    })

    test('find all', async () => {
      const res = await rdbTeacherOrganizationRepository.findAll()

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
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
        createdUserId: 'test-user-id1-update',
        organizationId,
        teacherId,
      }

      const res = await rdbTeacherOrganizationRepository.update(toBeUpdated)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeNull()

      const item = await rdbTeacherOrganizationRepository.findById(id)

      expect(item.error).toBeNull()

      if (item.hasError) {
        throw new Error(item.error.message)
      }
      expect(item.value).toEqual({ ...toBeCreated, ...toBeUpdated })
    })

    test('update with invalid organization', async () => {
      const organizationIdRes = await rdbTeacherOrganizationRepository.issueId()

      if (!organizationIdRes.value) {
        throw new Error('failed to create id for organization of toBeUpdated')
      }

      const res = await rdbTeacherOrganizationRepository.update({ id, organizationId: organizationIdRes.value })

      expect(res.hasError).toEqual(true)
    })

    test('update with invalid teacher', async () => {
      const teacherIdRes = await rdbTeacherOrganizationRepository.issueId()

      if (!teacherIdRes.value) {
        throw new Error('failed to create id for organization of toBeUpdated')
      }

      const res = await rdbTeacherOrganizationRepository.update({ id, teacherId: teacherIdRes.value })

      expect(res.hasError).toEqual(true)
    })

    test('update', async () => {
      const organizationIdRes = await rdbTeacherOrganizationRepository.issueId()

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
        createdUserId: 'test-user-id1-update',
        organizationId,
        teacherId,
        createdAt: new Date(futureStr),
      }

      const res = await rdbTeacherOrganizationRepository.update(toBeUpdated)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeNull()

      const resUntouched = await rdbTeacherOrganizationRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbTeacherOrganizationRepository.findById(id)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(toBeUpdated)
    })

    test('delete by id', async () => {
      const res = await rdbTeacherOrganizationRepository.delete(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after delete', async () => {
      const res = await rdbTeacherOrganizationRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(null)
    })
  })
})
