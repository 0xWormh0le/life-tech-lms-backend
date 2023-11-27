import { UserTypeormEntity } from '../../../../src/adapter/typeorm/entity/User'
import { request } from '../../api/codex-api-request'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { hashingPassword } from '../../../../src/adapter/repositories/shared/PassWordHashing'
import { StudentGroupPackageAssignmentTypeormEntity } from '../../../../src/adapter/typeorm/entity/StudentGroupPackageAssignment'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('StudentGroupPackageAssignmentScenario', async () => {
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
  const loginResponse = await request({
    url: '/login',
    method: 'post',
    data: {
      loginId: 'bhadresh',
      password: 'bhadresh',
    },
  })

  if (loginResponse.hasError || !loginResponse.value.user) {
    throw new Error('failed to get user from /login')
  }

  const { user } = loginResponse.value
  const authorizationHeader = {
    Authorization: `Bearer ${user.accessToken}`,
  }

  const getStudentGroupPackageAssignmentResponse1 = await request({
    url: '/student-group-package-assignments',
    method: 'get',
    queryParams: {
      studentGroupId: 'hoge',
    },
    headers: authorizationHeader,
  })

  if (getStudentGroupPackageAssignmentResponse1.hasError) {
    throw new Error(
      `failed to GET /student-group-package-assignments ${JSON.stringify(
        getStudentGroupPackageAssignmentResponse1.error,
      )}`,
    )
  }
  expect(
    getStudentGroupPackageAssignmentResponse1.value
      .studentGroupPackageAssignments,
  ).toEqual<
    typeof getStudentGroupPackageAssignmentResponse1.value.studentGroupPackageAssignments
  >([])

  const studentGroupPackageAssignmentRepo = appDataSource.getRepository(
    StudentGroupPackageAssignmentTypeormEntity,
  )

  await studentGroupPackageAssignmentRepo.save([
    {
      package_category_id: 'cse',
      package_id: 'package-1',
      student_group_id: 'student-group-id-1',
    },
    {
      package_category_id: 'codeillusion',
      package_id: 'package-2',
      student_group_id: 'student-group-id-1',
    },
    {
      package_category_id: 'cse',
      package_id: 'package-1',
      student_group_id: 'student-group-id-2',
    },
  ])

  const getStudentGroupPackageAssignmentResponse2 = await request({
    url: '/student-group-package-assignments',
    method: 'get',
    queryParams: {
      studentGroupId: 'student-group-id-1',
    },
    headers: authorizationHeader,
  })

  if (getStudentGroupPackageAssignmentResponse2.hasError) {
    throw new Error(
      `failed to GET /student-group-package-assignments ${JSON.stringify(
        getStudentGroupPackageAssignmentResponse2.error,
      )}`,
    )
  }
  expect(
    getStudentGroupPackageAssignmentResponse2.value
      .studentGroupPackageAssignments,
  ).toEqual<
    typeof getStudentGroupPackageAssignmentResponse2.value.studentGroupPackageAssignments
  >([
    {
      packageCategoryId: 'cse',
      packageId: 'package-1',
      studentGroupId: 'student-group-id-1',
    },
    {
      packageCategoryId: 'codeillusion',
      packageId: 'package-2',
      studentGroupId: 'student-group-id-1',
    },
  ])
})
