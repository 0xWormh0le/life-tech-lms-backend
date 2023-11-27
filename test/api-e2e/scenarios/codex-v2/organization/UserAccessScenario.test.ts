import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateOrganizationPayload,
  CreateOrganizationInput,
  UpdateOrganizationPayload,
  UpdateOrganizationInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import { RdbDistrictRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbDistrictRepository'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / Organization / UserAccessScenario', () => {
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

  const nowStr = '2000-01-01T00:00:00Z'

  let organizationId: string
  let testDistrict: District

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

  test('create data', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is undefined.')
    }

    const districtRepository = new RdbDistrictRepository(appDataSource)

    const createDistrict = async () => {
      const id = uuid()

      const district: District = {
        id,
        name: 'test-name',
        stateId: 'test-state-id',
        lmsId: 'test-lms-id',
        externalLmsDistrictId: 'test-external-lms-district-id',
        enableRosterSync: false,
        createdAt: new Date(nowStr),
        createdUserId: 'test-created-user-id',
      }

      const res = await districtRepository.create(district)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      return district
    }

    testDistrict = await createDistrict()
  })

  describe('get organizations', () => {
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
              organizations {
                __typename
                ... on Organizations {
                  items {
                    id
                    name
                    classlinkTenantId
                    districtId
                    externalLmsOrganizationId
                    createdAt
                    updatedAt
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

        const res = await axios.post<
          GraphQLResponse<'organizations', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: createAuthorizationHeaderByUserToken(userToken),
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.organizations.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.organizations.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.organizations.__typename).toEqual(
            'Organizations',
          )
          expect(res.data.data.organizations.items).toBeDefined()
          expect(res.data.data.organizations.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('create organization', () => {
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
        const input: CreateOrganizationInput = {
          name: 'name',
          classlinkTenantId: 'classlinkTenantId',
          districtId: testDistrict.id,
          externalLmsOrganizationId: 'externalLmsOrganizationId',
          clientMutationId: 'testMutationId',
        }

        const mutationData = {
          query: `
            mutation CreateOrganization($input: CreateOrganizationInput!) {
              createOrganization(input: $input) {
                __typename
                ... on CreateOrganizationPayload {
                  clientMutationId
                  organization {
                    id
                    name
                    classlinkTenantId
                    districtId
                    externalLmsOrganizationId
                    createdAt
                    updatedAt
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

        const res = await axios.post<
          GraphQLResponse<'createOrganization', CreateOrganizationPayload>
        >(`/v2/graphql`, mutationData, {
          headers: createAuthorizationHeaderByUserToken(userToken),
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createOrganization.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createOrganization.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createOrganization.__typename).toEqual(
            'CreateOrganizationPayload',
          )
          expect(res.data.data.createOrganization.organization).toBeDefined()
          expect(res.data.data.createOrganization.errorCode).toBeUndefined()
          organizationId = res.data.data.createOrganization.organization.id
        }
      },
    )
  })

  describe('update organization', () => {
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
        const input: UpdateOrganizationInput = {
          id: organizationId,
          name: 'name-updated',
          classlinkTenantId: 'classlinkTenantId-updated',
          districtId: testDistrict.id,
          externalLmsOrganizationId: 'externalLmsOrganizationId-updated',
          clientMutationId: 'testMutationId-updated',
        }
        const mutationData = {
          query: `
            mutation UpdateOrganization($input: UpdateOrganizationInput!) {
              updateOrganization(input: $input) {
                __typename
                ... on UpdateOrganizationPayload {
                  clientMutationId
                  organization {
                    id
                    name
                    classlinkTenantId
                    districtId
                    externalLmsOrganizationId
                    createdAt
                    updatedAt
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

        const res = await axios.post<
          GraphQLResponse<'updateOrganization', UpdateOrganizationPayload>
        >(`/v2/graphql`, mutationData, {
          headers: createAuthorizationHeaderByUserToken(userToken),
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateOrganization.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateOrganization.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateOrganization.__typename).toEqual(
            'UpdateOrganizationPayload',
          )
          expect(res.data.data.updateOrganization.organization).toBeDefined()
          expect(res.data.data.updateOrganization.errorCode).toBeUndefined()
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
