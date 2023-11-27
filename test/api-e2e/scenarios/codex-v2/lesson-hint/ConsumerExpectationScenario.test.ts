import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { LessonHint } from '../../../../../src/domain/entities/codex-v2/LessonHint'
import { RdbLessonHintRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbLessonHintRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / LessonHint / ConsumerExpectationScenario', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  let testLessonHint1: LessonHint
  let testLessonHint2: LessonHint

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

    test('create lesson hints', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }

      const rdbLessonHintRepository = new RdbLessonHintRepository(appDataSource)

      testLessonHint1 = {
        id: uuid(),
        lessonStepId: 'test-lessonStepId1',
        label: 'test-label1',
        description: 'test-desc1',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }
      testLessonHint2 = {
        id: uuid(),
        lessonStepId: 'test-lessonStepId2',
        label: 'test-label2',
        description: 'test-desc2',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      await rdbLessonHintRepository.create(testLessonHint1)
      await rdbLessonHintRepository.create(testLessonHint2)
    })

    test('get lesson quizzes', async () => {
      const queryData = {
        query: `
          {
            lessonHints {
              __typename
              ... on LessonHints {
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
        GraphQLResponse<'lessonHints', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.lessonHints.__typename).toEqual('LessonHints')
      expect(res.data.data.lessonHints.errorCode).toBeUndefined()
      expect(res.data.data.lessonHints.items).toHaveLength(2)
      expect(res.data.data.lessonHints.items).toContainEqual({
        ...testLessonHint1,
        createdAt: testLessonHint1.createdAt.toISOString(),
        updatedAt: testLessonHint1.updatedAt.toISOString(),
      })
      expect(res.data.data.lessonHints.items).toContainEqual({
        ...testLessonHint2,
        createdAt: testLessonHint2.createdAt.toISOString(),
        updatedAt: testLessonHint2.updatedAt.toISOString(),
      })
    })
  })
})
