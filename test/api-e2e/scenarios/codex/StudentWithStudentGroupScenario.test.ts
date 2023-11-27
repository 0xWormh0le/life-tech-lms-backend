import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { StudentGroupStudentTypeormEntity } from '../../../../src/adapter/typeorm/entity/StudentGroupStudent'
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

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Student Mapping to StudentGroup APIs should work correctly', async () => {
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

  /* Create another Student Group */
  const createStudentGroupResponse1 =
    await axios.post<Paths.PostStudentGroup.Responses.$200>(
      `/organization/${organizationId}/student-group`,
      {
        name: 'KP Group',
        packageId: '1',
        grade: 'Grade2',
        studentGroupLmsId: '444',
      } as Paths.PostStudentGroup.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(createStudentGroupResponse1.status).toEqual(200)
  expect(createStudentGroupResponse1.statusText).toEqual('OK')

  /* Get Student Group (which should be 2) */
  const getStudentGroupResponse =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  if (!getStudentGroupResponse.data.studentgroups) {
    throw new Error('failed to get student group data from db,')
  }

  expect(getStudentGroupResponse.status).toEqual(200)
  expect(getStudentGroupResponse.data.studentgroups?.length).toEqual(2) // get one data
  expect(getStudentGroupResponse.data.studentgroups[0].name).toEqual('AL Group')

  const studentGroupId1 = getStudentGroupResponse.data.studentgroups[0].id
  const studentGroupId2 = getStudentGroupResponse.data.studentgroups[1].id

  /* Create students */
  const createStudentsRes = await axios.post<Paths.PostStudents.Responses.$200>(
    `/student-group/${studentGroupId1}/students`,
    VALID_STUDENTS as Paths.PostStudents.RequestBody,
    {
      headers: authorizationHeader,
    },
  )

  expect(createStudentsRes.status).toEqual(200)

  /* Get records for created students */
  const getStudentRes = await axios.get(
    `/student-group/${studentGroupId1}/students`,
    { headers: authorizationHeader },
  )

  expect(getStudentRes.status).toEqual(200)
  expect(getStudentRes.data.students.length).toEqual(
    VALID_STUDENTS.students.length,
  )

  const studentId = getStudentRes.data.students?.[0]?.id

  /* Add Student to another student-group */
  const addStudentRes =
    await axios.post<Paths.PostStudentInStudentGroup.Responses.$200>(
      `/student-group/${studentGroupId2}/students/${studentId}`,
      VALID_STUDENTS as Paths.PostStudents.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(addStudentRes.status).toEqual(200)

  /* check student added to another group or not */
  const studentMappingRepo = appDataSource.getRepository(
    StudentGroupStudentTypeormEntity,
  )
  const getStudentResult = await studentMappingRepo
    .createQueryBuilder('student_groups_students')
    .where(
      'student_groups_students.student_id= :id AND student_groups_students.student_group_id= :gid',
      {
        id: studentId,
        gid: studentGroupId2,
      },
    )
    .getRawOne()

  if (!getStudentResult) {
    throw new Error('student not added in mapping table')
  }

  /* Remove student from student group */
  const deleteStudentRes =
    await axios.delete<Paths.DeleteStudentFromStudentGroup.Responses.$200>(
      `/student-group/${studentGroupId2}/students/${studentId}`,
      {
        headers: authorizationHeader,
      },
    )

  expect(deleteStudentRes.status).toEqual(200)

  /* check student remove or not */
  const getStudentResult1 = await studentMappingRepo
    .createQueryBuilder('student_groups_students')
    .where(
      'student_groups_students.student_id= :id AND student_groups_students.student_group_id= :gid',
      {
        id: studentId,
        gid: studentGroupId2,
      },
    )
    .getRawOne()

  if (getStudentResult1) {
    throw new Error('student is not remove from student-group')
  }
})
