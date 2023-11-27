import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import { lessons } from '../../../../src/adapter/typeorm/hardcoded-data/Lessons'
import { request } from '../../api/codex-api-request'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Get lessons works correctly', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'dummydummy',
    password: await hashingPassword('dummydummy'),
    role: 'student',
  })

  // Login
  const loginResponse = await request({
    url: '/login',
    method: 'post',
    data: {
      loginId: 'dummydummy',
      password: 'dummydummy',
    },
  })

  if (loginResponse.hasError) {
    throw new Error(
      `failed to get user from /login ${JSON.stringify(loginResponse.error)}`,
    )
  }

  const user = loginResponse.value.user

  if (!user) {
    throw new Error(`failed to get user from /login user is undefined`)
  }

  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // Get every lessons
  const lessonIds = lessons(
    'http://localhost:3000',
    'http://localhost:3000',
  ).map((l) => l.id)

  const getLessonsResult = await request({
    url: '/lessons',
    method: 'get',
    headers: authorizationHeader,
    queryParams: {
      lessonIds,
    },
  })

  if (getLessonsResult.hasError) {
    throw new Error(
      `GET /lessons failed ${JSON.stringify(getLessonsResult.error)}`,
    )
  }
})
