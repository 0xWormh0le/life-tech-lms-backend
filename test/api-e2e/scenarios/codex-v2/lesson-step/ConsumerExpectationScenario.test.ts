import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { LessonStep } from '../../../../../src/domain/entities/codex-v2/LessonStep'
import { RdbLessonStepRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbLessonStepRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / LessonStep / ConsumerExpectationScenario', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  let testLessonStep1: LessonStep
  let testLessonStep2: LessonStep

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

      const rdbLessonStepRepository = new RdbLessonStepRepository(appDataSource)

      testLessonStep1 = {
        id: uuid(),
        lessonId: 'test-lessonId1',
        orderIndex: 0,
        externalLessonPlayerStepId: 'test-externalLessonPlayerStepId1',
        createdAt: new Date(nowStr),
      }
      testLessonStep2 = {
        id: uuid(),
        lessonId: 'test-lessonId2',
        orderIndex: 0,
        externalLessonPlayerStepId: 'test-externalLessonPlayerStepId2',
        createdAt: new Date(nowStr),
      }

      await rdbLessonStepRepository.create(testLessonStep1)
      await rdbLessonStepRepository.create(testLessonStep2)
    })

    test('get lesson steps', async () => {
      const queryData = {
        query: `
          query LessonStepsQuery($lessonId: String!) {
            lessonSteps(lessonId: $lessonId) {
              __typename
              ... on LessonSteps {
                items {
                  id
                  lessonId
                  orderIndex
                  externalLessonPlayerStepId
                  createdAt
                }
              }
              ... on ErrorUnknownRuntime {
                errorCode
                message
              }
            }
          }
        `,
        variables: {
          lessonId: testLessonStep1.lessonId,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'lessonSteps', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.lessonSteps.__typename).toEqual('LessonSteps')
      expect(res.data.data.lessonSteps.errorCode).toBeUndefined()
      expect(res.data.data.lessonSteps.items).toHaveLength(1)
      expect(res.data.data.lessonSteps.items).toContainEqual({
        ...testLessonStep1,
        createdAt: testLessonStep1.createdAt.toISOString(),
      })
    })
  })
})
