import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbUserLessonHintStatusRepository } from './RdbUserLessonHintStatusRepository'
import { UserLessonHintStatus } from '../../../domain/entities/codex-v2/UserLessonHintStatus'
import { v4 as uuid } from 'uuid'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserLessonHintStatusRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbUserLessonHintStatusRepository: RdbUserLessonHintStatusRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbUserLessonHintStatusRepository = new RdbUserLessonHintStatusRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbUserLessonHintStatusRepository.issueId()
      const resultSecond = await rdbUserLessonHintStatusRepository.issueId()

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
    let userLessonHintStatus: UserLessonHintStatus
    let toBeUpdated: UserLessonHintStatus
    let toBeUntouched: UserLessonHintStatus

    test('issue new id', async () => {
      const res = await rdbUserLessonHintStatusRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbUserLessonHintStatusRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        userId: uuid(),
        lessonHintId: `testLessonHintId-${toBeUntouchedId}`,
        userLessonStatusId: `testUserLessonStatusId-${toBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbUserLessonHintStatusRepository.create(toBeUntouched)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userLessonHintStatus id', async () => {
      const res = await rdbUserLessonHintStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other', async () => {
      const res = await rdbUserLessonHintStatusRepository.findAll()

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
      userLessonHintStatus = {
        id,
        userId: uuid(),
        lessonHintId: `testLessonHintId-${id}`,
        userLessonStatusId: `testUserLessonStatusId-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbUserLessonHintStatusRepository.create(userLessonHintStatus)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbUserLessonHintStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonHintStatus)
    })

    test('find all', async () => {
      const res = await rdbUserLessonHintStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonHintStatus)
    })

    test('find by lesson hint id', async () => {
      const res = await rdbUserLessonHintStatusRepository.findByLessonHintId(userLessonHintStatus.lessonHintId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.lessonHintId === userLessonHintStatus.lessonHintId)

      expect(target).toEqual(userLessonHintStatus)
    })

    test('find by user lesson status id', async () => {
      const res = await rdbUserLessonHintStatusRepository.findByUserLessonStatusId(userLessonHintStatus.userLessonStatusId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.lessonHintId === userLessonHintStatus.lessonHintId)

      expect(target).toEqual(userLessonHintStatus)
    })

    test('update', async () => {
      toBeUpdated = {
        id,
        userId: uuid(),
        lessonHintId: `testLessonHintId-${id}-update`,
        userLessonStatusId: `testUserLessonStatusId-${id}-update`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbUserLessonHintStatusRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserLessonHintStatusRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserLessonHintStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })
  })
})
