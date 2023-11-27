import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { ClasslinkSchoolAdministrator } from '../../domain/entities/ClasslinkSchoolAdministrator'
import { ClasslinkSchoolAdministratorRepository } from './ClasslinkSchoolAdministratorRepository'

const VALID_SCHOOL_ADMIN_DATA: ClasslinkSchoolAdministrator[] = [
  {
    sourcedId: '91236',
    status: 'active',
    givenName: 'Mary',
    familyName: 'Kline',
    email: 'mary.kline@classlink.k12.nj.us',
  },
  {
    sourcedId: '91238',
    status: 'active',
    givenName: 'John',
    familyName: 'Simpson',
    email: 'john.simpson@classlink.k12.nj.us',
  },
]
const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkSchoolAdministratorRepository for Classlink', () => {
  test('ClasslinkSchoolAdministratorRepository - success', async () => {
    const classlinkSchoolAdministratorRepository = new ClasslinkSchoolAdministratorRepository()
    const result = await classlinkSchoolAdministratorRepository.getAllBySchoolSourcedId(APP_ID, ACCESS_TOKEN, '2')

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_SCHOOL_ADMIN_DATA)
  })
})
