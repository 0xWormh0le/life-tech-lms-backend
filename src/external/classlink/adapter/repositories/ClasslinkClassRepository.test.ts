import { ClasslinkClassRepository } from './ClasslinkClassRepository'
import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'

const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkClassRepository for Classlink', () => {
  test('ClasslinkClassRepository - success', async () => {
    const classlinkClassRepository = new ClasslinkClassRepository()
    const result = await classlinkClassRepository.getAllBySchoolSourcedId(APP_ID, ACCESS_TOKEN, '2')

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
  })
})
