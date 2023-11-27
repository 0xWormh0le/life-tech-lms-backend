import { randomUUID } from 'crypto'
import { UserTypeormEntity } from '../typeorm/entity/User'
import { UserLessonQuizAnswerStatusTypeormEntity } from '../typeorm/entity/UserLessonQuizAnswerStatus'
import { UserLessonStepStatusTypeormEntity, UserLessonStepStatusTypeormEnum } from '../typeorm/entity/UserLessonStepStatus'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { UserLessonQuizAnswerStatusRepository } from './UserLessonQuizAnswerStatusRepository'
import { UserLessonStatusesRepository } from './UserLessonStatusesRepository'
import { UserLessonStepStatusRepository } from './UserLessonStepStatusRepository'

const userId1 = randomUUID()
const userId2 = randomUUID()
const userId3 = randomUUID()
const lessonStepStatusId1 = randomUUID()
const lessonStepStatusId2 = randomUUID()
const lessonStepStatusId3 = randomUUID()
const lessonStepStatusId4 = randomUUID()

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
  ])
})

afterEach(teardownEnvironment)

describe('test UserLessonStepStatusRepoisitory for Codex', () => {
  test('success getUserLessonStepStatusesByUserIdAndLessonId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStepStatusTypeormRepository = appDataSource.getRepository(UserLessonStepStatusTypeormEntity)

    await userLessonStepStatusTypeormRepository.save([
      {
        user_id: userId1,
        id: lessonStepStatusId1,
        lesson_id: lessonId1,
        status: UserLessonStepStatusTypeormEnum.cleared,
        step_id: '5',
      },
      {
        user_id: userId1,
        id: lessonStepStatusId2,
        lesson_id: lessonId2,
        status: UserLessonStepStatusTypeormEnum.cleared,
        step_id: '4',
      },
      {
        user_id: userId1,
        id: lessonStepStatusId3,
        lesson_id: lessonId3,
        status: UserLessonStepStatusTypeormEnum.not_cleared,
        step_id: '8',
      },
      {
        user_id: userId1,
        id: lessonStepStatusId4,
        lesson_id: lessonId2,
        status: UserLessonStepStatusTypeormEnum.cleared,
        step_id: '8',
      },
    ])

    const userLessonStepStatusRepository = new UserLessonStepStatusRepository(appDataSource)
    const getUserLessonStepStatusesByUserIdAndLessonIdResult = await userLessonStepStatusRepository.getUserLessonStepStatusesByUserIdAndLessonId(
      userId1,
      lessonId2,
    )

    expect(
      getUserLessonStepStatusesByUserIdAndLessonIdResult.value?.map((e) => {
        return {
          userId: e.userId,
          lessonId: e.lessonId,
          stepId: e.stepId,
          status: e.status,
        }
      }),
    ).toStrictEqual([
      {
        userId: userId1,
        lessonId: lessonId2,
        stepId: '4',
        status: 'cleared',
      },
      {
        userId: userId1,
        lessonId: lessonId2,
        stepId: '8',
        status: 'cleared',
      },
    ])
  })

  test('success createUserLessonStepStatus', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStepStatusRepository = new UserLessonStepStatusRepository(appDataSource)
    const createUserLessonStepStatusResult = await userLessonStepStatusRepository.createUserLessonStepStatus({
      lessonId: lessonId2,
      status: 'not_cleared',
      stepId: '5',
      userId: userId2,
    })

    expect(createUserLessonStepStatusResult.value).toBe(undefined)
    expect(createUserLessonStepStatusResult.hasError).toBe(false)
    expect(createUserLessonStepStatusResult.error).toBe(null)

    const getCreatedResult = await userLessonStepStatusRepository.getUserLessonStepStatusesByUserIdAndLessonId(userId2, lessonId2)

    expect(getCreatedResult?.value?.[0]).toStrictEqual({
      lessonId: lessonId2,
      status: 'not_cleared',
      stepId: '5',
      userId: userId2,
    })
  })
})
