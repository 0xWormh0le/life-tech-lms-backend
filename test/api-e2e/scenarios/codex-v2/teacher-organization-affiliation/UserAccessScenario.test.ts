import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import {
  CreateTeacherOrganizationAffiliationPayload,
  CreateTeacherOrganizationAffiliationInput,
  DeleteTeacherOrganizationAffiliationPayload,
  DeleteTeacherOrganizationAffiliationInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { RdbTeacherRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbTeacherRepository'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { Teacher } from '../../../../../src/domain/entities/codex-v2/Teacher'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / TeacherOrganizationAffiliation / UserAccessScenario', () => {
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

  let testOrganization: Organization
  let testTeacher: Teacher
  let affiliationId: string

  test('create data', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is undefined.')
    }

    const teacherRepository = new RdbTeacherRepository(appDataSource)
    const organizationRepository = new RdbOrganizationRepository(appDataSource)

    const createTeacher = async () => {
      const id = uuid()
      const teacher: Teacher = {
        id,
        userId: uuid(),
        role: 'teacher',
        firstName: `firstName-${id}`,
        lastName: `lastName-${id}`,
        externalLmsTeacherId: null,
        isDeactivated: false,
        createdUserId: null,
        createdAt: new Date(nowStr),
      }

      const res = await teacherRepository.create(teacher)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()

      return teacher
    }

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

    testTeacher = await createTeacher()
    testOrganization = await createOrganization()
  })

  describe('get teacher organization affiliations', () => {
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
              teacherOrganizationAffiliations {
                __typename
                ... on TeacherOrganizationAffiliations {
                  items {
                    id
                    teacherId
                    organizationId
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

        const authorizationHeader =
          createAuthorizationHeaderByUserToken(userToken)
        const res = await axios.post<
          GraphQLResponse<'teacherOrganizationAffiliations', { items: [] }>
        >(`/v2/graphql`, queryData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.teacherOrganizationAffiliations.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.teacherOrganizationAffiliations.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.teacherOrganizationAffiliations.__typename,
          ).toEqual('TeacherOrganizationAffiliations')
          expect(
            res.data.data.teacherOrganizationAffiliations.items,
          ).toBeDefined()
          expect(
            res.data.data.teacherOrganizationAffiliations.errorCode,
          ).toBeUndefined()
        }
      },
    )
  })

  describe('create teacher organization affiliation', () => {
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
        const input: CreateTeacherOrganizationAffiliationInput = {
          organizationId: testOrganization.id,
          teacherId: testTeacher.id,
        }

        const mutationData = {
          query: `
            mutation CreateTeacherOrganizationAffiliation($input: CreateTeacherOrganizationAffiliationInput!) {
              createTeacherOrganizationAffiliation(input: $input) {
                __typename
                ... on CreateTeacherOrganizationAffiliationPayload {
                  clientMutationId
                  teacherOrganizationAffiliation {
                    id
                    teacherId
                    organizationId
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
            'createTeacherOrganizationAffiliation',
            CreateTeacherOrganizationAffiliationPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.createTeacherOrganizationAffiliation.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.createTeacherOrganizationAffiliation.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.createTeacherOrganizationAffiliation.__typename,
          ).toEqual('CreateTeacherOrganizationAffiliationPayload')
          expect(
            res.data.data.createTeacherOrganizationAffiliation
              .teacherOrganizationAffiliation,
          ).toBeDefined()
          expect(
            res.data.data.createTeacherOrganizationAffiliation.errorCode,
          ).toBeUndefined()
          affiliationId =
            res.data.data.createTeacherOrganizationAffiliation
              .teacherOrganizationAffiliation.id
        }
      },
    )
  })

  describe('delete teacher oragnization affiliation', () => {
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
        const input: DeleteTeacherOrganizationAffiliationInput = {
          id: affiliationId,
          clientMutationId: 'testMutationId',
        }
        const mutationData = {
          query: `
            mutation DeleteTeacherOrganizationAffiliation($input: DeleteTeacherOrganizationAffiliationInput!) {
              deleteTeacherOrganizationAffiliation(input: $input) {
                __typename
                ... on DeleteTeacherOrganizationAffiliationPayload {
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
            'deleteTeacherOrganizationAffiliation',
            DeleteTeacherOrganizationAffiliationPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: authorizationHeader,
        })

        if (expectUnauthorizedError) {
          expect(
            res.data.data.deleteTeacherOrganizationAffiliation.__typename,
          ).toEqual('ErrorPermissionDenied')
          expect(
            res.data.data.deleteTeacherOrganizationAffiliation.errorCode,
          ).toEqual('PERMISSION_DENIED')
        } else {
          expect(
            res.data.data.deleteTeacherOrganizationAffiliation.__typename,
          ).toEqual('DeleteTeacherOrganizationAffiliationPayload')
          expect(
            res.data.data.deleteTeacherOrganizationAffiliation.id,
          ).toBeDefined()
          expect(
            res.data.data.deleteTeacherOrganizationAffiliation.errorCode,
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
