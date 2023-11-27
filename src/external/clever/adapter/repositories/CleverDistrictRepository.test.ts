import { setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { CleverDistrict } from '../../domain/entities/CleverDistrict'
import { CleverDistrictRepository } from './CleverDistrictRepository'

const VALID_DISTRICT_DATA: CleverDistrict = {
  name: '#DEMO Certification ISD - Events',
  districtLMSId: '58da8a43cc70ab00017a1a87',
}
const CLEVER_AUTH_TOKEN = 'TEST_TOKEN'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test CleverDistrictRepository for Clever', () => {
  test('CleverDistrictRepository - success', async () => {
    const cleverDistrictRepository = new CleverDistrictRepository()
    const result = await cleverDistrictRepository.getDistrict(CLEVER_AUTH_TOKEN)

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(VALID_DISTRICT_DATA)
  })
})
