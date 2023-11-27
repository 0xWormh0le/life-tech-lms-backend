import { ClasslinkStudentRepository } from './ClasslinkStudentRepository'
import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { ClasslinkStudent } from '../../domain/entities/ClasslinkStudent'

const VALID_STUDENTS_DATA: ClasslinkStudent[] = [
  {
    sourcedId: '22156',
    status: 'active',
    givenName: 'Brandon',
    familyName: 'Landfair',
    email: 'brandon.landfair@classlink.k12.nj.us',
  },
  {
    sourcedId: '29205',
    status: 'active',
    givenName: 'Mohammed',
    familyName: 'Forster',
    email: 'mohammed.forster@classlink.k12.nj.us',
  },
  {
    sourcedId: '32452',
    status: 'active',
    givenName: 'Dimple',
    familyName: 'Preciado',
    email: 'dimple.preciado@classlink.k12.nj.us',
  },
]
const APP_ID = 'jKWORGdUdX4%3D'
const ACCESS_TOKEN = '47078863-2fb8-4040-b697-8fe36ca78458'

jest.setTimeout(100000)

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test ClasslinkStudentRepository for Classlink', () => {
  test('ClasslinkStudentRepository - success', async () => {
    const classlinkStudentRepository = new ClasslinkStudentRepository()
    const result = await classlinkStudentRepository.getAllByClassSourcedId(APP_ID, ACCESS_TOKEN, '31763')

    if (result.hasError) {
      throw result.error
    }
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_STUDENTS_DATA)
  })
})
