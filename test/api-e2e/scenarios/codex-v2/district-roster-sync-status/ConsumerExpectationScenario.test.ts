import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { DistrictRosterSyncStatus } from '../../../../../src/domain/entities/codex-v2/DistrictRosterSyncStatus'
import { RdbDistrictRosterSyncStatusRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbDistrictRosterSyncStatusRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / DistrictRosterSyncStatus / ConsumerExpectationScenario', () => {
  let testDistrictRosterSyncStatus1: DistrictRosterSyncStatus
  let testDistrictRosterSyncStatus2: DistrictRosterSyncStatus

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

    const nowStr = '2000-01-01T00:00:00Z'

    test('create DistrictRosterSyncStatus', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const districtRosterSyncStatusRepository =
        new RdbDistrictRosterSyncStatusRepository(appDataSource)

      const createAndInsert = async (districtId: string) => {
        const id = uuid()
        const districtRosterSyncStatus: DistrictRosterSyncStatus = {
          id: id,
          districtId,
          errorMessage: `error-message-${id}`,
          startedAt: new Date(nowStr),
          finishedAt: new Date(nowStr),
        }

        await districtRosterSyncStatusRepository.create(
          districtRosterSyncStatus,
        )

        return districtRosterSyncStatus
      }

      testDistrictRosterSyncStatus1 = await createAndInsert('district-id-1')
      testDistrictRosterSyncStatus2 = await createAndInsert('district-id-2')
    })

    test('get DistrictRosterSyncStatuses by district id', async () => {
      const queryData = {
        query: `
          query ($districtId: String) {
            districtRosterSyncStatuses(districtId: $districtId) {
              __typename
              ... on DistrictRosterSyncStatuses {
                items {
                  id
                  districtId
                  startedAt
                  finishedAt
                  errorMessage
                }
              }
            }
          }
        `,
        variables: {
          districtId: testDistrictRosterSyncStatus1.districtId,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'districtRosterSyncStatuses', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.districtRosterSyncStatuses.items).toEqual([
        {
          ...testDistrictRosterSyncStatus1,
          startedAt: testDistrictRosterSyncStatus1.startedAt.toISOString(),
          finishedAt: testDistrictRosterSyncStatus1.finishedAt?.toISOString(),
        },
      ])
    })
  })

  test('get DistrictRosterSyncStatuses', async () => {
    const queryData = {
      query: `
        {
          districtRosterSyncStatuses {
            __typename
            ... on DistrictRosterSyncStatuses {
              items {
                id
                districtId
                startedAt
                finishedAt
                errorMessage
              }
            }
          }
        }
      `,
      variables: {
        districtId: testDistrictRosterSyncStatus1.districtId,
      },
    }

    const res = await axios.post<
      GraphQLResponse<'districtRosterSyncStatuses', { items: [] }>
    >(`/v2/graphql`, queryData, {
      headers: {
        Authorization: `Bearer ${operatorToken}`,
      },
    })

    expect(res.status).toEqual(200)
    expect(res.data.data.districtRosterSyncStatuses.items).toEqual([
      {
        ...testDistrictRosterSyncStatus1,
        startedAt: testDistrictRosterSyncStatus1.startedAt.toISOString(),
        finishedAt: testDistrictRosterSyncStatus1.finishedAt?.toISOString(),
      },
      {
        ...testDistrictRosterSyncStatus2,
        startedAt: testDistrictRosterSyncStatus2.startedAt.toISOString(),
        finishedAt: testDistrictRosterSyncStatus2.finishedAt?.toISOString(),
      },
    ])
  })
})
