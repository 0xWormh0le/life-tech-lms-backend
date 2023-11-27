import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { codeillusionPackageLessonDefinitionsMapByCircleId } from '../../../../../src/adapter/typeorm/hardcoded-data/Pacakges/CodeillusionPackageLessonDefinitions'
import { CodeillusionPackageLessonDefinitionUiType } from '../../../../../clients/codex-v2/resolvers-type'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const uiType: Record<string, CodeillusionPackageLessonDefinitionUiType> = {
  gem: CodeillusionPackageLessonDefinitionUiType.Gem,
  book: CodeillusionPackageLessonDefinitionUiType.Book,
  magicQuest: CodeillusionPackageLessonDefinitionUiType.MagicQuest,
  magicJourney: CodeillusionPackageLessonDefinitionUiType.MagicJourney,
}

describe('CodexV2 / CodeillusionPackageCircleDefinition / ConsumerExpectationScenario', () => {
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

    test('get codeillusionPackageCircleDefinitions', async () => {
      const queryData = {
        query: `
          query CodeillusionPackageCircleDefinitionsQuery ($codeillusionPackageChapterDefinitionId: String!) {
            codeillusionPackageCircleDefinitions(codeillusionPackageChapterDefinitionId: $codeillusionPackageChapterDefinitionId) {
              __typename
              ... on CodeillusionPackageCircleDefinitions {
                items {
                  id
                  codeillusionPackageChapterDefinitionId
                  course
                  bookName
                  characterImageUrl
                  clearedCharacterImageUrl
                  bookImageUrl
                  codeillusionPackageLessonDefinitions {
                    items {
                      lessonId
                      codeillusionPackageCircleDefinitionId
                      uiType
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          codeillusionPackageChapterDefinitionId: `chapter-codeillusion-2`,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'codeillusionPackageCircleDefinitions', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)

      expect(
        res.data.data.codeillusionPackageCircleDefinitions.__typename,
      ).toEqual('CodeillusionPackageCircleDefinitions')

      expect(
        res.data.data.codeillusionPackageCircleDefinitions.errorCode,
      ).toBeUndefined()

      expect(
        res.data.data.codeillusionPackageCircleDefinitions.items,
      ).toHaveLength(3)

      expect(res.data.data.codeillusionPackageCircleDefinitions.items).toEqual([
        {
          bookImageUrl: 'http://localhost:3000/images/b_aladdin_book.png',
          bookName: 'Flying Carpet',
          characterImageUrl:
            'http://localhost:3000/images/b_aladdin_character1.png',
          clearedCharacterImageUrl:
            'http://localhost:3000/images/b_aladdin_character1_completed.png',
          codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-2',
          course: 'GAME_DEVELOPMENT',
          id: 'circle-codeillusion-basic-aladdin-game_development',
          codeillusionPackageLessonDefinitions: {
            items: codeillusionPackageLessonDefinitionsMapByCircleId[
              'circle-codeillusion-basic-aladdin-game_development'
            ].map((item) => ({
              ...item,
              uiType: uiType[item.uiType],
            })),
          },
        },
        {
          bookImageUrl: 'http://localhost:3000/images/b_tangled_book.png',
          bookName: 'Sky Lanterns',
          characterImageUrl:
            'http://localhost:3000/images/b_tangled_character1.png',
          clearedCharacterImageUrl:
            'http://localhost:3000/images/b_tangled_character1_completed.png',
          codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-2',
          course: 'MEDIA_ART',
          id: 'circle-codeillusion-basic-tangled-media_art',
          codeillusionPackageLessonDefinitions: {
            items: codeillusionPackageLessonDefinitionsMapByCircleId[
              'circle-codeillusion-basic-tangled-media_art'
            ].map((item) => ({
              ...item,
              uiType: uiType[item.uiType],
            })),
          },
        },
        {
          bookImageUrl: 'http://localhost:3000/images/b_zootopia_book.png',
          bookName: 'Person Finder Site',
          characterImageUrl:
            'http://localhost:3000/images/b_zootopia_character1.png',
          clearedCharacterImageUrl:
            'http://localhost:3000/images/b_zootopia_character1_completed.png',
          codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-2',
          course: 'WEB_DESIGN',
          id: 'circle-codeillusion-basic-zootopia-web_design',
          codeillusionPackageLessonDefinitions: {
            items: codeillusionPackageLessonDefinitionsMapByCircleId[
              'circle-codeillusion-basic-zootopia-web_design'
            ].map((item) => ({
              ...item,
              uiType: uiType[item.uiType],
            })),
          },
        },
      ])
    })
  })
})
