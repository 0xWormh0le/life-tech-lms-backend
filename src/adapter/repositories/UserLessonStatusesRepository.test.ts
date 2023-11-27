import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { StudentTypeormEntity } from '../typeorm/entity/Student'
import { StudentGroupTypeormEntity } from '../typeorm/entity/StudentGroup'
import { StudentGroupStudentTypeormEntity } from '../typeorm/entity/StudentGroupStudent'
import { UserTypeormEntity } from '../typeorm/entity/User'
import { UserLessonStatusTypeormEntity } from '../typeorm/entity/UserLessonStatus'
import { UserLessonStatusHistoryTypeormEntity } from '../typeorm/entity/UserLessonStatusHistory'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { UserLessonStatusesRepository } from './UserLessonStatusesRepository'

const createDistrict1: string = randomUUID()
const createdOrganizationId1: string = randomUUID()
const createdOrganizationId2: string = randomUUID()
const createdStudentGroupId1: string = randomUUID()
const createdStudentGroupId2: string = randomUUID()

const studentId1: string = randomUUID()
const studentId2: string = randomUUID()
const studentId3: string = randomUUID()
const userId1: string = randomUUID()
const userId2: string = randomUUID()
const userId3: string = randomUUID()

const lessonStatuses = [
  {
    user_id: userId1,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-1',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:08:08.756'),
    finished_at: new Date('2022-09-12 02:18:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
  {
    user_id: userId1,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-2',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:18:08.756'),
    finished_at: new Date('2022-09-12 02:28:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
  {
    user_id: userId1,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-3',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:08:08.756'),
    finished_at: new Date('2022-09-12 02:12:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
  {
    user_id: userId1,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-4',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:18:08.756'),
    finished_at: new Date('2022-09-12 02:22:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
  {
    user_id: userId2,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-1',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:18:08.756'),
    finished_at: new Date('2022-09-12 02:25:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
  {
    user_id: userId2,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-2',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:30:08.756'),
    finished_at: new Date('2022-09-12 02:32:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
  {
    user_id: userId3,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-2',
    achieved_star_count: 0,
    started_at: new Date('2022-09-12 02:30:08.756'),
    correct_answered_quiz_count: 0,
    status: 'not_cleared',
  },
  {
    user_id: userId3,
    lesson_id: 'lesson-codeillusion-basic-principal-gem-3',
    achieved_star_count: 3,
    started_at: new Date('2022-09-12 02:30:08.756'),
    finished_at: new Date('2022-09-12 02:35:08.756'),
    correct_answered_quiz_count: 0,
    status: 'cleared',
  },
]

beforeEach(async () => {
  await setupEnvironment()
  process.env = {
    STATIC_FILES_BASE_URL: 'http://localhost:3000/',
    LESSON_PLAYER_BASE_URL: 'http://localhost:3200/',
  }

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  //create district
  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const createDistrictResult = await districtRepository.save([
    {
      id: createDistrict1,
      name: 'district-name-1',
    },
  ])

  //create organization
  const organizationRepository = appDataSource.getRepository(OrganizationTypeormEntity)

  await organizationRepository.save([
    {
      id: createdOrganizationId1,
      name: 'organization-name-1',
      district_id: createDistrictResult[0].id,
    },
    {
      id: createdOrganizationId2,
      name: 'organization-name-2',
      district_id: createDistrictResult[0].id,
    },
  ])

  //create student group
  const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

  await studentGroupRepository.save([
    {
      id: createdStudentGroupId1,
      name: 'organization-name-1-1',
      organization_id: { id: createdOrganizationId1 },
      package_id: 'package-1',
    },
    {
      id: createdStudentGroupId2,
      name: 'organization-name-1-2',
      organization_id: { id: createdOrganizationId1 },
      package_id: 'package-2',
    },
  ])

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

  const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)

  await studentTypeormRepository.save<DeepPartial<StudentTypeormEntity>>([
    {
      id: studentId1,
      nick_name: 'student-nickName-1',
      user_id: userId1,
      student_lms_id: 'student-studentLMSId-1',
      classlink_tenant_id: 'student-classlinkTenantId',
    },
    {
      id: studentId2,
      nick_name: 'student-nickName-2',
      user_id: userId2,
      student_lms_id: 'student-studentLMSId-2',
      classlink_tenant_id: 'student-classlinkTenantId',
    },
    {
      id: studentId3,
      nick_name: 'student-nickName-3',
      user_id: userId3,
      student_lms_id: 'student-studentLMSId-3',
      classlink_tenant_id: 'student-classlinkTenantId',
    },
  ])

  const studentMappingRepository = appDataSource.getRepository(StudentGroupStudentTypeormEntity)

  await studentMappingRepository.save<DeepPartial<StudentGroupStudentTypeormEntity>>([
    {
      student_group_id: { id: createdStudentGroupId1 },
      student_id: { id: studentId1 },
    },
    {
      student_group_id: { id: createdStudentGroupId1 },
      student_id: { id: studentId2 },
    },
    {
      student_group_id: { id: createdStudentGroupId1 },
      student_id: { id: studentId3 },
    },
    {
      student_group_id: { id: createdStudentGroupId2 },
      student_id: { id: studentId3 },
    },
  ])

  const userLessonStatusRepostiroy = appDataSource.getRepository(UserLessonStatusTypeormEntity)
  const userLessonHisotryRepository = appDataSource.getRepository(UserLessonStatusHistoryTypeormEntity)

  await userLessonHisotryRepository.save([
    ...lessonStatuses,
    {
      user_id: userId2,
      lesson_id: 'lesson-codeillusion-basic-principal-gem-1',
      achieved_star_count: 2,
      started_at: new Date('2022-09-12 03:18:08.756'),
      finished_at: new Date('2022-09-12 03:25:08.756'),
      correct_answered_quiz_count: 0,
      status: 'cleared',
    },
  ] as DeepPartial<UserLessonStatusHistoryTypeormEntity>[])
  await userLessonStatusRepostiroy.save(lessonStatuses as DeepPartial<UserLessonStatusTypeormEntity>[])
})

afterEach(teardownEnvironment)

describe('test UserLessonStatusedRepository', () => {
  test('success getUserLessonStatusesByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStatusesRepository = new UserLessonStatusesRepository(appDataSource)
    const getUserLessonStatusesByUserId = await userLessonStatusesRepository.getUserLessonStatusesByUserId(userId1)

    expect(getUserLessonStatusesByUserId.hasError).toEqual(false)
    expect(getUserLessonStatusesByUserId.error).toEqual(null)
    expect(getUserLessonStatusesByUserId.value).toEqual(
      lessonStatuses
        .map((item) => {
          if (item.user_id === userId1)
            return {
              userId: item.user_id,
              achievedStarCount: item.achieved_star_count,
              correctAnsweredQuizCount: item.correct_answered_quiz_count,
              lessonId: item.lesson_id,
              finishedAt: item.finished_at?.toISOString(),
              startedAt: item.started_at.toISOString(),
              status: item.status,
              stepIdskippingDetected: false,
              usedHintCount: null,
            }
        })
        .filter((item) => item !== undefined),
    )
  })

  test('success getLatesUserLessonStatusHistoriesByUserIdAndLessonId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStatusesRepository = new UserLessonStatusesRepository(appDataSource)
    const userLessonStatusHistoryTypeormEntity = appDataSource.getRepository(UserLessonStatusHistoryTypeormEntity)
    const result = await userLessonStatusesRepository.getLatesUserLessonStatusHistoriesByUserIdAndLessonId(userId2, 'lesson-codeillusion-basic-principal-gem-1')

    const findLatestHisotryId = await userLessonStatusHistoryTypeormEntity.findOne({
      where: {
        user_id: userId2,
        lesson_id: 'lesson-codeillusion-basic-principal-gem-1',
      },
      order: {
        started_at: 'DESC',
      },
    })

    if (!findLatestHisotryId) {
      throw new Error(`unable to get latest history of the user ${userId2}`)
    }
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual({
      id: findLatestHisotryId?.id,
      userId: userId2,
      achievedStarCount: 2,
      correctAnsweredQuizCount: 0,
      lessonId: 'lesson-codeillusion-basic-principal-gem-1',
      finishedAt: new Date('2022-09-12 03:25:08.756').toISOString(),
      startedAt: new Date('2022-09-12 03:18:08.756').toISOString(),
      status: 'cleared',
      stepIdskippingDetected: false,
      usedHintCount: null,
    })
  })

  test('success updateUserLessonStatus', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStatusesRepository = new UserLessonStatusesRepository(appDataSource)

    const result = await userLessonStatusesRepository.updateUserLessonStatus({
      userId: userId3,
      lessonId: 'lesson-codeillusion-basic-principal-gem-2',
      status: 'cleared',
      achievedStarCount: 1,
      correctAnsweredQuizCount: 2,
      usedHintCount: 3,
      stepIdskippingDetected: false,
      finishedAt: new Date('2022-09-12 02:30:08.756').toISOString(),
    })

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)

    const userLessonStatusHistoryTypeormEntity = appDataSource.getRepository(UserLessonStatusHistoryTypeormEntity)
    const userLessonStatusTypeormEntity = appDataSource.getRepository(UserLessonStatusTypeormEntity)

    const findUpdatedHistory = await userLessonStatusHistoryTypeormEntity.findOne({
      where: {
        user_id: userId3,
        lesson_id: 'lesson-codeillusion-basic-principal-gem-2',
      },
      order: {
        started_at: 'DESC',
      },
    })

    if (!findUpdatedHistory) {
      throw new Error(`failed to find latest record of userId : ${userId3}`)
    }
    expect(findUpdatedHistory.achieved_star_count).toEqual(1)
    expect(findUpdatedHistory.correct_answered_quiz_count).toEqual(2)
    expect(findUpdatedHistory.used_hint_count).toEqual(3)
    expect(findUpdatedHistory.status).toEqual('cleared')

    const updatedRecordInUserLessonStatusesTable = await userLessonStatusTypeormEntity.findOneBy({
      user_id: userId3,
      lesson_id: 'lesson-codeillusion-basic-principal-gem-2',
    })

    if (!updatedRecordInUserLessonStatusesTable) {
      throw new Error(`failed to find latest record of in user-lesson-statuses of userId : ${userId3}`)
    }
    expect(updatedRecordInUserLessonStatusesTable.achieved_star_count).toEqual(1)
    expect(updatedRecordInUserLessonStatusesTable.correct_answered_quiz_count).toEqual(2)
    expect(updatedRecordInUserLessonStatusesTable.used_hint_count).toEqual(3)
    expect(updatedRecordInUserLessonStatusesTable.status).toEqual('cleared')
  })

  test('success createUserLessonStatus', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStatusesRepository = new UserLessonStatusesRepository(appDataSource)

    const result = await userLessonStatusesRepository.createUserLessonStatus({
      userId: userId3,
      lessonId: 'lesson-codeillusion-basic-principal-gem-3',
      status: 'not_cleared',
      achievedStarCount: 0,
      correctAnsweredQuizCount: 0,
      usedHintCount: 0,
      stepIdskippingDetected: false,
      startedAt: new Date('2022-09-12 02:30:08.756').toISOString(),
    })

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)

    const findCreatedHistory = await userLessonStatusesRepository.getLatesUserLessonStatusHistoriesByUserIdAndLessonId(
      userId3,
      'lesson-codeillusion-basic-principal-gem-3',
    )

    expect(findCreatedHistory.value?.achievedStarCount).toEqual(0)
    expect(findCreatedHistory.value?.correctAnsweredQuizCount).toEqual(0)
    expect(findCreatedHistory.value?.usedHintCount).toEqual(0)
    expect(findCreatedHistory.value?.status).toEqual('not_cleared')
  })

  test('success getStudentGroupLessonStatuses', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const userLessonStatusesRepository = new UserLessonStatusesRepository(appDataSource)

    const result = await userLessonStatusesRepository.getStudentGroupLessonStatuses(createdStudentGroupId2)

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)

    expect(result.value).toEqual(
      lessonStatuses.slice(lessonStatuses.length - 2, lessonStatuses.length).map((item) => {
        return {
          userId: item.user_id,
          achievedStarCount: item.achieved_star_count,
          correctAnsweredQuizCount: item.correct_answered_quiz_count,
          lessonId: item.lesson_id,
          quizCount: item.correct_answered_quiz_count,
          status: item.status,
          stepIdskippingDetected: false,
          usedHintCount: null,
          startedAt: item.started_at.toISOString() ?? undefined,
          finishedAt: item.finished_at?.toISOString() ?? undefined,
        }
      }),
    )
  })
})
