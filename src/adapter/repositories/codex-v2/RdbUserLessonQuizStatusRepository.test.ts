import { v4 as uuidv4 } from 'uuid'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbUserLessonQuizStatusRepository } from './RdbUserLessonQuizStatusRepository'
import { UserLessonQuizStatus } from '../../../domain/entities/codex-v2/UserLessonQuizStatus'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserLessonQuizStatusRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbUserLessonQuizStatusRepository: RdbUserLessonQuizStatusRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbUserLessonQuizStatusRepository = new RdbUserLessonQuizStatusRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbUserLessonQuizStatusRepository.issueId()
      const resultSecond = await rdbUserLessonQuizStatusRepository.issueId()

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
    let userLessonQuizStatus: UserLessonQuizStatus
    let toBeUpdated: UserLessonQuizStatus
    let toBeUntouched: UserLessonQuizStatus

    test('issue new id', async () => {
      const res = await rdbUserLessonQuizStatusRepository.issueId()

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
      const lessonToBeUntouchedIdRes = await rdbUserLessonQuizStatusRepository.issueId()

      if (!lessonToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      const lessonToBeUntouchedId = lessonToBeUntouchedIdRes.value

      toBeUntouched = {
        id: lessonToBeUntouchedId,
        userId: uuidv4(),
        lessonQuizId: `userLessonQuizStatus-quiz-id-${lessonToBeUntouchedId}`,
        userLessonStatusId: `user-userLessonQuizStatus-status-id-${lessonToBeUntouchedId}`,
        isCorrect: true,
        selectedChoice: `selected-choice-${lessonToBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbUserLessonQuizStatusRepository.create(toBeUntouched)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userLessonQuizStatus id', async () => {
      const res = await rdbUserLessonQuizStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other userLessonQuizStatuses', async () => {
      const res = await rdbUserLessonQuizStatusRepository.findAll()

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
      userLessonQuizStatus = {
        id,
        userId: uuidv4(),
        lessonQuizId: `userLessonQuizStatus-quiz-id-${id}`,
        userLessonStatusId: `userLessonQuizStatus-status-id-${id}`,
        isCorrect: true,
        selectedChoice: `selected-choice-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbUserLessonQuizStatusRepository.create(userLessonQuizStatus)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbUserLessonQuizStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonQuizStatus)
    })

    test('find all', async () => {
      const res = await rdbUserLessonQuizStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonQuizStatus)
    })

    test('find by lesson quiz id', async () => {
      let res = await rdbUserLessonQuizStatusRepository.findByLessonQuizId(userLessonQuizStatus.lessonQuizId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      let target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonQuizStatus)

      res = await rdbUserLessonQuizStatusRepository.findByLessonQuizId(toBeUntouched.lessonQuizId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      target = res.value?.find((e) => e.id === toBeUntouched.id)

      expect(target).toEqual(toBeUntouched)
    })

    test('find by user lesson status id', async () => {
      let res = await rdbUserLessonQuizStatusRepository.findByUserLessonStatusId(userLessonQuizStatus.userLessonStatusId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      let target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonQuizStatus)

      res = await rdbUserLessonQuizStatusRepository.findByUserLessonStatusId(toBeUntouched.userLessonStatusId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      target = res.value?.find((e) => e.id === toBeUntouched.id)

      expect(target).toEqual(toBeUntouched)
    })

    test('update', async () => {
      toBeUpdated = {
        id,
        userId: uuidv4(),
        lessonQuizId: `userLessonQuizStatus-quiz-id-${id}-update`,
        userLessonStatusId: `userLessonQuizStatus-status-id-${id}-update`,
        isCorrect: false,
        selectedChoice: `selected-choice-${id}-update`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbUserLessonQuizStatusRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserLessonQuizStatusRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserLessonQuizStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })
  })
})
