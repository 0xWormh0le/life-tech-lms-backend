import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { Student } from '../../../../../src/domain/entities/codex-v2/Student'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { StudentGroup } from '../../../../../src/domain/entities/codex-v2/StudentGroup'
import { StudentStudentGroupAffiliation } from '../../../../../src/domain/entities/codex-v2/StudentStudentGroupAffiliation'
import {
  CreateStudentInput,
  CreateStudentPayload,
  CreateHumanUserInput,
  CreateHumanUserPayload,
  CreateUserInput,
  CreateUserPayload,
  UpdateHumanUserInput,
  UpdateHumanUserPayload,
  UpdateStudentInput,
  UpdateStudentPayload,
  CreateStudentGroupInput,
  CreateStudentGroupPayload,
  CreateStudentStudentGroupAffiliationInput,
  CreateStudentStudentGroupAffiliationPayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import dayjs from 'dayjs'
import { Paths } from '../../../../../src/adapter/entry-points/_gen/codex-usa-backend-types'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

const nowStr = '2000-01-01T00:00:00Z'

describe('CodexV2 / Student / ConsumerExpectationScenario', () => {
  let testStudent1: Student
  let testStudent2: Student
  type User = {
    id: string
    role: string
  }

  type HumanUser = {
    userId: string
    email: string | null
    loginId: string | null
    password: string | null
  }
  let testUser1: User
  let testUser2: User
  let testHumanUser1: HumanUser
  let testHumanUser2: HumanUser
  let testStudentGroup: StudentGroup
  let testOrganization: Organization

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

  describe('creating student operation for internalOperator', () => {
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

    const nowStr = '2000-01-01T00:00:00Z'

    test(`create user`, async () => {
      const createUser = async (input: CreateUserInput) => {
        const mutationData = {
          query: `
            mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                ... on CreateUserPayload {
                  clientMutationId
                  user {
                    id
                    role
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createUser', CreateUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })
        const user: User = {
          ...res.data.data.createUser.user,
        }
        return user
      }
      testUser1 = await createUser({ role: 'student', isDemo: true })
      testUser2 = await createUser({ role: 'student', isDemo: true })
    })

    test(`create humanUser`, async () => {
      const createHumanUser = async (input: CreateHumanUserInput) => {
        const mutationData = {
          query: `
            mutation CreateHumanUser($input: CreateHumanUserInput!) {
              createHumanUser(input: $input) {
                __typename
                ... on CreateHumanUserPayload {
                  clientMutationId
                  humanUser {
                    userId
                    email
                    loginId
                    password
                  }
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createHumanUser', CreateHumanUserPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })
        const resValue = res.data.data.createHumanUser.humanUser
        const humanUser: HumanUser = {
          ...resValue,
          email: resValue.email ?? null,
          loginId: resValue.loginId ?? null,
          password: resValue.password ?? null,
        }
        return humanUser
      }
      testHumanUser1 = await createHumanUser({
        userId: testUser1.id,
        loginId: 'userLoginId1',
        password: 'password',
      })
      testHumanUser2 = await createHumanUser({
        userId: testUser2.id,
        email: 'test2@example.com',
        password: 'password',
      })
    })

    test('create students', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const create = async (
        userId: string,
        nickName: string,
        externalLmsStudentId: string,
        isDeactivated: boolean,
      ): Promise<Student> => {
        const input: CreateStudentInput = {
          userId,
          nickName,
          externalLmsStudentId,
          isDeactivated,
          clientMutationId: 'client-mutation-id',
        }

        const mutationData = {
          query: `
            mutation CreateStudent($input: CreateStudentInput!) {
              createStudent(input: $input) {
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
                ... on ErrorUnknownRuntime {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<'createStudent', CreateStudentPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.data.data.createStudent.errorCode).toBeUndefined()
        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(res.data.data.createStudent).toMatchObject({
          student: {
            ...fields,
            role: 'student',
          },
          clientMutationId,
        })

        const response = res.data.data.createStudent.student

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
        } as unknown as Student
      }

      testStudent1 = await create(
        testUser1.id,
        'test-nick-name-1',
        'test-external-lms-student-id-1',
        true,
      )
      testStudent2 = await create(
        testUser2.id,
        'test-nick-name-2',
        'test-external-lms-student-id-2',
        true,
      )
    })
  })

  describe('operation on student1', () => {
    test('Login', async () => {
      const token = await loginByApi(testHumanUser1.loginId ?? '', 'password')
      expect(token).toBeDefined()
    })
  })

  describe('operation on student2', () => {
    test('Login', async () => {
      const token = await loginByApi(testHumanUser2.email ?? '', 'password')
      expect(token).toBeDefined()
    })
  })

  describe('updating student operation for internalOperator', () => {
    test('update student', async () => {
      const input: UpdateStudentInput = {
        id: testStudent1.id,
        userId: testUser1.id,
        nickName: 'test-nick-name-1-update',
        externalLmsStudentId: 'test-external-lms-student-id-1-update',
        isDeactivated: false,
        clientMutationId: 'test-mutation-id-updated',
      }

      const mutationData = {
        query: `
          mutation UpdateStudent($input: UpdateStudentInput!) {
            updateStudent(input: $input) {
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
              ... on ErrorUnknownRuntime {
                errorCode
                message
              }
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateStudent', UpdateStudentPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.data.data.updateStudent.errorCode).toBeUndefined()
      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateStudent).toMatchObject({
        student: fields,
        clientMutationId,
      })
    })
  })

  describe('update humanUser and check login', () => {
    const updateHumanUser = async (input: UpdateHumanUserInput) => {
      const mutationData = {
        query: `
          mutation UpdateHumanUser($input: UpdateHumanUserInput!) {
            updateHumanUser(input: $input) {
              ... on UpdateHumanUserPayload {
                clientMutationId
                humanUser {
                  userId
                  email
                  loginId
                  password
                }
              }
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateHumanUser', UpdateHumanUserPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })
      const resValue = res.data.data.updateHumanUser.humanUser
      const humanUser: HumanUser = {
        ...resValue,
        email: resValue.email ?? null,
        loginId: resValue.loginId ?? null,
        password: resValue.password ?? null,
      }
      return humanUser
    }

    test(`update without password and check login by loginId`, async () => {
      await updateHumanUser({
        userId: testUser1.id,
        loginId: 'userLoginId1',
        password: null,
      })

      const token = await loginByApi(testHumanUser1.loginId ?? '', 'password')
      expect(token).toBeDefined()
    })

    test('update without password and check login by email', async () => {
      await updateHumanUser({
        userId: testUser2.id,
        email: 'test2@example.com',
        password: null,
      })

      const token = await loginByApi(testHumanUser2.email ?? '', 'password')
      expect(token).toBeDefined()
    })

    test(`update password and check login by loginId`, async () => {
      await updateHumanUser({
        userId: testUser1.id,
        loginId: 'userLoginId1',
        password: 'password-updated',
      })

      const token = await loginByApi(
        testHumanUser1.loginId ?? '',
        'password-updated',
      )
      expect(token).toBeDefined()
    })

    test('update password and check login by email', async () => {
      await updateHumanUser({
        userId: testUser2.id,
        email: 'test2@example.com',
        password: 'password-updated',
      })

      const token = await loginByApi(
        testHumanUser2.email ?? '',
        'password-updated',
      )

      expect(token).toBeDefined()
    })
  })

  describe('get student for internal operator', () => {
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
            Authorization: `Bearer ${operatorToken}`,
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

      testStudentGroup = await create(
        'name1-1',
        'grade-1',
        testOrganization.id,
        'classlinkTenantId-1',
        'externalLmsStudentGroupId-1',
      )
    })

    test('create studentStudentGroupAffiliation', async () => {
      const create = async (
        studentGroupId: string,
        studentId: string,
      ): Promise<StudentStudentGroupAffiliation> => {
        const input: CreateStudentStudentGroupAffiliationInput = {
          studentGroupId,
          studentId,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
          mutation CreateStudentStudentGroupAffiliation($input: CreateStudentStudentGroupAffiliationInput!) {
            createStudentStudentGroupAffiliation(input: $input) {
              __typename
              ... on CreateStudentStudentGroupAffiliationPayload {
                clientMutationId
                studentStudentGroupAffiliation {
                  id
                  studentId
                  studentGroupId
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
          GraphQLResponse<
            'createStudentStudentGroupAffiliation',
            CreateStudentStudentGroupAffiliationPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(
          res.data.data.createStudentStudentGroupAffiliation.__typename,
        ).toBe('CreateStudentStudentGroupAffiliationPayload')
        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(
          res.data.data.createStudentStudentGroupAffiliation,
        ).toMatchObject({
          studentStudentGroupAffiliation: fields,
          clientMutationId,
        })

        const response =
          res.data.data.createStudentStudentGroupAffiliation
            .studentStudentGroupAffiliation

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
        } as StudentStudentGroupAffiliation
      }

      await create(testStudentGroup.id, testStudent1.id)
      await create(testStudentGroup.id, testStudent2.id)
    })

    test('get students', async () => {
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
              ... on ErrorUnknownRuntime {
                errorCode
                message
              }
            }
          }
        `,
        variables: {
          studentGroupId: testStudentGroup.id,
        },
      }
      const res = await axios.post<GraphQLResponse<'students', { items: [] }>>(
        `/v2/graphql`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        },
      )

      expect(res.status).toEqual(200)
      expect(res.data.data.students.items).toHaveLength(2)
      expect(res.data.data.students.items).toContainEqual({
        ...testStudent1,
        userId: testUser1.id,
        nickName: 'test-nick-name-1-update',
        externalLmsStudentId: 'test-external-lms-student-id-1-update',
        isDeactivated: false,
        createdAt: testStudent1.createdAt.toISOString(),
        humanUser: {
          ...testHumanUser1,
          password: '******',
        },
      })
      expect(res.data.data.students.items).toContainEqual({
        ...testStudent2,
        createdAt: testStudent2.createdAt.toISOString(),
        humanUser: {
          ...testHumanUser2,
          password: '******',
        },
      })
    })
  })

  const loginByApi = async (loginId: string, password: string) => {
    const loginResponse = await axios.post<Paths.PostLogin.Responses.$200>(
      '/login',
      {
        loginId: loginId,
        password: password,
      } as Paths.PostLogin.RequestBody,
    )

    expect(loginResponse.status).toEqual(200)

    if (!loginResponse.data.user) {
      throw new Error('failed to get user from /login')
    }

    const user = loginResponse.data.user
    return user.accessToken
  }
})
