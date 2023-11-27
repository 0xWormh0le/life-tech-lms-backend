import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import {
  CreateOrganizationPayload,
  CreateOrganizationInput,
  UpdateOrganizationPayload,
  UpdateOrganizationInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import dayjs from 'dayjs'
import { RdbDistrictRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbDistrictRepository'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / Organization / ConsumerExpectationScenario', () => {
  let testOrganization1: Organization
  let testOrganization2: Organization
  let testDistrict: District
  let operatorToken = ''
  const nowStr = '2000-01-01T00:00:00Z'

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

    test('create organizations', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const create = async (
        name: string,
        classlinkTenantId: string,
        districtId: string,
        externalLmsOrganizationId: string,
      ): Promise<Organization> => {
        const input: CreateOrganizationInput = {
          name,
          classlinkTenantId,
          districtId,
          externalLmsOrganizationId,
          clientMutationId: 'testMutationId-1',
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
                ... on ErrorUnknownRuntime {
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
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createOrganization).toMatchObject({
          organization: fields,
          clientMutationId,
        })

        const response = res.data.data.createOrganization.organization

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
          updatedAt: dayjs(response.updatedAt).toDate(),
        } as Organization
      }

      testOrganization1 = await create(
        'name-1',
        'classlinkTenantId-1',
        testDistrict.id,
        'externalLmsOrganizationId-1',
      )
      testOrganization2 = await create(
        'name-2',
        'classlinkTenantId-2',
        testDistrict.id,
        'externalLmsOrganizationId-2',
      )
    })

    test('update organization', async () => {
      const input: UpdateOrganizationInput = {
        id: testOrganization1.id,
        name: 'name-1-updated',
        classlinkTenantId: 'classlinkTenantId-1-updated',
        districtId: testDistrict.id,
        externalLmsOrganizationId: 'externalLmsOrganizationId-1-updated',
        clientMutationId: 'testMutationId-1-updated',
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
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateOrganization', UpdateOrganizationPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateOrganization).toMatchObject({
        organization: fields,
        clientMutationId,
      })

      testOrganization1 = {
        ...testOrganization1,
        ...fields,
        updatedAt: dayjs(
          res.data.data.updateOrganization.organization.updatedAt,
        ).toDate(),
      }
    })

    test('get organizations', async () => {
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
          }
        }
        `,
        variables: {},
      }
      const res = await axios.post<
        GraphQLResponse<'organizations', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.organizations.items).toHaveLength(2)
      expect(res.data.data.organizations.items).toContainEqual({
        ...testOrganization1,
        createdAt: testOrganization1.createdAt.toISOString(),
        updatedAt: testOrganization1.updatedAt.toISOString(),
      })
      expect(res.data.data.organizations.items).toContainEqual({
        ...testOrganization2,
        createdAt: testOrganization2.createdAt.toISOString(),
        updatedAt: testOrganization2.updatedAt.toISOString(),
      })
    })
  })
})
