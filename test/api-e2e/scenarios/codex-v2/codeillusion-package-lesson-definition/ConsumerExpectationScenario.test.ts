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

describe('CodexV2 / CodeillusionPackageLessonDefinition / ConsumerExpectationScenario', () => {
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

    test('get codeillusionPackageLessonDefinitions', async () => {
      const queryData = {
        query: `
          query CodeillusionPackageLessonDefinitionsQuery ($codeillusionPackageCircleDefinitionId: String!) {
            codeillusionPackageLessonDefinitions(codeillusionPackageCircleDefinitionId: $codeillusionPackageCircleDefinitionId) {
              __typename
              ... on CodeillusionPackageLessonDefinitions {
                items {
                  lessonId
                  codeillusionPackageCircleDefinitionId
                  uiType
                }
              }
            }
          }
        `,
        variables: {
          codeillusionPackageCircleDefinitionId: `circle-codeillusion-basic-tangled-media_art`,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'codeillusionPackageLessonDefinitions', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(
        res.data.data.codeillusionPackageLessonDefinitions.__typename,
      ).toEqual('CodeillusionPackageLessonDefinitions')
      expect(
        res.data.data.codeillusionPackageLessonDefinitions.errorCode,
      ).toBeUndefined()
      expect(
        res.data.data.codeillusionPackageLessonDefinitions.items,
      ).toHaveLength(8)
      expect(res.data.data.codeillusionPackageLessonDefinitions.items).toEqual([
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId: 'lesson-codeillusion-basic-tangled-gem-1',
          uiType: 'GEM',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId: 'lesson-codeillusion-basic-tangled-gem-2',
          uiType: 'GEM',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId:
            'lesson-codeillusion-basic-magic_quest-randomization_magic-adventurous',
          uiType: 'MAGIC_QUEST',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId:
            'lesson-codeillusion-basic-magic_quest-randomization_magic-heroic',
          uiType: 'MAGIC_QUEST',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId: 'lesson-codeillusion-basic-tangled-gem-3',
          uiType: 'GEM',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId: 'lesson-codeillusion-basic-aladdin-gem-2',
          uiType: 'GEM',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId: 'lesson-codeillusion-basic-tangled-gem-4',
          uiType: 'GEM',
        },
        {
          codeillusionPackageCircleDefinitionId:
            'circle-codeillusion-basic-tangled-media_art',
          lessonId: 'lesson-codeillusion-basic-tangled-book-1',
          uiType: 'BOOK',
        },
      ])
    })
  })
})
