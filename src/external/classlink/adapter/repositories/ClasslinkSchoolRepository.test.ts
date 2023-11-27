import { ClasslinkSchoolRepository } from './ClasslinkSchoolRepository'
import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { ClasslinkSchool } from '../../domain/entities/ClasslinkSchool'

const VALID_SCHOOLS_DATA: ClasslinkSchool[] = [
  {
    sourcedId: '2',
    status: 'active',
    name: 'ClassLink HS',
    parentSourcedId: '0',
  },
  {
    sourcedId: '3',
    status: 'active',
    name: 'ClassLink MS',
    parentSourcedId: '0',
  },
  {
    sourcedId: '7',
    status: 'active',
    name: 'ClassLink Elementary School',
    parentSourcedId: '0',
  },
]
const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkSchoolRepository for Classlink', () => {
  test('ClasslinkSchoolRepository - success', async () => {
    const classLinkSchoolRepository = new ClasslinkSchoolRepository()
    const result = await classLinkSchoolRepository.getAllSchools(APP_ID, ACCESS_TOKEN)

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_SCHOOLS_DATA)
  })
})
