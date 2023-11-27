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
import {
  UserLessonStatusTypeormEntity,
  UserLessonStatusTypeormEnum,
} from '../../../../src/adapter/typeorm/entity/UserLessonStatus'
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

test('student-group/{studentGroupId}/unaccessible-lession API', async () => {
  if (!appDataSource) {
    throw new Error('failed to connect database.')
  }

  const userRepo = appDataSource.getRepository(UserTypeormEntity)

  await userRepo.save({
    login_id: 'bhadresh',
    password: await hashingPassword('bhadresh'),
    role: 'internal_operator',
  })

  // Login
  const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'bhadresh',
      password: 'bhadresh',
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

  const lessonIds = lessonResult.id

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

  /* Get Student Group */
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

  /* Get records for created students */
  const getStudentRes = await axios.get(
    `/student-group/${studentGroupId}/students`,
    { headers: authorizationHeader },
  )

  expect(getStudentRes.status).toEqual(200)
  expect(getStudentRes.data.students.length).toEqual(
    VALID_STUDENTS.students.length,
  )

  const studentId = getStudentRes.data.students?.[0]?.id

  //Create user lesson
  const userLessonRepo = appDataSource.getRepository(
    UserLessonStatusTypeormEntity,
  )

  await userLessonRepo
    .createQueryBuilder()
    .insert()
    .into(UserLessonStatusTypeormEntity)
    .values({
      user_id: getStudentRes.data.students?.[0]?.userId,
      lesson_id: 'lesson-codeillusion-basic-principal-gem-1',
      status: UserLessonStatusTypeormEnum.cleared,
      used_hint_count: 1,
      correct_answered_quiz_count: 1,
      achieved_star_count: 1,
      step_id_skipping_detected: false,
      started_at: new Date(),
      finished_at: new Date(),
    })
    .execute()

  /// get lesson statuses for student group
  const getStudentGroupLessonStatusesRes =
    await axios.get<Paths.GetStudentGroupLessonStatuses.Responses.$200>(
      `/student-group/${studentGroupId}/lesson-statuses`,
      {
        headers: authorizationHeader,
      },
    )

  expect(getStudentGroupLessonStatusesRes.status).toEqual(200)
})
