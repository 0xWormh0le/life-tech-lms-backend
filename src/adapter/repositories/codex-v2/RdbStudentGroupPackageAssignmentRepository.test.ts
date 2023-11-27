import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbStudentGroupPackageAssignmentRepository } from './RdbStudentGroupPackageAssignmentRepository'
import { StudentGroupPackageAssignment } from '../../../domain/entities/codex-v2/StudentGroupPackageAssignment'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbStudentGroupPackageAssignmentRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbStudentGroupPackageAssignmentRepository: RdbStudentGroupPackageAssignmentRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbStudentGroupPackageAssignmentRepository = new RdbStudentGroupPackageAssignmentRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbStudentGroupPackageAssignmentRepository.issueId()
      const resultSecond = await rdbStudentGroupPackageAssignmentRepository.issueId()

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
    let toBeCreated: StudentGroupPackageAssignment
    let toBeUpdated: Partial<StudentGroupPackageAssignment>
    let toBeUntouched: StudentGroupPackageAssignment

    test('issue new id', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbStudentGroupPackageAssignmentRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        curriculumBrandId: 'test-package-category-id',
        curriculumPackageId: 'test-package-id',
        studentGroupId: 'test-student-group-id',
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentGroupPackageAssignmentRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved id', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all others', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findAll()

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
        curriculumBrandId: 'test-package-category-id1',
        curriculumPackageId: 'test-package-id1',
        studentGroupId: 'test-student-group-id1',
        createdAt: new Date(nowStr),
      }

      const res = await rdbStudentGroupPackageAssignmentRepository.create(toBeCreated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeCreated)
    })

    test('find by student group id', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findByStudentGroupId(toBeCreated.studentGroupId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.studentGroupId === toBeCreated.studentGroupId)

      expect(target).toEqual(toBeCreated)
    })

    test('find all', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(toBeCreated)
    })

    test('partial update', async () => {
      toBeUpdated = {
        id,
        curriculumBrandId: `test-package-category-id-update`,
      }

      const res = await rdbStudentGroupPackageAssignmentRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const item = await rdbStudentGroupPackageAssignmentRepository.findById(id)

      if (item.hasError) {
        throw new Error(item.error.message)
      }
      expect(item.error).toBeNull()
      expect(item.value).toEqual({ ...toBeCreated, ...toBeUpdated })
    })

    test('update', async () => {
      toBeUpdated = {
        id,
        curriculumBrandId: 'test-package-category-id1-update',
        curriculumPackageId: 'test-package-id1-update',
        studentGroupId: 'test-student-group-id1-update',
        createdAt: new Date(futureStr),
      }

      const res = await rdbStudentGroupPackageAssignmentRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbStudentGroupPackageAssignmentRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })

    test('delete by id', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.delete(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after delete', async () => {
      const res = await rdbStudentGroupPackageAssignmentRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(null)
    })
  })
})
