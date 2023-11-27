import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { request } from '../../api/codex-api-request'

beforeEach(setupEnvironment)

afterEach(teardownEnvironment)

test('No Credential Login should work', async () => {
  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  // No Credential Login
  const noCredentialLoginResult = await request({
    url: '/no-credential-login',
    method: 'post',
  })

  if (noCredentialLoginResult.hasError) {
    throw new Error(
      `POST /no-credential-login failed ${JSON.stringify(
        noCredentialLoginResult.error,
      )}`,
    )
  }

  const authorizationHeader = {
    Authorization: `Bearer ${noCredentialLoginResult.value.user.accessToken}`,
  }
  // Check Token
  const checkTokenResponse = await request({
    url: `/player_api/check_token`,
    method: 'get',
    headers: authorizationHeader,
  })

  if (checkTokenResponse.hasError) {
    throw new Error(
      `GET /player_api/check_token failed ${JSON.stringify(
        checkTokenResponse.error,
      )}`,
    )
  }
  expect(checkTokenResponse.value).toEqual<
    NonNullable<typeof checkTokenResponse.value>
  >({
    isAccessible: true,
    name: '',
    result: 'valid',
  })
})
