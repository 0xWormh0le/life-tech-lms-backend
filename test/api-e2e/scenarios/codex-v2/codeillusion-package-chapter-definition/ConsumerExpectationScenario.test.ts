import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { codeillusionPackageCircleDefinitionsMapByChapterId } from '../../../../../src/adapter/typeorm/hardcoded-data/Pacakges/CodeillusionPackageCircleDefinitions'
import { LessonCourse } from '../../../../../clients/codex-v2/resolvers-type'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const course: Record<string, LessonCourse> = {
  basic: LessonCourse.Basic,
  gameDevelopment: LessonCourse.GameDevelopment,
  mediaArt: LessonCourse.MediaArt,
  webDesign: LessonCourse.WebDesign,
}

describe('CodexV2 / CodeillusionPackageChapterDefinition / ConsumerExpectationScenario', () => {
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

    test('get codeillusionPackageChapterDefinitions', async () => {
      const queryData = {
        query: `
          {
            codeillusionPackageChapterDefinitions {
              __typename
              ... on CodeillusionPackageChapterDefinitions {
                items {
                  id
                  name
                  title
                  lessonOverViewPdfUrl
                  lessonNoteSheetsZipUrl
                  codeillusionPackageCircleDefinitions {
                    items {
                      id
                      codeillusionPackageChapterDefinitionId
                      course
                      bookName
                      characterImageUrl
                      clearedCharacterImageUrl
                      bookImageUrl
                    }
                  }
                }
              }
            }
          }
        `,
      }

      const res = await axios.post<
        GraphQLResponse<
          'codeillusionPackageChapterDefinitions',
          { items: object[] }
        >
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)

      expect(
        res.data.data.codeillusionPackageChapterDefinitions.__typename,
      ).toEqual('CodeillusionPackageChapterDefinitions')

      expect(
        res.data.data.codeillusionPackageChapterDefinitions.errorCode,
      ).toBeUndefined()

      expect(
        res.data.data.codeillusionPackageChapterDefinitions.items,
      ).toHaveLength(11)

      expect(
        res.data.data.codeillusionPackageChapterDefinitions.items[1],
      ).toEqual({
        id: 'chapter-codeillusion-2',
        lessonNoteSheetsZipUrl:
          'http://localhost:3000/teacher-resources/chapter-codeillusion-2-lesson-note-sheets.zip',
        lessonOverViewPdfUrl:
          'http://localhost:3000/teacher-resources/chapter-codeillusion-2-lesson-overview.pdf',
        name: 'Chapter 2',
        title: 'When You Wish Upon a Magic Festival',
        codeillusionPackageCircleDefinitions: {
          items: codeillusionPackageCircleDefinitionsMapByChapterId(
            'http://localhost:3000',
          )['chapter-codeillusion-2'].map((item) => ({
            ...item,
            course: course[item.course],
          })),
        },
      })

      expect(
        res.data.data.codeillusionPackageChapterDefinitions.items[10],
      ).toEqual({
        id: 'chapter-codeillusion-11',
        lessonNoteSheetsZipUrl: '',
        lessonOverViewPdfUrl: '',
        name: 'Chapter 11',
        title: '',
        codeillusionPackageCircleDefinitions: {
          items: codeillusionPackageCircleDefinitionsMapByChapterId(
            'http://localhost:3000',
          )['chapter-codeillusion-11'].map((item) => ({
            ...item,
            course: course[item.course],
          })),
        },
      })
    })
  })
})
