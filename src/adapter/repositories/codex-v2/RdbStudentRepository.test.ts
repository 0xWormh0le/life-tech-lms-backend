import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbStudentRepository } from './RdbStudentRepository'
import { Student } from '../../../domain/entities/codex-v2/Student'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbStudentRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbStudentRepository: RdbStudentRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbStudentRepository = new RdbStudentRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbStudentRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbStudentRepository.issueId()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id1: string
    let id2: string
    let student1: Student
    let student2: Student
    let studentToBeUpdated: Student
    let studentToBeUntouched: Student
    let studentToBeUpdatedWithNullValue: Student

    test('issue new id1', async () => {
      const res = await rdbStudentRepository.issueId()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()

      if (!res.value) {
        throw new Error()
      }
      id1 = res.value
    })

    test('issue new id2', async () => {
      const res = await rdbStudentRepository.issueId()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()

      if (!res.value) {
        throw new Error()
      }
      id2 = res.value
    })

    test('create studentToBeUntouched', async () => {
      const studentToBeUntouchedIdRes = await rdbStudentRepository.issueId()

      if (!studentToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for studentToBeUntouched')
      }

      const studentToBeUntouchedId = studentToBeUntouchedIdRes.value

      studentToBeUntouched = {
        id: studentToBeUntouchedId,
        userId: `testUserId1-${studentToBeUntouchedId}`,
        role: `student`,
        nickName: `testNickName1-${studentToBeUntouchedId}`,
        externalLmsStudentId: `testExternalLmsStudentId1-${studentToBeUntouchedId}`,
        classlinkTenantId: `testClasslinkTenantId1-${studentToBeUntouchedId}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId1-${studentToBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentRepository.create(studentToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved student id', async () => {
      const res = await rdbStudentRepository.findById(id1)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other students', async () => {
      const res = await rdbStudentRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is undefined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(studentToBeUntouched)
    })

    test('create 1', async () => {
      student1 = {
        id: id1,
        userId: `${id1}`,
        role: `student`,
        nickName: `testNickName1-${id1}`,
        externalLmsStudentId: `testExternalLmsStudentId1-${id1}`,
        classlinkTenantId: `testClasslinkTenantId1-${id1}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId1-${id1}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentRepository.create(student1)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbStudentRepository.findById(studentToBeUntouched.id)

      expect(resUntouched.value).toEqual(studentToBeUntouched)
    })

    test('create 2', async () => {
      student2 = {
        id: id2,
        userId: `testUserId2-${id2}`,
        role: `student`,
        nickName: `testNickName2-${id2}`,
        externalLmsStudentId: `testExternalLmsStudentId2-${id2}`,
        classlinkTenantId: `testClasslinkTenantId2-${id2}`,
        isDeactivated: false,
        createdUserId: `testCreatedUserId2-${id2}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentRepository.create(student2)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id1', async () => {
      const res = await rdbStudentRepository.findById(id1)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(student1)
    })

    test('find by userId1', async () => {
      const res = await rdbStudentRepository.findById(student1.userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(student1)
    })

    test('find by id1 and id2', async () => {
      const res = await rdbStudentRepository.findByIds([id1, id2])

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual([student1, student2])
    })

    test('find all', async () => {
      const res = await rdbStudentRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id1)

      expect(target).toEqual(student1)
    })

    test('update', async () => {
      studentToBeUpdated = {
        id: id1,
        userId: `testUserId1-${id1}-updated1`,
        role: `student`,
        nickName: `testNickName1-${id1}-updated1`,
        externalLmsStudentId: `testExternalLmsStudentId1-${id1}-updated1`,
        classlinkTenantId: `testClasslinkTenantId1-${id1}-updated1`,
        isDeactivated: true,
        createdUserId: `testCreatedUserId1-${id1}-updated1`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbStudentRepository.update(studentToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbStudentRepository.findById(studentToBeUntouched.id)

      expect(resUntouched.value).toEqual(studentToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbStudentRepository.findById(id1)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(studentToBeUpdated)
    })

    test('update with null value', async () => {
      studentToBeUpdatedWithNullValue = {
        id: id1,
        userId: `testUserId1-${id1}-updated1`,
        role: `student`,
        nickName: `testNickName1-${id1}-updated1`,
        externalLmsStudentId: null,
        classlinkTenantId: null,
        isDeactivated: true,
        createdUserId: `testCreatedUserId1-${id1}-updated1`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbStudentRepository.update(studentToBeUpdatedWithNullValue)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after update with null value', async () => {
      const res = await rdbStudentRepository.findById(id1)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(studentToBeUpdatedWithNullValue)

      const resUntouched = await rdbStudentRepository.findById(studentToBeUntouched.id)

      expect(resUntouched.value).toEqual(studentToBeUntouched)
    })
  })
})
