import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbLessonHintRepository } from './RdbLessonHintRepository'
import { LessonHint } from '../../../domain/entities/codex-v2/LessonHint'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbLessonHintRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbLessonHintRepository: RdbLessonHintRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbLessonHintRepository = new RdbLessonHintRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbLessonHintRepository.issueId()
      const resultSecond = await rdbLessonHintRepository.issueId()

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
    let userLessonHintStatus: LessonHint
    let toBeUpdated: LessonHint
    let toBeUntouched: LessonHint

    test('issue new id', async () => {
      const res = await rdbLessonHintRepository.issueId()

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
      const toBeUntouchedIdRes = await rdbLessonHintRepository.issueId()

      if (!toBeUntouchedIdRes.value) {
        throw new Error('failed to create id for toBeUntouched')
      }

      const toBeUntouchedId = toBeUntouchedIdRes.value

      toBeUntouched = {
        id: toBeUntouchedId,
        lessonStepId: `testLessonStepId-${toBeUntouchedId}`,
        label: `testLabel-${toBeUntouchedId}`,
        description: `testDescription-${toBeUntouchedId}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbLessonHintRepository.create(toBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userLessonHintStatus id', async () => {
      const res = await rdbLessonHintRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other', async () => {
      const res = await rdbLessonHintRepository.findAll()

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
        lessonStepId: `testLessonStepId-${id}`,
        label: `testLabel-${id}`,
        description: `testDescription-${id}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbLessonHintRepository.create(userLessonHintStatus)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbLessonHintRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonHintStatus)
    })

    test('find all', async () => {
      const res = await rdbLessonHintRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonHintStatus)
    })

    test('find by lesson step id', async () => {
      const res = await rdbLessonHintRepository.findByLessonStepId(userLessonHintStatus.lessonStepId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.lessonStepId === userLessonHintStatus.lessonStepId)

      expect(target).toEqual(userLessonHintStatus)
    })

    test('update', async () => {
      toBeUpdated = {
        id,
        lessonStepId: `testLessonStepId-${id}-update`,
        label: `testLabel-${id}-update`,
        description: `testDescription-${id}-update`,
        createdAt: new Date(futureStr),
        updatedAt: new Date(futureStr),
      }

      const res = await rdbLessonHintRepository.update(toBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbLessonHintRepository.findById(toBeUntouched.id)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbLessonHintRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })
  })
})
