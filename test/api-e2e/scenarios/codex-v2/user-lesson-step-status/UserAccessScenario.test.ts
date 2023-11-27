import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / UserLessonStepStatus / UserAccessScenario', () => {
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

  describe('get UserLessonStepStatus', () => {
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
            query UserLessonStepStatusesQuery($userIds: [String!]!) {
              userLessonStepStatuses(userIds: $userIds) {
                __typename
                ... on UserLessonStepStatuses {
                  items {
                    id
                    userId
                    stepId
                    userLessonStatusId
                    lessonId
                    status
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
          variables: {
            userIds: [],
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'userLessonStepStatuses', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.userLessonStepStatuses.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.userLessonStepStatuses.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.userLessonStepStatuses.__typename).toEqual(
            'UserLessonStepStatuses',
          )
          expect(res.data.data.userLessonStepStatuses.items).toBeDefined()
          expect(res.data.data.userLessonStepStatuses.errorCode).toBeUndefined()
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
