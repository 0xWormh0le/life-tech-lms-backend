import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { CleverDistrictAdministrator } from '../../domain/entities/CleverDistrictAdministrator'
import { CleverDistrictAdministratorRepository } from './CleverDistrictAdministratorRepository'

const VALID_DISTRICT_ADMINISTRATOR_DATA: CleverDistrictAdministrator[] = [
  {
    email: 'amelie.zeng+certification@clever.com',
    firstName: 'Amelie',
    lastName: 'Zeng',
    administratorLMSId: '5faac8b7bc447500a10ae89d',
  },
  {
    email: 'leboy.thoppil+demo1@riversideinsights.com',
    firstName: 'Leboy',
    lastName: 'Wilson',
    administratorLMSId: '640a618c2878220379fe7a25',
  },
]
const CLEVER_AUTH_TOKEN = 'TEST_TOKEN'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test CleverDistrictAdministratorRepository for Clever', () => {
  test('CleverDistrictAdministratorRepository - success', async () => {
    const cleverDistrictAdministratorRepository = new CleverDistrictAdministratorRepository()
    const result = await cleverDistrictAdministratorRepository.getDistrictAdministrator(CLEVER_AUTH_TOKEN)

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_DISTRICT_ADMINISTRATOR_DATA)
  })
})
