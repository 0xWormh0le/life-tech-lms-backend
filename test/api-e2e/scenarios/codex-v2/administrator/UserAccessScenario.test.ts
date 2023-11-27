import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateAdministratorPayload,
  CreateAdministratorInput,
  UpdateAdministratorPayload,
  UpdateAdministratorInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbDistrictRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbDistrictRepository'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import { User } from '../../../../../src/domain/entities/codex-v2/User'
import { HumanUser } from '../../../../../src/domain/entities/codex-v2/HumanUser'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

import { v4 as uuid } from 'uuid'
import { RdbHumanUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbHumanUserRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / Administrator / UserAccessScenario', () => {
  const userTokens = {
    internalOperator: '',
    administrator: '',
    teacher1: '',
    teacher2: '',
    student1: '',
    student2: '',
    invalid: 'invalid_token',
    anonymous: null,
  }

  const nowStr = '2000-01-01T00:00:00Z'

  type userTokenKey = keyof typeof userTokens

  beforeAll(async () => {
    userTokens.internalOperator = await getToken(
      'internal_operator',
      'internal_operator',
    )
    userTokens.administrator = await getToken('administrator', 'administrator')
    userTokens.teacher1 = await getToken('teacher1', 'teacher')
    userTokens.teacher2 = await getToken('teacher2', 'teacher')
    userTokens.student1 = await getToken('student1', 'student')
    userTokens.student2 = await getToken('student2', 'student')
  })

  let testDistrict: District
  let testUser: User
  let administratorId: string

  test('create data', async () => {
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

    testDistrict = await createDistrict()
    testUser = await createUser()
  })

  describe('get administrator', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${true}
      ${'teacher1'}         | ${true}
      ${'teacher2'}         | ${true}
      ${'student1'}         | ${true}
      ${'student2'}         | ${true}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        const queryData = {
          query: `
            {
              administrators {
                __typename
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: {},
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'administrators', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.administrators.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.administrators.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.administrators.__typename).toEqual(
            'Administrators',
          )
          expect(res.data.data.administrators.items).toBeDefined()
          expect(res.data.data.administrators.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('create administrator', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${true}
      ${'teacher1'}         | ${true}
      ${'teacher2'}         | ${true}
      ${'student1'}         | ${true}
      ${'student2'}         | ${true}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        const input: CreateAdministratorInput = {
          userId: testUser.id,
          firstName: 'testFirstname',
          lastName: 'testLastname',
          externalLmsAdministratorId: 'testExternalLmsAdminId',
          isDeactivated: false,
          clientMutationId: 'testMutationId-1',
          districtId: testDistrict.id,
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

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'createAdministrator', CreateAdministratorPayload>
        >(`/v2/graphql`, mutationData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createAdministrator.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createAdministrator.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createAdministrator.__typename).toEqual(
            'CreateAdministratorPayload',
          )
          expect(res.data.data.createAdministrator.administrator).toBeDefined()
          expect(res.data.data.createAdministrator.errorCode).toBeUndefined()
          administratorId = res.data.data.createAdministrator.administrator.id
        }
      },
    )
  })

  describe('update administrator', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${true}
      ${'teacher1'}         | ${true}
      ${'teacher2'}         | ${true}
      ${'student1'}         | ${true}
      ${'student2'}         | ${true}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        const input: UpdateAdministratorInput = {
          id: administratorId,
          userId: testUser.id,
          firstName: 'testFirstname-updated',
          lastName: 'testLastname-updated',
          externalLmsAdministratorId: 'testExternalLmsAdminId-updated',
          clientMutationId: 'testMutationId-updated',
          districtId: testDistrict.id,
          isDeactivated: false,
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'updateAdministrator', UpdateAdministratorPayload>
        >(`/v2/graphql`, mutationData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateAdministrator.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateAdministrator.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateAdministrator.__typename).toEqual(
            'UpdateAdministratorPayload',
          )
          expect(res.data.data.updateAdministrator.administrator).toBeDefined()
          expect(res.data.data.updateAdministrator.errorCode).toBeUndefined()
        }
      },
    )
  })

  const createAuthorizationHeaderByUserToken = (
    userToken: unknown,
  ): { Authorization: string } | undefined => {
    const authorizationHeader = userTokens[userToken as userTokenKey]
      ? {
          Authorization: `Bearer ${
            userTokens[userToken as userTokenKey] ?? ''
          }`,
        }
      : undefined

    return authorizationHeader
  }

  const getToken = async (
    loginId: string,
    role: 'internal_operator' | 'administrator' | 'teacher' | 'student',
  ): Promise<string> => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }

    const { token } = await createUserAndGetToken(loginId, role, appDataSource)

    return token
  }
})
