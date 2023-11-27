import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateUserPayload,
  CreateUserInput,
  UpdateUserPayload,
  UpdateUserInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / User / UserAccessScenario', () => {
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

  let userId: string

  describe('get users', () => {
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
              users {
                __typename
                ... on Users {
                  items {
                    id
                    role
                    isDemo
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
          GraphQLResponse<'users', { items: []; count: number }>
        >(`/v2/graphql`, queryData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.users.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.users.errorCode).toEqual('PERMISSION_DENIED')
        } else {
          expect(res.data.data.users.__typename).toEqual('Users')
          expect(res.data.data.users.items).toBeDefined()
          expect(res.data.data.users.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('create user', () => {
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
        const input: CreateUserInput = {
          role: 'administrator',
          isDemo: false,
        }

        const mutationData = {
          query: `
            mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                __typename
                ... on CreateUserPayload {
                  clientMutationId
                  user {
                    id
                    role
                    isDemo
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
          GraphQLResponse<'createUser', CreateUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createUser.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createUser.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createUser.__typename).toEqual(
            'CreateUserPayload',
          )
          expect(res.data.data.createUser.user).toBeDefined()
          expect(res.data.data.createUser.errorCode).toBeUndefined()
          userId = res.data.data.createUser.user.id
        }
      },
    )
  })

  describe('update user', () => {
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
        const input: UpdateUserInput = {
          id: userId,
          role: 'teacher',
          isDemo: true,
        }
        const mutationData = {
          query: `
            mutation UpdateUser($input: UpdateUserInput!) {
              updateUser(input: $input) {
                __typename
                ... on UpdateUserPayload {
                  clientMutationId
                  user {
                    id
                    role
                    isDemo
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
          GraphQLResponse<'updateUser', UpdateUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateUser.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateUser.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateUser.__typename).toEqual(
            'UpdateUserPayload',
          )
          expect(res.data.data.updateUser.user).toBeDefined()
          expect(res.data.data.updateUser.errorCode).toBeUndefined()
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
