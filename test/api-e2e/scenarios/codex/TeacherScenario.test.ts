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
      email: 'teacher1@email.com',
      firstName: 'teacher_first_name_1',
      lastName: 'teacher_last_name_1',
      teacherLMSId: 'teacher_lms_id_1',
    },
  ],
}

const UPDATED_TEACHER = {
  teacher: {
    email: 'updatedteacher1@mail.com',
    firstName: 'teacher',
    lastName: '0001',
    teacherLMSId: 'Test0001',
  },
}

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('POST /organization/<organizationId>/teachers API', async () => {
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

  /* Create organization with given payload */
  const createOrganizationRes = await axios.post(
    `/organization`,
    {
      name: 'FAKE_ORGANIZATION',
      districtId: districtId,
      stateId: 'AL',
    },
    {
      headers: authorizationHeader,
    },
  )

  expect(createOrganizationRes.status).toEqual(200)

  /* Get records for created organization */
  const getOrganizationsRes = await axios.get(
    `/district/${districtId}/organizations`,
    {
      headers: authorizationHeader,
    },
  )

  expect(getOrganizationsRes.status).toEqual(200)

  const organizationId = getOrganizationsRes.data?.organizations?.[0]?.id

  /* Create teachers in organization using organizationId which we created earlier */
  const createTeacherRes = await axios.post<Paths.PostTeachers.Responses.$200>(
    `/organization/${organizationId}/teachers`,
    VALID_TEACHERS as Paths.PostTeachers.RequestBody,
    {
      headers: authorizationHeader,
    },
  )

  expect(createTeacherRes.status).toEqual(200)

  /* Get records for created district adminstrators */
  const getTaecherRes = await axios.get(
    `/organization/${organizationId}/teachers`,
    { headers: authorizationHeader },
  )

  expect(getTaecherRes.status).toEqual(200)
  expect(getTaecherRes.data.teachers.length).toEqual(
    VALID_TEACHERS.teachers.length,
  )

  const teacherId = getTaecherRes.data.teachers?.[0]?.id

  /* Update record for created teacher */
  const updateTeacherRes = await axios.put(
    `/teacher/${teacherId}`,
    UPDATED_TEACHER as Paths.PutTeacher.RequestBody,
    { headers: authorizationHeader },
  )

  expect(updateTeacherRes.status).toEqual(200)

  /* Get records for created teacher */
  const getUpdatedTeacherRes = await axios.get(
    `/organization/${organizationId}/teachers`,
    { headers: authorizationHeader },
  )

  expect(getUpdatedTeacherRes.status).toEqual(200)
  expect(getUpdatedTeacherRes.data.teachers?.[0]?.firstName).toEqual(
    UPDATED_TEACHER.teacher.firstName,
  )
  expect(getUpdatedTeacherRes.data.teachers?.[0]?.lastName).toEqual(
    UPDATED_TEACHER.teacher.lastName,
  )
  expect(getUpdatedTeacherRes.data.teachers?.[0]?.email).toEqual(
    UPDATED_TEACHER.teacher.email,
  )
  expect(getUpdatedTeacherRes.data.teachers?.[0]?.teacherLMSId).toEqual(
    UPDATED_TEACHER.teacher.teacherLMSId,
  )

  /* Delete record for created teacher */
  const deleteTeacherRes = await axios.delete(`/teacher/${teacherId}`, {
    headers: authorizationHeader,
  })

  expect(deleteTeacherRes.status).toEqual(200)

  /* Check records for delete teacher should not exists */
  const getDeletedTeacherRes = await axios.get(
    `/organization/${organizationId}/teachers`,
    { headers: authorizationHeader },
  )

  expect(getDeletedTeacherRes.status).toEqual(404)
})
