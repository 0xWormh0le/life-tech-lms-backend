import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { userRoles } from '../../../../src/domain/usecases/shared/Constants'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

const VALID_ADMINISTRATORS = {
  administrators: [
    {
      email: 'admin@gmail.com',
      password: 'admin@123',
      firstName: 'admin_first_name_1',
      lastName: 'admin_last_name_1',
      administratorLMSId: 'admin_lms_id_1',
    },
  ],
}
const VALID_STUDENTS = {
  students: [
    {
      nickName: 'studentA',
      loginId: 'studentA',
      password: 'studentA@123',
      studentLMSId: 'student_lms_id_1',
    },
  ],
}
const VALID_TEACHERS = {
  teachers: [
    {
      email: 'teacher1@gmail.com',
      password: 'teacher@123',
      firstName: 'teacher_first_name_1',
      lastName: 'teacher_last_name_1',
      teacherLMSId: 'teacher_lms_id_1',
    },
  ],
}

beforeEach(setupEnvironment)

afterEach(teardownEnvironment)

test('Me APIs should work correctly when user role is Internal operator', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const DUMMY_USER_DATA = {
    email: 'litUserB@email.com',
    password: await hashingPassword('litUserB@123'),
    role: 'internal_operator',
  }

  /* Create User */
  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save(DUMMY_USER_DATA)

  const userData = await userRepo.findOneBy({ email: DUMMY_USER_DATA.email })

  /* Login */
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: DUMMY_USER_DATA.email,
      password: 'litUserB@123',
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

  //Get Logged in internal operator user details
  const getMeRes = await axios.get(`/me`, { headers: authorizationHeader })

  expect(getMeRes.status).toEqual(200)

  if (userData) {
    expect(getMeRes.data).toEqual({
      user: {
        id: userData.id,
        role: userRoles.internalOperator,
        email: userData.email,
      },
    })
  }
})

test('Me APIs should work correctly when user role is Administrator', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const DUMMY_USER_DATA = {
    email: 'litUserB@email.com',
    password: await hashingPassword('litUserB@123'),
    role: 'internal_operator',
  }

  /* Create User */
  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save(DUMMY_USER_DATA)

  /* Login */
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: DUMMY_USER_DATA.email,
      password: 'litUserB@123',
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

  const userData = await userRepo.findOneBy({
    email: VALID_ADMINISTRATORS.administrators[0].email,
  })

  //Login with administrator
  const administratorLoginResponse =
    await axios.post<Paths.PostLogin.Responses.$200>('/login', {
      loginId: VALID_ADMINISTRATORS.administrators[0].email,
      password: VALID_ADMINISTRATORS.administrators[0].password,
    } as Paths.PostLogin.RequestBody)

  expect(administratorLoginResponse.status).toEqual(200)

  if (!administratorLoginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const administratorUser = administratorLoginResponse.data.user
  const authorizationHeaderAdministrator = {
    Authorization: `Bearer ${administratorUser.accessToken}`,
  }

  //Get Logged in administrator user details
  const getMeAdministratorRes = await axios.get(`/me`, {
    headers: authorizationHeaderAdministrator,
  })

  if (getMeAdministratorRes.status !== 200) {
    throw new Error(
      `getMeAdministratorRes returns error status ${
        getMeAdministratorRes.status
      } with ${JSON.stringify(getMeAdministratorRes.data)}`,
    )
  }
  expect(getMeAdministratorRes.data).toEqual<typeof getMeAdministratorRes.data>(
    {
      user: {
        id: getDistrictAdminsRes.data.administrators?.[0]?.userId,
        role: userRoles.administrator,
        email: getDistrictAdminsRes.data.administrators?.[0]?.email,
      },
      administrator: {
        id: getDistrictAdminsRes.data.administrators?.[0]?.administratorId,
        userId: getDistrictAdminsRes.data.administrators?.[0]?.userId,
        firstName: getDistrictAdminsRes.data.administrators?.[0]?.firstName,
        lastName: getDistrictAdminsRes.data.administrators?.[0]?.lastName,
        administratorLMSId:
          getDistrictAdminsRes.data.administrators?.[0]?.administratorLMSId,
        districtId,
      },
    },
  )
})

