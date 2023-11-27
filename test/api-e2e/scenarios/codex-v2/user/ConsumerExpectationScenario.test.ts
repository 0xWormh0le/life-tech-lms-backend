import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { User } from '../../../../../src/domain/entities/codex-v2/User'
import {
  CreateUserPayload,
  CreateUserInput,
  UpdateUserPayload,
  UpdateUserInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / User / ConsumerExpectationScenario', () => {
  const testUsers: User[] = []

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

    describe('create users', () => {
      const createUser = async (input: CreateUserInput) => {
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
                ... on ErrorUnknownRuntime {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        return axios.post<GraphQLResponse<'createUser', CreateUserPayload>>(
          `/v2/graphql`,
          mutationData,
          {
            headers: {
              Authorization: `Bearer ${operatorToken}`,
            },
          },
        )
      }

      test.each`
        role                  | expectUnknownUserRoleError
        ${'internalOperator'} | ${false}
        ${'administrator'}    | ${false}
        ${'teacher'}          | ${false}
        ${'student'}          | ${false}
        ${'unknown-role'}     | ${true}
      `(
        'role: $role, expectUnknownUserRoleError: $expectUnknownUserRoleError',
        async ({
          role,
          expectUnknownUserRoleError,
        }: {
          role: string
          expectUnknownUserRoleError: string
        }) => {
          if (!appDataSource) {
            throw new Error('appDataSource is undefined.')
          }

          const input: CreateUserInput = {
            role,
            isDemo: false,
            clientMutationId: 'client-mutation-id',
          }
          const res = await createUser(input)
          const { clientMutationId, ...fields } = input

          expect(res.status).toEqual(200)

          if (expectUnknownUserRoleError) {
            expect(res.data.data.createUser.__typename).toEqual(
              'ErrorUnknownRuntime',
            )
            expect(res.data.data.createUser.errorCode).toEqual(
              'UNKNOWN_RUNTIME_ERROR',
            )
            expect(res.data.data.createUser.message).toMatch(/unknown userRole/)
          } else {
            expect(res.data.data.createUser.__typename).toEqual(
              'CreateUserPayload',
            )
            expect(res.data.data.createUser.errorCode).toBeUndefined()
            expect(res.data.data.createUser).toMatchObject({
              user: fields,
              clientMutationId,
            })

            const response = res.data.data.createUser.user

            testUsers.push(response as User)
          }
        },
      )
    })

    describe('update user', () => {
      const updateUser = async (input: UpdateUserInput) => {
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
                ... on ErrorUnknownRuntime {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        return axios.post<GraphQLResponse<'updateUser', UpdateUserPayload>>(
          `/v2/graphql`,
          mutationData,
          {
            headers: {
              Authorization: `Bearer ${operatorToken}`,
            },
          },
        )
      }

      test.each`
        role                  | expectUnknownUserRoleError
        ${'internalOperator'} | ${false}
        ${'administrator'}    | ${false}
        ${'teacher'}          | ${false}
        ${'student'}          | ${false}
        ${'unknown-role'}     | ${true}
      `(
        'role: $role, expectUnknownUserRoleError: $expectUnknownUserRoleError',
        async ({
          role,
          expectUnknownUserRoleError,
        }: {
          role: string
          expectUnknownUserRoleError: string
        }) => {
          if (!appDataSource) {
            throw new Error('appDataSource is undefined.')
          }

          const input: UpdateUserInput = {
            id: testUsers[0].id,
            role,
            isDemo: true,
            clientMutationId: 'client-mutation-id',
          }
          const res = await updateUser(input)
          const { clientMutationId, ...fields } = input

          expect(res.status).toEqual(200)

          if (expectUnknownUserRoleError) {
            expect(res.data.data.updateUser.__typename).toEqual(
              'ErrorUnknownRuntime',
            )
            expect(res.data.data.updateUser.errorCode).toEqual(
              'UNKNOWN_RUNTIME_ERROR',
            )
            expect(res.data.data.updateUser.message).toMatch(/unknown userRole/)
          } else {
            expect(res.data.data.updateUser.__typename).toEqual(
              'UpdateUserPayload',
            )
            expect(res.data.data.updateUser.errorCode).toBeUndefined()
            expect(res.data.data.updateUser).toMatchObject({
              user: fields,
              clientMutationId,
            })
          }
        },
      )
    })

    test('get users', async () => {
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
            }
          }
        `,
        variables: {},
      }
      const res = await axios.post<GraphQLResponse<'users', { items: [] }>>(
        `/v2/graphql`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        },
      )

      expect(res.status).toEqual(200)
      expect(res.data.data.users.__typename).toBe('Users')
      expect(res.data.data.users.errorCode).toBeUndefined()
      expect(res.data.data.users.items).toContainEqual({
        ...testUsers[0],
        isDemo: true,
        role: 'student',
      })
      expect(res.data.data.users.items).toContainEqual(testUsers[1])
      expect(res.data.data.users.items).toContainEqual(testUsers[2])
      expect(res.data.data.users.items).toContainEqual(testUsers[3])
    })
  })
})
