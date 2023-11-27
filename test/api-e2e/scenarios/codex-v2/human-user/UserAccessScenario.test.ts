import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateHumanUserPayload,
  CreateHumanUserInput,
  UpdateHumanUserPayload,
  UpdateHumanUserInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'
import { User } from '../../../../../src/domain/entities/codex-v2/User'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const nowStr = '2000-01-01T00:00:00Z'

describe('CodexV2 / HumanUser / UserAccessScenario', () => {
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

  let testUserId: string

  describe('get human user', () => {
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
              humanUsers {
                __typename
                ... on HumanUsers {
                  items {
                    email
                    loginId
                    password
                    userId
                    user {
                      id
                      isDemo
                      role
                    }
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
          GraphQLResponse<'humanUsers', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.humanUsers.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.humanUsers.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.humanUsers.__typename).toEqual('HumanUsers')
          expect(res.data.data.humanUsers.items).toBeDefined()
          expect(res.data.data.humanUsers.errorCode).toBeUndefined()
        }
      },
    )
  })

  test('create user', async () => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }

    const userRepository = new RdbUserRepository(appDataSource)

    const create = async (id: string) => {
      const user: User = {
        id,
        role: 'administrator',
        isDemo: true,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await userRepository.create(user)

      expect(res.hasError).toBe(false)
      expect(res.error).toBe(null)

      return id
    }

    testUserId = await create(uuid())
  })

  describe('create human user', () => {
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
        const input: CreateHumanUserInput = {
          email: 'sample@email.com',
          loginId: 'loginId-test',
          password: 'password-test',
          userId: testUserId,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateHumanUser($input: CreateHumanUserInput!) {
              createHumanUser(input: $input) {
                __typename
                ... on CreateHumanUserPayload {
                  clientMutationId
                  humanUser {
                    email
                    loginId
                    password
                    userId
                    user {
                      id
                      role
                      isDemo
                    }
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
          GraphQLResponse<'createHumanUser', CreateHumanUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createHumanUser.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createHumanUser.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createHumanUser.__typename).toEqual(
            'CreateHumanUserPayload',
          )
          expect(res.data.data.createHumanUser.humanUser).toBeDefined()
          expect(res.data.data.createHumanUser.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('update human user', () => {
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
        const input: UpdateHumanUserInput = {
          email: 'sample1updated@mail1.com',
          loginId: 'loginId1-updated',
          password: 'password1-updated',
          userId: testUserId,
        }
        const mutationData = {
          query: `
            mutation UpdateHumanUser($input: UpdateHumanUserInput!) {
              updateHumanUser(input: $input) {
                __typename
                ... on UpdateHumanUserPayload {
                  clientMutationId
                  humanUser {
                    email
                    loginId
                    password
                    userId
                    user {
                      id
                      role
                      isDemo
                    }
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
          GraphQLResponse<'updateHumanUser', UpdateHumanUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateHumanUser.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateHumanUser.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateHumanUser.__typename).toEqual(
            'UpdateHumanUserPayload',
          )
          expect(res.data.data.updateHumanUser.humanUser).toBeDefined()
          expect(res.data.data.updateHumanUser.errorCode).toBeUndefined()
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
