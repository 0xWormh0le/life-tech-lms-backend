import axios, { AxiosResponse } from 'axios'

import { Paths } from '../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Maintenace Users API should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  // Get Users (which should be empty)
  const getUsersResponse1 =
    await axios.get<Paths.MaintenanceGetUsers.Responses.$200>(
      `/maintenance/users`,
    )

  expect(getUsersResponse1.status).toEqual(200)
  expect(
    getUsersResponse1.data,
  ).toEqual<Paths.MaintenanceGetUsers.Responses.$200>({
    users: [], // empty first
  })

  // Create Users
  const createUsersResponse1 = await axios.post<
    Paths.MaintenancePostUsers.Responses.$200,
    AxiosResponse<Paths.MaintenancePostUsers.Responses.$200>,
    Paths.MaintenancePostUsers.RequestBody
  >(`/maintenance/users`, {
    users: [
      {
        role: 'student',
        loginId: 'student-login-id-1',
        email: 'student-email-id-1',
        password: 'student-password-1',
        nickname: 'student-nickname-1',
        lmsId: 'lms-id-1',
      },
      {
        role: 'teacher',
        loginId: 'teacher-login-id-2',
        email: 'teacher-email-id-2',
        password: 'teacher-password-2',
        firstName: 'teacher-first-name-2',
        lastName: 'teacher-last-name-2',
      },
    ],
  })

  if (createUsersResponse1.status !== 200) {
    const error = `createUsersResponse1 returns status ${
      createUsersResponse1.status
    } with ${JSON.stringify(createUsersResponse1.data)}`

    throw new Error(error)
  }
  expect(
    createUsersResponse1.data.users.map((u) => {
      const ret: Partial<typeof u> = {
        ...u,
      }

      delete ret.id

      return ret
    }),
  ).toEqual([
    {
      role: 'student',
      loginId: 'student-login-id-1',
      email: 'student-email-id-1',
      nickname: 'student-nickname-1',
      lmsId: 'lms-id-1',
      password: 'student-password-1',
    },
    {
      role: 'teacher',
      loginId: 'teacher-login-id-2',
      email: 'teacher-email-id-2',
      firstName: 'teacher-first-name-2',
      lastName: 'teacher-last-name-2',
      password: 'teacher-password-2',
    },
  ])

  // Try login
  const loginResponse1 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'student-login-id-1',
      email: 'student-email-id-1',
      password: 'student-password-1',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse1.status).toEqual(200)

  const loginResponse2 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'teacher-login-id-2',
      email: 'teacher-email-id-2',
      password: 'teacher-password-2',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse2.status).toEqual(200)

  // Create Users again
  const createUsersResponse2 = await axios.post<
    Paths.MaintenancePostUsers.Responses.$200,
    AxiosResponse<Paths.MaintenancePostUsers.Responses.$200>,
    Paths.MaintenancePostUsers.RequestBody
  >(`/maintenance/users`, {
    users: [
      {
        role: 'administrator',
        loginId: 'administrator-login-id-3',
        email: 'administrator-email-id-3',
        password: 'administrator-password-3',
        firstName: 'administrator-first-name-3',
        lastName: 'administrator-last-name-3',
      },
      {
        role: 'internalOperator',
        loginId: 'internalOperator-login-id-4',
        email: 'internalOperator-email-id-4',
        password: 'internalOperator-password-4',
      },
    ],
  })

  if (createUsersResponse2.status !== 200) {
    const error = `createUsersResponse2 returns status ${
      createUsersResponse2.status
    } with ${JSON.stringify(createUsersResponse2.data)}`

    throw new Error(error)
  }
  expect(
    createUsersResponse2.data.users.map((u) => {
      const ret: Partial<typeof u> = {
        ...u,
      }

      delete ret.id

      return ret
    }),
  ).toEqual([
    {
      role: 'administrator',
      loginId: 'administrator-login-id-3',
      email: 'administrator-email-id-3',
      firstName: 'administrator-first-name-3',
      lastName: 'administrator-last-name-3',
      password: 'administrator-password-3',
    },
    {
      role: 'internalOperator',
      loginId: 'internalOperator-login-id-4',
      email: 'internalOperator-email-id-4',
      password: 'internalOperator-password-4',
    },
  ])

  // Try login again
  const loginResponse3 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'administrator-login-id-3',
      email: 'administrator-email-id-3',
      password: 'administrator-password-3',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse3.status).toEqual(200)

  const loginResponse4 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'internalOperator-login-id-4',
      email: 'internalOperator-email-id-4',
      password: 'internalOperator-password-4',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse4.status).toEqual(200)

  // Get Users again
  const getUsersResponse2 =
    await axios.get<Paths.MaintenanceGetUsers.Responses.$200>(
      `/maintenance/users`,
    )

  expect(getUsersResponse2.status).toEqual(200)
  expect(getUsersResponse2.data.users.length).toEqual(4)
  expect(getUsersResponse2.data.users[0].role).toEqual('student')
  expect(getUsersResponse2.data.users[1].role).toEqual('teacher')
  expect(getUsersResponse2.data.users[2].role).toEqual('administrator')
  expect(getUsersResponse2.data.users[3].role).toEqual('internalOperator')

  // Update Users
  const udpateUsersResponse = await axios.put<
    Paths.MaintenancePutUsers.Responses.$200,
    AxiosResponse<Paths.MaintenancePutUsers.Responses.$200>,
    Paths.MaintenancePutUsers.RequestBody
  >(`/maintenance/users`, {
    users: [
      {
        id: getUsersResponse2.data.users[0].id,
        role: 'internalOperator', // Change role
        loginId: 'student-login-id-1',
        email: 'student-email-id-1',
        password: 'student-password-1-updated',
      },
      {
        id: getUsersResponse2.data.users[2].id,
        role: 'administrator',
        loginId: 'administrator-login-id-3-changed', // Change password
        email: 'administrator-email-id-3-changed', // Change password
        password: 'administrator-password-3',
        firstName: 'administrator-first-name-3',
        lastName: 'administrator-last-name-3',
      },
    ],
  })

  if (udpateUsersResponse.status !== 200) {
    const error = `udpateUsersResponse returns status ${
      udpateUsersResponse.status
    } with ${JSON.stringify(udpateUsersResponse.data)}`

    throw new Error(error)
  }
  expect(
    udpateUsersResponse.data.users.map((u) => {
      const ret: Partial<typeof u> = {
        ...u,
      }

      delete ret.id

      return ret
    }),
  ).toEqual([
    {
      role: 'internalOperator', // Change role
      loginId: 'student-login-id-1',
      email: 'student-email-id-1',
      password: 'student-password-1-updated',
    },
    {
      role: 'administrator',
      loginId: 'administrator-login-id-3-changed', // Change password
      email: 'administrator-email-id-3-changed', // Change password
      password: 'administrator-password-3',
      firstName: 'administrator-first-name-3',
      lastName: 'administrator-last-name-3',
    },
  ])

  // Try login again
  const loginResponse5 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'student-login-id-1',
      email: 'student-email-id-1',
      password: 'student-password-1', // previous password
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse5.status).toEqual(401)

  const loginResponse6 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'student-login-id-1',
      email: 'student-email-id-1',
      password: 'student-password-1-updated', // new password
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse6.status).toEqual(200)

  const loginResponse7 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'administrator-login-id-3-changed', // new login ids
      email: 'administrator-email-id-3-changed', // new login ids
      password: 'administrator-password-3',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse7.status).toEqual(200)

  // Get Users again
  const getUsersResponse3 =
    await axios.get<Paths.MaintenanceGetUsers.Responses.$200>(
      `/maintenance/users`,
    )

  expect(getUsersResponse3.status).toEqual(200)
  // The order of users could be unstable, check one by one
  expect(
    getUsersResponse3.data.users.find(
      (u) => u.id === getUsersResponse2.data.users[0].id,
    ),
  ).toEqual({
    id: getUsersResponse2.data.users[0].id,
    role: 'internalOperator',
    loginId: 'student-login-id-1',
    email: 'student-email-id-1',
    password: '',
  })
  expect(
    getUsersResponse3.data.users.find(
      (u) => u.id === getUsersResponse2.data.users[1].id,
    ),
  ).toEqual({
    ...getUsersResponse2.data.users[1],
  })
  expect(
    getUsersResponse3.data.users.find(
      (u) => u.id === getUsersResponse2.data.users[2].id,
    ),
  ).toEqual({
    ...getUsersResponse2.data.users[2],
    loginId: 'administrator-login-id-3-changed',
    email: 'administrator-email-id-3-changed',
  })
  expect(
    getUsersResponse3.data.users.find(
      (u) => u.id === getUsersResponse2.data.users[3].id,
    ),
  ).toEqual({
    ...getUsersResponse2.data.users[3],
  })

  // Try to create duplicated Users
  const createUsersResponseDuplicated = await axios.post<
    Paths.MaintenancePostUsers.Responses.$200,
    AxiosResponse<Paths.MaintenancePostUsers.Responses.$200>,
    Paths.MaintenancePostUsers.RequestBody
  >(`/maintenance/users`, {
    users: [
      {
        role: 'administrator',
        loginId: 'teacher-login-id-2', // already exists
        email: 'teacher-email-id-2', // already exists
        password: 'administrator-password-dup',
        firstName: 'administrator-first-name-3-dup',
        lastName: 'administrator-last-name-3-dup',
      },
      {
        role: 'internalOperator',
        loginId: 'internalOperator-login-id-5',
        email: 'internalOperator-email-id-5',
        password: 'internalOperator-password-5',
      },
    ],
  })

  expect(createUsersResponseDuplicated.status).toEqual(409)

  // Check login
  const loginResponse8 = await axios.post<Paths.PostLogin.Responses.$200>(
    '/login',
    {
      loginId: 'internalOperator-login-id-5', // this also failed to be created
      email: 'internalOperator-email-id-5', // this also failed to be created
      password: 'internalOperator-password-5',
    } as Paths.PostLogin.RequestBody,
  )

  expect(loginResponse8.status).toEqual(401)
})
