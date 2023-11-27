import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { ClasslinkTeacherRepository } from './ClasslinkTeacherRepository'

const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkTeacherRepository for Classlink', () => {
  test('ClasslinkTeacherRepository - success', async () => {
    const classlinkTeacherRepository = new ClasslinkTeacherRepository()
    const result = await classlinkTeacherRepository.getAllBySchoolSourcedId(APP_ID, ACCESS_TOKEN, '2')

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
    expect(result.hasError).toEqual(false)
  })
})
