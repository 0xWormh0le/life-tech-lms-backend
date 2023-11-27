import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { v4 as uuid } from 'uuid'
import { RdbDistrictRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbDistrictRepository'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'
import { Administrator } from '../../../../../src/domain/entities/codex-v2/Administrator'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import { User } from '../../../../../src/domain/entities/codex-v2/User'
import {
  CreateAdministratorPayload,
  CreateAdministratorInput,
  UpdateAdministratorPayload,
  UpdateAdministratorInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import dayjs from 'dayjs'
import { RdbHumanUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbHumanUserRepository'
import { HumanUser } from '../../../../../src/domain/entities/codex-v2/HumanUser'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / Administrator / ConsumerExpectationScenario', () => {
  let testAdministrator1: Administrator
  let testAdministrator2: Administrator
  let testUser1: User
  let testUser2: User
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

  describe('operation for internalOperator', () => {
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

    test('create administrators', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const districtRepository = new RdbDistrictRepository(appDataSource)
      const userRepository = new RdbUserRepository(appDataSource)
      const humanUserRepository = new RdbHumanUserRepository(appDataSource)

      const createUser = async () => {
        const user: User = {
          id: uuid(),
          role: 'administrator',
          isDemo: true,
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        }

        const humanUser: HumanUser = {
          userId: user.id,
          loginId: null,
          email: `${user.id}@mail.com`,
          hashedPassword: 'password',
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        }

        const userRes = await userRepository.create(user)
        const humanUserRes = await humanUserRepository.create(humanUser)

        if (userRes.hasError) {
          throw new Error(userRes.error.message)
        }

        if (humanUserRes.hasError) {
          throw new Error(humanUserRes.error.message)
        }

        expect(userRes.error).toBeNull()
        expect(humanUserRes.error).toBeNull()

        return user
      }

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
                __typename
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
        expect(res.data.data.createAdministrator.__typename).toEqual(
          'CreateAdministratorPayload',
        )
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
      testUser1 = await createUser()
      testUser2 = await createUser()
      testAdministrator1 = await create('1', testUser1.id, testDistrict.id)
      testAdministrator2 = await create('2', testUser2.id, testDistrict.id)
    })

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
              __typename
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
              ... on ErrorUnknownRuntime {
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
      expect(res.data.data.updateAdministrator.__typename).toEqual(
        'UpdateAdministratorPayload',
      )
      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateAdministrator).toMatchObject({
        administrator: fields,
        clientMutationId: clientMutationId,
      })
    })

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
      })
      expect(res.data.data.administrators.items).toContainEqual({
        ...testAdministrator2,
        createdAt: testAdministrator2.createdAt.toISOString(),
      })
    })
  })
})
