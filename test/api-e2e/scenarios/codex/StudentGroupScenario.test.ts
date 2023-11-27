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

test('Student Group API should work correctly', async () => {
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

  const organizationId = getOrganizationResponse2.data.organizations[0].id

  //Get Student Group (which should be empty)
  const getStudentGroups =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  expect(getStudentGroups.status).toEqual(200)
  expect(getStudentGroups.data).toEqual<Paths.GetStudentGroups.Responses.$200>({
    studentgroups: [], // empty first
  })

  // Create Student Group
  const createStudentGroupResponse =
    await axios.post<Paths.PostStudentGroup.Responses.$200>(
      `/organization/${organizationId}/student-group`,
      {
        name: 'AL Group',
        packageId: '1',
        grade: 'Grade11',
        studentGroupLmsId: '44',
      } as Paths.PostStudentGroup.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(createStudentGroupResponse.status).toEqual(200)
  expect(createStudentGroupResponse.statusText).toEqual('OK')

  // Get Student Group (which should be 1)
  const getStudentGroupResponse =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  if (!getStudentGroupResponse.data.studentgroups) {
    throw new Error('failed to get student group data from db,')
  }

  expect(getStudentGroupResponse.status).toEqual(200)
  expect(getStudentGroupResponse.data.studentgroups?.length).toEqual(1) // get one data
  expect(getStudentGroupResponse.data.studentgroups[0].name).toEqual('AL Group')

  // Edit Student Group
  const editStudentGroupResponse =
    await axios.put<Paths.PutStudentGroup.Responses.$200>(
      `/student-group/${getStudentGroupResponse.data?.studentgroups[0].id}`,
      {
        name: 'FL Group',
        packageId: '2',
        grade: 'Grade1',
        studentGroupLmsId: '11',
      } as Paths.PutStudentGroup.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(editStudentGroupResponse.status).toEqual(200)
  expect(editStudentGroupResponse.statusText).toEqual('OK')

  // Get upadted Student Group
  const getStudentGroupResponse2 =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  if (!getStudentGroupResponse2.data.studentgroups) {
    throw new Error('failed to get student groups data from db,')
  }
  expect(getStudentGroupResponse2.status).toEqual(200)
  expect(getStudentGroupResponse2.data.studentgroups?.length).toEqual(1) //
  expect(getStudentGroupResponse2.data.studentgroups[0].name).toEqual(
    'FL Group',
  )

  // Delete Student Group
  const deleteStudentGroupResponse =
    await axios.delete<Paths.DeleteStudentGroup.Responses.$200>(
      `/student-group/${getStudentGroupResponse2.data?.studentgroups[0].id}`,
      {
        headers: authorizationHeader,
      },
    )

  expect(deleteStudentGroupResponse.status).toEqual(200)
  expect(deleteStudentGroupResponse.statusText).toEqual('OK')

  // Get Student Group (which should be empty)
  const getStudentGroupResponse3 =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  expect(getStudentGroupResponse3.status).toEqual(200)
  expect(
    getStudentGroupResponse3.data,
  ).toEqual<Paths.GetStudentGroups.Responses.$200>({
    studentgroups: [], // empty
  })
})
