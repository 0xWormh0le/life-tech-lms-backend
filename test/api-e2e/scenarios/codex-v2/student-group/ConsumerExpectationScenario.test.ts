import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { StudentGroup } from '../../../../../src/domain/entities/codex-v2/StudentGroup'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import {
  CreateStudentGroupPayload,
  CreateStudentGroupInput,
  UpdateStudentGroupPayload,
  UpdateStudentGroupInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / StudentGroup / ConsumerExpectationScenario', () => {
  let testStudentGroup1: StudentGroup
  let testStudentGroup2: StudentGroup
  let testOrganization: Organization
  const nowStr = '2000-01-01T00:00:00Z'

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

      testStudentGroup1 = await create(
        'name1-1',
        'grade-1',
        testOrganization.id,
        'classlinkTenantId-1',
        'externalLmsStudentGroupId-1',
      )
      testStudentGroup2 = await create(
        'name-2',
        'grade-2',
        testOrganization.id,
        'classlinkTenantId-2',
        'externalLmsStudentGroupId-2',
      )
    })

    test('update student group', async () => {
      const input: UpdateStudentGroupInput = {
        id: testStudentGroup1.id,
        name: 'name-1-update',
        grade: 'grade-1-update',
        organizationId: testOrganization.id,
        classlinkTenantId: 'classlinkTenantId-1-update',
        externalLmsStudentGroupId: 'externalLmsStudentGroupId-1-update',
        clientMutationId: 'client-mutation-id',
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
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<'updateStudentGroup', UpdateStudentGroupPayload>
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.data.data.updateStudentGroup.__typename).toBe(
        'UpdateStudentGroupPayload',
      )
      expect(res.status).toEqual(200)

      const { clientMutationId, ...fields } = input

      expect(res.data.data.updateStudentGroup).toMatchObject({
        studentGroup: fields,
        clientMutationId,
      })

      testStudentGroup1 = {
        ...testStudentGroup1,
        ...fields,
        updatedAt: dayjs(
          res.data.data.updateStudentGroup.studentGroup.updatedAt,
        ).toDate(),
      }
    })

    test('get student groups', async () => {
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
          }
        }
        `,
        variables: {},
      }
      const res = await axios.post<
        GraphQLResponse<'studentGroups', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentGroups.items).toHaveLength(2)
      expect(res.data.data.studentGroups.items).toContainEqual({
        ...testStudentGroup1,
        createdAt: testStudentGroup1.createdAt.toISOString(),
        updatedAt: testStudentGroup1.updatedAt.toISOString(),
      })
      expect(res.data.data.studentGroups.items).toContainEqual({
        ...testStudentGroup2,
        createdAt: testStudentGroup2.createdAt.toISOString(),
        updatedAt: testStudentGroup2.updatedAt.toISOString(),
      })
    })

    test('get student groups by organization id', async () => {
      const queryData = {
        query: `
        query StudentGroupsQuery ($organizationId: String) {
          studentGroups (organizationId: $organizationId) {
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
          }
        }
        `,
        variables: {
          organizationId: testOrganization.id,
        },
      }
      const res = await axios.post<
        GraphQLResponse<'studentGroups', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentGroups.items).toHaveLength(2)
      expect(res.data.data.studentGroups.items).toContainEqual({
        ...testStudentGroup1,
        createdAt: testStudentGroup1.createdAt.toISOString(),
        updatedAt: testStudentGroup1.updatedAt.toISOString(),
      })
      expect(res.data.data.studentGroups.items).toContainEqual({
        ...testStudentGroup2,
        createdAt: testStudentGroup2.createdAt.toISOString(),
        updatedAt: testStudentGroup2.updatedAt.toISOString(),
      })
    })
  })
})
