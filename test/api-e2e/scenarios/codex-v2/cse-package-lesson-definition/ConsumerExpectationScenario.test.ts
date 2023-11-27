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

describe('CodexV2 / CsePackageLessonDefinition / ConsumerExpectationScenario', () => {
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

    test('get csePackageLessonDefinitions', async () => {
      const queryData = {
        query: `
          query CsePackageLessonDefinitionsQuery ($csePackageUnitDefinitionId: String!) {
            csePackageLessonDefinitions(csePackageUnitDefinitionId: $csePackageUnitDefinitionId) {
              __typename
              ... on CsePackageLessonDefinitions {
                items {
                  lessonId
                  csePackageUnitDefinitionId
                  isQuizLesson
                }
              }
            }
          }
        `,
        variables: {
          csePackageUnitDefinitionId: `unit-cse-3`,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'csePackageLessonDefinitions', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.csePackageLessonDefinitions.__typename).toEqual(
        'CsePackageLessonDefinitions',
      )
      expect(
        res.data.data.csePackageLessonDefinitions.errorCode,
      ).toBeUndefined()
      expect(res.data.data.csePackageLessonDefinitions.items).toHaveLength(8)
      expect(res.data.data.csePackageLessonDefinitions.items).toEqual([
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_06',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_07',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_08',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_09',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_10',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_11',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: false,
          lessonId: 'lesson-cse-cs-01_12',
        },
        {
          csePackageUnitDefinitionId: 'unit-cse-3',
          isQuizLesson: true,
          lessonId: 'lesson-cse-cs-01_quiz02',
        },
      ])
    })
  })
})
