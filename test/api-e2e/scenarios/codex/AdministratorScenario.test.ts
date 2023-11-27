import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

const VALID_ADMINISTRATORS = {
  administrators: [
    {
      email: 'admin@mail.com',
    },
  ],
}

const UPDATED_ADMINSTRATOR = {
  email: 'updated-admin@mail.com',
  firstName: 'Admin',
  lastName: '0001',
  administratorLMSId: 'Test0001',
}

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('POST /district/<district_id>/administrators API', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'wickwickwick',
    password: await hashingPassword('wickwickwick'),
    role: 'internal_operator',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'wickwickwick',
      password: 'wickwickwick',
    },
  )

  expect(loginResponse.status).toEqual(200)

  const { user } = loginResponse.data

  if (!user) {
    throw new Error('failed to get user from /login')
  }

  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  /* Create district with given payload */
  const createDistrictRes = await axios.post(
    `/district`,
    { name: 'FAKE_DISTRICT', lmsId: 'none' },
    {
      headers: authorizationHeader,
    },
  )

  if (createDistrictRes.status !== 200) {
    throw new Error(
      `/district returns error status ${
        createDistrictRes.status
      } with ${JSON.stringify(createDistrictRes.data)}`,
    )
  }

  /* Get records for created districts */
  const getDistrictsRes = await axios.get('/districts', {
    headers: authorizationHeader,
  })

  expect(getDistrictsRes.status).toEqual(200)

  const districtId = getDistrictsRes.data?.districts?.[0]?.id

  /* Create administrator in district using districtId which we created earlier */
  const createAdminRes = await axios.post(
    `/district/${districtId}/administrators`,
    VALID_ADMINISTRATORS,
    {
      headers: authorizationHeader,
    },
  )

  expect(createAdminRes.status).toEqual(200)

  /* Get records for created district adminstrators */
  const getDistrictAdminsRes = await axios.get(
    `/district/${districtId}/administrators`,
    { headers: authorizationHeader },
  )

  expect(getDistrictAdminsRes.status).toEqual(200)
  expect(getDistrictAdminsRes.data.administrators.length).toEqual(
    VALID_ADMINISTRATORS.administrators.length,
  )

  const administratorId =
    getDistrictAdminsRes.data.administrators?.[0]?.administratorId

  /* Update record for created district administrator */
  const updateDistrictAdminRes = await axios.put(
    `/administrator/${administratorId}`,
    UPDATED_ADMINSTRATOR,
    { headers: authorizationHeader },
  )

  expect(updateDistrictAdminRes.status).toEqual(200)

  /* Get records for created district adminstrators */
  const getUpdatedDistrictAdminsRes = await axios.get(
    `/district/${districtId}/administrators`,
    { headers: authorizationHeader },
  )

  expect(getUpdatedDistrictAdminsRes.status).toEqual(200)
  expect(
    getUpdatedDistrictAdminsRes.data.administrators?.[0]?.firstName,
  ).toEqual(UPDATED_ADMINSTRATOR.firstName)
  expect(
    getUpdatedDistrictAdminsRes.data.administrators?.[0]?.lastName,
  ).toEqual(UPDATED_ADMINSTRATOR.lastName)
  expect(getUpdatedDistrictAdminsRes.data.administrators?.[0]?.email).toEqual(
    UPDATED_ADMINSTRATOR.email,
  )
  expect(
    getUpdatedDistrictAdminsRes.data.administrators?.[0]?.administratorLMSId,
  ).toEqual(UPDATED_ADMINSTRATOR.administratorLMSId)

  /* Delete record for created district administrator */
  const deleteDistrictAdminRes = await axios.delete(
    `/administrator/${administratorId}`,
    { headers: authorizationHeader },
  )

  expect(deleteDistrictAdminRes.status).toEqual(200)

  /* Check records for delete administrator should not exists */
  const getDeletedDistrictAdminsRes = await axios.get(
    `/district/${districtId}/administrators`,
    { headers: authorizationHeader },
  )

  expect(getDeletedDistrictAdminsRes.status).toEqual(404)
})
