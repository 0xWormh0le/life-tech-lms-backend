import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import axios from 'axios'
import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import {
  CourseTypeormEnum,
  LessonEnvironmentTypeormEnum,
  LessonLevelTypeormEnum,
  LessonTypeormEntity,
} from '../../../../src/adapter/typeorm/entity/Lesson'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'

const VALID_STUDENTS = {
  students: [
    {
      nickName: 'student',
      loginId: 'student',
      password: 'student@123',
      studentLMSId: 'student_lms_id_1',
    },
  ],
}
const VALID_LESSON = {
  id: 'lesson-id-1',
  url: 'https://player.lit.com/lesson/lesson-id-1',
  project_name: 'pr1',
  scenario_path: 'sc1',
  name: 'The Mouse Magic',
  course: CourseTypeormEnum.basic,
  lesson_environment: LessonEnvironmentTypeormEnum.litLessonPlayer,
  description: 'description',
  lesson_duration: '60',
  thumbnail_image_url: 'https://lit.com/thumbnail-image-2.png',
  max_star_count: 1,
  quiz_count: 2,
  hint_count: 2,
  level: LessonLevelTypeormEnum.basic,
}

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test.only('UserCodeillusion APIs should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const DUMMY_USER_DATA = {
    email: 'litUserD@email.com',
    password: await hashingPassword('litUserD@123'),
    role: 'internal_operator',
  }

  /* Create User */
  const userRepo = appDataSource.getRepository(UserTypeormEntity)

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

  //Create Lesson
  const lessonRepo = appDataSource.getRepository(LessonTypeormEntity)

  await lessonRepo
    .createQueryBuilder()
    .insert()
    .into(LessonTypeormEntity)
    .values(VALID_LESSON)
    .execute()

  const lessonResult = await lessonRepo.findOne({
    where: { name: 'The Mouse Magic' },
  })

  if (!lessonResult) {
    throw new Error('failed to get lesson data')
  }

  // const lessonIds = lessonResult.id
  const lessonId = 'lesson-codeillusion-basic-principal-gem-3'
  const lessonId2 = 'lesson-codeillusion-basic-principal-gem-2'

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

  /* Create Student Group1 */
  const createStudentGroupResponse =
    await axios.post<Paths.PostStudentGroup.Responses.$200>(
      `/organization/${organizationId}/student-group`,
      {
        name: 'AL Group',
        packageId: 'codeillusion-package-basic-full-premium-heroic',
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
        packageId: 'codeillusion-package-basic-full-premium-heroic',
        grade: 'Grade2',
        studentGroupLmsId: '444',
      } as Paths.PostStudentGroup.RequestBody,
      {
        headers: authorizationHeader,
      },
    )

  expect(createStudentGroupResponse1.status).toEqual(200)
  expect(createStudentGroupResponse1.statusText).toEqual('OK')

  /* Get Student Group1 */
  const getStudentGroupResponse =
    await axios.get<Paths.GetStudentGroups.Responses.$200>(
      `/organization/${organizationId}/student-groups`,
      { headers: authorizationHeader },
    )

  if (!getStudentGroupResponse.data.studentgroups) {
    throw new Error('failed to get student group data from db,')
  }
  expect(getStudentGroupResponse.status).toEqual(200)

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

  /* Get records for created students*/
  const getStudentRes = await axios.get(
    `/student-group/${studentGroupId1}/students`,
    { headers: authorizationHeader },
  )

  expect(getStudentRes.status).toEqual(200)

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

  //Restrict lesson access for student group.
  const createUnaccessibleLessonRes =
    await axios.post<Paths.PostStudentGroupUnaccessibleLesson.Responses.$200>(
      `/student-group/${studentGroupId1}/unaccessible-lesson?lessonIds=${lessonId}`,
      { packageId: 'codeillusion-package-basic-full-premium-heroic' },
      {
        headers: authorizationHeader,
      },
    )

  expect(createUnaccessibleLessonRes.status).toEqual(200)

  //Restrict lesson access for student group2.
  const createUnaccessibleLessonRes2 =
    await axios.post<Paths.PostStudentGroupUnaccessibleLesson.Responses.$200>(
      `/student-group/${studentGroupId2}/unaccessible-lesson?lessonIds=${lessonId2}`,
      { packageId: 'codeillusion-package-basic-full-premium-heroic' },
      {
        headers: authorizationHeader,
      },
    )

  expect(createUnaccessibleLessonRes2.status).toEqual(200)

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

  const userId = studentLoginResponse.data.user.id

  //userCodeillusionPackages API
  const userCodeillusionPackagesRes =
    await axios.get<Paths.GetUsersUserIdCodeIllusionPackages.Responses.$200>(
      `/users/${userId}/codeIllusionPackage`,
      {
        headers: authorizationHeaderStudent,
      },
    )

  expect(userCodeillusionPackagesRes.status).toEqual(200)
})
