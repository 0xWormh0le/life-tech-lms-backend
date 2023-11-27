import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { LessonQuiz } from '../../../../../src/domain/entities/codex-v2/LessonQuiz'
import { RdbLessonQuizRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbLessonQuizRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / LessonQuiz / ConsumerExpectationScenario', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  let testLessonQuiz1: LessonQuiz
  let testLessonQuiz2: LessonQuiz

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

    test('create lesson steps', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }

      const rdbLessonQuizRepository = new RdbLessonQuizRepository(appDataSource)

      testLessonQuiz1 = {
        id: uuid(),
        lessonStepId: 'test-lessonStepId1',
        label: 'test-label1',
        description: 'test-desc1',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }
      testLessonQuiz2 = {
        id: uuid(),
        lessonStepId: 'test-lessonStepId2',
        label: 'test-label2',
        description: 'test-desc2',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      await rdbLessonQuizRepository.create(testLessonQuiz1)
      await rdbLessonQuizRepository.create(testLessonQuiz2)
    })

    test('get lesson quizzes', async () => {
      const queryData = {
        query: `
          {
            lessonQuizzes {
              __typename
              ... on LessonQuizzes {
                items {
                  id
                  lessonStepId
                  label
                  description
                  createdAt
                  updatedAt
                }
              }
            }
          }
        `,
      }

      const res = await axios.post<
        GraphQLResponse<'lessonQuizzes', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.lessonQuizzes.__typename).toEqual('LessonQuizzes')
      expect(res.data.data.lessonQuizzes.errorCode).toBeUndefined()
      expect(res.data.data.lessonQuizzes.items).toHaveLength(2)
      expect(res.data.data.lessonQuizzes.items).toContainEqual({
        ...testLessonQuiz1,
        createdAt: testLessonQuiz1.createdAt.toISOString(),
        updatedAt: testLessonQuiz1.updatedAt.toISOString(),
      })
      expect(res.data.data.lessonQuizzes.items).toContainEqual({
        ...testLessonQuiz2,
        createdAt: testLessonQuiz2.createdAt.toISOString(),
        updatedAt: testLessonQuiz2.updatedAt.toISOString(),
      })
    })
  })
})
