import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateUserExternalChurnZeroMappingInput,
  CreateUserExternalChurnZeroMappingPayload,
  UpdateUserExternalChurnZeroMappingInput,
  UpdateUserExternalChurnZeroMappingPayload,
  UserExternalChurnZeroMapping,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / UserExternalChurnZeroMapping / UserAccessScenario', () => {
  const userTokens = {
    internalOperator: '',
    administrator: '',
    teacher: '',
    student: '',
    invalid: 'invalid_token',
    anonymous: null,
  }

  const userIds = {
    internalOperator: '',
    administrator: '',
    teacher: '',
    student: '',
    another: '',
    invalid: 'invalid',
    anonymous: 'anonymous',
  }

  type userTokenKey = keyof typeof userTokens
  type userIdKey = keyof typeof userIds

  beforeAll(async () => {
    const internalOperator = await getUserInfo(
      'internal_operator',
      'internal_operator',
    )
    const administrator = await getUserInfo('administrator', 'administrator')
    const teacher = await getUserInfo('teacher', 'teacher')
    const student = await getUserInfo('student', 'student')
    const another = await getUserInfo('another', 'student')

    userTokens.internalOperator = internalOperator.token
    userTokens.administrator = administrator.token
    userTokens.teacher = teacher.token
    userTokens.student = student.token

    userIds.internalOperator = internalOperator.userId
    userIds.administrator = administrator.userId
    userIds.teacher = teacher.userId
    userIds.student = student.userId
    userIds.another = another.userId
  })

  describe('create user', () => {
    test.each`
      userToken             | userId                | expectUnauthorizedError
      ${'internalOperator'} | ${'internalOperator'} | ${false}
      ${'internalOperator'} | ${'another'}          | ${false}
      ${'administrator'}    | ${'administrator'}    | ${false}
      ${'administrator'}    | ${'another'}          | ${true}
      ${'teacher'}          | ${'teacher'}          | ${false}
      ${'teacher'}          | ${'another'}          | ${true}
      ${'student'}          | ${'student'}          | ${false}
      ${'student'}          | ${'another'}          | ${true}
      ${'invalid'}          | ${'invalid'}          | ${true}
      ${'anonymous'}        | ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, userId: $userId, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, userId, expectUnauthorizedError }) => {
        const input: CreateUserExternalChurnZeroMappingInput = {
          userId: getUserId(userId),
          externalChurnZeroAccountExternalId:
            'test-externalChurnZeroAccountExternalId',
          externalChurnZeroContactExternalId:
            'test-externalChurnZeroContactExternalId',
          clientMutationId: 'testMutationId-1',
        }

        const queryData = {
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
          GraphQLResponse<
            'createUserExternalChurnZeroMapping',
            CreateUserExternalChurnZeroMappingPayload
          >
        >('/v2/graphql', queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.createUserExternalChurnZeroMapping.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.createUserExternalChurnZeroMapping.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.createUserExternalChurnZeroMapping.__typename,
          ).toEqual('CreateUserExternalChurnZeroMappingPayload')
          expect(
            res.data.data.createUserExternalChurnZeroMapping.errorCode,
          ).toBeUndefined()
        }
      },
    )
  })

  describe('update user', () => {
    test.each`
      userToken             | userId                | expectUnauthorizedError
      ${'internalOperator'} | ${'internalOperator'} | ${false}
      ${'internalOperator'} | ${'another'}          | ${false}
      ${'administrator'}    | ${'administrator'}    | ${false}
      ${'administrator'}    | ${'another'}          | ${true}
      ${'teacher'}          | ${'teacher'}          | ${false}
      ${'teacher'}          | ${'another'}          | ${true}
      ${'student'}          | ${'student'}          | ${false}
      ${'student'}          | ${'another'}          | ${true}
      ${'invalid'}          | ${'invalid'}          | ${true}
      ${'anonymous'}        | ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, userId: $userId, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, userId, expectUnauthorizedError }) => {
        const input: UpdateUserExternalChurnZeroMappingInput = {
          userId: getUserId(userId),
          externalChurnZeroAccountExternalId:
            'test-externalChurnZeroAccountExternalId',
          externalChurnZeroContactExternalId:
            'test-externalChurnZeroContactExternalId',
          clientMutationId: 'testMutationId-1',
        }

        const queryData = {
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
          GraphQLResponse<
            'updateUserExternalChurnZeroMapping',
            UpdateUserExternalChurnZeroMappingPayload
          >
        >('/v2/graphql', queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.updateUserExternalChurnZeroMapping.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.updateUserExternalChurnZeroMapping.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.updateUserExternalChurnZeroMapping.__typename,
          ).toEqual('UpdateUserExternalChurnZeroMappingPayload')
          expect(
            res.data.data.updateUserExternalChurnZeroMapping.errorCode,
          ).toBeUndefined()
        }
      },
    )
  })

  describe('get userExternalChurnZeroMapping by userId', () => {
    test.each`
      userToken             | userId                | expectUnauthorizedError
      ${'internalOperator'} | ${'internalOperator'} | ${false}
      ${'internalOperator'} | ${'another'}          | ${false}
      ${'administrator'}    | ${'administrator'}    | ${false}
      ${'administrator'}    | ${'another'}          | ${true}
      ${'teacher'}          | ${'teacher'}          | ${false}
      ${'teacher'}          | ${'another'}          | ${true}
      ${'student'}          | ${'student'}          | ${false}
      ${'student'}          | ${'another'}          | ${true}
      ${'invalid'}          | ${'invalid'}          | ${true}
      ${'anonymous'}        | ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, userId: $userId, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, userId, expectUnauthorizedError }) => {
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { userId: getUserId(userId) },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<
            'userExternalChurnZeroMapping',
            UserExternalChurnZeroMapping
          >
        >('/v2/graphql', queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.userExternalChurnZeroMapping.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.userExternalChurnZeroMapping.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.userExternalChurnZeroMapping.__typename).toEqual(
            'UserExternalChurnZeroMapping',
          )
          expect(
            res.data.data.userExternalChurnZeroMapping.errorCode,
          ).toBeUndefined()
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

  const getUserId = (userId: unknown) => userIds[userId as userIdKey]

  const getUserInfo = async (
    loginId: string,
    role: 'internal_operator' | 'administrator' | 'teacher' | 'student',
  ) => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }

    return await createUserAndGetToken(loginId, role, appDataSource)
  }
})
