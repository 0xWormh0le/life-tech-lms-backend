import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import {
  UserRoleTypeormEnum,
  UserTypeormEntity,
} from '../../../../src/adapter/typeorm/entity/User'

import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Organization APIs should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'ParthParekh',
    password: await hashingPassword('Parth@123'),
    role: UserRoleTypeormEnum.internal_operator,
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'ParthParekh',
      password: 'Parth@123',
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

  //Need to add district and state data in table

  //Create distirct
  const createDistrictRes = await axios.post(
    `/district`,
    { name: 'florida', lmsId: 'none' },
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

  //Get records for created districts
  const getDistricts = await axios.get('/districts', {
    headers: authorizationHeader,
  })

  if (!getDistricts.data.districts) {
    throw new Error('failed to get districts data')
  }
  expect(getDistricts.status).toEqual(200)

  const districtId = getDistricts.data.districts[0].id

  //Get Organizations (which should be empty)
  const getOrganizationResponse1 =
    await axios.get<Paths.GetOrganizations.Responses.$200>(
      `/district/${districtId}/organizations`,
      { headers: authorizationHeader },
    )

  expect(getOrganizationResponse1.status).toEqual(200)
  expect(
    getOrganizationResponse1.data,
  ).toEqual<Paths.GetOrganizations.Responses.$200>({
    organizations: [], // empty first
  })

  //Create Organization
  const organizationInfo = {
    name: 'Sunrise',
    districtId: districtId,
    stateId: 'AL',
  }

  const createOrganization =
    await axios.post<Paths.PostOrganization.Responses.$200>(
      '/organization',
      organizationInfo,
      { headers: authorizationHeader },
    )

  expect(createOrganization.status).toEqual(200)
  expect(
    createOrganization.data,
  ).toEqual<Paths.PostOrganization.Responses.$200>({
    message: 'ok',
  })

  //Check organization data added or not
  const getOrganizationResponse2 =
    await axios.get<Paths.GetOrganizations.Responses.$200>(
      `/district/${districtId}/organizations`,
      { headers: authorizationHeader },
    )

  expect(getOrganizationResponse2.status).toEqual(200)
  expect(getOrganizationResponse2.data.organizations?.length).toEqual(1)

  if (!getOrganizationResponse2.data.organizations) {
    throw new Error('failed to get organizations')
  }

  //Update organization data
  const updateOrganization =
    await axios.put<Paths.PutOrganization.Responses.$200>(
      `/organization/${getOrganizationResponse2.data.organizations[0].id}`,
      {
        ...organizationInfo,
        name: 'Royal',
      },
      { headers: authorizationHeader },
    )

  expect(updateOrganization.status).toEqual(200)
  expect(updateOrganization.data).toEqual<Paths.PutOrganization.Responses.$200>(
    {
      message: 'ok',
    },
  )

  //Check organization data update or not
  const getOrganizationResponse3 =
    await axios.get<Paths.GetOrganizations.Responses.$200>(
      `/district/${districtId}/organizations`,
      {
        headers: authorizationHeader,
      },
    )
  const { organizations } = getOrganizationResponse3.data

  if (!organizations) {
    throw new Error('failed to get organizations')
  }
  expect(getOrganizationResponse3.status).toEqual(200)
  expect(organizations.length).toEqual(1)
  expect(organizations[0].name).toEqual('Royal')
  expect(organizations[0].districtId).toEqual(districtId)
  expect(organizations[0].stateId).toEqual('AL')

  //delete organization
  const deleteOrganization =
    await axios.delete<Paths.DeleteOrganization.Responses.$200>(
      `/organization/${getOrganizationResponse2.data.organizations[0].id}`,
      {
        headers: authorizationHeader,
      },
    )

  expect(deleteOrganization.status).toEqual(200)
  expect(
    deleteOrganization.data,
  ).toEqual<Paths.DeleteOrganization.Responses.$200>({
    message: 'ok',
  })

  //Check organization delete or not
  const getOrganizationResponse4 =
    await axios.get<Paths.GetOrganizations.Responses.$200>(
      `/district/${districtId}/organizations`,
      {
        headers: authorizationHeader,
      },
    )

  expect(getOrganizationResponse4.status).toEqual(200)
  expect(
    getOrganizationResponse4.data,
  ).toEqual<Paths.GetOrganizations.Responses.$200>({
    organizations: [], // empty first
  })
})
