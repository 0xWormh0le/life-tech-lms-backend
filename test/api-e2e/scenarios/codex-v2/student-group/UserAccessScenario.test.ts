import axios from 'axios'
import {
  appDataSource,
  createAllTestTargetData,
  createUserAndGetToken,
  GraphQlUser,
  setupEnvironment,
  teardownEnvironment,
  TestTargetData,
  TestTargetUsers,
} from '../../../utilities'
import {
  CreateStudentGroupPayload,
  CreateStudentGroupInput,
  UpdateStudentGroupPayload,
  UpdateStudentGroupInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / StudentGroup / UserAccessScenario', () => {
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
  let u: TestTargetData

  type userTokenKey = keyof typeof userTokens

  let studentGroupId: string
  let testOrganization: Organization
  const nowStr = '2000-01-01T00:00:00Z'

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
    u = await createAllTestTargetData()
  })

  test('create organization', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is undefined.')
    }

    const organizationRepository = new RdbOrganizationRepository(appDataSource)

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

  describe('get student groups', () => {
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
            {
              studentGroups {
                __typename
                ... on StudentGroups {
                  items {
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
          variables: {},
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'studentGroups', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.studentGroups.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.studentGroups.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.studentGroups.__typename).toEqual(
            'StudentGroups',
          )
          expect(res.data.data.studentGroups.items).toBeDefined()
          expect(res.data.data.studentGroups.errorCode).toBeUndefined()
        }
      },
    )
  })

  describe('get student groups by organizationId', () => {
    describe(`
        userName                                             | expectUnauthorizedError
    `, () => {
      test.each`
        userName                                         | expectUnauthorizedError
        ${'anonymous'}                                   | ${true}
        ${'invalid'}                                     | ${true}
        ${'district0Organization0StudentGroup0Student0'} | ${false}
        ${'district0Organization0StudentGroup0Student1'} | ${false}
        ${'district0Organization0StudentGroup1Student1'} | ${false}
        ${'district0Organization1StudentGroup1Student1'} | ${false}
        ${'district1Organization1StudentGroup1Student1'} | ${true}
        ${'district0Organization0Teacher0'}              | ${false}
        ${'district0Organization0Teacher1'}              | ${false}
        ${'district0Organization1Teacher1'}              | ${false}
        ${'district1Organization1Teacher1'}              | ${true}
        ${'district0Administrator0'}                     | ${false}
        ${'district0Administrator1'}                     | ${false}
        ${'district1Administrator1'}                     | ${true}
        ${'internalOperator0'}                           | ${false}
        ${'internalOperator1'}                           | ${false}
      `(
        `
        $userName                                             $expectUnauthorizedError
    `,
        async ({
          userName,
          expectUnauthorizedError,
        }: {
          userName: keyof TestTargetUsers
          expectUnauthorizedError: boolean
        }) => {
          const queryData = {
            query: `
            query StudentGroupQuery ($organizationId: String) {
              studentGroups(organizationId: $organizationId) {
                __typename
                ... on StudentGroups {
                  items {
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
                ... on ErrorPermissionDenied {
                  errorCode
                  message
                }
              }
            }
          `,
            variables: {
              organizationId: u.district0Organization0.id,
            },
          }
          const user: GraphQlUser = u.users[userName]

          const authorizationHeader = user.token
            ? {
                Authorization: `Bearer ${user.token}`,
              }
            : undefined
          const res = await axios.post<
            GraphQLResponse<'studentGroups', { items: [] }>
          >(`/v2/graphql`, queryData, {
            headers: authorizationHeader,
          })

          if (expectUnauthorizedError) {
            expect(res.data.data.studentGroups.__typename).toEqual(
              'ErrorPermissionDenied',
            )
            expect(res.data.data.studentGroups.errorCode).toEqual(
              'PERMISSION_DENIED',
            )
          } else {
            expect(res.data.data.studentGroups.__typename).toEqual(
              'StudentGroups',
            )
            expect(res.data.data.studentGroups.items).toBeDefined()
            expect(res.data.data.studentGroups.errorCode).toBeUndefined()
          }
        },
      )
    })
  })

  describe('create student group', () => {
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
        const input: CreateStudentGroupInput = {
          name: 'name',
          grade: 'grade',
          organizationId: testOrganization.id,
          classlinkTenantId: 'classlinkTenantId',
          externalLmsStudentGroupId: 'externalLmsStudentGroupId',
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
          GraphQLResponse<'createStudentGroup', CreateStudentGroupPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.createStudentGroup.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.createStudentGroup.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.createStudentGroup.__typename).toEqual(
            'CreateStudentGroupPayload',
          )
          expect(res.data.data.createStudentGroup.studentGroup).toBeDefined()
          expect(res.data.data.createStudentGroup.errorCode).toBeUndefined()
          studentGroupId = res.data.data.createStudentGroup.studentGroup.id
        }
      },
    )
  })

  describe('update student group', () => {
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
        const input: UpdateStudentGroupInput = {
          id: studentGroupId,
          name: 'name-update',
          grade: 'grade-update',
          organizationId: testOrganization.id,
          classlinkTenantId: 'classlinkTenantId-update',
          externalLmsStudentGroupId: 'externalLmsStudentGroupId-update',
          clientMutationId: 'client-mutation-id-update',
        }
        const mutationData = {
          query: `
            mutation UpdateStudentGroup($input: UpdateStudentGroupInput!) {
              updateStudentGroup(input: $input) {
                __typename
                ... on UpdateStudentGroupPayload {
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
          GraphQLResponse<'updateStudentGroup', UpdateStudentGroupPayload>
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(res.data.data.updateStudentGroup.__typename).toEqual(
            'ErrorPermissionDenied',
          )
          expect(res.data.data.updateStudentGroup.errorCode).toEqual(
            'PERMISSION_DENIED',
          )
        } else {
          expect(res.data.data.updateStudentGroup.__typename).toEqual(
            'UpdateStudentGroupPayload',
          )
          expect(res.data.data.updateStudentGroup.studentGroup).toBeDefined()
          expect(res.data.data.updateStudentGroup.errorCode).toBeUndefined()
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
