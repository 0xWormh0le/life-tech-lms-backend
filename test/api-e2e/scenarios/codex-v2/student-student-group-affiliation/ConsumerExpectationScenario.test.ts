import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { v4 as uuid } from 'uuid'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { RdbStudentRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbStudentRepository'
import { RdbStudentGroupRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbStudentGroupRepository'
import { StudentStudentGroupAffiliation } from '../../../../../src/domain/entities/codex-v2/StudentStudentGroupAffiliation'
import { Student } from '../../../../../src/domain/entities/codex-v2/Student'
import { StudentGroup } from '../../../../../src/domain/entities/codex-v2/StudentGroup'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import {
  CreateStudentStudentGroupAffiliationPayload,
  CreateStudentStudentGroupAffiliationInput,
  DeleteStudentStudentGroupAffiliationPayload,
  DeleteStudentStudentGroupAffiliationInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import dayjs from 'dayjs'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / StudentStudentGroupAffiliation / ConsumerExpectationScenario', () => {
  let testAffiliation1: StudentStudentGroupAffiliation
  let testAffiliation2: StudentStudentGroupAffiliation
  let testStudent1: Student
  let testStudent2: Student
  let testStudentGroup: StudentGroup

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

    const nowStr = '2000-01-01T00:00:00Z'

    test('create student student group affiliations', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const organizationRepository = new RdbOrganizationRepository(
        appDataSource,
      )
      const studentGroupRepository = new RdbStudentGroupRepository(
        appDataSource,
      )
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

      const organization = await createOrganization()

      testStudentGroup = await createStudentGroup(organization.id)
      testStudent1 = await createStudent()
      testStudent2 = await createStudent()
      testAffiliation1 = await create(testStudentGroup.id, testStudent1.id)
      testAffiliation2 = await create(testStudentGroup.id, testStudent2.id)
    })

    test('remove student student group affiliation', async () => {
      const input: DeleteStudentStudentGroupAffiliationInput = {
        id: testAffiliation1.id,
        clientMutationId: 'mutation-id',
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
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<
          'deleteStudentStudentGroupAffiliation',
          DeleteStudentStudentGroupAffiliationPayload
        >
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(
        res.data.data.deleteStudentStudentGroupAffiliation.__typename,
      ).toBe('DeleteStudentStudentGroupAffiliationPayload')
      expect(res.status).toEqual(200)

      expect(res.data.data.deleteStudentStudentGroupAffiliation).toMatchObject(
        input,
      )
    })

    test('get student student group affiliations with valid student group id', async () => {
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
            }
          }
        `,
        variables: {
          studentGroupId: testStudentGroup.id,
        },
      }
      const res = await axios.post<
        GraphQLResponse<'studentStudentGroupAffiliations', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentStudentGroupAffiliations.items).toHaveLength(
        1,
      )
      expect(
        res.data.data.studentStudentGroupAffiliations.items,
      ).toContainEqual({
        ...testAffiliation2,
        createdAt: testAffiliation2.createdAt.toISOString(),
      })
    })

    test('get student student group affiliations with non-exist student group id', async () => {
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
            }
          }
        `,
        variables: {
          studentGroupId: uuid(),
        },
      }
      const res = await axios.post<
        GraphQLResponse<'studentStudentGroupAffiliations', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentStudentGroupAffiliations.items).toHaveLength(
        0,
      )
    })
  })
})
