import axios from 'axios'

import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeEach(setupEnvironment)

afterEach(teardownEnvironment)

test('lesson_finished from Lesson Player succeed with student account', async () => {
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

  expect(loginResponse.status).toEqual(200)

  if (!loginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const user = loginResponse.data.user
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // PostLessonFinished
  const postLessonFinishedResponse =
    await axios.post<Paths.PostLessonCleared.Responses.$200>(
      'player_api/lesson_finished',
      {
        finish_status: {
          quiz_all_answered: false, // correctAnsweredQuizCount will be 1
          no_hint_cleared: false, // usedHintCount will be 1
          no_status_up: false, // this will be reflected to stepIdskippingDetected
        },
        project_name: 'aladdin',
        scenario_path: 'lesson/g_aladdin_1',
      } as Paths.PostLessonCleared.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  if (postLessonFinishedResponse.status !== 200) {
    throw new Error(
      `postLessonFinishedResponse not 200 ${JSON.stringify(
        postLessonFinishedResponse.data,
        null,
        2,
      )}`,
    )
  }
  expect(
    postLessonFinishedResponse.data,
  ).toEqual<Paths.PostLessonFinished.Responses.$200>({
    type: 'full_url', // returns fixed value
    // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
    value: 'http://localhost:3100/computer-science-essentials',
  })
})

test('lesson_finished from Lesson Player succeed with teacher account', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'wickwickwick',
    password: await hashingPassword('wickwickwick'),
    role: 'teacher',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'wickwickwick',
      password: 'wickwickwick',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse.status).toEqual(200)

  if (!loginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const user = loginResponse.data.user
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // PostLessonFinished
  const postLessonFinishedResponse =
    await axios.post<Paths.PostLessonCleared.Responses.$200>(
      'player_api/lesson_finished',
      {
        finish_status: {
          quiz_all_answered: false, // correctAnsweredQuizCount will be 1
          no_hint_cleared: false, // usedHintCount will be 1
          no_status_up: false, // this will be reflected to stepIdskippingDetected
        },
        project_name: 'aladdin',
        scenario_path: 'lesson/g_aladdin_1',
      } as Paths.PostLessonCleared.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  if (postLessonFinishedResponse.status !== 200) {
    throw new Error(
      `postLessonFinishedResponse not 200 ${JSON.stringify(
        postLessonFinishedResponse.data,
        null,
        2,
      )}`,
    )
  }
  expect(
    postLessonFinishedResponse.data,
  ).toEqual<Paths.PostLessonFinished.Responses.$200>({
    type: 'full_url', // returns fixed value
    // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
    value: 'http://localhost:3100/lesson-guidance',
  })
})
