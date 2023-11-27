import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

const VALID_TEACHERS = {
  teachers: [
    {
      email: 'teacher1@gmail.com',
      firstName: 'teacher_first_name_1',
      lastName: 'teacher_last_name_1',
      teacherLMSId: 'teacher_lms_id_1',
    },
  ],
}

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('GET /teacher/<teacherId> API', async () => {
  jest.setTimeout(20000)

  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const DUMMY_USER_DATA = {
    email: 'litUserD@gmail.com',
    password: await hashingPassword('litUserD@123'),
    role: 'internal_operator',
  }
  const userRepo = appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save(DUMMY_USER_DATA)

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: DUMMY_USER_DATA.email,
      password: 'litUserD@123',
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

  expect(createDistrictRes.status).toEqual(200)

  /* Get records for created districts */
  const getDistrictsRes = await axios.get('/districts', {
    headers: authorizationHeader,
  })

  expect(getDistrictsRes.status).toEqual(200)

  const districtId = getDistrictsRes.data?.districts?.[0]?.id

  /* Create organization with given payload */
  const createOrganizationRes = await axios.post(
    `/organization`,
    {
      name: 'organization1',
      districtId: districtId,
      stateId: 'AL',
    },
    {
      headers: authorizationHeader,
    },
  )

  expect(createOrganizationRes.status).toEqual(200)

  /* Create another organization with given payload */
  const createOrganizationRes2 = await axios.post(
    `/organization`,
    {
      name: 'organization2',
      districtId: districtId,
      stateId: 'AL',
    },
    {
      headers: authorizationHeader,
    },
  )

  expect(createOrganizationRes2.status).toEqual(200)

  /* Create another organization with given payload */
  const createOrganizationRes3 = await axios.post(
    `/organization`,
    {
      name: 'organization3',
      districtId: districtId,
      stateId: 'AL',
    },
    {
      headers: authorizationHeader,
    },
  )

  expect(createOrganizationRes3.status).toEqual(200)

  /* Get records for created organization */
  const getOrganizationsRes = await axios.get(
    `/district/${districtId}/organizations`,
    {
      headers: authorizationHeader,
    },
  )

  expect(getOrganizationsRes.status).toEqual(200)

  const organizationId = getOrganizationsRes.data?.organizations?.[0]?.id
  const organizationId2 = getOrganizationsRes.data?.organizations?.[1]?.id
  const organizationId3 = getOrganizationsRes.data?.organizations?.[2]?.id

  /* Create teachers in organization using organizationId which we created earlier */
  const createTeacherRes = await axios.post<Paths.PostTeachers.Responses.$200>(
    `/organization/${organizationId}/teachers`,
    VALID_TEACHERS as Paths.PostTeachers.RequestBody,
    {
      headers: authorizationHeader,
    },
  )

  expect(createTeacherRes.status).toEqual(200)

  /* Get records for created teacher */
  const getTeacherRes = await axios.get(
    `/organization/${organizationId}/teachers`,
    { headers: authorizationHeader },
  )

  expect(getTeacherRes.status).toEqual(200)
  expect(getTeacherRes.data.teachers.length).toEqual(
    VALID_TEACHERS.teachers.length,
  )

  const teacherId = getTeacherRes.data.teachers?.[0]?.id

  /* Add teacher into organization using organizationId2 and teacherId which we created earlier */
  const addTeacherInOrganizationRes =
    await axios.post<Paths.PostTeacherInOrganization.Responses.$200>(
      `/organization/${organizationId2}/teacher/${teacherId}`,
      {},
      {
        headers: authorizationHeader,
      },
    )

  expect(addTeacherInOrganizationRes.status).toEqual(200)

  /* Add teacher into another organization using organizationId3 and teacherId which we created earlier */
  const addTeacherInOrganizationRes2 =
    await axios.post<Paths.PostTeacherInOrganization.Responses.$200>(
      `/organization/${organizationId3}/teacher/${teacherId}`,
      {},
      {
        headers: authorizationHeader,
      },
    )

  expect(addTeacherInOrganizationRes2.status).toEqual(200)

  // Get record for see all the organizations teacher belongs to
  const getTeacherOrganizationRes = await axios.get(`/teacher/${teacherId}`, {
    headers: authorizationHeader,
  })

  expect(getTeacherOrganizationRes.status).toEqual(200)
})
