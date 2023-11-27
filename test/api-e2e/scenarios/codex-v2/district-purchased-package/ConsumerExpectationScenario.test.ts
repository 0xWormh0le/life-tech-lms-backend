import axios from 'axios'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import { DistrictPurchasedPackage } from '../../../../../src/domain/entities/codex-v2/DistrictPurchasedPackage'
import { CreateDistrictPayload } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2/_gen/resolvers-type'
import dayjs from 'dayjs'
import {
  CreateDistrictPurchasedPackageInput,
  CreateDistrictPurchasedPackagePayload,
  DeleteDistrictPurchasedPackageInput,
  DeleteDistrictPurchasedPackagePayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import { v4 as uuid } from 'uuid'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / DistrictPurchasedPackage / ConsumerExpectationScenario', () => {
  let testDistrict1: District
  let testDistrict2: District
  let testDistrict1PurchasedPackage1: DistrictPurchasedPackage
  let testDistrict1PurchasedPackage2: DistrictPurchasedPackage
  let testDistrict2PurchasedPackage1: DistrictPurchasedPackage
  let testDistrict2PurchasedPackage2: DistrictPurchasedPackage

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
              createDistrict(input: $input) {
                __typename
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

    test('create DistrictPurchasedPackages', async () => {
      const createAndInsert = async (
        districtId: string,
        curriculumPackageId: string,
      ): Promise<DistrictPurchasedPackage> => {
        const input: CreateDistrictPurchasedPackageInput = {
          districtId: districtId,
          curriculumPackageId: curriculumPackageId,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateDistrictPurchasedPackage($input: CreateDistrictPurchasedPackageInput!) {
              createDistrictPurchasedPackage(input: $input) {
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
              }
            }
          `,
          variables: {
            input: input,
          },
        }
        const res = await axios.post<
          GraphQLResponse<
            'createDistrictPurchasedPackage',
            CreateDistrictPurchasedPackagePayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)
        expect(
          res.data.data.createDistrictPurchasedPackage.clientMutationId,
        ).toEqual('testMutationId-1')

        const response =
          res.data.data.createDistrictPurchasedPackage.districtPurchasedPackage

        expect(response.districtId).toEqual(input.districtId)
        expect(response.curriculumPackageId).toEqual(input.curriculumPackageId)
        expect(response.id).toBeDefined()
        expect(response.createdUserId).toBeDefined()
        expect(response.createdAt).toBeDefined()

        return {
          ...response,
          createdAt: dayjs(response.createdAt).toDate(),
          createdUserId: response.createdUserId ?? null,
        }
      }

      testDistrict1PurchasedPackage1 = await createAndInsert(
        testDistrict1.id,
        'codeillusion-package-basic-full-premium-heroic',
      )
      testDistrict1PurchasedPackage2 = await createAndInsert(
        testDistrict1.id,
        'cse-package-full-standard',
      )
      testDistrict2PurchasedPackage1 = await createAndInsert(
        testDistrict2.id,
        'codeillusion-package-basic-full-premium-heroic',
      )
      testDistrict2PurchasedPackage2 = await createAndInsert(
        testDistrict2.id,
        'cse-package-full-standard',
      )
    })

    test('get Districts with DistrictPurchasedPackages', async () => {
      const queryData = {
        query: `
      {
        districts {
          __typename
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
              districtPurchasedPackages {
                id
                districtId
                curriculumPackageId
                createdUserId
                createdAt
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
          districtPurchasedPackages: [
            {
              ...testDistrict1PurchasedPackage1,
              createdAt: testDistrict1PurchasedPackage1.createdAt.toISOString(),
            },
            {
              ...testDistrict1PurchasedPackage2,
              createdAt: testDistrict1PurchasedPackage2.createdAt.toISOString(),
            },
          ],
        },
        {
          ...testDistrict2,
          createdAt: testDistrict2.createdAt.toISOString(),
          districtPurchasedPackages: [
            {
              ...testDistrict2PurchasedPackage1,
              createdAt: testDistrict2PurchasedPackage1.createdAt.toISOString(),
            },
            {
              ...testDistrict2PurchasedPackage2,
              createdAt: testDistrict2PurchasedPackage2.createdAt.toISOString(),
            },
          ],
        },
      ])
    })

    test('delete Districts with DistrictPurchasedPackages with non-exist id', async () => {
      const input: DeleteDistrictPurchasedPackageInput = {
        clientMutationId: 'clientMutationId-delete',
        id: uuid(),
      }
      const mutationData = {
        query: `
          mutation DeleteDistrictPurchasedPackage($input: DeleteDistrictPurchasedPackageInput!) {
            deleteDistrictPurchasedPackage(input: $input) {
              ... on DeleteDistrictPurchasedPackagePayload {
                clientMutationId
                id
              }
              ... on ErrorUnknownRuntime {
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
      const res = await axios.post<
        GraphQLResponse<
          'deleteDistrictPurchasedPackage',
          DeleteDistrictPurchasedPackagePayload
        >
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.data.data.deleteDistrictPurchasedPackage.errorCode).toBe(
        'UNKNOWN_RUNTIME_ERROR',
      )
      expect(res.data.data.deleteDistrictPurchasedPackage.message).toMatch(
        /districtPurchasedPackage not found/,
      )
      expect(res.status).toEqual(200)
    })

    test('delete Districts with DistrictPurchasedPackages with valid id', async () => {
      const input: DeleteDistrictPurchasedPackageInput = {
        clientMutationId: 'clientMutationId-delete',
        id: testDistrict1PurchasedPackage1.id,
      }
      const mutationData = {
        query: `
          mutation DeleteDistrictPurchasedPackage($input: DeleteDistrictPurchasedPackageInput!) {
            deleteDistrictPurchasedPackage(input: $input) {
              ... on DeleteDistrictPurchasedPackagePayload {
                clientMutationId
                id
              }
            }
          }
        `,
        variables: {
          input: input,
        },
      }
      const res = await axios.post<
        GraphQLResponse<
          'deleteDistrictPurchasedPackage',
          DeleteDistrictPurchasedPackagePayload
        >
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(
        res.data.data.deleteDistrictPurchasedPackage.clientMutationId,
      ).toEqual('clientMutationId-delete')
      expect(res.data.data.deleteDistrictPurchasedPackage.id).toEqual(
        testDistrict1PurchasedPackage1.id,
      )
    })

    test('get Districts with DistrictPurchasedPackages after deletion', async () => {
      const queryData = {
        query: `
      {
        districts {
          __typename
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
              districtPurchasedPackages {
                id
                districtId
                curriculumPackageId
                createdUserId
                createdAt
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
          districtPurchasedPackages: [
            // {
            //   ...testDistrict1PurchasedPackage1,
            //   createdAt:
            //     testDistrict1PurchasedPackage1.createdAt.toISOString(),
            // },
            {
              ...testDistrict1PurchasedPackage2,
              createdAt: testDistrict1PurchasedPackage2.createdAt.toISOString(),
            },
          ],
        },
        {
          ...testDistrict2,
          createdAt: testDistrict2.createdAt.toISOString(),
          districtPurchasedPackages: [
            {
              ...testDistrict2PurchasedPackage1,
              createdAt: testDistrict2PurchasedPackage1.createdAt.toISOString(),
            },
            {
              ...testDistrict2PurchasedPackage2,
              createdAt: testDistrict2PurchasedPackage2.createdAt.toISOString(),
            },
          ],
        },
      ])
    })
  })
})
