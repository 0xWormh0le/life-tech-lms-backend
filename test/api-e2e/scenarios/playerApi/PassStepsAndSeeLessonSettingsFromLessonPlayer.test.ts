import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import dayjs from 'dayjs'
import { lessonIdByProjectnameAndScenarioPath } from '../../../../src/adapter/typeorm/hardcoded-data/Lessons'
import { UserLessonStatusHistoryTypeormEntity } from '../../../../src/adapter/typeorm/entity/UserLessonStatusHistory'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('When the user passed steps, lesson setting should reflect it', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'wickwickwick',
    password: await hashingPassword('wickwickwick'),
    role: 'student',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'wickwickwick',
      password: 'wickwickwick',
    } as Paths.PostLogin.RequestBody,
  )
  const targetLessonId = lessonIdByProjectnameAndScenarioPath(
    'aladdin',
    'lesson/g_aladdin_1',
  )

  if (!targetLessonId) {
    throw new Error(`aladdin lesson/g_aladdin_1 is not existing`)
  }

  expect(loginResponse.status).toEqual(200)

  if (!loginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const user = loginResponse.data.user
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  const targetProjectName = 'aladdin'
  const targetScenarioPath = encodeURIComponent('lesson/g_aladdin_1')
  //
  // POST /user-lesson-status called to start lesson
  //
  const dateWhenLessonStartedCalled = dayjs()
  const postUserLessonStatusResult =
    await axios.post<Paths.PostUserLessonStatus.Responses.$200>(
      '/user-lesson-status',
      {
        lessonId: targetLessonId,
      } as Paths.PostUserLessonStatus.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  if (postUserLessonStatusResult.status !== 200) {
    throw new Error(
      `postUserLessonStatusResult not 200 ${JSON.stringify(
        postUserLessonStatusResult.data,
        null,
        2,
      )}`,
    )
  }

  if (postUserLessonStatusResult.status !== 200) {
    throw new Error(
      `postUserLessonStatusResult not 200 ${JSON.stringify(
        postUserLessonStatusResult.data,
        null,
        2,
      )}`,
    )
  }

  const userLessonStatusHistoryRepository = await appDataSource.getRepository(
    UserLessonStatusHistoryTypeormEntity,
  )
  const userLessonStatusHistoriesData =
    await userLessonStatusHistoryRepository.find({
      where: {
        user_id: user.id,
        lesson_id: targetLessonId,
      },
    })

  expect(userLessonStatusHistoriesData.length).toEqual(1)
  expect(userLessonStatusHistoriesData[0].started_at).not.toBeUndefined()
  expect(
    dayjs(userLessonStatusHistoriesData[0].started_at).diff(
      dateWhenLessonStartedCalled,
      'second',
    ),
  ).toBeLessThan(1)
  expect(userLessonStatusHistoriesData[0].finished_at).toBe(null)

  // See Lesson Setting
  const getLessonsSettingResponse = await axios.get(
    `player_api/lesson_setting?project_name=${targetProjectName}&scenario_path=${targetScenarioPath}`,
    {
      headers: authorizationHeader,
    },
  )

  expect(getLessonsSettingResponse.status).toEqual(200)
  expect(
    getLessonsSettingResponse.data,
  ).toEqual<Paths.GetLessonsSetting.Responses.$200>({
    isAccessible: true,
    cleared: false,
    redirecetUrl: '',
    passed_step_id_list: [], // No steps cleared yet
  })

  // step_passed called from Lesson Player
  const stepPassedResponse =
    await axios.post<Paths.PostStepPassed.Responses.$200>(
      'player_api/step_passed',
      {
        project_name: targetProjectName,
        scenario_path: targetScenarioPath,
        step_id: '20',
      } as Paths.PostStepPassed.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(stepPassedResponse.status).toEqual(200)

  // Lesson Player can call step_passed for the same lesson and the same step
  const stepPassedResponse2 =
    await axios.post<Paths.PostStepPassed.Responses.$200>(
      'player_api/step_passed',
      {
        project_name: targetProjectName,
        scenario_path: targetScenarioPath,
        step_id: '20',
      } as Paths.PostStepPassed.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(stepPassedResponse2.status).toEqual(200)

  // See Lesson Setting again
  const getLessonsSettingResponseAfterPassStep = await axios.get(
    `player_api/lesson_setting?project_name=${targetProjectName}&scenario_path=${targetScenarioPath}`,
    {
      headers: authorizationHeader,
    },
  )

  expect(getLessonsSettingResponseAfterPassStep.status).toEqual(200)
  expect(
    getLessonsSettingResponseAfterPassStep.data,
  ).toEqual<Paths.GetLessonsSetting.Responses.$200>({
    isAccessible: true,
    cleared: false,
    redirecetUrl: '',
    passed_step_id_list: [20], // passed step added
  })

  // call step_passed again for the other step_id
  const stepPassedResponse3 =
    await axios.post<Paths.PostStepPassed.Responses.$200>(
      'player_api/step_passed',
      {
        project_name: targetProjectName,
        scenario_path: targetScenarioPath,
        step_id: '35',
      } as Paths.PostStepPassed.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(stepPassedResponse3.status).toEqual(200)

  // lesson_cleared called from Lesson Player
  const lessonClearedResponse =
    await axios.post<Paths.PostLessonCleared.Responses.$200>(
      'player_api/lesson_cleared',
      {
        finish_status: {
          no_status_up: false,
          no_hint_cleared: true,
          quiz_all_answered: false,
        },
        project_name: targetProjectName,
        scenario_path: targetScenarioPath,
      } as Paths.PostLessonCleared.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(lessonClearedResponse.status).toEqual(200)

  // See Lesson Setting once more again
  const getLessonsSettingResponseAfterLessonCleared = await axios.get(
    `player_api/lesson_setting?project_name=${targetProjectName}&scenario_path=${targetScenarioPath}`,
    {
      headers: authorizationHeader,
    },
  )

  expect(getLessonsSettingResponseAfterLessonCleared.status).toEqual(200)
  expect(
    getLessonsSettingResponseAfterLessonCleared.data,
  ).toEqual<Paths.GetLessonsSetting.Responses.$200>({
    isAccessible: true,
    cleared: true, // Cleared
    redirecetUrl: '',
    passed_step_id_list: [20, 35],
  })
})
