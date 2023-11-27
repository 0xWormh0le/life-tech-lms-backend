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
  CreateDistrictPurchasedPackageInput,
  CreateDistrictPurchasedPackagePayload,
  CreateStudentGroupPackageAssignmentInput,
  CreateStudentGroupPackageAssignmentPayload,
  DeleteStudentGroupPackageAssignmentInput,
  DeleteStudentGroupPackageAssignmentPayload,
  DistrictPurchasedPackage,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / StudentGroupPackageAssignment / UserAccessScenario', () => {
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

  let u: TestTargetData

  jest.setTimeout(5 * 60 * 1000)

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

  let districtPurchasedPackage: DistrictPurchasedPackage
  let studentGroupPackageAssignmentId: string

  describe('create DistrictPackageAssignment', () => {
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
        const input: CreateDistrictPurchasedPackageInput = {
          districtId: u.district0.id,
          curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateDistrictPurchasedPackage($input: CreateDistrictPurchasedPackageInput!) {
              createDistrictPurchasedPackage(input: $input) {
                __typename
                ... on CreateDistrictPurchasedPackagePayload {
                  clientMutationId
                  districtPurchasedPackage {
                    id
                    districtId
                    curriculumPackageId
                    createdAt
                    createdUserId
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
            input: input,
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<
            'createDistrictPurchasedPackage',
            CreateDistrictPurchasedPackagePayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.createDistrictPurchasedPackage.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.createDistrictPurchasedPackage.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.createDistrictPurchasedPackage.__typename,
          ).toEqual('CreateDistrictPurchasedPackagePayload')
          expect(
            res.data.data.createDistrictPurchasedPackage
              .districtPurchasedPackage,
          ).toBeDefined()
          expect(
            res.data.data.createDistrictPurchasedPackage.errorCode,
          ).toBeUndefined()
          districtPurchasedPackage =
            res.data.data.createDistrictPurchasedPackage
              .districtPurchasedPackage
        }
      },
    )
  })

  describe('create StudentGroupPackageAssignment', () => {
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
        const input: CreateStudentGroupPackageAssignmentInput = {
          studentGroupId: u.district0Organization0StudentGroup0.id,
          curriculumPackageId: districtPurchasedPackage.curriculumPackageId,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateStudentGroupPackageAssignment($input: CreateStudentGroupPackageAssignmentInput!) {
              createStudentGroupPackageAssignment(input: $input) {
                __typename
                ... on CreateStudentGroupPackageAssignmentPayload {
                  clientMutationId
                  studentGroupPackageAssignment {
                    id
                    studentGroupId
                    curriculumPackageId
                    packageCategoryId
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
            input: input,
          },
        }

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<
            'createStudentGroupPackageAssignment',
            CreateStudentGroupPackageAssignmentPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.createStudentGroupPackageAssignment.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.createStudentGroupPackageAssignment.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.createStudentGroupPackageAssignment.__typename,
          ).toEqual('CreateStudentGroupPackageAssignmentPayload')
          expect(
            res.data.data.createStudentGroupPackageAssignment
              .studentGroupPackageAssignment,
          ).toBeDefined()
          expect(
            res.data.data.createStudentGroupPackageAssignment.errorCode,
          ).toBeUndefined()
          studentGroupPackageAssignmentId =
            res.data.data.createStudentGroupPackageAssignment
              .studentGroupPackageAssignment.id
        }
      },
    )
  })

  describe('getStudentGroupPackageAssignments', () => {
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
        studentGroupPackageAssignments {
          __typename
          ... on StudentGroupPackageAssignments {
            items {
              id
              studentGroupId
              curriculumPackageId
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

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'studentGroupPackageAssignments', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.studentGroupPackageAssignments.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.studentGroupPackageAssignments.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.studentGroupPackageAssignments.__typename,
          ).toEqual('StudentGroupPackageAssignments')
          expect(
            res.data.data.studentGroupPackageAssignments.items,
          ).toBeDefined()
          expect(
            res.data.data.studentGroupPackageAssignments.errorCode,
          ).toBeUndefined()
        }
      },
    )
  })

  describe('getStudentGroupPackageAssignmentsByStudentGroupId', () => {
    describe(`
        userName | expectUnauthorizedError
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
        $userName $expectUnauthorizedError
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
      query StudentGroupPackageAssignmentsQuery ($studentGroupId: String!) {
        studentGroupPackageAssignments(studentGroupId: $studentGroupId) {
          __typename
          ... on StudentGroupPackageAssignments {
            items {
              id
              studentGroupId
              curriculumPackageId
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
              studentGroupId: u.district0Organization0StudentGroup0.id,
            },
          }
          const user: GraphQlUser = u.users[userName]
          const authorizationHeader = user.token
            ? {
                Authorization: `Bearer ${user.token}`,
              }
            : undefined

          const res = await axios.post<
            GraphQLResponse<'studentGroupPackageAssignments', { items: [] }>
          >(`/v2/graphql`, queryData, {
            headers: authorizationHeader,
          })

          if (expectUnauthorizedError) {
            expect(
              res.data.data.studentGroupPackageAssignments.__typename,
            ).toEqual('ErrorPermissionDenied')
            expect(
              res.data.data.studentGroupPackageAssignments.errorCode,
            ).toEqual('PERMISSION_DENIED')
          } else {
            expect(
              res.data.data.studentGroupPackageAssignments.__typename,
            ).toEqual('StudentGroupPackageAssignments')
            expect(
              res.data.data.studentGroupPackageAssignments.items,
            ).toBeDefined()
            expect(
              res.data.data.studentGroupPackageAssignments.errorCode,
            ).toBeUndefined()
          }
        },
      )
    })
  })

  describe('delete StudentGroupPackageAssignment', () => {
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
        const input: DeleteStudentGroupPackageAssignmentInput = {
          clientMutationId: 'clientMutationId-delete',
          id: studentGroupPackageAssignmentId,
        }
        const mutationData = {
          query: `
            mutation DeleteStudentGroupPackageAssignment($input: DeleteStudentGroupPackageAssignmentInput!) {
              deleteStudentGroupPackageAssignment(input: $input) {
                __typename
                ... on DeleteStudentGroupPackageAssignmentPayload {
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
          variables: {
            input: input,
          },
        }
        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<
            'deleteStudentGroupPackageAssignment',
            DeleteStudentGroupPackageAssignmentPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.deleteStudentGroupPackageAssignment.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.deleteStudentGroupPackageAssignment.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.deleteStudentGroupPackageAssignment.__typename,
          ).toEqual('DeleteStudentGroupPackageAssignmentPayload')
          expect(
            res.data.data.deleteStudentGroupPackageAssignment.id,
          ).toBeDefined()
          expect(
            res.data.data.deleteStudentGroupPackageAssignment.errorCode,
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
