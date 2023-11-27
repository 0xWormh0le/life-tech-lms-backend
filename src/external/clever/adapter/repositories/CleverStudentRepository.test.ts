import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { VALID_ORGANIZATION_DATA } from './CleverSchoolRepository.test'
import { CleverStudentRepository } from './CleverStudentRepository'

const CLEVER_AUTH_TOKEN = 'TEST_TOKEN'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test CleverStudentRepository for Clever', () => {
  test('CleverStudentRepository - success', async () => {
    const cleverStudentRepository = new CleverStudentRepository()
    const result = await cleverStudentRepository.getCleverStudents(
      CLEVER_AUTH_TOKEN,
      VALID_ORGANIZATION_DATA.map((item) => item.organizationLMSId),
    )

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
  }, 20000)
})
