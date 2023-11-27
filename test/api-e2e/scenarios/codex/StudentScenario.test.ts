import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

const VALID_STUDENTS = {
  students: [
    {
      nickName: 'Parth',
      loginId: 'Parth',
      password: 'Parth@123',
    },
  ],
}

const UPDATED_STUDENT = {
  nickName: 'Parth Parekh',
  loginId: 'ParthParekh',
  password: 'Parth@123456',
}

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Student APIs should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  /* Create User */
  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'chirag',
    password: await hashingPassword('Chirag@123'),
    role: 'internal_operator',
  })

  /* Login */
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

  /* Create distirct */
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

  /* Get records for created districts */
  const getDistricts = await axios.get('/districts', {
    headers: authorizationHeader,
  })

  if (!getDistricts.data.districts) {
    throw new Error('failed to get districts data')
  }
  expect(getDistricts.status).toEqual(200)

  const districtId = getDistricts.data.districts[0].id

  /* Get Organizations (which should be empty) */
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

  /* Create Organization */
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

  /* Check organization data added or not */
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

  /* Get Student Group (which should be empty) */
  const getStudentGroups =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  expect(getStudentGroups.status).toEqual(200)
  expect(getStudentGroups.data).toEqual<Paths.GetStudentGroups.Responses.$200>({
    studentgroups: [], // empty first
  })

  /* Create Student Group */
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

  /* Get Student Group (which should be 1) */
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

  const studentGroupId = getStudentGroupResponse.data.studentgroups[0].id

  /* Create students */
  const createStudentsRes = await axios.post<Paths.PostStudents.Responses.$200>(
    `/student-group/${studentGroupId}/students`,
    VALID_STUDENTS as Paths.PostStudents.RequestBody,
    {
      headers: authorizationHeader,
    },
  )

  expect(createStudentsRes.status).toEqual(200)

  /* Get records for created students*/
  const getStudentRes = await axios.get(
    `/student-group/${studentGroupId}/students`,
    { headers: authorizationHeader },
  )

  expect(getStudentRes.status).toEqual(200)
  expect(getStudentRes.data.students.length).toEqual(
    VALID_STUDENTS.students.length,
  )

  const studentId = getStudentRes.data.students?.[0]?.id

  /* Update record for created student */
  const updateStudentRes = await axios.put(
    `/student/${studentId}`,
    UPDATED_STUDENT as Paths.PutStudent.RequestBody,
    { headers: authorizationHeader },
  )

  expect(updateStudentRes.status).toEqual(200)

  /* Get records for created student */
  const getUpdatedStudentRes = await axios.get(
    `/student-group/${studentGroupId}/students`,
    { headers: authorizationHeader },
  )

  expect(getUpdatedStudentRes.status).toEqual(200)
  expect(getUpdatedStudentRes.data.students?.[0]?.nickName).toEqual(
    UPDATED_STUDENT.nickName,
  )
  expect(getUpdatedStudentRes.data.students?.[0]?.loginId).toEqual(
    UPDATED_STUDENT.loginId,
  )

  /* Delete created student */
  const deleteStudentRes = await axios.delete(`/student/${studentId}`, {
    headers: authorizationHeader,
  })

  expect(deleteStudentRes.status).toEqual(200)

  /* Check student record delete or not */
  const getDeletedStudentRes = await axios.get(
    `/student-group/${studentGroupId}/students`,
    { headers: authorizationHeader },
  )

  expect(getDeletedStudentRes.status).toEqual(200)
})
