import axios from 'axios'

import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('District API should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  // Create User
  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'chirag',
    password: await hashingPassword('Chirag@123'),
    role: 'internal_operator',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'chirag',
      password: 'Chirag@123',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse.status).toEqual(200)

  if (!loginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const user = loginResponse.data.user
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  // Get Districts (which should be empty)
  const getDistrictsResponse =
    await axios.get<Paths.GetDistricts.Responses.$200>(`/districts`, {
      headers: authorizationHeader,
    })

  expect(getDistrictsResponse.status).toEqual(200)
  expect(getDistrictsResponse.data).toEqual<Paths.GetDistricts.Responses.$200>({
    districts: [], // empty first
  })

  // Create District
  const createDistrictResponse =
    await axios.post<Paths.PostDistrict.Responses.$200>(
      `/district`,
      {
        name: 'CALL District',
        lmsId: '1',
        districtLMSId: null,
      } as Paths.PostDistrict.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  if (createDistrictResponse.status !== 200) {
    throw new Error(
      `/district returns error status ${
        createDistrictResponse.status
      } with ${JSON.stringify(createDistrictResponse.data)}`,
    )
  }

  // Get Districts (which should be 1)
  const getDistrictsResponse1 =
    await axios.get<Paths.GetDistricts.Responses.$200>(`/districts`, {
      headers: authorizationHeader,
    })

  if (!getDistrictsResponse1.data.districts) {
    throw new Error('failed to get districts data from db,')
  }

  expect(getDistrictsResponse1.status).toEqual(200)
  expect(getDistrictsResponse1.data.districts?.length).toEqual(1) // get one data
  expect(getDistrictsResponse1.data.districts[0].name).toEqual('CALL District')

  // Edit District
  const editDistrictResponse =
    await axios.put<Paths.PostDistrict.Responses.$200>(
      `/district/${getDistrictsResponse1.data?.districts[0].id}`,
      {
        name: 'Florida District',
        lmsId: '2',
        districtLMSId: null,
      } as Paths.PostDistrict.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(editDistrictResponse.status).toEqual(200)
  expect(editDistrictResponse.statusText).toEqual('OK')

  // Get upadted Districts
  const getDistrictsResponse2 =
    await axios.get<Paths.GetDistricts.Responses.$200>(`/districts`, {
      headers: authorizationHeader,
    })

  if (!getDistrictsResponse2.data.districts) {
    throw new Error('failed to get district data from db,')
  }
  expect(getDistrictsResponse2.status).toEqual(200)
  expect(getDistrictsResponse2.data.districts?.length).toEqual(1) //
  expect(getDistrictsResponse2.data.districts[0].name).toEqual(
    'Florida District',
  )

  // Delete District
  const deleteDistrictResponse =
    await axios.delete<Paths.DeleteDistrict.Responses.$200>(
      `/district/${getDistrictsResponse2.data?.districts[0].id}`,
      {
        headers: authorizationHeader,
      },
    )

  expect(deleteDistrictResponse.status).toEqual(200)
  expect(editDistrictResponse.statusText).toEqual('OK')

  // Get Districts (which should be empty)
  const getDistrictsResponse3 =
    await axios.get<Paths.GetDistricts.Responses.$200>(`/districts`, {
      headers: authorizationHeader,
    })

  expect(getDistrictsResponse3.status).toEqual(200)
  expect(getDistrictsResponse3.data).toEqual<Paths.GetDistricts.Responses.$200>(
    {
      districts: [], // empty
    },
  )
})