test('Me APIs should work correctly when user role is Student', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const DUMMY_USER_DATA = {
    email: 'litUserD@email.com',
    password: await hashingPassword('litUserD@123'),
    role: 'internal_operator',
  }

  /* Create User */
  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save(DUMMY_USER_DATA)

  /* Login */
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: DUMMY_USER_DATA.email,
      password: 'litUserD@123',
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
    { name: 'miami', lmsId: 'none' },
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

  /* Create organization with given payload */
  const createOrganizationRes = await axios.post(
    `/organization`,
    {
      name: 'ORGANIZATION',
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

  const userData = await userRepo.findOneBy({
    login_id: VALID_STUDENTS.students[0].loginId,
  })

  //Login with student
  const studentLoginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: VALID_STUDENTS.students[0].loginId,
      password: VALID_STUDENTS.students[0].password,
    } as Paths.PostLogin.RequestBody,
  )

  expect(studentLoginResponse.status).toEqual(200)

  if (!studentLoginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const studentUser = studentLoginResponse.data.user
  const authorizationHeaderStudent = {
    Authorization: `Bearer ${studentUser.accessToken}`,
  }

  //Get Logged in student user details
  const getMeStudentRes = await axios.get(`/me`, {
    headers: authorizationHeaderStudent,
  })

  if (getMeStudentRes.status !== 200) {
    throw new Error(
      `getMeStudentRes returns error status ${
        getMeStudentRes.status
      } with ${JSON.stringify(getMeStudentRes.data)}`,
    )
  }
  expect(getMeStudentRes.data).toEqual<typeof getMeStudentRes.data>({
    user: {
      id: getStudentRes.data.students?.[0]?.userId,
      loginId: getStudentRes.data.students?.[0]?.loginId,
      role: userRoles.student,
    },
    student: {
      id: getStudentRes.data.students?.[0]?.id,
      userId: getStudentRes.data.students?.[0]?.userId,
      nickName: getStudentRes.data.students?.[0]?.nickName,
      studentLMSId: getStudentRes.data.students?.[0]?.studentLMSId,
      districtId,
      organizationIds: [organizationId],
      studentGroupIds: [studentGroupId],
    },
  })
})

test('Me APIs should work correctly when user role is Teacher', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const DUMMY_USER_DATA = {
    email: 'litUserC@email.com',
    password: await hashingPassword('litUserC@123'),
    role: 'internal_operator',
  }

  /* Create User */
  const userRepo = await appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save(DUMMY_USER_DATA)

  /* Login */
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: DUMMY_USER_DATA.email,
      password: 'litUserC@123',
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
    { name: 'chicago', lmsId: 'none' },
    {
      headers: authorizationHeader,
    },
  )

  expect(createDistrictRes.status).toEqual(200)

  /* Get records for created districts */
  const getDistricts = await axios.get('/districts', {
    headers: authorizationHeader,
  })

  if (!getDistricts.data.districts) {
    throw new Error('failed to get districts data')
  }
  expect(getDistricts.status).toEqual(200)

  const districtId = getDistricts.data.districts[0].id

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
  const getTeacherRes = await axios.get(
    `/organization/${organizationId}/teachers`,
    { headers: authorizationHeader },
  )

  expect(getTeacherRes.status).toEqual(200)

  const userData = await userRepo.findOneBy({
    email: VALID_TEACHERS.teachers[0].email,
  })

  //Login with teacher
  const teacherLoginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: VALID_TEACHERS.teachers[0].email,
      password: VALID_TEACHERS.teachers[0].password,
    } as Paths.PostLogin.RequestBody,
  )

  expect(teacherLoginResponse.status).toEqual(200)

  if (!teacherLoginResponse.data.user) {
    throw new Error('failed to get user from /login')
  }

  const teacherUser = teacherLoginResponse.data.user
  const authorizationHeaderTeacher = {
    Authorization: `Bearer ${teacherUser?.accessToken}`,
  }

  //Get Logged in teacher user details
  const getMeTeacherRes = await axios.get(`/me`, {
    headers: authorizationHeaderTeacher,
  })

  expect(getMeTeacherRes.status).toEqual(200)
  expect(getMeTeacherRes.data).toEqual({
    user: {
      id: getTeacherRes.data.teachers?.[0]?.userId,
      role: userRoles.teacher,
      email: getTeacherRes.data.teachers?.[0]?.email,
    },
    teacher: {
      id: getTeacherRes.data.teachers?.[0]?.id,
      userId: getTeacherRes.data.teachers?.[0]?.userId,
      firstName: getTeacherRes.data.teachers?.[0]?.firstName,
      lastName: getTeacherRes.data.teachers?.[0]?.lastName,
      teacherLMSId: getTeacherRes.data.teachers?.[0]?.teacherLMSId,
      districtId,
      organizationIds: [organizationId],
    },
  })
})
