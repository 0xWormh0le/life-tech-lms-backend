import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import {
  CreateUserExternalChurnZeroMappingInput,
  CreateUserExternalChurnZeroMappingPayload,
  UpdateUserExternalChurnZeroMappingInput,
  UpdateUserExternalChurnZeroMappingPayload,
  UserExternalChurnZeroMapping,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbUserExternalChurnZeroMappingRepository } from '../../../../../src/external/churn-zero/adapter/repositories/RdbUserExternalChurnZeroMappingRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / UserExternalChurnZeroMapping / ConsumerExpectationScenario', () => {
  let userExternalChurnZeroMapping1: UserExternalChurnZeroMapping
  let userExternalChurnZeroMapping2: UserExternalChurnZeroMapping

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
  let operatorUserId = ''

  describe('operation for teacher', () => {
    test('Login', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }

      const { token, userId } = await createUserAndGetToken(
        'testInternalOperator1',
        'internal_operator',
        appDataSource,
      )

      operatorToken = token
      operatorUserId = userId
    })

    test('prepare data', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const userExternalChurnZeroMappingRepository =
        new RdbUserExternalChurnZeroMappingRepository(appDataSource)

      const createUserExternalChurnZeroMapping = async (userId: string) => {
        const userExternalChurnZeroMapping: UserExternalChurnZeroMapping = {
          userId,
          externalChurnZeroContactExternalId: `test-externalChurnZeroContactExternalId-${userId}`,
          externalChurnZeroAccountExternalId: `test-externalChurnZeroAccountExternalId-${userId}`,
        }

        const res = await userExternalChurnZeroMappingRepository.create(
          userExternalChurnZeroMapping,
        )

        expect(res.hasError).toEqual(false)
        expect(res.error).toBeNull()

        return userExternalChurnZeroMapping
      }

      userExternalChurnZeroMapping1 = await createUserExternalChurnZeroMapping(
        uuid(),
      )
    })

    test('create userExternalChurnZeroMapping', async () => {
      const create = async (
        userId: string,
      ): Promise<UserExternalChurnZeroMapping> => {
        const input: CreateUserExternalChurnZeroMappingInput = {
          userId,
          externalChurnZeroAccountExternalId: `test-externalChurnZeroAccountExternalId-${userId}`,
          externalChurnZeroContactExternalId: `test-externalChurnZeroContactExternalId-${userId}`,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateUserExternalChurnZeroMapping($input: CreateUserExternalChurnZeroMappingInput!) {
              createUserExternalChurnZeroMapping(input: $input) {
                __typename
                ... on CreateUserExternalChurnZeroMappingPayload {
                  clientMutationId
                  userExternalChurnZeroMapping {
                    userId
                    externalChurnZeroContactExternalId
                    externalChurnZeroAccountExternalId
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<
            'createUserExternalChurnZeroMapping',
            CreateUserExternalChurnZeroMappingPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(
          res.data.data.createUserExternalChurnZeroMapping.__typename,
        ).toEqual('CreateUserExternalChurnZeroMappingPayload')
        expect(res.data.data.createUserExternalChurnZeroMapping).toMatchObject({
          userExternalChurnZeroMapping: fields,
          clientMutationId,
        })

        const response =
          res.data.data.createUserExternalChurnZeroMapping
            .userExternalChurnZeroMapping

        return response
      }

      userExternalChurnZeroMapping2 = await create(operatorUserId)
    })

    test('update userExternalChurnZeroMapping', async () => {
      const input: UpdateUserExternalChurnZeroMappingInput = {
        userId: operatorUserId,
        externalChurnZeroAccountExternalId: `test-externalChurnZeroAccountExternalId-${operatorUserId}-updated`,
        externalChurnZeroContactExternalId: `test-externalChurnZeroContactExternalId-${operatorUserId}-updated`,
        clientMutationId: 'testMutationId-1',
      }

      const mutationData = {
        query: `
          mutation UpdateUserExternalChurnZeroMapping($input: UpdateUserExternalChurnZeroMappingInput!) {
            updateUserExternalChurnZeroMapping(input: $input) {
              __typename
              ... on UpdateUserExternalChurnZeroMappingPayload {
                clientMutationId
                userExternalChurnZeroMapping {
                  userId
                  externalChurnZeroContactExternalId
                  externalChurnZeroAccountExternalId
                }
              }
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<
          'updateUserExternalChurnZeroMapping',
          UpdateUserExternalChurnZeroMappingPayload
        >
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(
        res.data.data.updateUserExternalChurnZeroMapping.__typename,
      ).toEqual('UpdateUserExternalChurnZeroMappingPayload')
      expect(res.data.data.updateUserExternalChurnZeroMapping).toMatchObject({
        userExternalChurnZeroMapping: fields,
        clientMutationId,
      })

      userExternalChurnZeroMapping2 = fields
    })

    test('get userExternalChurnZeroMapping by userId', async () => {
      const getValue = async (
        userId: string,
      ): Promise<UserExternalChurnZeroMapping> => {
        const queryData = {
          query: `
            query UserExternalChurnZeroMappingQuery($userId: String!) {
              userExternalChurnZeroMapping(userId: $userId) {
                __typename
                ... on UserExternalChurnZeroMapping {
                  userId
                  externalChurnZeroContactExternalId
                  externalChurnZeroAccountExternalId
                }
              }
            }
          `,
          variables: {
            userId,
          },
        }
        const res = await axios.post<
          GraphQLResponse<
            'userExternalChurnZeroMapping',
            UserExternalChurnZeroMapping
          >
        >(`/v2/graphql`, queryData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)
        expect(res.data.data.userExternalChurnZeroMapping.__typename).toEqual(
          'UserExternalChurnZeroMapping',
        )

        return res.data.data.userExternalChurnZeroMapping
      }

      const value1 = await getValue(userExternalChurnZeroMapping1.userId)
      const value2 = await getValue(userExternalChurnZeroMapping2.userId)

      expect(value1).toMatchObject(userExternalChurnZeroMapping1)
      expect(value2).toMatchObject(userExternalChurnZeroMapping2)
    })
  })
})
