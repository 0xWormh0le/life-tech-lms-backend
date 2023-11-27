import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'
import { request } from '../../api/codex-api-request'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Maintenace Assignment of Users to Districts API should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  // Create Users to assign to each District
  const createUsersResponse1 = await request({
    url: '/maintenance/users',
    method: 'post',
    data: {
      users: [
        {
          role: 'teacher',
          loginId: 'teacher-login-id-3',
          email: 'teacher-email-id-3',
          password: 'teacher-password-3',
          firstName: 'teacher-first-name-3',
          lastName: 'teacher-last-name-3',
        },
        {
          role: 'teacher',
          loginId: 'teacher-login-id-4',
          email: 'teacher-email-id-4',
          password: 'teacher-password-4',
          firstName: 'teacher-first-name-4',
          lastName: 'teacher-last-name-4',
        },
        {
          role: 'teacher',
          loginId: 'teacher-login-id-5',
          email: 'teacher-email-id-5',
          password: 'teacher-password-5',
          firstName: 'teacher-first-name-5',
          lastName: 'teacher-last-name-5',
        },
      ],
    },
  })

  if (createUsersResponse1.hasError) {
    throw new Error(
      `POST /maintenance/users failed ${JSON.stringify(
        createUsersResponse1.error,
      )}`,
    )
  }

  const getUsersResponse = await request({
    url: '/maintenance/users',
    method: 'get',
  })

  if (getUsersResponse.hasError) {
    throw new Error(
      `POST /maintenance/users failed ${JSON.stringify(
        getUsersResponse.error,
      )}`,
    )
  }
  expect(getUsersResponse.value.users[0].role).toEqual('teacher')
  expect(getUsersResponse.value.users[1].role).toEqual('teacher')
  expect(getUsersResponse.value.users[2].role).toEqual('teacher')

  // Create Districts
  const createDistrictsResponse1 = await request({
    url: '/maintenance/districts',
    method: 'put',
    data: {
      districts: [
        {
          name: 'District-1',
          stateId: 'NA',
        },
        {
          name: 'District-2',
          stateId: 'NA',
        },
      ],
    },
  })

  if (!createDistrictsResponse1.value) {
    throw new Error(
      `PUT /maintenance/districts failed ${JSON.stringify(
        createDistrictsResponse1.error,
      )}`,
    )
  }

  const getDistrictsResponse1 = await request({
    url: '/maintenance/districts',
    method: 'get',
  })

  if (!getDistrictsResponse1.value) {
    throw new Error(
      `GET /maintenance/districts failed ${JSON.stringify(
        getDistrictsResponse1.error,
      )}`,
    )
  }

  // Create Organizations
  const createOrganizationsResponse1 = await request({
    url: '/maintenance/organizations',
    method: 'put',
    data: {
      organizations: [
        {
          districtId: getDistrictsResponse1.value.districts[0].id,
          name: 'Organization-1',
          stateId: 'IN',
        },
        {
          districtId: getDistrictsResponse1.value.districts[0].id,
          name: 'Organization-2',
          stateId: 'AL',
        },
      ],
    },
  })

  if (!createOrganizationsResponse1.value) {
    throw new Error(
      `PUT /maintenance/organizations failed ${JSON.stringify(
        createOrganizationsResponse1.error,
      )}`,
    )
  }

  const getOrganizationsResponse1 = await request({
    url: '/maintenance/organizations',
    method: 'get',
  })

  if (!getOrganizationsResponse1.value) {
    throw new Error(
      `GET /maintenance/organizations failed ${JSON.stringify(
        getOrganizationsResponse1.error,
      )}`,
    )
  }

  // Assign Teachers To Organization
  const postTeacherOrganizationsResponse1 = await request({
    url: '/maintenance/teacherOrganizations',
    method: 'post',
    data: {
      teacherOrganizations: [
        {
          userId: createUsersResponse1.value.users[0].id,
          organizationId: getOrganizationsResponse1.value.organizations[0].id,
        },
        {
          userId: createUsersResponse1.value.users[0].id,
          organizationId: getOrganizationsResponse1.value.organizations[1].id,
        },
        {
          userId: createUsersResponse1.value.users[1].id,
          organizationId: getOrganizationsResponse1.value.organizations[1].id,
        },
      ],
    },
  })

  if (!postTeacherOrganizationsResponse1.value) {
    throw new Error(
      `POST /maintenance/teacherOrganizations failed ${JSON.stringify(
        postTeacherOrganizationsResponse1.error,
      )}`,
    )
  }

  // Check Teachers assignment
  const getTeacherOrganizationsResponse1 = await request({
    url: '/maintenance/teacherOrganizations',
    method: 'get',
  })

  if (!getTeacherOrganizationsResponse1.value) {
    throw new Error(
      `GET /maintenance/teacherOrganizations failed ${JSON.stringify(
        getTeacherOrganizationsResponse1.error,
      )}`,
    )
  }
  expect(getTeacherOrganizationsResponse1.value.teacherOrganizations).toEqual([
    {
      userId: createUsersResponse1.value.users[0].id,
      organizationId: getOrganizationsResponse1.value.organizations[0].id,
    },
    {
      userId: createUsersResponse1.value.users[0].id,
      organizationId: getOrganizationsResponse1.value.organizations[1].id,
    },
    {
      userId: createUsersResponse1.value.users[1].id,
      organizationId: getOrganizationsResponse1.value.organizations[1].id,
    },
  ])

  // Delete Teachers from Organization
  const deleteTeacherOrganizationsResponse = await request({
    url: '/maintenance/teacherOrganizations',
    method: 'delete',
    data: {
      teacherOrganizations: [
        {
          userId: createUsersResponse1.value.users[0].id,
          organizationId: getOrganizationsResponse1.value.organizations[0].id,
        },
        {
          userId: createUsersResponse1.value.users[1].id,
          organizationId: getOrganizationsResponse1.value.organizations[1].id,
        },
      ],
    },
  })

  if (!deleteTeacherOrganizationsResponse.value) {
    throw new Error(
      `DELETE /maintenance/teacherOrganizations failed ${JSON.stringify(
        deleteTeacherOrganizationsResponse.error,
      )}`,
    )
  }

  // Check Teachers assignment
  const getTeacherOrganizationsResponse2 = await request({
    url: '/maintenance/teacherOrganizations',
    method: 'get',
  })

  if (!getTeacherOrganizationsResponse2.value) {
    throw new Error(
      `GET /maintenance/teacherOrganizations failed ${JSON.stringify(
        getTeacherOrganizationsResponse2.error,
      )}`,
    )
  }
  expect(getTeacherOrganizationsResponse2.value.teacherOrganizations).toEqual([
    {
      userId: createUsersResponse1.value.users[0].id,
      organizationId: getOrganizationsResponse1.value.organizations[1].id,
    },
  ])
})
