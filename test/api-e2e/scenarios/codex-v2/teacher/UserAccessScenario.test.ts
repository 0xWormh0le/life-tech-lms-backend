import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateTeacherPayload,
  CreateTeacherInput,
  UpdateTeacherPayload,
  UpdateTeacherInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'
import { RdbHumanUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbHumanUserRepository'
import dayjs from 'dayjs'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const nowStr = '2000-01-01T00:00:00Z'

describe('CodexV2 / Teacher / UserAccessScenario', () => {
  const userTokens = {
    internalOperator: '',
    administrator: '',
    teacher1: '',
    teacher2: '',
    student1: '',
    student2: '',
    invalid: 'invalid_token',
    anonymous: null,
  }

  type userTokenKey = keyof typeof userTokens

  let teacherId: string
  let userId: string

  beforeAll(async () => {
    userTokens.internalOperator = await getToken(
      'internal_operator',
      'internal_operator',
    )
    userTokens.administrator = await getToken('administrator', 'administrator')
    userTokens.teacher1 = await getToken('teacher1', 'teacher')
    userTokens.teacher2 = await getToken('teacher2', 'teacher')
    userTokens.student1 = await getToken('student1', 'student')
    userTokens.student2 = await getToken('student2', 'student')
  })

  test('create users', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is undefined.')
    }

    const userRepository = new RdbUserRepository(appDataSource)
    const humanUserRepository = new RdbHumanUserRepository(appDataSource)

    const create = async (id: string) => {
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
        loginId: 'test',
        email: 'test@foo.com',
        hashedPassword: 'test',
        createdAt: dayjs(nowStr).toDate(),
        updatedAt: dayjs(nowStr).toDate(),
      })

      expect(humanUserRes.error).toBe(null)
      expect(humanUserRes.hasError).toBe(false)

      return id
    }

    userId = await create(uuid())
  })

  describe('get teachers', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${true}
      ${'teacher1'}         | ${true}
      ${'teacher2'}         | ${true}
      ${'student1'}         | ${true}
      ${'student2'}         | ${true}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        if (!appDataSource) {
          throw new Error('failed to connect database.')
        }

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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: {},
        }

        const res = await axios.post<
          GraphQLResponse<'teachers', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: createAuthorizationHeaderByUserToken(userToken),
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.teachers.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.teachers.errorCode).toEqual('PERMISSION_DENIED')
        } else {
          expect(res.data.data.teachers.__typename).toEqual('Teachers')
          expect(res.data.data.teachers.items).toBeDefined()
          expect(res.data.data.teachers.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('create teacher', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${true}
      ${'teacher1'}         | ${true}
      ${'teacher2'}         | ${true}
      ${'student1'}         | ${true}
      ${'student2'}         | ${true}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        if (!appDataSource) {
          throw new Error('failed to connect database.')
        }

        const input: CreateTeacherInput = {
          userId,
          firstName: 'test-first-name',
          lastName: 'test-last-name',
          externalLmsTeacherId: 'test-external-lms-teacher-id',
          isDeactivated: false,
        }

        const mutationData = {
          query: `
            mutation CreateTeacher($input: CreateTeacherInput!) {
              createTeacher(input: $input){
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createTeacher', CreateTeacherPayload>
        >(`/v2/graphql`, mutationData, {
          headers: createAuthorizationHeaderByUserToken(userToken),
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createTeacher.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createTeacher.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createTeacher.__typename).toEqual(
            'CreateTeacherPayload',
          )
          expect(res.data.data.createTeacher.teacher).toBeDefined()
          expect(res.data.data.createTeacher.errorCode).toBeUndefined()
          teacherId = res.data.data.createTeacher.teacher.id
        }
      },
    )
  })

  describe('update teacher', () => {
    test.each`
      userToken             | expectUnauthorizedError
      ${'internalOperator'} | ${false}
      ${'administrator'}    | ${true}
      ${'teacher1'}         | ${true}
      ${'teacher2'}         | ${true}
      ${'student1'}         | ${true}
      ${'student2'}         | ${true}
      ${'invalid'}          | ${true}
      ${'anonymous'}        | ${true}
    `(
      'userToken: $userToken, expectUnauthorizedError: $expectUnauthorizedError',
      async ({ userToken, expectUnauthorizedError }) => {
        if (!appDataSource) {
          throw new Error('failed to connect database.')
        }

        const input: UpdateTeacherInput = {
          id: teacherId,
          userId,
          firstName: 'test-first-name-update',
          lastName: 'test-last-name-update',
          externalLmsTeacherId: 'test-external-lms-teacher-id-update',
          isDeactivated: false,
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'updateTeacher', UpdateTeacherPayload>
        >(`/v2/graphql`, mutationData, {
          headers: createAuthorizationHeaderByUserToken(userToken),
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateTeacher.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateTeacher.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateTeacher.__typename).toEqual(
            'UpdateTeacherPayload',
          )
          expect(res.data.data.updateTeacher.teacher).toBeDefined()
          expect(res.data.data.updateTeacher.errorCode).toBeUndefined()
        }
      },
    )
  })

  const createAuthorizationHeaderByUserToken = (
    userToken: unknown,
  ): { Authorization: string } | undefined => {
    const authorizationHeader = userTokens[userToken as userTokenKey]
      ? {
          Authorization: `Bearer ${
            userTokens[userToken as userTokenKey] ?? ''
          }`,
        }
      : undefined

    return authorizationHeader
  }

  const getToken = async (
    loginId: string,
    role: 'internal_operator' | 'administrator' | 'teacher' | 'student',
  ): Promise<string> => {
    if (!appDataSource) {
      throw new Error('failed to connect database.')
    }

    const { token } = await createUserAndGetToken(loginId, role, appDataSource)

    return token
  }
})
