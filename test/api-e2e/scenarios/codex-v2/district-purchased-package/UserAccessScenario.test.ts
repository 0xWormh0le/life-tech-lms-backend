import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateDistrictPayload,
  CreateDistrictPurchasedPackageInput,
  CreateDistrictPurchasedPackagePayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / DistrictPurchasedPackage / UserAccessScenario', () => {
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

  describe('createDistricts', () => {
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
          variables: {
            input: {
              name: `testDistrict1-${new Date().toISOString()}`,
              stateId: `testStateId1`,
              lmsId: `testLmsId1`,
              externalLmsDistrictId: `testExternalLmsDistrictId1`,
              enableRosterSync: true,
              clientMutationId: 'testMutationId-1',
            },
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'createDistrict', CreateDistrictPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
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

  describe('create DistrictPurchasedPackage', () => {
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
        const input: CreateDistrictPurchasedPackageInput = {
          districtId,
          curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateDistrictPurchasedPackage($input: CreateDistrictPurchasedPackageInput!) {
              createDistrictPurchasedPackage(input: $input) {
                __typename
                ... on CreateDistrictPurchasedPackagePayload {
                  clientMutationId
                  districtPurchasedPackage {
                    id
                    districtId
                    curriculumPackageId
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
          variables: {
            input: input,
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<
            'createDistrictPurchasedPackage',
            CreateDistrictPurchasedPackagePayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.createDistrictPurchasedPackage.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.createDistrictPurchasedPackage.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.createDistrictPurchasedPackage.__typename,
          ).toEqual('CreateDistrictPurchasedPackagePayload')
          expect(
            res.data.data.createDistrictPurchasedPackage
              .districtPurchasedPackage,
          ).toBeDefined()
          expect(
            res.data.data.createDistrictPurchasedPackage.errorCode,
          ).toBeUndefined()
        }
      },
    )
  })

  describe('getDistrictPurchasedPackages', () => {
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
                    districtPurchasedPackages {
                      id
                      districtId
                      curriculumPackageId
                      createdUserId
                      createdAt
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
          GraphQLResponse<'districts', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
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
