import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateDistrictPayload,
  CreateDistrictInput,
  UpdateDistrictPayload,
  UpdateDistrictInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / District / UserAccessScenario', () => {
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

  let districtId: string

  describe('get district', () => {
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
              districts {
                __typename
                ... on Districts {
                  items {
                    id
                    name
                    stateId
                    lmsId
                    externalLmsDistrictId
                    enableRosterSync
                    createdAt
                    createdUserId
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
          GraphQLResponse<'districts', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.districts.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.districts.errorCode).toEqual('PERMISSION_DENIED')
        } else {
          expect(res.data.data.districts.__typename).toEqual('Districts')
          expect(res.data.data.districts.items).toBeDefined()
          expect(res.data.data.districts.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('create district', () => {
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
        const input: CreateDistrictInput = {
          name: 'name',
          stateId: 'stateId',
          lmsId: 'lmsId',
          externalLmsDistrictId: 'externalLmsDistrictId',
          enableRosterSync: true,
        }

        const mutationData = {
          query: `
            mutation CreateDistrict($input: CreateDistrictInput!) {
              createDistrict(input: $input) {
                __typename
                ... on CreateDistrictPayload {
                  clientMutationId
                  district {
                    id
                    name
                    stateId
                    lmsId
                    externalLmsDistrictId
                    enableRosterSync
                    createdAt
                    createdUserId
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
          GraphQLResponse<'createDistrict', CreateDistrictPayload>
        >(`/v2/graphql`, mutationData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createDistrict.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createDistrict.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createDistrict.__typename).toEqual(
            'CreateDistrictPayload',
          )
          expect(res.data.data.createDistrict.district).toBeDefined()
          expect(res.data.data.createDistrict.errorCode).toBeUndefined()
          districtId = res.data.data.createDistrict.district.id
        }
      },
    )
  })

  describe('update district', () => {
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
        const input: UpdateDistrictInput = {
          id: districtId,
          name: 'name-updated',
          stateId: 'stateId-updated',
          lmsId: 'lmsId-updated',
          externalLmsDistrictId: 'externalLmsDistrictId-1-updated',
          enableRosterSync: false,
        }
        const mutationData = {
          query: `
            mutation UpdateDistrict($input: UpdateDistrictInput!) {
              updateDistrict(input: $input) {
                __typename
                ... on UpdateDistrictPayload {
                  clientMutationId
                  district {
                    id
                    name
                    stateId
                    lmsId
                    externalLmsDistrictId
                    enableRosterSync
                    createdAt
                    createdUserId
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
          GraphQLResponse<'updateDistrict', UpdateDistrictPayload>
        >(`/v2/graphql`, mutationData, {
          headers: { ...authorizationHeader },
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateDistrict.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateDistrict.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateDistrict.__typename).toEqual(
            'UpdateDistrictPayload',
          )
          expect(res.data.data.updateDistrict.district).toBeDefined()
          expect(res.data.data.updateDistrict.errorCode).toBeUndefined()
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
