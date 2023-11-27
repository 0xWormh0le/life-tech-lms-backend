import axios from 'axios'
import exp from 'constants'

import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('check_token from Lesson Player should succeed with correct token', async () => {
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

  // Check Token
  const checkTokenResponse =
    await axios.get<Paths.GetCheckToken.Responses.$200>(
      `/player_api/check_token`,
      {
        headers: authorizationHeader,
      },
    )

  expect(checkTokenResponse.status).toEqual(200)
  expect(checkTokenResponse.data).toEqual<Paths.GetCheckToken.Responses.$200>({
    isAccessible: true,
    name: '',
    result: 'valid',
  })
})

test('check_token from Lesson Player should fail with incorrect token', async () => {
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
    Authorization: `Bearer hogehogehoge`, // incorrect token
  }

  // Check Token
  const checkTokenResponse = await axios.get(`/player_api/check_token`, {
    headers: authorizationHeader,
  })

  expect(checkTokenResponse.status).toEqual(401)
  expect(checkTokenResponse.data).toEqual<Paths.GetCheckToken.Responses.$401>({
    isAccessible: false,
    // This base URL is specified in env/e2e-test/docker-compose.ts as CODEX_USA_FRONTEND_BASE_URL
    redirect_url: 'http://localhost:3100/',
    result: 'invalid',
  })
})
