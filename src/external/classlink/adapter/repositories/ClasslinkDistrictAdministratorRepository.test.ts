import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { ClasslinkDistrictAdministrator } from '../../domain/entities/ClasslinkDistrictAdministrator'
import { ClasslinkDistrictAdministratorRepository } from './ClasslinkDistrictAdministratorRepository'

const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'
const VALID_DISTRICT_ADMINISTRATOR_DATA: ClasslinkDistrictAdministrator[] = [
  {
    sourcedId: '91234',
    status: 'active',
    givenName: 'Smith',
    familyName: 'James',
    email: 'james.smith@classlink.k12.nj.us',
  },
]

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkDistrictAdministratorRepository for Classlink', () => {
  test('ClasslinkDistrictAdministratorRepository - success', async () => {
    const classlinkDistrictAdministratorRepository = new ClasslinkDistrictAdministratorRepository()
    const result = await classlinkDistrictAdministratorRepository.getAllByDistrictSourcedId(APP_ID, ACCESS_TOKEN, '0')

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_DISTRICT_ADMINISTRATOR_DATA)
  })
})
