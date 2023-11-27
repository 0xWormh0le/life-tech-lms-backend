import { v4 as uuid } from 'uuid'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbUserLessonStepStatusRepository } from './RdbUserLessonStepStatusRepository'
import { UserLessonStepStatus } from '../../../domain/entities/codex-v2/UserLessonStepStatus'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserLessonStepStatusRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbUserLessonStepStatusRepository: RdbUserLessonStepStatusRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbUserLessonStepStatusRepository = new RdbUserLessonStepStatusRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbUserLessonStepStatusRepository.issueId()
      const resultSecond = await rdbUserLessonStepStatusRepository.issueId()

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
    let userLessonStepStatus: UserLessonStepStatus
    let toBeUpdated: UserLessonStepStatus
    let toBeUntouched: UserLessonStepStatus

    test('issue new id', async () => {
      const res = await rdbUserLessonStepStatusRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbUserLessonStepStatusRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        userId: uuid(),
        stepId: `test-stepId-${toBeUntouchedId}`,
        userLessonStatusId: `test-userLessonStatusId-${toBeUntouchedId}`,
        lessonId: `test-lessonId-${toBeUntouchedId}`,
        status: 'not_cleared',
        createdAt: new Date(nowStr),
      }

      const res = await rdbUserLessonStepStatusRepository.create(toBeUntouched)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userLessonStepStatus id', async () => {
      const res = await rdbUserLessonStepStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other user lesson step statuses', async () => {
      const res = await rdbUserLessonStepStatusRepository.findAll()

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
      userLessonStepStatus = {
        id,
        userId: uuid(),
        stepId: `test-stepId-${id}`,
        userLessonStatusId: `test-userLessonStatusId-${id}`,
        lessonId: `test-lessonId-${id}`,
        status: 'not_cleared',
        createdAt: new Date(nowStr),
      }

      const res = await rdbUserLessonStepStatusRepository.create(userLessonStepStatus)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbUserLessonStepStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonStepStatus)
    })

    test('find all', async () => {
      const res = await rdbUserLessonStepStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonStepStatus)
    })

    test('find by user lesson status id', async () => {
      const res = await rdbUserLessonStepStatusRepository.findByUserLessonStatusId(userLessonStepStatus.userLessonStatusId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonStepStatus)
    })

    test('find by user ids', async () => {
      let res = await rdbUserLessonStepStatusRepository.findByUserIds([toBeUntouched.userId])

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()

      expect(res.value).toEqual([toBeUntouched])

      res = await rdbUserLessonStepStatusRepository.findByUserIds([toBeUntouched.userId, userLessonStepStatus.userId])

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value?.length).toBeGreaterThan(0)

      expect(res.value).toEqual([toBeUntouched, userLessonStepStatus])
    })

    test('update', async () => {
      toBeUpdated = {
        id,
        userId: uuid(),
        stepId: `test-stepId-${id}-updated`,
        userLessonStatusId: `test-userLessonStatusId-${id}-updated`,
        lessonId: `test-lessonId-${id}-updated`,
        status: 'not_cleared',
        createdAt: new Date(futureStr),
      }

      const res = await rdbUserLessonStepStatusRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserLessonStepStatusRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserLessonStepStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })
  })
})
