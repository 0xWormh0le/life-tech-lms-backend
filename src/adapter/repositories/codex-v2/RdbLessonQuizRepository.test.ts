import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbLessonQuizRepository } from './RdbLessonQuizRepository'
import { LessonQuiz } from '../../../domain/entities/codex-v2/LessonQuiz'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbLessonQuizRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbLessonQuizRepository: RdbLessonQuizRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbLessonQuizRepository = new RdbLessonQuizRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbLessonQuizRepository.issueId()
      const resultSecond = await rdbLessonQuizRepository.issueId()

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
    let lessonQuiz: LessonQuiz
    let lessonQuizToBeUpdated: LessonQuiz
    let lessonQuizToBeUntouched: LessonQuiz

    test('issue new id', async () => {
      const res = await rdbLessonQuizRepository.issueId()

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

    test('create lessonQuizToBeUntouched', async () => {
      const lessonQuizToBeUntouchedIdRes = await rdbLessonQuizRepository.issueId()

      if (!lessonQuizToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for lessonQuizToBeUntouched')
      }

      const lessonQuizToBeUntouchedId = lessonQuizToBeUntouchedIdRes.value

      lessonQuizToBeUntouched = {
        id: lessonQuizToBeUntouchedId,
        lessonStepId: `testLessonStepId-${lessonQuizToBeUntouchedId}`,
        label: `testLabel-${lessonQuizToBeUntouchedId}`,
        description: `testDescription-${lessonQuizToBeUntouchedId}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbLessonQuizRepository.create(lessonQuizToBeUntouched)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved lessonQuiz id', async () => {
      const res = await rdbLessonQuizRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other lessonSteps', async () => {
      const res = await rdbLessonQuizRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(lessonQuizToBeUntouched)
    })

    test('create', async () => {
      lessonQuiz = {
        id,
        lessonStepId: `testLessonStepId-${id}`,
        label: `testLabel-${id}`,
        description: `testDescription-${id}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbLessonQuizRepository.create(lessonQuiz)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbLessonQuizRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(lessonQuiz)
    })

    test('find all', async () => {
      const res = await rdbLessonQuizRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(lessonQuiz)
    })

    test('find by lesson step id', async () => {
      const res = await rdbLessonQuizRepository.findByLessonStepId(lessonQuiz.lessonStepId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(lessonQuiz)
    })

    test('update', async () => {
      lessonQuizToBeUpdated = {
        id,
        lessonStepId: `testLessonStepId-${id}-update`,
        label: `testLabel-${id}-update`,
        description: `testDescription-${id}-update`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(futureStr),
      }

      const res = await rdbLessonQuizRepository.update(lessonQuizToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbLessonQuizRepository.findById(lessonQuizToBeUntouched.id)

      expect(resUntouched.value).toEqual(lessonQuizToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbLessonQuizRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(lessonQuizToBeUpdated)
    })
  })
})
