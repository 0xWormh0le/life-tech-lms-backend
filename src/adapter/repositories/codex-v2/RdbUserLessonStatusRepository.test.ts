import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbUserLessonStatusRepository } from './RdbUserLessonStatusRepository'
import { UserLessonStatus } from '../../../domain/entities/codex-v2/UserLessonStatus'
import { v4 as uuid } from 'uuid'
import { UserLessonStatusHistoryTypeormEntity } from '../../typeorm/entity/UserLessonStatusHistory'
import { UserLessonStatusTypeormEntity, UserLessonStatusTypeormEnum } from '../../typeorm/entity/UserLessonStatus'
import { Repository } from 'typeorm'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserLessonStatusRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  let rdbUserLessonStatusRepository: RdbUserLessonStatusRepository
  let typeormUserLessonStatusHistoryRepository: Repository<UserLessonStatusHistoryTypeormEntity>
  let typeormOldUserLessonStatusRepository: Repository<UserLessonStatusTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbUserLessonStatusRepository = new RdbUserLessonStatusRepository(appDataSource)
    typeormUserLessonStatusHistoryRepository = appDataSource.getRepository(UserLessonStatusHistoryTypeormEntity)
    typeormOldUserLessonStatusRepository = appDataSource.getRepository(UserLessonStatusTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbUserLessonStatusRepository.issueId()
      const resultSecond = await rdbUserLessonStatusRepository.issueId()

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
    let userId: string
    let userLessonStatus: UserLessonStatus
    let userLessonStatusToBeUpdated: UserLessonStatus
    let userLessonStatusToBeUntouched: UserLessonStatus
    let userLessonStatusOnlyInHistoryTable: UserLessonStatus

    test('issue new id', async () => {
      const res = await rdbUserLessonStatusRepository.issueId()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()

      if (!res.value) {
        throw new Error()
      }
      id = res.value
      userId = uuid()
    })

    test('create userLessonStatusOnlyInHistoryTable', async () => {
      const idRes = await rdbUserLessonStatusRepository.issueId()

      if (!idRes.value) {
        throw new Error('failed to create id for userLessonStatusOnlyInHistoryTable')
      }

      const id = idRes.value

      userLessonStatusOnlyInHistoryTable = {
        id: id,
        userId: userId,
        lessonId: `lesson-id-${id}`,
        status: 'not_cleared',
        startedAt: new Date(nowStr),
        finishedAt: new Date(nowStr),
        achievedStarCount: 2,
        correctAnsweredQuizCount: 2,
        usedHintCount: 2,
        stepIdSkippingDetected: true,
      }

      await typeormUserLessonStatusHistoryRepository.insert({
        id: userLessonStatusOnlyInHistoryTable.id,
        user_id: userLessonStatusOnlyInHistoryTable.userId,
        lesson_id: userLessonStatusOnlyInHistoryTable.lessonId,
        status: userLessonStatusOnlyInHistoryTable.status === 'cleared' ? UserLessonStatusTypeormEnum.cleared : UserLessonStatusTypeormEnum.not_cleared,
        started_at: userLessonStatusOnlyInHistoryTable.startedAt,
        finished_at: userLessonStatusOnlyInHistoryTable.finishedAt ?? undefined,
        achieved_star_count: userLessonStatusOnlyInHistoryTable.achievedStarCount,
        correct_answered_quiz_count: userLessonStatusOnlyInHistoryTable.correctAnsweredQuizCount ?? undefined,
        used_hint_count: userLessonStatusOnlyInHistoryTable.usedHintCount ?? undefined,
        step_id_skipping_detected: userLessonStatusOnlyInHistoryTable.stepIdSkippingDetected,
      })
    })

    test('create userLessonStatusToBeUntouched', async () => {
      const userLessonStatusToBeUntouchedIdRes = await rdbUserLessonStatusRepository.issueId()

      if (!userLessonStatusToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for userLessonStatusToBeUntouched')
      }

      const userLessonStatusToBeUntouchedId = userLessonStatusToBeUntouchedIdRes.value

      userLessonStatusToBeUntouched = {
        id: userLessonStatusToBeUntouchedId,
        userId: userId,
        lessonId: `lesson-id-${userLessonStatusToBeUntouchedId}`,
        status: 'not_cleared',
        startedAt: new Date(nowStr),
        finishedAt: new Date(nowStr),
        achievedStarCount: 2,
        correctAnsweredQuizCount: 2,
        usedHintCount: 2,
        stepIdSkippingDetected: true,
      }

      const res = await rdbUserLessonStatusRepository.create(userLessonStatusToBeUntouched)

      expect(res.error).toBeNull()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.value).toBeUndefined()
    })

    test('find unsaved user lesson status by id', async () => {
      const res = await rdbUserLessonStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other user lesson statuses', async () => {
      const res = await rdbUserLessonStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(2)
      expect(res.value).toEqual([userLessonStatusOnlyInHistoryTable, userLessonStatusToBeUntouched])
    })

    test('create', async () => {
      userLessonStatus = {
        id,
        userId: userId,
        lessonId: `lesson-id-${id}`,
        status: 'not_cleared',
        startedAt: new Date(nowStr),
        finishedAt: new Date(nowStr),
        achievedStarCount: 2,
        correctAnsweredQuizCount: 2,
        usedHintCount: 2,
        stepIdSkippingDetected: true,
      }

      const res = await rdbUserLessonStatusRepository.create(userLessonStatus)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      if (!appDataSource) {
        throw new Error('Error appDataSource not found')
      }

      const resultForHistory = await typeormUserLessonStatusHistoryRepository.findOneBy({
        id,
      })

      if (!resultForHistory) {
        throw new Error(`failed to get data from resultFromHistory`)
      }
      expect(resultForHistory).toMatchObject({
        id: userLessonStatus.id,
        user_id: userLessonStatus.userId,
        lesson_id: userLessonStatus.lessonId,
        status: userLessonStatus.status === 'cleared' ? UserLessonStatusTypeormEnum.cleared : UserLessonStatusTypeormEnum.not_cleared,
        started_at: userLessonStatus.startedAt,
        finished_at: userLessonStatus.finishedAt ?? undefined,
        achieved_star_count: userLessonStatus.achievedStarCount,
        correct_answered_quiz_count: userLessonStatus.correctAnsweredQuizCount ?? undefined,
        used_hint_count: userLessonStatus.usedHintCount ?? undefined,
        step_id_skipping_detected: userLessonStatus.stepIdSkippingDetected,
      })

      const resultForStatusLatestTable = await typeormOldUserLessonStatusRepository.findOneBy({
        id,
      })

      if (!resultForStatusLatestTable) {
        throw new Error(`failed to get data from old user lesson table`)
      }
      expect(resultForStatusLatestTable).toMatchObject({
        id: userLessonStatus.id,
        user_id: userLessonStatus.userId,
        lesson_id: userLessonStatus.lessonId,
        status: userLessonStatus.status === 'cleared' ? UserLessonStatusTypeormEnum.cleared : UserLessonStatusTypeormEnum.not_cleared,
        started_at: userLessonStatus.startedAt,
        finished_at: userLessonStatus.finishedAt ?? undefined,
        achieved_star_count: userLessonStatus.achievedStarCount,
        correct_answered_quiz_count: userLessonStatus.correctAnsweredQuizCount ?? undefined,
        used_hint_count: userLessonStatus.usedHintCount ?? undefined,
        step_id_skipping_detected: userLessonStatus.stepIdSkippingDetected,
      })
    })

    test('find by id', async () => {
      const res = await rdbUserLessonStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonStatus)
    })

    test('find latest', async () => {
      const res = await rdbUserLessonStatusRepository.findLatest(userLessonStatus.userId, userLessonStatus.lessonId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonStatus)
    })

    test('find by user id', async () => {
      const res = await rdbUserLessonStatusRepository.findByUserId(userLessonStatus.userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonStatus)
    })

    test('find by lesson id', async () => {
      const res = await rdbUserLessonStatusRepository.findByLessonId(userLessonStatus.lessonId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonStatus)
    })

    test('find all', async () => {
      const res = await rdbUserLessonStatusRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(userLessonStatus)

      const onlyHistoryTable = res.value?.find((e) => e.id === userLessonStatusOnlyInHistoryTable.id)

      expect(onlyHistoryTable).toEqual(userLessonStatusOnlyInHistoryTable)
    })

    test('update', async () => {
      userLessonStatusToBeUpdated = {
        id,
        userId: userId,
        lessonId: `lesson-id-${id}-updated`,
        status: 'cleared',
        startedAt: new Date(futureStr),
        finishedAt: new Date(futureStr),
        achievedStarCount: 2,
        correctAnsweredQuizCount: 2,
        usedHintCount: 2,
        stepIdSkippingDetected: true,
      }

      const res = await rdbUserLessonStatusRepository.update(userLessonStatusToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserLessonStatusRepository.findById(userLessonStatusToBeUntouched.id)

      expect(resUntouched.value).toEqual(userLessonStatusToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserLessonStatusRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userLessonStatusToBeUpdated)

      const receiveFromStatusTable = await typeormOldUserLessonStatusRepository.findOneBy({
        id: id,
      })
      const receiveFromHistoryTable = await typeormUserLessonStatusHistoryRepository.findOneBy({
        id: id,
      })

      if (!receiveFromStatusTable) {
        throw new Error(`failed to get data from history table`)
      }

      expect(receiveFromHistoryTable).toMatchObject(receiveFromStatusTable)
    })
  })

  describe('check creation with old status table', () => {
    describe(`firstLessonId | secondLessonId | thirdLessonId | lessonIdInOldStatus | creatingLessonId | expectedLessonIdInOldStatus`, () => {
      test.each`
        firstLessonId | secondLessonId | thirdLessonId | lessonIdInOldStatus | creatingLessonId | expectedLessonIdInOldStatus
        ${'first'}    | ${'second'}    | ${'third'}    | ${'third'}          | ${'fourth'}      | ${'fourth'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${null}             | ${'fourth'}      | ${'fourth'}
        ${null}       | ${null}        | ${null}       | ${null}             | ${'first'}       | ${'first'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${'third'}          | ${'second'}      | ${'second'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${'second'}         | ${'third'}       | ${'third'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${'second'}         | ${'fourth'}      | ${'fourth'}
      `(
        `$firstLessonId, $secondLessonId, $thirdLessonId, $lessonIdInOldStatus, $creatingLessonId, $expectedLessonIdInOldStatus
      `,
        async ({
          firstLessonId,
          secondLessonId,
          thirdLessonId,
          lessonIdInOldStatus,
          creatingLessonId,
          expectedLessonIdInOldStatus,
        }: {
          firstLessonId: string
          secondLessonId: string
          thirdLessonId: string
          lessonIdInOldStatus: string
          creatingLessonId: string
          expectedLessonIdInOldStatus: string
        }) => {
          const userId = uuid()
          const createHistory = async (startedAt: string, userId: string, lessonId: string) => {
            if (!lessonId) {
              return
            }
            await typeormUserLessonStatusHistoryRepository.insert({
              id: uuid(),
              user_id: userId,
              lesson_id: lessonId,
              status: UserLessonStatusTypeormEnum.not_cleared,
              started_at: new Date(startedAt),
              finished_at: undefined,
              achieved_star_count: 2,
              correct_answered_quiz_count: 2,
              used_hint_count: 2,
              step_id_skipping_detected: true,
            })
          }

          const createOldStatus = async (startedAt: string, userId: string, lessonId: string) => {
            if (!lessonId) {
              return
            }
            await typeormOldUserLessonStatusRepository.insert({
              id: uuid(),
              user_id: userId,
              lesson_id: lessonId,
              status: UserLessonStatusTypeormEnum.not_cleared,
              started_at: new Date(startedAt),
              finished_at: undefined,
              achieved_star_count: 2,
              correct_answered_quiz_count: 2,
              used_hint_count: 2,
              step_id_skipping_detected: true,
            })
          }

          await createHistory('2000-01-01T00:01:00Z', userId, firstLessonId)
          await createHistory('2000-01-01T00:02:00Z', userId, secondLessonId)
          await createHistory('2000-01-01T00:03:00Z', userId, thirdLessonId)
          await createOldStatus('2000-01-01T00:04:00Z', userId, lessonIdInOldStatus)
          await rdbUserLessonStatusRepository.create({
            id: uuid(),
            userId: userId,
            lessonId: creatingLessonId,
            status: 'not_cleared',
            startedAt: new Date('2000-01-01T00:05:00Z'),
            finishedAt: null,
            achievedStarCount: 0,
            correctAnsweredQuizCount: null,
            usedHintCount: null,
            stepIdSkippingDetected: false,
          })

          const res = await typeormOldUserLessonStatusRepository.findOneByOrFail({
            user_id: userId,
          })

          expect(res.lesson_id).toEqual(expectedLessonIdInOldStatus)
        },
      )
    })
  })

  describe('check updating with old status table', () => {
    describe(`firstLessonId | secondLessonId | thirdLessonId | lessonIdInOldStatus | updatingLessonId | expectedLessonIdInOldStatus`, () => {
      test.each`
        firstLessonId | secondLessonId | thirdLessonId | lessonIdInOldStatus | updatingLessonId | expectedLessonIdInOldStatus
        ${'first'}    | ${'second'}    | ${'third'}    | ${'third'}          | ${'third'}       | ${'third'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${'third'}          | ${'second'}      | ${'second'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${null}             | ${'third'}       | ${'third'}
        ${'first'}    | ${'second'}    | ${'third'}    | ${'second'}         | ${'third'}       | ${'third'}
      `(
        `$firstLessonId, $secondLessonId, $thirdLessonId, $lessonIdInOldStatus, $updatingLessonId, $expectedLessonIdInOldStatus
      `,
        async ({
          firstLessonId,
          secondLessonId,
          thirdLessonId,
          lessonIdInOldStatus,
          updatingLessonId,
          expectedLessonIdInOldStatus,
        }: {
          firstLessonId: string
          secondLessonId: string
          thirdLessonId: string
          lessonIdInOldStatus: string
          updatingLessonId: string
          expectedLessonIdInOldStatus: string
        }) => {
          const userId = uuid()
          const createHistory = async (startedAt: string, userId: string, lessonId: string) => {
            if (!lessonId) {
              return
            }

            const history = {
              id: uuid(),
              user_id: userId,
              lesson_id: lessonId,
              status: UserLessonStatusTypeormEnum.not_cleared,
              started_at: new Date(startedAt),
              finished_at: undefined,
              achieved_star_count: 2,
              correct_answered_quiz_count: 2,
              used_hint_count: 2,
              step_id_skipping_detected: true,
            }

            await typeormUserLessonStatusHistoryRepository.insert(history)

            return history
          }

          const createOldStatus = async (startedAt: string, userId: string, lessonId: string) => {
            if (!lessonId) {
              return
            }
            await typeormOldUserLessonStatusRepository.insert({
              id: uuid(),
              user_id: userId,
              lesson_id: lessonId,
              status: UserLessonStatusTypeormEnum.not_cleared,
              started_at: new Date(startedAt),
              finished_at: undefined,
              achieved_star_count: 2,
              correct_answered_quiz_count: 2,
              used_hint_count: 2,
              step_id_skipping_detected: true,
            })
          }

          const historyFirst = await createHistory('2000-01-01T00:01:00Z', userId, firstLessonId)
          const historySecond = await createHistory('2000-01-01T00:02:00Z', userId, secondLessonId)
          const historyThird = await createHistory('2000-01-01T00:03:00Z', userId, thirdLessonId)

          await createOldStatus('2000-01-01T00:04:00Z', userId, lessonIdInOldStatus)

          let target

          if (updatingLessonId === 'first' && historyFirst) {
            target = historyFirst
          } else if (updatingLessonId === 'second' && historySecond) {
            target = historySecond
          } else if (updatingLessonId === 'third' && historyThird) {
            target = historyThird
          }

          if (!target) {
            throw new Error(``)
          }
          await rdbUserLessonStatusRepository.update({
            id: target.id,
            userId: userId,
            lessonId: target.lesson_id,
            status: target.status,
            startedAt: target.started_at,
            finishedAt: new Date('2000-01-02T00:00:00Z'),
            achievedStarCount: 1,
            correctAnsweredQuizCount: 2,
            usedHintCount: 3,
            stepIdSkippingDetected: true,
          })

          const res = await typeormOldUserLessonStatusRepository.findOneByOrFail({
            user_id: userId,
          })

          expect(res.lesson_id).toEqual(expectedLessonIdInOldStatus)
        },
      )
    })
  })
})
