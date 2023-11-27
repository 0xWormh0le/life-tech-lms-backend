import axios from 'axios'
import { v4 as uuid } from 'uuid'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  createUser,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)
describe('ActionLogFromLessonPlayer', () => {
  let userAccessToken: string
  test('login', async () => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }
    await createUser('student1', 'student', appDataSource)

    const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
      '/login',
      {
        loginId: 'student1',
        password: 'student1',
      } as Paths.PostLogin.RequestBody,
    )
    expect(loginResponse.status).toEqual(200)

    if (!loginResponse.data.user) {
      throw new Error('failed to get user from /login')
    }

    userAccessToken = loginResponse.data.user.accessToken
  })

  test('call /action_log', async () => {
    const stepPassedResponse =
      await axios.post<Paths.PostActionLog.Responses.$200>(
        'player_api/action_log',
        {
          log: {
            event_name: 'stepPassed',
            project_name: 'donald',
            scenario_path: 'lesson/g_donald_1',
            step_id: '20',
            unique_id: uuid(),
          },
        } as Paths.PostActionLog.RequestBody,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        },
      )
  })
})
