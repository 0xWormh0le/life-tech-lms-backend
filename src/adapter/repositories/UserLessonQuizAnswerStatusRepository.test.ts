import { randomUUID } from 'crypto'
import { UserTypeormEntity } from '../typeorm/entity/User'
import { UserLessonQuizAnswerStatusTypeormEntity } from '../typeorm/entity/UserLessonQuizAnswerStatus'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { UserLessonQuizAnswerStatusRepository } from './UserLessonQuizAnswerStatusRepository'

const userId1 = randomUUID()
const userId2 = randomUUID()
const userId3 = randomUUID()
const userId4 = randomUUID()
const userId5 = randomUUID()
const userLessonStatusHistoryId1 = randomUUID()
const userLessonStatusHistoryId2 = randomUUID()
const userLessonStatusHistoryId3 = randomUUID()
const userLessonStatusHistoryId4 = randomUUID()
const userLessonStatusHistoryId5 = randomUUID()
const userLessonQuizAnswerStatuseId1 = randomUUID()
const userLessonQuizAnswerStatuseId2 = randomUUID()
const userLessonQuizAnswerStatuseId3 = randomUUID()
const userLessonQuizAnswerStatuseId4 = randomUUID()
const userLessonQuizAnswerStatuseId5 = randomUUID()
const lessonId1 = 'lesson-codeillusion-basic-principal-gem-1'
const lessonId2 = 'lesson-codeillusion-basic-principal-gem-2'
const lessonId3 = 'lesson-codeillusion-basic-principal-gem-3'

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  // create users
  const userTypeormRepository = appDataSource.getRepository(UserTypeormEntity)

  await userTypeormRepository.save([
    {
      id: userId1,
      email: 'user1@gmail.com',
      login_id: 'user-login-id-1',
      password: 'user1',
      role: 'student',
    },
    {
      id: userId2,
      email: 'user2@gmail.com',
      login_id: 'user-login-id-2',
      password: 'user2',
      role: 'student',
    },
    {
      id: userId3,
      email: 'user3@gmail.com',
      login_id: 'user-login-id-3',
      password: 'user3',
      role: 'student',
    },
    {
      id: userId4,
      email: 'user4@gmail.com',
      login_id: 'user-login-id-4',
      password: 'user4',
      role: 'internal_operator',
    },
    {
      id: userId5,
      email: 'user5@gmail.com',
      login_id: 'user-login-id-5',
      password: 'user5',
      role: 'student',
    },
  ])
})

afterEach(teardownEnvironment)

describe('test UserLessonQuizAnswerStatusRepository for Codex', () => {
  test('success getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonQuizAnswerStatusesTypeormRepository = appDataSource.getRepository(UserLessonQuizAnswerStatusTypeormEntity)

    await userLessonQuizAnswerStatusesTypeormRepository.save([
      {
        user_id: userId1,
        user_lesson_status_history_id: userLessonStatusHistoryId1,
        created_at: '2022-09-12T08:54:44.942Z',
        id: userLessonQuizAnswerStatuseId1,
        is_correct: true,
        lesson_id: lessonId1,
        selected_choice: 'choice-1',
        step_id: '4',
      },
      {
        user_id: userId1,
        user_lesson_status_history_id: userLessonStatusHistoryId2,
        created_at: '2022-06-12T08:54:44.942Z',
        id: userLessonQuizAnswerStatuseId2,
        is_correct: false,
        lesson_id: lessonId2,
        selected_choice: 'choice-1',
        step_id: '5',
      },
      {
        user_id: userId1,
        user_lesson_status_history_id: userLessonStatusHistoryId3,
        created_at: '2022-07-12T08:54:44.942Z',
        id: userLessonQuizAnswerStatuseId3,
        is_correct: false,
        lesson_id: lessonId2,
        selected_choice: 'choice-1',
        step_id: '6',
      },
      {
        user_id: userId1,
        user_lesson_status_history_id: userLessonStatusHistoryId4,
        created_at: '2022-08-12T08:54:44.942Z',
        id: userLessonQuizAnswerStatuseId4,
        is_correct: false,
        lesson_id: lessonId2,
        selected_choice: 'choice-1',
        step_id: '5',
      },
      {
        user_id: userId2,
        user_lesson_status_history_id: userLessonStatusHistoryId5,
        created_at: '2022-01-12T08:54:44.942Z',
        id: userLessonQuizAnswerStatuseId5,
        is_correct: false,
        lesson_id: lessonId3,
        selected_choice: 'choice-1',
        step_id: '5',
      },
    ])

    const userLessonQuizAnswerStatusRepository = new UserLessonQuizAnswerStatusRepository(appDataSource)
    const getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryResult =
      await userLessonQuizAnswerStatusRepository.getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryId(userLessonStatusHistoryId1)

    expect(getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryResult.error).toBe(null)
    expect(getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryResult.hasError).toBe(false)
    expect(
      getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryResult.value?.map((e) => {
        return {
          userId: e.userId,
          lessonId: e.lessonId,
          stepId: e.stepId,
          userLessonStatusHistoryId: e.userLessonStatusHistoryId,
          isCorrect: e.isCorrect,
          selectedChoice: e.selectedChoice,
        }
      }),
    ).toStrictEqual([
      {
        userId: userId1,
        userLessonStatusHistoryId: userLessonStatusHistoryId1,
        isCorrect: true,
        lessonId: lessonId1,
        selectedChoice: 'choice-1',
        stepId: '4',
      },
    ])
  })

  test('success createUserLessonQuizAnswerStatus', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonQuizAnswerStatusesTypeormRepository = appDataSource.getRepository(UserLessonQuizAnswerStatusTypeormEntity)

    const userLessonQuizAnswerStatusRepository = new UserLessonQuizAnswerStatusRepository(appDataSource)
    const createUserLessonQuizAnswerStatusResult = await userLessonQuizAnswerStatusRepository.createUserLessonQuizAnswerStatus({
      isCorrect: false,
      lessonId: lessonId3,
      selectedChoice: 'choice-2',
      stepId: '6',
      userId: userId2,
      userLessonStatusHistoryId: userLessonStatusHistoryId1,
    })
    const createdResult = await userLessonQuizAnswerStatusesTypeormRepository.find({
      where: {
        lesson_id: lessonId3,
        user_lesson_status_history_id: userLessonStatusHistoryId1,
      },
    })

    expect(createdResult[0]).not.toBe(undefined)
    expect(
      createdResult.map((e) => {
        return {
          isCorrect: e.is_correct,
          lessonId: e.lesson_id,
          selectedChoice: e.selected_choice,
          stepId: e.step_id,
          userId: e.user_id,
          userLessonStatusHistoryId: e.user_lesson_status_history_id,
        }
      }),
    ).toStrictEqual([
      {
        isCorrect: false,
        lessonId: lessonId3,
        selectedChoice: 'choice-2',
        stepId: '6',
        userId: userId2,
        userLessonStatusHistoryId: userLessonStatusHistoryId1,
      },
    ])
    expect(createUserLessonQuizAnswerStatusResult.error).toBe(null)
    expect(createUserLessonQuizAnswerStatusResult.hasError).toBe(false)
    expect(createUserLessonQuizAnswerStatusResult.value).toBe(undefined)
  })
})
