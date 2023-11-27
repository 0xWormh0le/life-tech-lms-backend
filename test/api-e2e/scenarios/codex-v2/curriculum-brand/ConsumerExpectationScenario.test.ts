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

describe('CodexV2 / CurriculumBrand / ConsumerExpectationScenario', () => {
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

    test('get curriculumBrands', async () => {
      const queryData = {
        query: `
          {
            curriculumBrands {
              __typename
              ... on CurriculumBrands {
                items {
                  id
                  name
                }
              }
            }
          }
        `,
      }

      const res = await axios.post<
        GraphQLResponse<'curriculumBrands', { items: object[] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.curriculumBrands.__typename).toEqual(
        'CurriculumBrands',
      )
      expect(res.data.data.curriculumBrands.errorCode).toBeUndefined()
      expect(res.data.data.curriculumBrands.items).toHaveLength(2)
      expect(res.data.data.curriculumBrands.items).toEqual([
        {
          id: 'codeillusion',
          name: 'Codeillusion',
        },
        {
          id: 'cse',
          name: 'Computer Science Essentials',
        },
      ])
    })
  })
})
