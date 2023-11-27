import axios from 'axios'
import { setupEnvironment, teardownEnvironment } from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('ChurnZero token based authentication', async () => {
  const response = await axios.get<{ authToken: string }>('/churnzero/token', {
    params: {
      'account-external-id': '9999999',
      'contact-external-id': '9999999',
      next: 'next_query_string_parameter',
    },
    maxRedirects: 0,
  })

  if (response.status !== 302) {
    throw new Error(
      `/churnzero/token failed with status: ${
        response.status
      }, response: ${JSON.stringify(response.data)}`,
    )
  }
  expect(response.status).toBe(302)
  expect(response.data).toHaveProperty('authToken')

  if (
    !response.headers ||
    typeof response.headers !== 'object' ||
    !('location' in response.headers)
  ) {
    console.log(response.headers)
    throw new Error(`headers does not contain 'location'`)
  }
  expect(response.headers.location).toContain(
    `.churnzero.net/SuccessCenterCallback?token=${encodeURIComponent(
      response.data.authToken,
    )}&next=next_query_string_parameter`,
  )
})
