import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import {
  CreateDistrictPayload,
  CreateDistrictInput,
  UpdateDistrictPayload,
  UpdateDistrictInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import dayjs from 'dayjs'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / District / ConsumerExpectationScenario', () => {
  let testDistrict1: District
  let testDistrict2: District

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

    test('create districts', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const create = async (
        name: string,
        stateId: string,
        lmsId: string,
        externalLmsDistrictId: string,
        enableRosterSync: boolean,
      ): Promise<District> => {
        const input: CreateDistrictInput = {
          name,
          stateId,
          lmsId,
          externalLmsDistrictId,
          enableRosterSync,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateDistrict($input: CreateDistrictInput!) {
              createDistrict(input: $input) {
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
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createDistrict', CreateDistrictPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createDistrict).toMatchObject({
          district: fields,
          clientMutationId,
        })

        const response = res.data.data.createDistrict.district

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
        } as District
      }

      testDistrict1 = await create(
        'name1',
        'stateId1',
        'lmsId1',
        'externalLmsDistrictId1',
        true,
      )
      testDistrict2 = await create(
        'name2',
        'stateId2',
        'lmsId2',
        'externalLmsDistrictId2',
        true,
      )
    })

    test('update district', async () => {
      const input: UpdateDistrictInput = {
        id: testDistrict1.id,
        name: 'name-1-updated',
        stateId: 'stateId-1-updated',
        lmsId: 'lmsId-1-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-1-updated',
        enableRosterSync: false,
        clientMutationId: 'mutation-id-updated',
      }

      const mutationData = {
        query: `
          mutation UpdateDistrict($input: UpdateDistrictInput!) {
            updateDistrict(input: $input) {
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
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateDistrict', UpdateDistrictPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateDistrict).toMatchObject({
        district: fields,
        clientMutationId,
      })
    })

    test('get districts', async () => {
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
          }
        }
        `,
        variables: {},
      }
      const res = await axios.post<GraphQLResponse<'districts', { items: [] }>>(
        `/v2/graphql`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        },
      )

      expect(res.status).toEqual(200)
      expect(res.data.data.districts.items).toHaveLength(2)
      expect(res.data.data.districts.items).toContainEqual({
        ...testDistrict1,
        name: 'name-1-updated',
        stateId: 'stateId-1-updated',
        lmsId: 'lmsId-1-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-1-updated',
        enableRosterSync: false,
        createdAt: testDistrict1.createdAt.toISOString(),
      })
      expect(res.data.data.districts.items).toContainEqual({
        ...testDistrict2,
        createdAt: testDistrict2.createdAt.toISOString(),
      })
    })
  })
})
