import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { UserLessonStepStatus } from '../../../../../src/domain/entities/codex-v2/UserLessonStepStatus'
import { RdbUserLessonStepStatusRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserLessonStepStatusRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / UserLessonStepStatus / ConsumerExpectationScenario', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  let testUserLessonStepStatus1: UserLessonStepStatus
  let testUserLessonStepStatus2: UserLessonStepStatus
  let testUserLessonStepStatus3: UserLessonStepStatus

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

    test('create user lesson step status', async () => {
      if (!appDataSource) {
        throw new Error('failed to connect database.')
      }

      const rdbUserLessonStepStatusRepository =
        new RdbUserLessonStepStatusRepository(appDataSource)

      const create = async (id: string) => {
        const lesson: UserLessonStepStatus = {
          id,
          userId: uuid(),
          stepId: `test-stepId-${id}`,
          userLessonStatusId: `test-userLessonStatusId-${id}`,
          lessonId: `test-lessonId-${id}`,
          status: 'not_cleared',
          createdAt: new Date(nowStr),
        }

        await rdbUserLessonStepStatusRepository.create(lesson)

        return lesson
      }

      testUserLessonStepStatus1 = await create(uuid())
      testUserLessonStepStatus2 = await create(uuid())
      testUserLessonStepStatus3 = await create(uuid())
    })

    test('get user lesson step status', async () => {
      const queryData = {
        query: `
          query UserLessonStepStatusesQuery($userIds: [String!]!) {
            userLessonStepStatuses(userIds: $userIds) {
              __typename
              ... on UserLessonStepStatuses {
                items {
                  id
                  userId
                  stepId
                  userLessonStatusId
                  lessonId
                  status
                  createdAt
                }
              }
            }
          }
        `,
        variables: {
          userIds: [
            testUserLessonStepStatus1.userId,
            testUserLessonStepStatus2.userId,
          ],
        },
      }

      const res = await axios.post<
        GraphQLResponse<'userLessonStepStatuses', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.userLessonStepStatuses.__typename).toEqual(
        'UserLessonStepStatuses',
      )
      expect(res.data.data.userLessonStepStatuses.errorCode).toBeUndefined()
      expect(res.data.data.userLessonStepStatuses.items).toHaveLength(2)
      expect(res.data.data.userLessonStepStatuses.items).toContainEqual({
        ...testUserLessonStepStatus1,
        createdAt: testUserLessonStepStatus1.createdAt.toISOString(),
      })
      expect(res.data.data.userLessonStepStatuses.items).toContainEqual({
        ...testUserLessonStepStatus2,
        createdAt: testUserLessonStepStatus2.createdAt.toISOString(),
      })
      expect(res.data.data.userLessonStepStatuses.items).not.toContainEqual({
        ...testUserLessonStepStatus3,
        createdAt: testUserLessonStepStatus3.createdAt.toISOString(),
      })
    })
  })
})
