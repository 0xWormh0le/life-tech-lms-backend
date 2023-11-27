import { Repository } from 'typeorm'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbStudentGroupStudentAffiliationRepository } from './RdbStudentGroupStudentAffiliationRepository'
import { StudentStudentGroupAffiliation } from '../../../domain/entities/codex-v2/StudentStudentGroupAffiliation'
import { StudentTypeormEntity } from '../../typeorm/entity/Student'
import { OrganizationTypeormEntity } from '../../typeorm/entity/Organization'
import { StudentGroupTypeormEntity } from '../../typeorm/entity/StudentGroup'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbStudentGroupStudentAffiliationRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbStudentGroupStudentRepository: RdbStudentGroupStudentAffiliationRepository
  let studentTypeormRepo: Repository<StudentTypeormEntity>
  let studentGroupTypeormRepo: Repository<StudentGroupTypeormEntity>
  let organizationTypeormRepo: Repository<OrganizationTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbStudentGroupStudentRepository = new RdbStudentGroupStudentAffiliationRepository(appDataSource)
    studentTypeormRepo = appDataSource.getRepository(StudentTypeormEntity)
    studentGroupTypeormRepo = appDataSource.getRepository(StudentGroupTypeormEntity)
    organizationTypeormRepo = appDataSource.getRepository(OrganizationTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbStudentGroupStudentRepository.issueId()
      const resultSecond = await rdbStudentGroupStudentRepository.issueId()

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
    let studentId: string
    let studentGroupId: string
    let organizationId: string
    let toBeCreated: StudentStudentGroupAffiliation
    let toBeUpdated: Partial<StudentStudentGroupAffiliation>
    let toBeUntouched: StudentStudentGroupAffiliation

    test('issue new id', async () => {
      const res = await rdbStudentGroupStudentRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbStudentGroupStudentRepository.issueId()
      const studentIdRes = await rdbStudentGroupStudentRepository.issueId()
      const studentGroupIdRes = await rdbStudentGroupStudentRepository.issueId()
      const organizationGroupIdiRes = await rdbStudentGroupStudentRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      if (!studentIdRes.value) {
        throw new Error('failed to create id for student of toBeUntouched')
      }

      if (!studentGroupIdRes.value) {
        throw new Error('failed to create id for student group of toBeUntouched')
      }

      if (!organizationGroupIdiRes.value) {
        throw new Error('failed to create id for student group of toBeUntouched')
      }

      studentId = studentIdRes.value
      studentGroupId = studentGroupIdRes.value
      organizationId = organizationGroupIdiRes.value

      await studentTypeormRepo.insert({
        id: studentId,
        user_id: 'test-user-id',
        nick_name: 'test-nick-name',
        student_lms_id: 'test-student-lms-id',
        emails_to_notify: 'test-emails-to-notify',
        created_user_id: 'test-created-user-id',
        created_date: nowStr,
        classlink_tenant_id: 'test-classlink-tenent-id',
        is_deactivated: false,
      })

      await organizationTypeormRepo.insert({
        id: organizationId,
        name: 'test-organization-name',
        district_id: 'test-district-id',
        organization_lms_id: 'test-org-lms-id',
        created_user_id: 'test-created-user-id',
        created_date: nowStr,
        updated_date: nowStr,
        state_id: 'test-state-id',
        classlink_tenant_id: 'test-classlink-tenent-id',
      })

      await studentGroupTypeormRepo.insert({
        id: studentGroupId,
        name: 'test-name',
        grade: 'test-grade',
        student_group_lms_id: 'test-student-group-lms-id',
        created_user_id: 'test-created-user-id',
        updated_user_id: 'test-updated-user-id',
        created_date: nowStr,
        updated_date: nowStr,
        organization_id: { id: organizationId },
        classlink_tenant_id: 'test-classlink-tenant-id',
      })

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        createdUserId: 'test-user-id',
        studentId,
        studentGroupId,
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentGroupStudentRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved id', async () => {
      const res = await rdbStudentGroupStudentRepository.findById(id)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeNull()
    })

    test('find all others', async () => {
      const res = await rdbStudentGroupStudentRepository.findAll()

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
      const studentGroupIdRes = await rdbStudentGroupStudentRepository.issueId()

      if (!studentGroupIdRes.value) {
        throw new Error('failed to create id for student group of toBeUntouched')
      }

      studentGroupId = studentGroupIdRes.value

      await studentGroupTypeormRepo.insert({
        id: studentGroupId,
        name: 'test-name1',
        grade: 'test-grade1',
        student_group_lms_id: 'test-student-group-lms-id1',
        created_user_id: 'test-created-user-id1',
        updated_user_id: 'test-updated-user-id1',
        created_date: nowStr,
        updated_date: nowStr,
        organization_id: { id: organizationId },
        classlink_tenant_id: 'test-classlink-tenant-id1',
      })

      toBeCreated = {
        id,
        createdUserId: 'test-user-id1',
        studentId,
        studentGroupId,
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentGroupStudentRepository.create(toBeCreated)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('create with invalid student and student group id', async () => {
      const idRes = await rdbStudentGroupStudentRepository.issueId()

      if (!idRes.value) {
        throw new Error('failed to create id for student of toBeUntouched')
      }

      const value = {
        id: idRes.value,
        createdUserId: 'test-user2-id',
        isPrimary: true,
        studentId: idRes.value,
        studentGroupId: idRes.value,
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentGroupStudentRepository.create(value)

      expect(res.hasError).toEqual(true)
    })

    test('find by id', async () => {
      const res = await rdbStudentGroupStudentRepository.findById(id)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(toBeCreated)
    })

    test('find by student group id', async () => {
      const res = await rdbStudentGroupStudentRepository.findByStudentGroupId(studentGroupId)

      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeCreated)
      expect(res.value[0].studentGroupId).toEqual(studentGroupId)
    })

    test('find by student id', async () => {
      const res = await rdbStudentGroupStudentRepository.findByStudentId(studentId)

      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(2)
      expect(res.value[0].studentId).toEqual(toBeCreated.studentId)
      expect(res.value[1].studentId).toEqual(toBeCreated.studentId)
    })

    test('find all', async () => {
      const res = await rdbStudentGroupStudentRepository.findAll()

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
        studentId,
        studentGroupId,
      }

      const res = await rdbStudentGroupStudentRepository.update(toBeUpdated)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeNull()

      const item = await rdbStudentGroupStudentRepository.findById(id)

      expect(item.error).toBeNull()

      if (item.hasError) {
        throw new Error(item.error.message)
      }
      expect(item.value).toEqual({ ...toBeCreated, ...toBeUpdated })
    })

    test('update with invalid student', async () => {
      const studentIdRes = await rdbStudentGroupStudentRepository.issueId()

      if (!studentIdRes.value) {
        throw new Error('failed to create id for student of toBeUpdated')
      }

      const res = await rdbStudentGroupStudentRepository.update({ id, studentId: studentIdRes.value })

      expect(res.hasError).toEqual(true)
    })

    test('update with invalid student group', async () => {
      const studentGroupIdRes = await rdbStudentGroupStudentRepository.issueId()

      if (!studentGroupIdRes.value) {
        throw new Error('failed to create id for student group of toBeUpdated')
      }

      const res = await rdbStudentGroupStudentRepository.update({ id, studentGroupId: studentGroupIdRes.value })

      expect(res.hasError).toEqual(true)
    })

    test('update', async () => {
      const studentIdRes = await rdbStudentGroupStudentRepository.issueId()

      if (!studentIdRes.value) {
        throw new Error('failed to create id for student of toBeUpdated')
      }

      studentId = studentIdRes.value

      await studentTypeormRepo.insert({
        id: studentId,
        user_id: 'test-user-id1',
        nick_name: 'test-nick-name1',
        student_lms_id: 'test-student-lms-id1',
        emails_to_notify: 'test-emails-to-notify1',
        created_user_id: 'test-created-user-id1',
        created_date: nowStr,
        classlink_tenant_id: 'test-classlink-tenent-id1',
        is_deactivated: false,
      })

      toBeUpdated = {
        id,
        createdUserId: 'test-user-id1-update',
        studentId,
        studentGroupId,
        createdAt: new Date(futureStr),
      }

      const res = await rdbStudentGroupStudentRepository.update(toBeUpdated)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeNull()

      const resUntouched = await rdbStudentGroupStudentRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbStudentGroupStudentRepository.findById(id)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toEqual(toBeUpdated)
    })

    test('delete by id', async () => {
      const res = await rdbStudentGroupStudentRepository.delete(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after delete', async () => {
      const res = await rdbStudentGroupStudentRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(null)
    })
  })
})
