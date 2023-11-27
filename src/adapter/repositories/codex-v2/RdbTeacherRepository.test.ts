import { v4 as uuid } from 'uuid'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbTeacherRepository } from './RdbTeacherRepository'
import { RdbOrganizationRepository } from './RdbOrganizationRepository'
import { RdbTeacherOrganizationAffiliationRepository } from './RdbTeacherOrganizationAffiliationRepository'
import { Teacher } from '../../../domain/entities/codex-v2/Teacher'
import { Organization } from '../../../domain/entities/codex-v2/Organization'
import { TeacherOrganizationAffiliation } from '../../../domain/entities/codex-v2/TeacherOrganizationAffiliation'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbTeacherRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbTeacherRepository: RdbTeacherRepository
  let rdbOrganizationRepository: RdbOrganizationRepository
  let rdbTeacherOrganizationAffiliationRepository: RdbTeacherOrganizationAffiliationRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbTeacherRepository = new RdbTeacherRepository(appDataSource)
    rdbOrganizationRepository = new RdbOrganizationRepository(appDataSource)
    rdbTeacherOrganizationAffiliationRepository = new RdbTeacherOrganizationAffiliationRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbTeacherRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbTeacherRepository.issueId()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id: string
    let teacher: Teacher
    let teacherToBeUpdated: Teacher
    let teacherToBeUntouched: Teacher
    let teacherToBeUpdatedWithNullValue: Teacher

    test('issue new id', async () => {
      const res = await rdbTeacherRepository.issueId()

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

    test('create teacherToBeUntouched', async () => {
      const teacherToBeUntouchedIdRes = await rdbTeacherRepository.issueId()

      if (!teacherToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for teacherToBeUntouched')
      }

      const teacherToBeUntouchedId = teacherToBeUntouchedIdRes.value

      teacherToBeUntouched = {
        id: teacherToBeUntouchedId,
        userId: `testUserId1-${teacherToBeUntouchedId}`,
        role: `teacher`,
        firstName: `testFirstName1-${teacherToBeUntouchedId}`,
        lastName: `testLastName1-${teacherToBeUntouchedId}`,
        externalLmsTeacherId: `testExternalLmsTeacherId1-${teacherToBeUntouchedId}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId1-${teacherToBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbTeacherRepository.create(teacherToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved teacher id', async () => {
      const res = await rdbTeacherRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other teachers', async () => {
      const res = await rdbTeacherRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(teacherToBeUntouched)
    })

    test('create', async () => {
      teacher = {
        id,
        userId: `testUserId1-${id}`,
        role: `teacher`,
        firstName: `testFirstName1-${id}`,
        lastName: `testLastName1-${id}`,
        externalLmsTeacherId: `testExternalLmsTeacherId1-${id}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId1-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbTeacherRepository.create(teacher)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbTeacherRepository.findById(teacherToBeUntouched.id)

      expect(resUntouched.value).toEqual(teacherToBeUntouched)
    })

    test('find by id', async () => {
      const res = await rdbTeacherRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(teacher)
    })

    test('find by userId', async () => {
      const res = await rdbTeacherRepository.findByUserId(teacher.userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(teacher)
    })

    test('find all', async () => {
      const res = await rdbTeacherRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(teacher)
    })

    test('find by organization id', async () => {
      const createOrganization = async () => {
        const id = uuid()
        const data: Organization = {
          id,
          name: `test-name-${id}`,
          districtId: `test-district-${id}`,
          externalLmsOrganizationId: null,
          classlinkTenantId: null,
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        }

        const res = await rdbOrganizationRepository.create(data)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        return data
      }

      const createTeacherOrganizationAffiliation = async (organizationId: string, teacherId: string) => {
        const id = uuid()
        const data: TeacherOrganizationAffiliation = {
          id,
          createdUserId: uuid(),
          organizationId,
          teacherId,
          createdAt: new Date(nowStr),
        }

        const res = await rdbTeacherOrganizationAffiliationRepository.create(data)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        return data
      }

      const organization1 = await createOrganization()
      const organization2 = await createOrganization()

      await createTeacherOrganizationAffiliation(organization1.id, teacher.id)
      await createTeacherOrganizationAffiliation(organization2.id, teacher.id)
      await createTeacherOrganizationAffiliation(organization1.id, teacherToBeUntouched.id)

      const res1 = await rdbTeacherRepository.findByOrganizationId(organization1.id)
      const res2 = await rdbTeacherRepository.findByOrganizationId(organization2.id)
      const res3 = await rdbTeacherRepository.findByOrganizationId(uuid())

      expect(res1.error).toBeNull()
      expect(res1.hasError).toEqual(false)
      expect(res1.value).toHaveLength(2)
      expect(res1.value).toContainEqual(teacherToBeUntouched)
      expect(res1.value).toContainEqual(teacher)

      expect(res2.hasError).toEqual(false)
      expect(res2.error).toBeNull()
      expect(res2.value).toHaveLength(1)
      expect(res2.value).toContainEqual(teacher)

      expect(res3.hasError).toEqual(false)
      expect(res3.error).toBeNull()
      expect(res3.value).toHaveLength(0)
    })

    test('update', async () => {
      teacherToBeUpdated = {
        id: id,
        userId: `testUserId1-${id}-updated1`,
        role: `teacher`,
        firstName: `testFirstName1-${id}-updated1`,
        lastName: `testLastName1-${id}-updated1`,
        externalLmsTeacherId: `testExternalLmsTeacherId1-${id}-updated1`,
        isDeactivated: true,
        createdUserId: `testCreatedUserId1-${id}-updated1`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbTeacherRepository.update(teacherToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbTeacherRepository.findById(teacherToBeUntouched.id)

      expect(resUntouched.value).toEqual(teacherToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbTeacherRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(teacherToBeUpdated)
    })

    test('update with null value', async () => {
      teacherToBeUpdatedWithNullValue = {
        id,
        userId: `testUserId1-${id}-updated1`,
        role: `teacher`,
        firstName: `testFirstName1-${id}-updated1`,
        lastName: `testLastName1-${id}-updated1`,
        externalLmsTeacherId: `testExternalLmsTeacherId1-${id}-updated1`,
        isDeactivated: true,
        createdUserId: `testCreatedUserId1-${id}-updated1`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbTeacherRepository.update(teacherToBeUpdatedWithNullValue)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after update with null value', async () => {
      const res = await rdbTeacherRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(teacherToBeUpdatedWithNullValue)

      const resUntouched = await rdbTeacherRepository.findById(teacherToBeUntouched.id)

      expect(resUntouched.value).toEqual(teacherToBeUntouched)
    })
  })
})
