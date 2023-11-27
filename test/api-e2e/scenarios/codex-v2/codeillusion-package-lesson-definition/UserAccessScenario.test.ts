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

describe('CodexV2 / CodeillusionPackageLessonDefinition / UserAccessScenario', () => {
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

  describe('get CodeillusionPackageLessonDefinition', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${false}
      ${'teacher1'}         | ${false}
      ${'teacher2'}         | ${false}
      ${'student1'}         | ${false}
      ${'student2'}         | ${false}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        const queryData = {
          query: `
            query CodeillusionPackageLessonDefinitionsQuery ($codeillusionPackageCircleDefinitionId: String!) {
              codeillusionPackageLessonDefinitions(codeillusionPackageCircleDefinitionId: $codeillusionPackageCircleDefinitionId) {
                __typename
                ... on CodeillusionPackageLessonDefinitions {
                  items {
                    lessonId
                    codeillusionPackageCircleDefinitionId
                    uiType
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
            codeillusionPackageCircleDefinitionId: `circle-codeillusion-basic-tangled-media_art`,
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'codeillusionPackageLessonDefinitions', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.codeillusionPackageLessonDefinitions.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.codeillusionPackageLessonDefinitions.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.codeillusionPackageLessonDefinitions.__typename,
          ).toEqual('CodeillusionPackageLessonDefinitions')
          expect(
            res.data.data.codeillusionPackageLessonDefinitions.items,
          ).toBeDefined()
          expect(
            res.data.data.codeillusionPackageLessonDefinitions.errorCode,
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
