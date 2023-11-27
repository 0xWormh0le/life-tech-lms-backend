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

describe('CodexV2 / Lesson / ConsumerExpectationScenario', () => {
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

    test('get lessons', async () => {
      const queryData = {
        query: `
          {
            lessons {
              __typename
              ... on Lessons {
                items {
                  id
                  url
                  name
                  course
                  lessonEnvironment
                  description
                  lessonDuration
                  thumbnailImageUrl
                  projectName
                  scenarioName
                  maxStarCount
                  quizCount
                  hintCount
                  level
                }
              }
            }
          }
        `,
      }

      const res = await axios.post<
        GraphQLResponse<'lessons', { items: object[] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.lessons.__typename).toEqual('Lessons')
      expect(res.data.data.lessons.errorCode).toBeUndefined()
      expect(res.data.data.lessons.items).toHaveLength(324)
      expect(res.data.data.lessons.items[1]).toEqual({
        course: 'basic',
        description:
          'Learn dragging and dropping, two basic functions of controlling a mouse.',
        hintCount: 0,
        id: 'lesson-codeillusion-basic-principal-gem-2',
        lessonDuration: '3-5min',
        lessonEnvironment: 'litLessonPlayer',
        level: 'basic',
        maxStarCount: 3,
        name: 'Drag and Drop Magic',
        projectName: 'principal',
        quizCount: 0,
        scenarioName: 'g_principal_2',
        thumbnailImageUrl: 'http://localhost:3000/images/g_principal_2.gif',
        url: 'http://localhost:3200/player/step?project_name=principal&scenario_path=lesson/g_principal_2',
      })
      expect(res.data.data.lessons.items[300]).toEqual({
        course: '',
        description:
          'Learns the factors that determine computer system performance. Topic includes CPU, bits, number of processors or cores, and clock frequency.',
        hintCount: 0,
        id: 'lesson-cse-cs-01_18',
        lessonDuration: '20 min',
        lessonEnvironment: 'litLessonPlayer',
        level: 'basic',
        maxStarCount: 0,
        name: 'Computer Performance',
        projectName: 'information1',
        quizCount: 6,
        scenarioName: '01_18',
        thumbnailImageUrl: '',
        url: 'http://localhost:3200/player/step?project_name=information1&scenario_path=lesson/01_18',
      })
    })
  })
})
