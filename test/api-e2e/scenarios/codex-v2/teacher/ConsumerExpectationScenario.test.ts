import axios from 'axios'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'

import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { Teacher } from '../../../../../src/domain/entities/codex-v2/Teacher'
import {
  CreateTeacherPayload,
  CreateTeacherInput,
  UpdateTeacherPayload,
  UpdateTeacherInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'
import { RdbHumanUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbHumanUserRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const nowStr = '2000-01-01T00:00:00Z'

describe('CodexV2 / Teacher / ConsumerExpectationScenario', () => {
  let testTeacher1: Teacher
  let testTeacher2: Teacher
  let userId1: string
  let userId2: string
  let userId3: string

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

    test('create users', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const userRepository = new RdbUserRepository(appDataSource)
      const humanUserRepository = new RdbHumanUserRepository(appDataSource)

      const create = async (id: string, loginId: string, email: string) => {
        const userRes = await userRepository.create({
          id,
          role: 'student',
          isDemo: true,
          createdAt: dayjs(nowStr).toDate(),
          updatedAt: dayjs(nowStr).toDate(),
        })

        expect(userRes.error).toBe(null)
        expect(userRes.hasError).toBe(false)

        const humanUserRes = await humanUserRepository.create({
          userId: id,
          loginId,
          email,
          hashedPassword: 'test',
          createdAt: dayjs(nowStr).toDate(),
          updatedAt: dayjs(nowStr).toDate(),
        })

        expect(humanUserRes.error).toBe(null)
        expect(humanUserRes.hasError).toBe(false)

        return id
      }

      userId1 = await create(uuid(), 'test1', 'test1@foo.com')
      userId2 = await create(uuid(), 'test2', 'test2@foo.com')
      userId3 = await create(uuid(), 'test3', 'test3@foo.com')
    })

    test('create teachers', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const create = async (
        userId: string,
        firstName: string,
        lastName: string,
        externalLmsTeacherId: string,
        isDeactivated: boolean,
      ): Promise<Teacher> => {
        const input: CreateTeacherInput = {
          userId,
          firstName,
          lastName,
          externalLmsTeacherId,
          isDeactivated,
          clientMutationId: 'testMutationId',
        }

        const mutationData = {
          query: `
            mutation CreateTeacher($input: CreateTeacherInput!) {
              createTeacher(input: $input) {
                __typename
                ... on CreateTeacherPayload {
                  clientMutationId
                  teacher {
                    id
                    userId
                    role
                    firstName
                    lastName
                    externalLmsTeacherId
                    isDeactivated
                    createdUserId
                    createdAt
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createTeacher', CreateTeacherPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.data.data.createTeacher.__typename).toBe(
          'CreateTeacherPayload',
        )
        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createTeacher).toMatchObject({
          teacher: {
            ...fields,
            role: 'teacher',
          },
          clientMutationId,
        })

        const response = res.data.data.createTeacher.teacher

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
        } as Teacher
      }

      testTeacher1 = await create(
        userId1,
        'first-name-1',
        'last-name-1',
        'external-lms-teacher-id-1',
        false,
      )

      testTeacher2 = await create(
        userId2,
        'first-name-2',
        'last-name-2',
        'external-lms-teacher-id-2',
        false,
      )
    })

    test('update teacher', async () => {
      const input: UpdateTeacherInput = {
        id: testTeacher1.id,
        userId: userId3,
        firstName: 'first-name-1-updated',
        lastName: 'last-name-1-updated',
        externalLmsTeacherId: 'external-lms-teacher-id-1-updated',
        isDeactivated: true,
        clientMutationId: 'testMutationId-updated',
      }

      const mutationData = {
        query: `
          mutation UpdateTeacher($input: UpdateTeacherInput!) {
            updateTeacher(input: $input) {
              __typename
              ... on UpdateTeacherPayload {
                clientMutationId
                teacher {
                  id
                  userId
                  role
                  firstName
                  lastName
                  externalLmsTeacherId
                  isDeactivated
                  createdUserId
                  createdAt
                }
              }
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateTeacher', UpdateTeacherPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.data.data.updateTeacher.__typename).toBe(
        'UpdateTeacherPayload',
      )
      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateTeacher).toMatchObject({
        teacher: fields,
        clientMutationId,
      })
    })

    test('get teachers', async () => {
      const queryData = {
        query: `
      {
        teachers {
          __typename
          ... on Teachers {
            items {
              id
              userId
              role
              firstName
              lastName
              externalLmsTeacherId
              isDeactivated
              createdUserId
              createdAt
            }
          }
        }
      }
      `,
        variables: {},
      }

      const res = await axios.post<GraphQLResponse<'teachers', { items: [] }>>(
        `/v2/graphql`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        },
      )

      expect(res.status).toEqual(200)
      expect(res.data.data.teachers.items).toHaveLength(2)
      expect(res.data.data.teachers.items).toContainEqual({
        ...testTeacher1,
        userId: userId3,
        firstName: 'first-name-1-updated',
        lastName: 'last-name-1-updated',
        externalLmsTeacherId: 'external-lms-teacher-id-1-updated',
        isDeactivated: true,
        createdAt: testTeacher1.createdAt.toISOString(),
      })
      expect(res.data.data.teachers.items).toContainEqual({
        ...testTeacher2,
        createdAt: testTeacher2.createdAt.toISOString(),
      })
    })
  })
})
