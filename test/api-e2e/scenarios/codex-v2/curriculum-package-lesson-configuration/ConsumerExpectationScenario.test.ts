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

describe('CodexV2 / CurriculumPackageLessonConfiguration / ConsumerExpectationScenario', () => {
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

    test('get curriculumPackageLessonConfigurations', async () => {
      const queryData = {
        query: `
          query CurriculumPackageLessonConfigurationsQuery ($curriculumPackageId: String!) {
            curriculumPackageLessonConfigurations(curriculumPackageId: $curriculumPackageId) {
              __typename
              ... on CurriculumPackageLessonConfigurations {
                items {
                  curriculumPackageId
                  lessonId
                }
              }
            }
          }
        `,
        variables: {
          curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        },
      }

      const res = await axios.post<
        GraphQLResponse<
          'curriculumPackageLessonConfigurations',
          { items: object[] }
        >
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(
        res.data.data.curriculumPackageLessonConfigurations.__typename,
      ).toEqual('CurriculumPackageLessonConfigurations')
      expect(
        res.data.data.curriculumPackageLessonConfigurations.errorCode,
      ).toBeUndefined()
      expect(
        res.data.data.curriculumPackageLessonConfigurations.items,
      ).toHaveLength(151)
      expect(
        res.data.data.curriculumPackageLessonConfigurations.items[3],
      ).toEqual({
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-4',
      })
      expect(
        res.data.data.curriculumPackageLessonConfigurations.items[100],
      ).toEqual({
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-gem-2',
      })
    })
  })
})
