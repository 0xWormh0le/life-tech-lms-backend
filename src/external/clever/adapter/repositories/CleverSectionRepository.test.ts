import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { VALID_ORGANIZATION_DATA } from './CleverSchoolRepository.test'
import { CleverSectionRepository } from './CleverSectionRepository'

const CLEVER_AUTH_TOKEN = 'TEST_TOKEN'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test CleverSectionsRepository for Clever', () => {
  test('CleverSectionsRepository - success', async () => {
    const cleverSectionRepository = new CleverSectionRepository()
    const result = await cleverSectionRepository.getCleverSections(
      CLEVER_AUTH_TOKEN,
      VALID_ORGANIZATION_DATA.map((item) => item.organizationLMSId),
    )

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
  }, 20000)
})
