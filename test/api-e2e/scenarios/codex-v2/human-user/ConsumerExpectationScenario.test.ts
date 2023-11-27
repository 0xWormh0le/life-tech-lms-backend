import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { v4 as uuid } from 'uuid'
import { HumanUser } from '../../../../../clients/codex-v2/resolvers-type'
import {
  CreateHumanUserPayload,
  CreateHumanUserInput,
  UpdateHumanUserPayload,
  UpdateHumanUserInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { User } from '../../../../../src/domain/entities/codex-v2/User'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const nowStr = '2000-01-01T00:00:00Z'

describe('CodexV2 / HumanUser / ConsumerExpectationScenario', () => {
  let testHumanUser1: HumanUser
  let testHumanUser2: HumanUser
  let testUserId1: string
  let testUserId2: string

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

      testUserId1 = await create(uuid())
      testUserId2 = await create(uuid())
    })

    test('create human users', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const create = async (
        email: string,
        loginId: string,
        password: string,
        userId: string,
      ): Promise<HumanUser> => {
        const input: CreateHumanUserInput = {
          email,
          loginId,
          password,
          userId,
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
                      isDemo
                      role
                    }
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

        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createHumanUser).toMatchObject({
          humanUser: { ...fields, password: '******' },
          clientMutationId,
        })

        const response = res.data.data.createHumanUser.humanUser

        return response
      }

      testHumanUser1 = await create(
        'sample1@mail1.com',
        'loginId1',
        'password1',
        testUserId1,
      )
      testHumanUser2 = await create(
        'sample2@mail2.com',
        'loginId2',
        'password2',
        testUserId2,
      )
    })

    test('update humanUser', async () => {
      const input: UpdateHumanUserInput = {
        email: 'sample1updated@mail1.com',
        loginId: 'loginId1-updated',
        password: 'password1-updated',
        userId: testUserId1,
        clientMutationId: 'testMutationId-1',
      }

      const mutationData = {
        query: `
          mutation UpdateHumanUser($input: UpdateHumanUserInput!) {
            updateHumanUser(input: $input) {
              ... on UpdateHumanUserPayload {
                clientMutationId
                humanUser {
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

      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateHumanUser).toMatchObject({
        humanUser: {
          ...fields,
          user: { id: input.userId, role: 'administrator', isDemo: true },
          password: '******',
        },
        clientMutationId,
      })
    })

    test('get human users without email search keyword', async () => {
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
          }
        }
        `,
        variables: {},
      }
      const res = await axios.post<
        GraphQLResponse<'humanUsers', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.humanUsers.items).toContainEqual({
        ...testHumanUser1,
        email: 'sample1updated@mail1.com',
        loginId: 'loginId1-updated',
        password: '******',
        user: {
          id: testHumanUser1.userId,
          role: 'administrator',
          isDemo: true,
        },
      })
      expect(res.data.data.humanUsers.items).toContainEqual({
        ...testHumanUser2,
        password: '******',
        user: {
          id: testHumanUser2.userId,
          role: 'administrator',
          isDemo: true,
        },
      })
    })

    test('get human users with existing email keyword', async () => {
      const queryData = {
        query: `
          query HumanUsers($email: String) {
            humanUsers(email: $email) {
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
            }
          }
        `,
        variables: {
          email: 'mail1',
        },
      }
      const res = await axios.post<
        GraphQLResponse<'humanUsers', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.humanUsers.items).toHaveLength(1)
      expect(res.data.data.humanUsers.items).toContainEqual({
        ...testHumanUser1,
        email: 'sample1updated@mail1.com',
        loginId: 'loginId1-updated',
        password: '******',
        user: {
          id: testHumanUser1.userId,
          role: 'administrator',
          isDemo: true,
        },
      })
    })

    test('get human users with non-existing email keyword', async () => {
      const queryData = {
        query: `
          query HumanUsers($email: String) {
            humanUsers(email: $email) {
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
            }
          }
        `,
        variables: {
          email: 'email-none',
        },
      }
      const res = await axios.post<
        GraphQLResponse<'humanUsers', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.humanUsers.items).toHaveLength(0)
    })
  })
})
