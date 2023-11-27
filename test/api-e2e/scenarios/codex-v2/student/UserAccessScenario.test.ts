import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateStudentGroupInput,
  CreateStudentGroupPayload,
  CreateStudentInput,
  CreateStudentPayload,
  UpdateStudentInput,
  UpdateStudentPayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import { v4 as uuid } from 'uuid'
import { StudentGroup } from '../../../../../src/domain/entities/codex-v2/StudentGroup'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import dayjs from 'dayjs'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { RdbUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbUserRepository'
import { RdbHumanUserRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbHumanUserRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / Student / UserAccessScenario', () => {
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

  const nowStr = '2000-01-01T00:00:00Z'
  let testStudentGroup1: StudentGroup
  let testOrganization: Organization

  let studentId: string
  let userId: string

  describe('create studentGroup', () => {
    test('create organization', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const organizationRepository = new RdbOrganizationRepository(
        appDataSource,
      )

      const createOrganization = async () => {
        const id = uuid()

        const organization: Organization = {
          id,
          name: `name-${id}`,
          districtId: `districtId-${id}`,
          externalLmsOrganizationId: `externalLmsOrganizationId-${id}`,
          classlinkTenantId: `classlinkTenantId-${id}`,
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        }

        const res = await organizationRepository.create(organization)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        return organization
      }

      testOrganization = await createOrganization()
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

    test('create student groups', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const create = async (
        name: string,
        grade: string,
        organizationId: string,
        classlinkTenantId: string,
        externalLmsStudentGroupId: string,
      ): Promise<StudentGroup> => {
        const input: CreateStudentGroupInput = {
          name,
          grade,
          organizationId,
          classlinkTenantId,
          externalLmsStudentGroupId,
          clientMutationId: 'client-mutation-id',
        }

        const mutationData = {
          query: `
            mutation CreateStudentGroup($input: CreateStudentGroupInput!) {
              createStudentGroup(input: $input) {
                __typename
                ... on CreateStudentGroupPayload {
                  clientMutationId
                  studentGroup {
                    id
                    name
                    grade
                    organizationId
                    classlinkTenantId
                    externalLmsStudentGroupId
                    createdUserId
                    updatedUserId
                    createdAt
                    updatedAt
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createStudentGroup', CreateStudentGroupPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${userTokens.internalOperator}`,
          },
        })

        expect(res.data.data.createStudentGroup.__typename).toBe(
          'CreateStudentGroupPayload',
        )
        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createStudentGroup).toMatchObject({
          studentGroup: fields,
          clientMutationId,
        })

        const response = res.data.data.createStudentGroup.studentGroup

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
          updatedAt: dayjs(response.updatedAt).toDate(),
        } as StudentGroup
      }

      testStudentGroup1 = await create(
        'name1-1',
        'grade-1',
        testOrganization.id,
        'classlinkTenantId-1',
        'externalLmsStudentGroupId-1',
      )
    })
  })

  describe('get student', () => {
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
        const queryData = {
          query: `
          query StudentsQuery($studentGroupId: String!) {
            students(studentGroupId: $studentGroupId) {
              __typename
              ... on Students {
                items {
                  id
                  userId
                  humanUser {
                    userId
                    loginId
                    email
                    password
                  }
                  role
                  nickName
                  externalLmsStudentId
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
          variables: {
            studentGroupId: testStudentGroup1.id,
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'students', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.students.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.students.errorCode).toEqual('PERMISSION_DENIED')
        } else {
          expect(res.data.data.students.__typename).toEqual('Students')
          expect(res.data.data.students.items).toBeDefined()
          expect(res.data.data.students.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('create student', () => {
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
        const input: CreateStudentInput = {
          userId,
          nickName: 'test-nick-name',
          externalLmsStudentId: 'test-lms-student-id',
          isDeactivated: true,
        }

        const mutationData = {
          query: `
            mutation CreateStudent($input: CreateStudentInput!) {
              createStudent(input: $input) {
                __typename
                ... on CreateStudentPayload {
                  clientMutationId
                  student {
                    id
                    userId
                    role
                    nickName
                    externalLmsStudentId
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

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'createStudent', CreateStudentPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createStudent.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createStudent.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createStudent.__typename).toEqual(
            'CreateStudentPayload',
          )
          expect(res.data.data.createStudent.student).toBeDefined()
          expect(res.data.data.createStudent.errorCode).toBeUndefined()
          studentId = res.data.data.createStudent.student.id
        }
      },
    )
  })

  describe('update student', () => {
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
        const input: UpdateStudentInput = {
          id: studentId,
          userId,
          nickName: 'test-nick-name-update',
          externalLmsStudentId: 'test-lms-student-id-update',
          isDeactivated: false,
        }
        const mutationData = {
          query: `
            mutation UpdateStudent($input: UpdateStudentInput!) {
              updateStudent(input: $input) {
                __typename
                ... on UpdateStudentPayload {
                  clientMutationId
                  student {
                    id
                    userId
                    role
                    nickName
                    externalLmsStudentId
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

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'updateStudent', UpdateStudentPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateStudent.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateStudent.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateStudent.__typename).toEqual(
            'UpdateStudentPayload',
          )
          expect(res.data.data.updateStudent.student).toBeDefined()
          expect(res.data.data.updateStudent.errorCode).toBeUndefined()
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
