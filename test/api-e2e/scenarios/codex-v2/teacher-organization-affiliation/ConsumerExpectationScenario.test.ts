import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { v4 as uuid } from 'uuid'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { RdbTeacherRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbTeacherRepository'
import { TeacherOrganizationAffiliation } from '../../../../../src/domain/entities/codex-v2/TeacherOrganizationAffiliation'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { Teacher } from '../../../../../src/domain/entities/codex-v2/Teacher'
import {
  CreateTeacherOrganizationAffiliationPayload,
  CreateTeacherOrganizationAffiliationInput,
  DeleteTeacherOrganizationAffiliationPayload,
  DeleteTeacherOrganizationAffiliationInput,
} from '../../../../../clients/codex-v2/resolvers-type'
import dayjs from 'dayjs'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / TeacherOrganizationAffiliation / ConsumerExpectationScenario', () => {
  let testAffiliation1: TeacherOrganizationAffiliation
  let testAffiliation2: TeacherOrganizationAffiliation
  let testOrganization1: Organization
  let testOrganization2: Organization
  let testTeacher: Teacher

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

    test('create teacher organization affiliations', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const teacherRepository = new RdbTeacherRepository(appDataSource)
      const organizationRepository = new RdbOrganizationRepository(
        appDataSource,
      )

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

      const create = async (
        organizationId: string,
        teacherId: string,
      ): Promise<TeacherOrganizationAffiliation> => {
        const input: CreateTeacherOrganizationAffiliationInput = {
          organizationId,
          teacherId,
          clientMutationId: 'testMutationId-1',
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
              }
            }
          `,
          variables: { input },
        }

        const res = await axios.post<
          GraphQLResponse<
            'createTeacherOrganizationAffiliation',
            CreateTeacherOrganizationAffiliationPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(
          res.data.data.createTeacherOrganizationAffiliation.__typename,
        ).toBe('CreateTeacherOrganizationAffiliationPayload')
        expect(res.status).toEqual(200)

        const { clientMutationId, ...fields } = input

        expect(
          res.data.data.createTeacherOrganizationAffiliation,
        ).toMatchObject({
          teacherOrganizationAffiliation: fields,
          clientMutationId,
        })

        const response =
          res.data.data.createTeacherOrganizationAffiliation
            .teacherOrganizationAffiliation

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
        } as TeacherOrganizationAffiliation
      }

      testOrganization1 = await createOrganization()
      testOrganization2 = await createOrganization()
      testTeacher = await createTeacher()
      testAffiliation1 = await create(testOrganization1.id, testTeacher.id)
      testAffiliation2 = await create(testOrganization2.id, testTeacher.id)
    })

    test('remove teacher organization affiliation', async () => {
      const input: DeleteTeacherOrganizationAffiliationInput = {
        id: testAffiliation1.id,
        clientMutationId: 'mutation-id',
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
            }
          }
        `,
        variables: { input },
      }

      const res = await axios.post<
        GraphQLResponse<
          'deleteTeacherOrganizationAffiliation',
          DeleteTeacherOrganizationAffiliationPayload
        >
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(
        res.data.data.deleteTeacherOrganizationAffiliation.__typename,
      ).toBe('DeleteTeacherOrganizationAffiliationPayload')
      expect(res.status).toEqual(200)

      expect(res.data.data.deleteTeacherOrganizationAffiliation).toMatchObject(
        input,
      )
    })

    test('get teacher organization affiliations', async () => {
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
            }
          }
        `,
        variables: {},
      }
      const res = await axios.post<
        GraphQLResponse<'teacherOrganizationAffiliations', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.teacherOrganizationAffiliations.items).toHaveLength(
        1,
      )
      expect(
        res.data.data.teacherOrganizationAffiliations.items,
      ).toContainEqual({
        ...testAffiliation2,
        createdAt: testAffiliation2.createdAt.toISOString(),
      })
    })
  })
})
