import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import { ClasslinkTenantCredential } from '../../../../../src/domain/entities/codex-v2/ClasslinkTenantCredential'
import { CreateDistrictPayload } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2/_gen/resolvers-type'
import dayjs from 'dayjs'
import {
  CreateClasslinkTenantCredentialInput,
  CreateClasslinkTenantCredentialPayload,
  UpdateClasslinkTenantCredentialInput,
  UpdateClasslinkTenantCredentialPayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / ClasslinkTenantCredential / ConsumerExpectationScenario', () => {
  let testDistrict1: District
  let testDistrict2: District
  let testDistrict1ClasslinkTenantCredential: ClasslinkTenantCredential
  let testDistrict2ClasslinkTenantCredential: ClasslinkTenantCredential

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

    test('create districts', async () => {
      const create = async (label: string): Promise<District> => {
        const input = {
          name: `testDistrict1-${label}-${new Date().toISOString()}`,
          stateId: `testStateId1`,
          lmsId: `testLmsId1`,
          externalLmsDistrictId: `testExternalLmsDistrictId1`,
          enableRosterSync: true,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateDistrict($input: CreateDistrictInput!) {
              createDistrict(input: $input){
                ... on CreateDistrictPayload {
                  clientMutationId
                  district {
                    id
                    name
                    stateId
                    lmsId
                    externalLmsDistrictId
                    enableRosterSync
                    createdAt
                    createdUserId
                    classlinkTenantCredential {
                      districtId
                      externalLmsAppId
                      accessToken
                      externalLmsTenantId
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: input,
          },
        }
        const res = await axios.post<
          GraphQLResponse<'createDistrict', CreateDistrictPayload>
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)
        expect(res.data.data.createDistrict.clientMutationId).toEqual(
          'testMutationId-1',
        )

        const responseDistrict = res.data.data.createDistrict.district

        expect(responseDistrict.name).toEqual(input.name)
        expect(responseDistrict.stateId).toEqual(input.stateId)
        expect(responseDistrict.lmsId).toEqual(input.lmsId)
        expect(responseDistrict.externalLmsDistrictId).toEqual(
          input.externalLmsDistrictId,
        )
        expect(responseDistrict.enableRosterSync).toEqual(
          input.enableRosterSync,
        )
        expect(responseDistrict.id).toBeDefined()
        expect(responseDistrict.createdAt).toBeDefined()
        expect(responseDistrict.createdUserId).toBeDefined()
        expect(responseDistrict.classlinkTenantCredential).toBeNull()
        delete responseDistrict.classlinkTenantCredential

        return {
          ...responseDistrict,
          lmsId: responseDistrict.lmsId ?? null,
          externalLmsDistrictId: responseDistrict.externalLmsDistrictId ?? null,
          createdUserId: responseDistrict.createdUserId ?? null,
          createdAt: dayjs(responseDistrict.createdAt).toDate(),
        }
      }

      testDistrict1 = await create('1')
      testDistrict2 = await create('2')
    })

    test('create classlink credential', async () => {
      const create = async (
        districtId: string,
      ): Promise<ClasslinkTenantCredential> => {
        const input: CreateClasslinkTenantCredentialInput = {
          accessToken: `testAccessToken-${districtId}`,
          districtId: districtId,
          externalLmsAppId: `testExternalLmsAppId-${districtId}`,
          externalLmsTenantId: `testExternalLmsTenantId-${districtId}`,
        }

        const mutationData = {
          query: `
            mutation CreateClasslinkTenantCredential($input: CreateClasslinkTenantCredentialInput!) {
              createClasslinkTenantCredential(input: $input) {
                ... on CreateClasslinkTenantCredentialPayload {
                  clientMutationId
                  classlinkTenantCredential {
                    districtId
                    externalLmsAppId
                    accessToken
                    externalLmsTenantId
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              ...input,
              clientMutationId: `testClientMutationId`,
            },
          },
        }
        const res = await axios.post<
          GraphQLResponse<
            'createClasslinkTenantCredential',
            CreateClasslinkTenantCredentialPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)
        expect(
          res.data.data.createClasslinkTenantCredential.clientMutationId,
        ).toEqual('testClientMutationId')

        const response =
          res.data.data.createClasslinkTenantCredential
            .classlinkTenantCredential

        expect(response).toEqual(input)

        return response
      }

      testDistrict1ClasslinkTenantCredential = await create(testDistrict1.id)
      testDistrict2ClasslinkTenantCredential = await create(testDistrict2.id)
    })

    test('get Districts with ClasslinkTenantCredential', async () => {
      const queryData = {
        query: `
      {
        districts {
          ... on Districts {
            items {
              id
              name
              stateId
              lmsId
              externalLmsDistrictId
              enableRosterSync
              createdAt
              createdUserId
              classlinkTenantCredential {
                districtId
                externalLmsAppId
                accessToken
                externalLmsTenantId
              }
            }
          }
        }
      }
      `,
        variables: {},
      }
      const res = await axios.post<GraphQLResponse<'districts', { items: [] }>>(
        `/v2/graphql`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        },
      )

      expect(res.status).toEqual(200)
      expect(res.data.data.districts.items).toEqual([
        {
          ...testDistrict1,
          createdAt: testDistrict1.createdAt.toISOString(),
          classlinkTenantCredential: {
            ...testDistrict1ClasslinkTenantCredential,
          },
        },
        {
          ...testDistrict2,
          createdAt: testDistrict2.createdAt.toISOString(),
          classlinkTenantCredential: {
            ...testDistrict2ClasslinkTenantCredential,
          },
        },
      ])
    })

    test('update classlink credential', async () => {
      const update = async (
        districtId: string,
      ): Promise<ClasslinkTenantCredential> => {
        const input: UpdateClasslinkTenantCredentialInput = {
          accessToken: `testAccessToken-${districtId}-updated`,
          districtId: districtId,
          externalLmsAppId: `testExternalLmsAppId-${districtId}-updated`,
          externalLmsTenantId: `testExternalLmsTenantId-${districtId}-updated`,
        }

        const mutationData = {
          query: `
            mutation UpdateClasslinkTenantCredential($input: UpdateClasslinkTenantCredentialInput!) {
              updateClasslinkTenantCredential(input: $input) {
                ... on UpdateClasslinkTenantCredentialPayload {
                  clientMutationId
                  classlinkTenantCredential {
                    districtId
                    externalLmsAppId
                    accessToken
                    externalLmsTenantId
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              ...input,
              clientMutationId: `testClientMutationId`,
            },
          },
        }
        const res = await axios.post<
          GraphQLResponse<
            'updateClasslinkTenantCredential',
            UpdateClasslinkTenantCredentialPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)
        expect(
          res.data.data.updateClasslinkTenantCredential.clientMutationId,
        ).toEqual('testClientMutationId')

        const response =
          res.data.data.updateClasslinkTenantCredential
            .classlinkTenantCredential

        expect(response).toEqual(input)

        return {
          ...response,
        }
      }

      testDistrict1ClasslinkTenantCredential = await update(testDistrict1.id)
      testDistrict2ClasslinkTenantCredential = await update(testDistrict2.id)
    })

    test('get Districts with ClasslinkTenantCredential after update', async () => {
      const queryData = {
        query: `
      {
        districts {
          ... on Districts {
            items {
              id
              name
              stateId
              lmsId
              externalLmsDistrictId
              enableRosterSync
              createdAt
              createdUserId
              classlinkTenantCredential {
                districtId
                externalLmsAppId
                accessToken
                externalLmsTenantId
              }
            }
          }
        }
      }
      `,
        variables: {},
      }
      const res = await axios.post<GraphQLResponse<'districts', { items: [] }>>(
        `/v2/graphql`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        },
      )

      expect(res.status).toEqual(200)
      expect(res.data.data.districts.items).toEqual([
        {
          ...testDistrict1,
          createdAt: testDistrict1.createdAt.toISOString(),
          classlinkTenantCredential: {
            ...testDistrict1ClasslinkTenantCredential,
          },
        },
        {
          ...testDistrict2,
          createdAt: testDistrict2.createdAt.toISOString(),
          classlinkTenantCredential: {
            ...testDistrict2ClasslinkTenantCredential,
          },
        },
      ])
    })
  })
})
