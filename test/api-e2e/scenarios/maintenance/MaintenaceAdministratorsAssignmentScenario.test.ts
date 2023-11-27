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
          role: 'administrator',
          loginId: 'administrator-login-id-5',
          email: 'administrator-email-id-5',
          password: 'administrator-password-5',
          firstName: 'administrator-first-name-5',
          lastName: 'administrator-last-name-5',
        },
        {
          role: 'administrator',
          loginId: 'administrator-login-id-6',
          email: 'administrator-email-id-6',
          password: 'administrator-password-6',
          firstName: 'administrator-first-name-6',
          lastName: 'administrator-last-name-6',
        },
        {
          role: 'administrator',
          loginId: 'administrator-login-id-7',
          email: 'administrator-email-id-7',
          password: 'administrator-password-7',
          firstName: 'administrator-first-name-7',
          lastName: 'administrator-last-name-7',
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
  expect(getUsersResponse.value.users[0].role).toEqual('administrator')
  expect(getUsersResponse.value.users[1].role).toEqual('administrator')
  expect(getUsersResponse.value.users[2].role).toEqual('administrator')

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

  // Assign Administrators To District
  const postAdministratorDistrictsResponse1 = await request({
    url: '/maintenance/administratorDistricts',
    method: 'post',
    data: {
      administratorDistricts: [
        {
          userId: createUsersResponse1.value.users[0].id,
          districtId: getDistrictsResponse1.value.districts[0].id,
        },
        {
          userId: createUsersResponse1.value.users[1].id,
          districtId: getDistrictsResponse1.value.districts[1].id,
        },
      ],
    },
  })

  if (!postAdministratorDistrictsResponse1.value) {
    throw new Error(
      `POST /maintenance/administratorDistricts failed ${JSON.stringify(
        postAdministratorDistrictsResponse1.error,
      )}`,
    )
  }

  // Check Administrators assignment
  const getAdministratorDistrictsResponse1 = await request({
    url: '/maintenance/administratorDistricts',
    method: 'get',
  })

  if (!getAdministratorDistrictsResponse1.value) {
    throw new Error(
      `GET /maintenance/administratorDistricts failed ${JSON.stringify(
        getAdministratorDistrictsResponse1.error,
      )}`,
    )
  }
  expect(
    getAdministratorDistrictsResponse1.value.administratorDistricts,
  ).toEqual([
    {
      userId: createUsersResponse1.value.users[0].id,
      districtId: getDistrictsResponse1.value.districts[0].id,
    },
    {
      userId: createUsersResponse1.value.users[1].id,
      districtId: getDistrictsResponse1.value.districts[1].id,
    },
  ])

  // Delete Administrators from District
  const deleteAdministratorDistrictsResponse = await request({
    url: '/maintenance/administratorDistricts',
    method: 'delete',
    data: {
      administratorDistricts: [
        {
          userId: createUsersResponse1.value.users[0].id,
          districtId: getDistrictsResponse1.value.districts[0].id,
        },
      ],
    },
  })

  if (!deleteAdministratorDistrictsResponse.value) {
    throw new Error(
      `DELETE /maintenance/administratorDistricts failed ${JSON.stringify(
        deleteAdministratorDistrictsResponse.error,
      )}`,
    )
  }

  // Check Administrators assignment
  const getAdministratorDistrictsResponse2 = await request({
    url: '/maintenance/administratorDistricts',
    method: 'get',
  })

  if (!getAdministratorDistrictsResponse2.value) {
    throw new Error(
      `GET /maintenance/administratorDistricts failed ${JSON.stringify(
        getAdministratorDistrictsResponse2.error,
      )}`,
    )
  }
  expect(
    getAdministratorDistrictsResponse2.value.administratorDistricts,
  ).toEqual([
    {
      userId: createUsersResponse1.value.users[1].id,
      districtId: getDistrictsResponse1.value.districts[1].id,
    },
  ])
})
