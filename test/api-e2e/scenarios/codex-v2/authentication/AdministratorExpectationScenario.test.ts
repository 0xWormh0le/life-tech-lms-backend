import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { v4 as uuid } from 'uuid'
import { RdbDistrictRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbDistrictRepository'
import { Administrator } from '../../../../../src/domain/entities/codex-v2/Administrator'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import {
  CreateAdministratorInput,
  CreateAdministratorPayload,
  CreateHumanUserInput,
  CreateHumanUserPayload,
  CreateUserInput,
  CreateUserPayload,
  UpdateAdministratorInput,
  UpdateAdministratorPayload,
  UpdateHumanUserInput,
  UpdateHumanUserPayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import dayjs from 'dayjs'
import { Paths } from '../../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / Administrator / ConsumerExpectationScenario', () => {
  let testAdministrator1: Administrator
  let testAdministrator2: Administrator
  type User = {
    id: string
    role: string
  }

  type HumanUser = {
    userId: string
    email: string | null
    loginId: string | null
    password: string | null
  }
  let testUser1: User
  let testUser2: User
  let testHumanUser1: HumanUser
  let testHumanUser2: HumanUser
  let testDistrict: District

  test('HealthCheck', async () => {
    const queryData = {
      query: `
      {
        hc
      }
      `,
      variables: {},
    }
    const res = await axios.post<{ data: object }>(`/v2/graphql`, queryData, {})

    expect(res.status).toEqual(200)
    expect(res.data.data).toEqual({ hc: 'ok' })
  })

  let operatorToken = ''

  describe('creating administrator operation for internalOperator', () => {
    test('Login', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }
      const { token } = await createUserAndGetToken(
        'testInternalOperator1',
        'internal_operator',
        appDataSource,
      )
      operatorToken = token
    })

    const nowStr = '2000-01-01T00:00:00Z'

    test(`create user`, async () => {
      const createUser = async (input: CreateUserInput) => {
        const mutationData = {
          query: `
            mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                ... on CreateUserPayload {
                  clientMutationId
                  user {
                    id
                    role
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createUser', CreateUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })
        const user: User = {
          ...res.data.data.createUser.user,
        }
        return user
      }
      testUser1 = await createUser({ role: 'administrator', isDemo: false })
      testUser2 = await createUser({ role: 'administrator', isDemo: false })
    })

    test(`create humanUser`, async () => {
      const createHumanUser = async (input: CreateHumanUserInput) => {
        const mutationData = {
          query: `
            mutation CreateHumanUser($input: CreateHumanUserInput!) {
              createHumanUser(input: $input) {
                __typename
                ... on CreateHumanUserPayload {
                  clientMutationId
                  humanUser {
                    userId
                    email
                    loginId
                    password
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createHumanUser', CreateHumanUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })
        const resValue = res.data.data.createHumanUser.humanUser
        const humanUser: HumanUser = {
          ...resValue,
          email: resValue.email ?? null,
          loginId: resValue.loginId ?? null,
          password: resValue.password ?? null,
        }
        return humanUser
      }
      testHumanUser1 = await createHumanUser({
        userId: testUser1.id,
        loginId: 'userLoginId1',
        password: 'password',
      })
      testHumanUser2 = await createHumanUser({
        userId: testUser2.id,
        email: 'test2@example.com',
        password: 'password',
      })
    })
    test('create administrators', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const districtRepository = new RdbDistrictRepository(appDataSource)

      const createDistrict = async () => {
        const id = uuid()

        const district: District = {
          id,
          name: 'test-name',
          stateId: 'test-state-id',
          lmsId: 'test-lms-id',
          externalLmsDistrictId: 'test-external-lms-district-id',
          enableRosterSync: false,
          createdAt: new Date(nowStr),
          createdUserId: 'test-created-user-id',
        }

        const res = await districtRepository.create(district)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        return district
      }

      const create = async (
        label: string,
        userId: string,
        districtId: string,
      ): Promise<Administrator> => {
        const input: CreateAdministratorInput = {
          userId,
          firstName: `testFirstname-${label}`,
          lastName: `testLastname-${label}`,
          externalLmsAdministratorId: `testExternalLmsAdminId-${label}`,
          isDeactivated: false,
          clientMutationId: 'testMutationId-1',
          districtId,
        }

        const mutationData = {
          query: `
            mutation CreateAdministrator($input: CreateAdministratorInput!) {
              createAdministrator(input: $input) {
                ... on CreateAdministratorPayload {
                  clientMutationId
                  administrator {
                    id
                    userId
                    role
                    districtId
                    firstName
                    lastName
                    externalLmsAdministratorId
                    isDeactivated
                    createdUserId
                    createdAt
                  }
                }
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createAdministrator', CreateAdministratorPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.data.data.createAdministrator.errorCode).toBeUndefined()
        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createAdministrator).toMatchObject({
          administrator: {
            ...fields,
            role: 'administrator',
          },
          clientMutationId,
        })

        const response = res.data.data.createAdministrator.administrator

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
        } as Administrator
      }

      testDistrict = await createDistrict()
      testAdministrator1 = await create('1', testUser1.id, testDistrict.id)
      testAdministrator2 = await create('2', testUser2.id, testDistrict.id)
    })
  })
  describe('operation on administrator1', () => {
    test('Login', async () => {
      const token = await loginByApi(testHumanUser1.loginId ?? '', 'password')
      expect(token).toBeDefined()
    })
  })

  describe('operation on administrator2', () => {
    test('Login', async () => {
      const token = await loginByApi(testHumanUser2.email ?? '', 'password')
      expect(token).toBeDefined()
    })
  })
  describe('updating administrator operation for internalOperator', () => {
    test('update administrator', async () => {
      const input: UpdateAdministratorInput = {
        id: testAdministrator1.id,
        userId: testUser1.id,
        firstName: 'testFirstname-updated',
        lastName: 'testLastname-updated',
        externalLmsAdministratorId: 'testExternalLmsAdminId-updated',
        clientMutationId: 'testMutationId-updated',
        isDeactivated: false,
        districtId: testDistrict.id,
      }

      const mutationData = {
        query: `
          mutation UpdateAdministrator($input: UpdateAdministratorInput!) {
            updateAdministrator(input: $input) {
              ... on UpdateAdministratorPayload {
                clientMutationId
                administrator {
                  id
                  userId
                  role
                  districtId
                  firstName
                  lastName
                  externalLmsAdministratorId
                  isDeactivated
                  createdUserId
                  createdAt
                }
              }
              ... on ErrorPermissionDenied {
                errorCode
                message
              }
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateAdministrator', UpdateAdministratorPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.data.data.updateAdministrator.errorCode).toBeUndefined()
      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateAdministrator).toMatchObject({
        administrator: fields,
        clientMutationId: clientMutationId,
      })
    })
  })
  describe('update humanUser and check login', () => {
    const updateHumanUser = async (input: UpdateHumanUserInput) => {
      const mutationData = {
        query: `
          mutation UpdateHumanUser($input: UpdateHumanUserInput!) {
            updateHumanUser(input: $input) {
              ... on UpdateHumanUserPayload {
                clientMutationId
                humanUser {
                  userId
                  email
                  loginId
                  password
                }
              }
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateHumanUser', UpdateHumanUserPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })
      const resValue = res.data.data.updateHumanUser.humanUser
      const humanUser: HumanUser = {
        ...resValue,
        email: resValue.email ?? null,
        loginId: resValue.loginId ?? null,
        password: resValue.password ?? null,
      }
      return humanUser
    }

    test(`update without password and check login by loginId`, async () => {
      await updateHumanUser({
        userId: testUser1.id,
        loginId: 'userLoginId1',
        password: null,
      })

      const token = await loginByApi(testHumanUser1.loginId ?? '', 'password')
      expect(token).toBeDefined()
    })

    test('update without password and check login by email', async () => {
      await updateHumanUser({
        userId: testUser2.id,
        email: 'test2@example.com',
        password: null,
      })

      const token = await loginByApi(testHumanUser2.email ?? '', 'password')
      expect(token).toBeDefined()
    })
    test(`update password and check login by loginId`, async () => {
      await updateHumanUser({
        userId: testUser1.id,
        loginId: 'userLoginId1',
        password: 'password-updated',
      })

      const token = await loginByApi(
        testHumanUser1.loginId ?? '',
        'password-updated',
      )
      expect(token).toBeDefined()
    })

    test('update password and check login by email', async () => {
      await updateHumanUser({
        userId: testUser2.id,
        email: 'test2@example.com',
        password: 'password-updated',
      })

      const token = await loginByApi(
        testHumanUser2.email ?? '',
        'password-updated',
      )
      expect(token).toBeDefined()
    })
  })

  describe('get administrator for internal operator', () => {
    test('get administrators', async () => {
      const queryData = {
        query: `
        {
          administrators {
            ... on Administrators {
              items {
                id
                userId
                role
                districtId
                firstName
                lastName
                externalLmsAdministratorId
                isDeactivated
                createdUserId
                createdAt
                humanUser {
                  userId
                  loginId
                  email
                  password
                }
              }
            }
          }
        }
        `,
        variables: {},
      }
      const res = await axios.post<
        GraphQLResponse<'administrators', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.administrators.items).toHaveLength(2)
      expect(res.data.data.administrators.items).toContainEqual({
        ...testAdministrator1,
        userId: testUser1.id,
        firstName: 'testFirstname-updated',
        lastName: 'testLastname-updated',
        externalLmsAdministratorId: 'testExternalLmsAdminId-updated',
        createdAt: testAdministrator1.createdAt.toISOString(),
        humanUser: {
          ...testHumanUser1,
          password: '******',
        },
      })
      expect(res.data.data.administrators.items).toContainEqual({
        ...testAdministrator2,
        createdAt: testAdministrator2.createdAt.toISOString(),
        humanUser: {
          ...testHumanUser2,
          password: '******',
        },
      })
    })
  })
  const loginByApi = async (loginId: string, password: string) => {
    const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
      '/login',
      {
        loginId: loginId,
        password: password,
      } as Paths.PostLogin.RequestBody,
    )

    expect(loginResponse.status).toEqual(200)

    if (!loginResponse.data.user) {
      throw new Error('failed to get user from /login')
    }

    const user = loginResponse.data.user
    return user.accessToken
  }
})
