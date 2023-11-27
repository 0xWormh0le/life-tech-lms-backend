import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbLessonStepRepository } from './RdbLessonStepRepository'
import { LessonStep } from '../../../domain/entities/codex-v2/LessonStep'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbLessonStepRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbLessonStepRepository: RdbLessonStepRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbLessonStepRepository = new RdbLessonStepRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbLessonStepRepository.issueId()
      const resultSecond = await rdbLessonStepRepository.issueId()

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
    let lessonStep: LessonStep
    let lessonStepToBeUpdated: LessonStep
    let lessonStepToBeUntouched: LessonStep

    test('issue new id', async () => {
      const res = await rdbLessonStepRepository.issueId()

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

    test('create lessonStepToBeUntouched', async () => {
      const organizationToBeUntouchedIdRes = await rdbLessonStepRepository.issueId()

      if (!organizationToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for lessonStepToBeUntouched')
      }

      const organizationToBeUntouchedId = organizationToBeUntouchedIdRes.value

      lessonStepToBeUntouched = {
        id: organizationToBeUntouchedId,
        lessonId: `testLessonId-${organizationToBeUntouchedId}`,
        orderIndex: 0,
        externalLessonPlayerStepId: `testExternalLessonPlayerStepId-${organizationToBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbLessonStepRepository.create(lessonStepToBeUntouched)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved lessonStep id', async () => {
      const res = await rdbLessonStepRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other lessonSteps', async () => {
      const res = await rdbLessonStepRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(lessonStepToBeUntouched)
    })

    test('create', async () => {
      lessonStep = {
        id,
        lessonId: `testLessonId-${id}`,
        orderIndex: 0,
        externalLessonPlayerStepId: `testExternalLessonPlayerStepId-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await rdbLessonStepRepository.create(lessonStep)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbLessonStepRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(lessonStep)
    })

    test('find all', async () => {
      const res = await rdbLessonStepRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(lessonStep)
    })

    test('find by lesson id', async () => {
      const res = await rdbLessonStepRepository.findByLessonId(lessonStep.lessonId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.lessonId === lessonStep.lessonId)

      expect(target).toEqual(lessonStep)
    })

    test('update', async () => {
      lessonStepToBeUpdated = {
        id,
        lessonId: `testLessonId-${id}-update`,
        orderIndex: 0,
        externalLessonPlayerStepId: `testExternalLessonPlayerStepId-${id}-update`,
        createdAt: new Date(futureStr),
      }

      const res = await rdbLessonStepRepository.update(lessonStepToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbLessonStepRepository.findById(lessonStepToBeUntouched.id)

      expect(resUntouched.value).toEqual(lessonStepToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbLessonStepRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(lessonStepToBeUpdated)
    })
  })
})
