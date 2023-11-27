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

test('after_lesson_cleared from Lesson Player succeed with student account', async () => {
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

  // After Lesson Cleared
  const checkTokenResponse =
    await axios.get<Paths.GetAfterLessonCleared.Responses.$200>(
      `/player_api/after_lesson_cleared`,
      {
        headers: authorizationHeader,
      },
    )

  expect(checkTokenResponse.status).toEqual(200)
  expect(
    checkTokenResponse.data,
  ).toEqual<Paths.GetAfterLessonCleared.Responses.$200>({
    type: 'full_url', // returns fixed value
    // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
    value: 'http://localhost:3100/',
  })
})

test('after_lesson_cleared from Lesson Player succeed with teacher account', async () => {
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

  // After Lesson Cleared
  const checkTokenResponse =
    await axios.get<Paths.GetAfterLessonCleared.Responses.$200>(
      `/player_api/after_lesson_cleared`,
      {
        headers: authorizationHeader,
      },
    )

  expect(checkTokenResponse.status).toEqual(200)
  expect(
    checkTokenResponse.data,
  ).toEqual<Paths.GetAfterLessonCleared.Responses.$200>({
    type: 'full_url', // returns fixed value
    // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
    value: 'http://localhost:3100/lesson-guidance',
  })
})
