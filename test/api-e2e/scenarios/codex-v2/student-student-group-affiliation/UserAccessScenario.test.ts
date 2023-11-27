import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateStudentStudentGroupAffiliationPayload,
  CreateStudentStudentGroupAffiliationInput,
  DeleteStudentStudentGroupAffiliationPayload,
  DeleteStudentStudentGroupAffiliationInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbStudentRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbStudentRepository'
import { RdbStudentGroupRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbStudentGroupRepository'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { Student } from '../../../../../src/domain/entities/codex-v2/Student'
import { StudentGroup } from '../../../../../src/domain/entities/codex-v2/StudentGroup'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / StudentStudentGroupAffiliation / UserAccessScenario', () => {
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

  const nowStr = '2000-01-01T00:00:00Z'

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

  let testStudent: Student
  let testStudentGroup: StudentGroup
  let affiliationId: string

  test('create data', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is undefined.')
    }

    const organizationRepository = new RdbOrganizationRepository(appDataSource)
    const studentGroupRepository = new RdbStudentGroupRepository(appDataSource)
    const studentRepository = new RdbStudentRepository(appDataSource)

    const createOrganization = async () => {
      const id = uuid()
      const organization: Organization = {
        id,
        name: `name-${id}`,
        districtId: `districtId-${id}`,
        externalLmsOrganizationId: null,
        classlinkTenantId: null,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await organizationRepository.create(organization)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()

      return organization
    }

    const createStudentGroup = async (organiationId: string) => {
      const id = uuid()
      const studentGroup: StudentGroup = {
        id,
        name: `name-${id}`,
        grade: `grade-${id}`,
        externalLmsStudentGroupId: `externalLmsStudentGroupId-${id}`,
        createdUserId: `createdUserId-${id}`,
        updatedUserId: `updatedUserId-${id}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
        organizationId: organiationId,
        classlinkTenantId: `classlinkTenantId-${id}`,
      }

      const res = await studentGroupRepository.create(studentGroup)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()

      return studentGroup
    }

    const createStudent = async () => {
      const id = uuid()
      const student: Student = {
        id,
        userId: `userId-${id}`,
        role: 'student',
        nickName: `nickName-${id}`,
        classlinkTenantId: `classlinkTenantId-${id}`,
        externalLmsStudentId: `externalLmsStudentId-${id}`,
        isDeactivated: false,
        createdUserId: `createdUserId-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await studentRepository.create(student)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()

      return student
    }
    const organization = await createOrganization()

    testStudentGroup = await createStudentGroup(organization.id)
    testStudent = await createStudent()
  })

  describe('get student student group affiliations', () => {
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
            query ($studentGroupId: String!) {
              studentStudentGroupAffiliations(studentGroupId: $studentGroupId) {
                __typename
                ... on StudentStudentGroupAffiliations {
                  items {
                    id
                    studentId
                    studentGroupId
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
            studentGroupId: testStudentGroup.id,
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'studentStudentGroupAffiliations', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.studentStudentGroupAffiliations.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.studentStudentGroupAffiliations.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.studentStudentGroupAffiliations.__typename,
          ).toEqual('StudentStudentGroupAffiliations')
          expect(
            res.data.data.studentStudentGroupAffiliations.items,
          ).toBeDefined()
          expect(
            res.data.data.studentStudentGroupAffiliations.errorCode,
          ).toBeUndefined()
        }
      },
    )
  })

  describe('create student student group affiliation', () => {
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
        const input: CreateStudentStudentGroupAffiliationInput = {
          studentId: testStudent.id,
          studentGroupId: testStudentGroup.id,
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
          GraphQLResponse<
            'createStudentStudentGroupAffiliation',
            CreateStudentStudentGroupAffiliationPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.createStudentStudentGroupAffiliation.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.createStudentStudentGroupAffiliation.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.createStudentStudentGroupAffiliation.__typename,
          ).toEqual('CreateStudentStudentGroupAffiliationPayload')
          expect(
            res.data.data.createStudentStudentGroupAffiliation
              .studentStudentGroupAffiliation,
          ).toBeDefined()
          expect(
            res.data.data.createStudentStudentGroupAffiliation.errorCode,
          ).toBeUndefined()
          affiliationId =
            res.data.data.createStudentStudentGroupAffiliation
              .studentStudentGroupAffiliation.id
        }
      },
    )
  })

  describe('delete student student group affiliation', () => {
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
        const input: DeleteStudentStudentGroupAffiliationInput = {
          id: affiliationId,
          clientMutationId: 'testMutationId',
        }
        const mutationData = {
          query: `
            mutation DeleteStudentStudentGroupAffiliation($input: DeleteStudentStudentGroupAffiliationInput!) {
              deleteStudentStudentGroupAffiliation(input: $input) {
                __typename
                ... on DeleteStudentStudentGroupAffiliationPayload {
                  clientMutationId
                  id
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
          GraphQLResponse<
            'deleteStudentStudentGroupAffiliation',
            DeleteStudentStudentGroupAffiliationPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.deleteStudentStudentGroupAffiliation.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.deleteStudentStudentGroupAffiliation.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.deleteStudentStudentGroupAffiliation.__typename,
          ).toEqual('DeleteStudentStudentGroupAffiliationPayload')
          expect(
            res.data.data.deleteStudentStudentGroupAffiliation.id,
          ).toBeDefined()
          expect(
            res.data.data.deleteStudentStudentGroupAffiliation.errorCode,
          ).toBeUndefined()
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
