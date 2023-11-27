import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { ClasslinkDistrict } from '../../domain/entities/ClasslinkDistrict'
import { ClasslinkDistrictRepository } from './ClasslinkDistrictRepository'

const VALID_DISTRICT_DATA: ClasslinkDistrict = {
  sourcedId: '0',
  status: 'active',
  name: 'ClassLink School District',
}
const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkDistrictRepository for Classlink', () => {
  test('ClasslinkDistrictRepository - success', async () => {
    const classLinkDistrictRepository = new ClasslinkDistrictRepository()
    const result = await classLinkDistrictRepository.getDistrict(APP_ID, ACCESS_TOKEN)

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_DISTRICT_DATA)
  })
})
