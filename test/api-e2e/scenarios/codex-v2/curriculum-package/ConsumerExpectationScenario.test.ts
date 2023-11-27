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

describe('CodexV2 / Curriculum Package / ConsumerExpectationScenario', () => {
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

    test('get curriculumPackages', async () => {
      const queryData = {
        query: `
          query CurriculumPackagesQuery ($curriculumBrandId: String!) {
            curriculumPackages(curriculumBrandId: $curriculumBrandId) {
              __typename
              ... on CurriculumPackages {
                items {
                  id
                  curriculumBrandId
                  name
                  level
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
          curriculumBrandId: `cse`,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'curriculumPackages', { items: object[] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.curriculumPackages.__typename).toEqual(
        'CurriculumPackages',
      )
      expect(res.data.data.curriculumPackages.errorCode).toBeUndefined()
      expect(res.data.data.curriculumPackages.items).toHaveLength(1)
      expect(res.data.data.curriculumPackages.items).toEqual([
        {
          id: 'cse-package-full-standard',
          curriculumBrandId: 'cse',
          name: 'Computer Science Essentials',
          level: 'BASIC',
        },
      ])
    })
  })
})
