import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { CleverSchool } from '../../domain/entities/CleverSchool'
import { CleverSchoolRepository } from './CleverSchoolRepository'

export const VALID_ORGANIZATION_DATA: CleverSchool[] = [
  {
    name: 'Pineapple Elementary School',
    districtLMSId: '58da8a43cc70ab00017a1a87',
    organizationLMSId: '58da8c58155b940248000007',
  },
  {
    name: 'Rockaway Beach Middle School',
    districtLMSId: '58da8a43cc70ab00017a1a87',
    organizationLMSId: '58da8c58155b940248000008',
  },
  {
    name: 'Rockaway Beach Middle School Campus 2',
    districtLMSId: '58da8a43cc70ab00017a1a87',
    organizationLMSId: '58da8c58155b940248000009',
  },
  {
    name: 'Rockaway Beach Middle School Campus 3',
    districtLMSId: '58da8a43cc70ab00017a1a87',
    organizationLMSId: '58da8c58155b94024800000a',
  },
]

const CLEVER_AUTH_TOKEN = 'TEST_TOKEN'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test CleverSchoolsRepository for Clever', () => {
  test('CleverSchoolsRepository - success', async () => {
    const cleverSchoolRepository = new CleverSchoolRepository()
    const result = await cleverSchoolRepository.getCleverSchools(CLEVER_AUTH_TOKEN)

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_ORGANIZATION_DATA)
  })
})
