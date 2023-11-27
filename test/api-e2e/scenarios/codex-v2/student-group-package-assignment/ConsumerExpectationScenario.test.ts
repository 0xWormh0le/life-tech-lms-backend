import axios from 'axios'
import { v4 as uuid } from 'uuid'
import {
  appDataSource,
  createUserAndGetToken,
  setupEnvironment,
  teardownEnvironment,
} from '../../../utilities'
import { District } from '../../../../../src/domain/entities/codex-v2/District'
import { StudentGroupPackageAssignment } from '../../../../../src/domain/entities/codex-v2/StudentGroupPackageAssignment'
import { DistrictPurchasedPackage } from '../../../../../src/domain/entities/codex-v2/DistrictPurchasedPackage'
import { Organization } from '../../../../../src/domain/entities/codex-v2/Organization'
import { StudentGroup } from '../../../../../src/domain/entities/codex-v2/StudentGroup'
import dayjs from 'dayjs'
import {
  CreateDistrictPayload,
  CreateDistrictPurchasedPackageInput,
  CreateDistrictPurchasedPackagePayload,
  CreateStudentGroupPackageAssignmentInput,
  CreateStudentGroupPackageAssignmentPayload,
  DeleteStudentGroupPackageAssignmentInput,
  DeleteStudentGroupPackageAssignmentPayload,
} from '../../../../../clients/codex-v2/resolvers-type'
import { RdbOrganizationRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import { RdbStudentGroupRepository } from '../../../../../src/adapter/repositories/codex-v2/RdbStudentGroupRepository'
import { GraphQLResponse } from '../../../../../src/adapter/entry-points/express/handlers/codex-v2'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('CodexV2 / StudentGroupPackageAssignment / ConsumerExpectationScenario', () => {
  let testDistrict1: District
  let testDistrict2: District
  let testDistrict1PurchasedPackage1: DistrictPurchasedPackage
  let testDistrict1PurchasedPackage2: DistrictPurchasedPackage
  let testDistrict2PurchasedPackage1: DistrictPurchasedPackage
  let testDistrict2PurchasedPackage2: DistrictPurchasedPackage
  let testDistrict1Organization: Organization
  let testDistrict2Organization: Organization
  let testStudentGroup1: StudentGroup
  let testStudentGroup2: StudentGroup
  let testDistrict1StudentGroupPackageAssignment1: StudentGroupPackageAssignment
  let testDistrict1StudentGroupPackageAssignment2: StudentGroupPackageAssignment
  let testDistrict2StudentGroupPackageAssignment1: StudentGroupPackageAssignment
  let testDistrict2StudentGroupPackageAssignment2: StudentGroupPackageAssignment

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

    const nowStr = '2000-01-01T00:00:00Z'

    test('create Organization', async () => {
      if (!appDataSource) {
        throw new Error('appDataSource is undefined.')
      }

      const organizationRepository = new RdbOrganizationRepository(
        appDataSource,
      )
      const createAndInsert = async (districtId: string) => {
        const id = uuid()
        const organization: Organization = {
          id: id,
          name: `name-${id}`,
          districtId: districtId,
          externalLmsOrganizationId: `externalLmsOrganizationId-${id}`,
          classlinkTenantId: `classlinkTenantId-${id}`,
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        }

        await organizationRepository.create(organization)

        return organization
      }

      testDistrict1Organization = await createAndInsert(testDistrict1.id)
      testDistrict2Organization = await createAndInsert(testDistrict2.id)
    })

    test('create StudentGroups', async () => {
      const createAndInsert = async (organizationId: string) => {
        if (!appDataSource) {
          throw new Error('appDataSource is undefined.')
        }

        const id = uuid()
        const testTarget: StudentGroup = {
          id: id,
          name: `testDistrict1-${id}`,
          grade: `grade-${id}`,
          externalLmsStudentGroupId: `testExternalLsmStudentId-${id}`,
          organizationId: organizationId,
          classlinkTenantId: `classlinkTenantId-${id}`,
          createdUserId: `testCreateUserId-${id}`,
          updatedUserId: `testCreateUserId-${id}`,
          createdAt: new Date(nowStr),
          updatedAt: new Date(nowStr),
        }

        const studentGroupRepository = new RdbStudentGroupRepository(
          appDataSource,
        )

        await studentGroupRepository.create(testTarget)

        return testTarget
      }

      testStudentGroup1 = await createAndInsert(testDistrict1Organization.id)
      testStudentGroup2 = await createAndInsert(testDistrict2Organization.id)
    })

    test('create StudentGroupPackageAssignments', async () => {
      const createAndInsert = async (
        studentGroupId: string,
        curriculumPackageId: string,
      ): Promise<StudentGroupPackageAssignment> => {
        const input: CreateStudentGroupPackageAssignmentInput = {
          studentGroupId: studentGroupId,
          curriculumPackageId: curriculumPackageId,
          clientMutationId: 'testMutationId-1',
        }

        const mutationData = {
          query: `
            mutation CreateStudentGroupPackageAssignment($input: CreateStudentGroupPackageAssignmentInput!) {
              createStudentGroupPackageAssignment(input: $input) {
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
              }
            }
          `,
          variables: {
            input: input,
          },
        }
        const res = await axios.post<
          GraphQLResponse<
            'createStudentGroupPackageAssignment',
            CreateStudentGroupPackageAssignmentPayload
          >
        >(`/v2/graphql`, mutationData, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        })

        expect(res.status).toEqual(200)
        expect(
          res.data.data.createStudentGroupPackageAssignment.clientMutationId,
        ).toEqual('testMutationId-1')

        const response =
          res.data.data.createStudentGroupPackageAssignment
            .studentGroupPackageAssignment

        expect(response.studentGroupId).toEqual(input.studentGroupId)
        expect(response.curriculumPackageId).toEqual(input.curriculumPackageId)
        expect(response.id).toBeDefined()
        expect(response.createdAt).toBeDefined()

        return {
          ...response,
          curriculumBrandId: response.packageCategoryId,
          createdAt: dayjs(response.createdAt).toDate(),
        }
      }

      testDistrict1StudentGroupPackageAssignment1 = await createAndInsert(
        testStudentGroup1.id,
        testDistrict1PurchasedPackage1.curriculumPackageId,
      )
      testDistrict1StudentGroupPackageAssignment2 = await createAndInsert(
        testStudentGroup1.id,
        testDistrict1PurchasedPackage2.curriculumPackageId,
      )
      testDistrict2StudentGroupPackageAssignment1 = await createAndInsert(
        testStudentGroup2.id,
        testDistrict2PurchasedPackage1.curriculumPackageId,
      )
      testDistrict2StudentGroupPackageAssignment2 = await createAndInsert(
        testStudentGroup2.id,
        testDistrict2PurchasedPackage2.curriculumPackageId,
      )
    })

    test('get studentGroupPackageAssignments', async () => {
      const queryData = {
        query: `
      {
        studentGroupPackageAssignments {
          ... on StudentGroupPackageAssignments {
            items {
              id
              packageCategoryId
              curriculumBrandId
              curriculumPackageId
              studentGroupId
              createdAt
            }
          }
        }
      }
      `,
        variables: {},
      }

      const res = await axios.post<
        GraphQLResponse<'studentGroupPackageAssignments', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentGroupPackageAssignments.items).toEqual([
        {
          ...testDistrict1StudentGroupPackageAssignment1,
          curriculumBrandId:
            testDistrict1StudentGroupPackageAssignment1.curriculumBrandId,
          createdAt:
            testDistrict1StudentGroupPackageAssignment1.createdAt.toISOString(),
        },
        {
          ...testDistrict1StudentGroupPackageAssignment2,
          curriculumBrandId:
            testDistrict1StudentGroupPackageAssignment2.curriculumBrandId,
          createdAt:
            testDistrict1StudentGroupPackageAssignment2.createdAt.toISOString(),
        },

        {
          ...testDistrict2StudentGroupPackageAssignment1,
          curriculumBrandId:
            testDistrict2StudentGroupPackageAssignment1.curriculumBrandId,
          createdAt:
            testDistrict2StudentGroupPackageAssignment1.createdAt.toISOString(),
        },
        {
          ...testDistrict2StudentGroupPackageAssignment2,
          curriculumBrandId:
            testDistrict2StudentGroupPackageAssignment2.curriculumBrandId,
          createdAt:
            testDistrict2StudentGroupPackageAssignment2.createdAt.toISOString(),
        },
      ])
    })

    test('get studentGroupPackageAssignmentsByStudentGroupId', async () => {
      const queryData = {
        query: `
      query StudentGroupPackageAssignmentsQuery ($studentGroupId: String!) {
        studentGroupPackageAssignments(studentGroupId: $studentGroupId) {
          __typename
          ... on StudentGroupPackageAssignments {
            items {
              id
              curriculumBrandId
              curriculumPackageId
              packageCategoryId
              studentGroupId
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
          studentGroupId:
            testDistrict1StudentGroupPackageAssignment1.studentGroupId,
        },
      }

      const res = await axios.post<
        GraphQLResponse<'studentGroupPackageAssignments', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentGroupPackageAssignments.items).toEqual([
        {
          ...testDistrict1StudentGroupPackageAssignment1,
          curriculumBrandId:
            testDistrict1StudentGroupPackageAssignment1.curriculumBrandId,
          createdAt:
            testDistrict1StudentGroupPackageAssignment1.createdAt.toISOString(),
        },
        {
          ...testDistrict1StudentGroupPackageAssignment2,
          curriculumBrandId:
            testDistrict1StudentGroupPackageAssignment2.curriculumBrandId,
          createdAt:
            testDistrict1StudentGroupPackageAssignment2.createdAt.toISOString(),
        },
      ])
    })

    test('delete Districts with StudentGroupPackageAssignments', async () => {
      const input: DeleteStudentGroupPackageAssignmentInput = {
        clientMutationId: 'clientMutationId-delete',
        id: testDistrict1StudentGroupPackageAssignment1.id,
      }
      const mutationData = {
        query: `
          mutation DeleteStudentGroupPackageAssignment($input: DeleteStudentGroupPackageAssignmentInput!) {
            deleteStudentGroupPackageAssignment(input: $input) {
              ... on DeleteStudentGroupPackageAssignmentPayload {
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
          'deleteStudentGroupPackageAssignment',
          DeleteStudentGroupPackageAssignmentPayload
        >
      >(`/v2/graphql`, mutationData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(
        res.data.data.deleteStudentGroupPackageAssignment.clientMutationId,
      ).toEqual('clientMutationId-delete')
      expect(res.data.data.deleteStudentGroupPackageAssignment.id).toEqual(
        testDistrict1StudentGroupPackageAssignment1.id,
      )
    })

    test('get studentGroupPackageAssignments after deletion', async () => {
      const queryData = {
        query: `
        {
          studentGroupPackageAssignments {
            ... on StudentGroupPackageAssignments {
              items {
                id
                packageCategoryId
                curriculumBrandId
                curriculumPackageId
                studentGroupId
                createdAt
              }
            }
          }
        }
        `,
        variables: {},
      }

      const res = await axios.post<
        GraphQLResponse<'studentGroupPackageAssignments', { items: [] }>
      >(`/v2/graphql`, queryData, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      })

      expect(res.status).toEqual(200)
      expect(res.data.data.studentGroupPackageAssignments.items).toEqual([
        // {
        //   ...testDistrict1StudentGroupPackageAssignment1,
        //   createdAt:
        //     testDistrict1StudentGroupPackageAssignment1.createdAt.toISOString(),
        // },
        {
          ...testDistrict1StudentGroupPackageAssignment2,
          createdAt:
            testDistrict1StudentGroupPackageAssignment2.createdAt.toISOString(),
        },

        {
          ...testDistrict2StudentGroupPackageAssignment1,
          createdAt:
            testDistrict2StudentGroupPackageAssignment1.createdAt.toISOString(),
        },
        {
          ...testDistrict2StudentGroupPackageAssignment2,
          createdAt:
            testDistrict2StudentGroupPackageAssignment2.createdAt.toISOString(),
        },
      ])
    })
  })
})
