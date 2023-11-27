import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { UserLessonHintStatus } from '../../../../../src/domain/entities/codex-v2/UserLessonHintStatus'
import { RdbUserLessonHintStatusRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserLessonHintStatusRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / UserLessonHintStatus / ConsumerExpectationScenario', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  let testUserLessonHintStatus1: UserLessonHintStatus
  let testUserLessonHintStatus2: UserLessonHintStatus

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

    test('create user lesson hint statuses', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }

      const rdbUserLessonHintStatusRepository =
        new RdbUserLessonHintStatusRepository(appDataSource)

      testUserLessonHintStatus1 = {
        id: uuid(),
        userId: uuid(),
        lessonHintId: 'test-lessonHintId1',
        userLessonStatusId: 'test-userLessonStatusId1',
        createdAt: new Date(nowStr),
      }
      testUserLessonHintStatus2 = {
        id: uuid(),
        userId: uuid(),
        lessonHintId: 'test-lessonHintId2',
        userLessonStatusId: 'test-userLessonStatusId2',
        createdAt: new Date(nowStr),
      }

      await rdbUserLessonHintStatusRepository.create(testUserLessonHintStatus1)
      await rdbUserLessonHintStatusRepository.create(testUserLessonHintStatus2)
    })

    test('get user lesson hint statuses', async () => {
      const queryData = {
        query: `
          {
            userLessonHintStatuses {
              __typename
              ... on UserLessonHintStatuses {
                items {
                  id
                  userId
                  lessonHintId
                  userLessonStatusId
                  createdAt
                }
              }
            }
          }
        `,
      }

      const res = await axios.post<
        GraphQLResponse<'userLessonHintStatuses', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.userLessonHintStatuses.__typename).toEqual(
        'UserLessonHintStatuses',
      )
      expect(res.data.data.userLessonHintStatuses.errorCode).toBeUndefined()
      expect(res.data.data.userLessonHintStatuses.items).toHaveLength(2)
      expect(res.data.data.userLessonHintStatuses.items).toContainEqual({
        ...testUserLessonHintStatus1,
        createdAt: testUserLessonHintStatus1.createdAt.toISOString(),
      })
      expect(res.data.data.userLessonHintStatuses.items).toContainEqual({
        ...testUserLessonHintStatus2,
        createdAt: testUserLessonHintStatus2.createdAt.toISOString(),
      })
    })
  })
})
