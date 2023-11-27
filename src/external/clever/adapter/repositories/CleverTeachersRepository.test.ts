import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { VALID_ORGANIZATION_DATA } from './CleverSchoolRepository.test'
import { CleverTeachersRepository } from './CleverTeachersRepository'

const CLEVER_AUTH_TOKEN = 'TEST_TOKEN'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test CleverTeachersRepository for Clever', () => {
  test('CleverTeachersRepository - success', async () => {
    const cleverTeachersRepository = new CleverTeachersRepository()
    const result = await cleverTeachersRepository.getCleverTeachers(
      CLEVER_AUTH_TOKEN,
      VALID_ORGANIZATION_DATA.map((item) => item.organizationLMSId),
    )

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
  }, 20000)
})
