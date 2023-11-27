import CreateStudentGroupPackageAssignmentUseCase, {
  CurriculumPackageRepository,
  DatetimeRepository,
  DistrictPurchasedPackageRepository,
  DistrictRepository,
  OrganizationRepository,
  StudentGroupPackageAssignmentRepository,
  StudentGroupRepository,
} from './CreateStudentGroupPackageAssignmentUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import { CurriculumPackage } from '../../../entities/codex-v2/CurriculumPackage'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { User } from '../../../entities/codex-v2/User'
import { Organization } from '../../../entities/codex-v2/Organization'
import { District } from '../../../entities/codex-v2/District'

describe('CreateStudentGroupPackageAssignmentUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(studentGroupPackageAssignmentRepository.create.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeDefined()
      }
    })
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        createdAt: new Date(nowStr),
        curriculumPackageId: 'curriculumPackageId1',
        id: 'testStudentGroupPackageAssignmentId1',
        curriculumBrandId: 'testPackageCategoryId1',
        studentGroupId: 'studentGroupId1',
      })
      expect(createMethod.mock.calls.length).toEqual(1)
    })

    test('error on correctEntitiesToCheckError', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              curriculumPackage: CurriculumPackage | null
              studentGroup: StudentGroup | null
              organization: Organization | null
              district: District | null
              districtCurriculumPackages: CurriculumPackage[]
              studentGroupPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null curriculumPackage', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              curriculumPackage: CurriculumPackage | null
              studentGroup: StudentGroup | null
              organization: Organization | null
              district: District | null
              districtCurriculumPackages: CurriculumPackage[]
              studentGroupPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              curriculumPackage: null,
              studentGroup: null,
              organization: null,
              district: null,
              districtCurriculumPackages: [],
              studentGroupPackages: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'curriculumPackage not found. curriculumPackageId: curriculumPackageId',
        type: 'CurriculumPackageNotFound',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null studentGroup', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              curriculumPackage: CurriculumPackage | null
              studentGroup: StudentGroup | null
              organization: Organization | null
              district: District | null
              districtCurriculumPackages: CurriculumPackage[]
              studentGroupPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              curriculumPackage: {
                id: 'curriculumPackageId1',
                curriculumBrandId: 'codeillusion',
                name: 'name1',
                level: 'basic',
              },
              studentGroup: null,
              organization: null,
              district: null,
              districtCurriculumPackages: [],
              studentGroupPackages: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'studentGroup not found. studentGroupId: studentGroupId',
        type: 'StudentGroupNotFound',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null organization', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              curriculumPackage: CurriculumPackage | null
              studentGroup: StudentGroup | null
              organization: Organization | null
              district: District | null
              districtCurriculumPackages: CurriculumPackage[]
              studentGroupPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              curriculumPackage: {
                id: 'curriculumPackageId1',
                curriculumBrandId: 'codeillusion',
                name: 'name1',
                level: 'basic',
              },
              studentGroup: {
                id: 'testStudentGroupId1',
                name: 'testName1',
                grade: 'testGrade1',
                externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
                createdUserId: 'testCreatedUserId1',
                updatedUserId: 'testUpdatedUserId1',
                createdAt: new Date(nowStr),
                updatedAt: new Date(nowStr),
                organizationId: 'testOrganizationId1',
                classlinkTenantId: 'testClasslinkTenantId1',
              },
              organization: null,
              district: null,
              districtCurriculumPackages: [],
              studentGroupPackages: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'organization not found. studentGroupId: studentGroupId, organizationId: testOrganizationId1',
        type: 'OrganizationNotFound',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null district', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              curriculumPackage: CurriculumPackage | null
              studentGroup: StudentGroup | null
              organization: Organization | null
              district: District | null
              districtCurriculumPackages: CurriculumPackage[]
              studentGroupPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              curriculumPackage: {
                id: 'curriculumPackageId1',
                curriculumBrandId: 'codeillusion',
                name: 'name1',
                level: 'basic',
              },
              studentGroup: {
                id: 'testStudentGroupId1',
                name: 'testName1',
                grade: 'testGrade1',
                externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
                createdUserId: 'testCreatedUserId1',
                updatedUserId: 'testUpdatedUserId1',
                createdAt: new Date(nowStr),
                updatedAt: new Date(nowStr),
                organizationId: 'testOrganizationId1',
                classlinkTenantId: 'testClasslinkTenantId1',
              },
              organization: {
                id: 'testOrganizationId1',
                name: 'testOrganization1',
                districtId: 'testDistrictId1',
                externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
                classlinkTenantId: 'testClasslinkTenantId1',
                createdAt: new Date(nowStr),
                updatedAt: new Date(nowStr),
              },
              district: null,
              districtCurriculumPackages: [],
              studentGroupPackages: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district not found. studentGroupId: studentGroupId, organizationId: testOrganizationId1, districtId: testDistrictId1',
        type: 'DistrictNotFound',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('error on checkDistrictPurchasedPackageNotFound(curriculumPackage, districtCurriculumPackages)', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['checkDistrictPurchasedPackageNotFound'] = jest.fn(
        async (
          _curriculumPackage: CurriculumPackage,
          _districtsPackages: CurriculumPackage[],
        ): Promise<Errorable<void, E<'DistrictPurchasedPackageNotFound'>>> => {
          return {
            hasError: true,
            error: {
              type: 'DistrictPurchasedPackageNotFound',
              message: 'district purchased package not found.',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district purchased package not found.',
        type: 'DistrictPurchasedPackageNotFound',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('error on checkDuplicatedCurriculumPackageError(curriculumPackage, studentGroupPackages)', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['checkDuplicatedCurriculumPackageError'] = jest.fn(
        async (
          _curriculumPackage: CurriculumPackage,
          _studentGroupPackages: CurriculumPackage[],
        ): Promise<Errorable<void, E<'DuplicatedCurriculumPackage'>>> => {
          return {
            hasError: true,
            error: {
              type: 'DuplicatedCurriculumPackage',
              message: 'package duplicated.',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedCurriculumPackage',
        message: 'package duplicated.',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })

    test('error on checkDuplicatedCurriculumBrandError', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const createMethod = (useCase['create'] = jest.fn(
        async (
          _authenticatedUser: User,
          _input: {
            studentGroupId: string
            curriculumPackageId: string
          },
          _curriculumPackage: CurriculumPackage,
        ): Promise<Errorable<StudentGroupPackageAssignment, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
          }
        },
      ))

      useCase['checkDuplicatedCurriculumBrandError'] = jest.fn(
        async (_curriculumPackage: CurriculumPackage, _studentGroupPackages: CurriculumPackage[]): Promise<Errorable<void, E<'DuplicatedCurriculumBrand'>>> => {
          return {
            hasError: true,
            error: {
              type: 'DuplicatedCurriculumBrand',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedCurriculumBrand',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(createMethod.mock.calls.length).toEqual(0)
    })
  })

  describe('.correctEntitiesToCheckError(studentGroupId, curriculumPackageId)', () => {
    test('error on curriculumPackageRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      curriculumPackageRepository.findById = jest.fn(async (_id: string): Promise<Errorable<CurriculumPackage | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('curriculumPackageRepository.findById returns null value', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      curriculumPackageRepository.findById = jest.fn(async (_id: string): Promise<Errorable<CurriculumPackage | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        curriculumPackage: null,
        district: null,
        districtCurriculumPackages: [],
        organization: null,
        studentGroup: null,
        studentGroupPackages: [],
      })
    })

    test('error on studentGroupRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      studentGroupRepository.findById = jest.fn(async (_id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('studentGroupRepository.findById returns null value', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      studentGroupRepository.findById = jest.fn(async (_id: string): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        curriculumPackage: {
          id: 'curriculumPackageId1',
          level: 'basic',
          name: 'name1',
          curriculumBrandId: 'codeillusion',
        },
        district: null,
        districtCurriculumPackages: [],
        organization: null,
        studentGroup: null,
        studentGroupPackages: [],
      })
    })

    test('error on organizationRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      organizationRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('organizationRepository.findById returns null value', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      organizationRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        curriculumPackage: {
          id: 'curriculumPackageId1',
          level: 'basic',
          name: 'name1',
          curriculumBrandId: 'codeillusion',
        },
        district: null,
        districtCurriculumPackages: [],
        organization: null,
        studentGroup: {
          classlinkTenantId: 'testClasslinkTenantId1',
          createdAt: new Date(nowStr),
          createdUserId: 'testCreatedUserId1',
          externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
          grade: 'testGrade1',
          id: 'testStudentGroupId1',
          name: 'testName1',
          organizationId: 'testOrganizationId1',
          updatedAt: new Date(nowStr),
          updatedUserId: 'testUpdatedUserId1',
        },
        studentGroupPackages: [],
      })
    })

    test('error on districtRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('districtRepository.findById returns null value', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        curriculumPackage: {
          id: 'curriculumPackageId1',
          level: 'basic',
          name: 'name1',
          curriculumBrandId: 'codeillusion',
        },
        district: null,
        districtCurriculumPackages: [],
        organization: {
          classlinkTenantId: 'testClasslinkTenantId1',
          createdAt: new Date(nowStr),
          districtId: 'testDistrictId1',
          externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
          id: 'testOrganizationId1',
          name: 'testOrganization1',
          updatedAt: new Date(nowStr),
        },
        studentGroup: {
          classlinkTenantId: 'testClasslinkTenantId1',
          createdAt: new Date(nowStr),
          createdUserId: 'testCreatedUserId1',
          externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
          grade: 'testGrade1',
          id: 'testStudentGroupId1',
          name: 'testName1',
          organizationId: 'testOrganizationId1',
          updatedAt: new Date(nowStr),
          updatedUserId: 'testUpdatedUserId1',
        },
        studentGroupPackages: [],
      })
    })

    test('error on studentGroupPackageAssignmentRepository.findByStudentGroupId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      studentGroupPackageAssignmentRepository.findByStudentGroupId = jest.fn(
        async (_id: string): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('error on curriculumPackageRepository.findByIds for studentGroupPackages', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      curriculumPackageRepository.findByIds = jest.fn(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('error on districtPurchasedPackageRepository.findByDistrictId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      districtPurchasedPackageRepository.findByDistrictId = jest.fn(
        async (_id: string): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })

    test('error on curriculumPackageRepository.findByIds for districtPurchasedPackages', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

      curriculumPackageRepository.findByIds = jest
        .fn(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: [],
          }
        })
        .mockImplementationOnce(curriculumPackageRepository.findByIds)
        .mockImplementationOnce(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        })

      const useCase = new CreateStudentGroupPackageAssignmentUseCase(
        datetimeRepository,
        districtRepository,
        organizationRepository,
        studentGroupRepository,
        curriculumPackageRepository,
        districtPurchasedPackageRepository,
        studentGroupPackageAssignmentRepository,
      )
      const method = useCase['correctEntitiesToCheckError']
      const result = await method({
        studentGroupId: 'studentGroupId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  describe('.checkDistrictPurchasedPackageNotFound(curriculumPackage, districtsPackages)', () => {
    test.each`
      targetCurriculumPackageId | firstPurchasedCurriculumPackageId | secondPurchasedCurriculumPackageId | expectDistrictPurchasedPackageNotFoundError
      ${'1'}                    | ${'1'}                            | ${'2'}                             | ${false}
      ${'2'}                    | ${'2'}                            | ${'3'}                             | ${false}
      ${'1'}                    | ${null}                           | ${null}                            | ${true}
      ${'1'}                    | ${'2'}                            | ${'3'}                             | ${true}
    `(
      `$targetCurriculumPackageId, $firstPurchasedCurriculumPackageId, $secondPurchasedCurriculumPackageId, $expectDistrictPurchasedPackageNotFoundError`,
      async ({
        targetCurriculumPackageId,
        firstPurchasedCurriculumPackageId,
        secondPurchasedCurriculumPackageId,
        expectDistrictPurchasedPackageNotFoundError,
      }) => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
        const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
        const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

        const useCase = new CreateStudentGroupPackageAssignmentUseCase(
          datetimeRepository,
          districtRepository,
          organizationRepository,
          studentGroupRepository,
          curriculumPackageRepository,
          districtPurchasedPackageRepository,
          studentGroupPackageAssignmentRepository,
        )
        const method = useCase['checkDistrictPurchasedPackageNotFound']
        const targetCurriculumPackage: CurriculumPackage = {
          id: targetCurriculumPackageId as string,
          curriculumBrandId: 'codeillusion',
          name: 'name1',
          level: 'basic',
        }
        const districtPurchasedPackages: CurriculumPackage[] = []

        if (firstPurchasedCurriculumPackageId) {
          districtPurchasedPackages.push({
            id: firstPurchasedCurriculumPackageId as string,
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          })
        }

        if (secondPurchasedCurriculumPackageId) {
          districtPurchasedPackages.push({
            id: secondPurchasedCurriculumPackageId as string,
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          })
        }

        const result = await method(targetCurriculumPackage, districtPurchasedPackages)

        if (expectDistrictPurchasedPackageNotFoundError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            message: 'districtPurchasedPackage not found. packageId: 1',
            type: 'DistrictPurchasedPackageNotFound',
          })
          expect(result.value).toBeNull()
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeUndefined()
        }
      },
    )
  })

  describe('.checkDuplicatedCurriculumPackageError(curriculumPackage, studentGroupPackages)', () => {
    test.each`
      targetCurriculumPackageId | firstAssignedCurriculumPackageId | secondAssignedCurriculumPackageId | expectDuplicateError
      ${'1'}                    | ${null}                          | ${null}                           | ${false}
      ${'1'}                    | ${'2'}                           | ${'3'}                            | ${false}
      ${'2'}                    | ${'2'}                           | ${'3'}                            | ${true}
      ${'3'}                    | ${'2'}                           | ${'3'}                            | ${true}
    `(
      `$targetCurriculumPackageId, $firstAssignedCurriculumPackageId, $secondAssignedCurriculumPackageId, $expectDuplicateError`,
      async ({ targetCurriculumPackageId, firstAssignedCurriculumPackageId, secondAssignedCurriculumPackageId, expectDuplicateError }) => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
        const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
        const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

        const useCase = new CreateStudentGroupPackageAssignmentUseCase(
          datetimeRepository,
          districtRepository,
          organizationRepository,
          studentGroupRepository,
          curriculumPackageRepository,
          districtPurchasedPackageRepository,
          studentGroupPackageAssignmentRepository,
        )
        const method = useCase['checkDuplicatedCurriculumPackageError']
        const targetCurriculumPackage: CurriculumPackage = {
          id: targetCurriculumPackageId as string,
          curriculumBrandId: 'codeillusion',
          name: 'name1',
          level: 'basic',
        }
        const studentGroupPackage: CurriculumPackage[] = []

        if (firstAssignedCurriculumPackageId) {
          studentGroupPackage.push({
            id: firstAssignedCurriculumPackageId as string,
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          })
        }

        if (secondAssignedCurriculumPackageId) {
          studentGroupPackage.push({
            id: secondAssignedCurriculumPackageId as string,
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          })
        }

        const result = await method(targetCurriculumPackage, studentGroupPackage)

        if (expectDuplicateError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            message: `curriculumPackageId is already related to studentGroup. curriculumPackageId: ${targetCurriculumPackageId as string}`,
            type: 'DuplicatedCurriculumPackage',
          })
          expect(result.value).toBeNull()
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeUndefined()
        }
      },
    )

    describe('.checkDuplicatedCurriculumBrandError(curriculumPackage, districtsPackages)', () => {
      test.each`
        targetPackageCategory | firstPackageCategory | secondPackageCategory | expectDuplicatedError
        ${'codeillusion'}     | ${null}              | ${null}               | ${false}
        ${'cse'}              | ${null}              | ${null}               | ${false}
        ${'cse'}              | ${'codeillusion'}    | ${null}               | ${false}
        ${'cse'}              | ${'cse'}             | ${null}               | ${true}
        ${'cse'}              | ${null}              | ${'cse'}              | ${true}
      `(
        '$targetPackageCategory, $firstPackageCategory, $secondPackageCategory, $expectDuplicatedError',
        async ({ targetPackageCategory, firstPackageCategory, secondPackageCategory, expectDuplicatedError }) => {
          const datetimeRepository = createSuccessMockDatetimeRepository()
          const districtRepository = createSuccessMockDistrictRepository()
          const organizationRepository = createSuccessMockOrganizationRepository()
          const studentGroupRepository = createSuccessMockStudentGroupRepository()
          const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
          const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
          const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

          const useCase = new CreateStudentGroupPackageAssignmentUseCase(
            datetimeRepository,
            districtRepository,
            organizationRepository,
            studentGroupRepository,
            curriculumPackageRepository,
            districtPurchasedPackageRepository,
            studentGroupPackageAssignmentRepository,
          )
          const method = useCase['checkDuplicatedCurriculumBrandError']
          const targetCurriculumPackage: CurriculumPackage = {
            id: 'id',
            curriculumBrandId: targetPackageCategory as 'codeillusion' | 'cse',
            name: 'name1',
            level: 'basic',
          }
          const studentGroupPackage: CurriculumPackage[] = []

          if (firstPackageCategory) {
            studentGroupPackage.push({
              id: 'id',
              curriculumBrandId: firstPackageCategory as 'codeillusion' | 'cse',
              name: 'name1',
              level: 'basic',
            })
          }

          if (secondPackageCategory) {
            studentGroupPackage.push({
              id: 'id',
              curriculumBrandId: secondPackageCategory as 'codeillusion' | 'cse',
              name: 'name1',
              level: 'basic',
            })
          }

          const result = await method(targetCurriculumPackage, studentGroupPackage)

          if (expectDuplicatedError) {
            expect(result.hasError).toEqual(true)
            expect(result.error).toEqual({
              message: 'curriculumBrandId is duplicated. curriculumPackageId: id, curriculumBrandId: cse, duplicated curriculumPackageId: id',
              type: 'DuplicatedCurriculumBrand',
            })
            expect(result.value).toBeNull()
          } else {
            expect(result.hasError).toEqual(false)
            expect(result.error).toBeNull()
            expect(result.value).toBeUndefined()
          }
        },
      )
    })

    describe('.create(authenticatedUser, input, curriculumPackage)', () => {
      test('error on studentGroupPackageAssignmentRepository.issueId', async () => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
        const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
        const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

        studentGroupPackageAssignmentRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        })

        const useCase = new CreateStudentGroupPackageAssignmentUseCase(
          datetimeRepository,
          districtRepository,
          organizationRepository,
          studentGroupRepository,
          curriculumPackageRepository,
          districtPurchasedPackageRepository,
          studentGroupPackageAssignmentRepository,
        )
        const method = useCase['create']
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await method(
          authenticatedUser,
          {
            studentGroupId: 'studentGroupId',
            curriculumPackageId: 'curriculumPackageId',
          },
          {
            id: 'curriculumPackageId1',
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          },
        )

        expect(result.hasError).toEqual(true)
        expect(result.error?.type).toEqual('UnknownRuntimeError')
        expect(result.error?.message).toBeDefined()
        expect(result.value).toBeNull()
      })

      test('error on datetimeRepository.now', async () => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
        const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
        const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

        datetimeRepository.now = jest.fn(async (): Promise<Errorable<Date, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'error message',
            },
            value: null,
          }
        })

        const useCase = new CreateStudentGroupPackageAssignmentUseCase(
          datetimeRepository,
          districtRepository,
          organizationRepository,
          studentGroupRepository,
          curriculumPackageRepository,
          districtPurchasedPackageRepository,
          studentGroupPackageAssignmentRepository,
        )
        const method = useCase['create']
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await method(
          authenticatedUser,
          {
            studentGroupId: 'studentGroupId',
            curriculumPackageId: 'curriculumPackageId',
          },
          {
            id: 'curriculumPackageId1',
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          },
        )

        expect(result.hasError).toEqual(true)
        expect(result.error?.type).toEqual('UnknownRuntimeError')
        expect(result.error?.message).toBeDefined()
        expect(result.value).toBeNull()
      })

      test('error on studentGroupPackageAssignmentRepository.create', async () => {
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const curriculumPackageRepository = createSuccessMockCurriculumPackageRepository()
        const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
        const studentGroupPackageAssignmentRepository = createSuccessMockStudentGroupPackageAssignmentRepository()

        studentGroupPackageAssignmentRepository.create = jest.fn(
          async (_studentGroupPackageAssignment: StudentGroupPackageAssignment): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: 'error message',
              },
              value: null,
            }
          },
        )

        const useCase = new CreateStudentGroupPackageAssignmentUseCase(
          datetimeRepository,
          districtRepository,
          organizationRepository,
          studentGroupRepository,
          curriculumPackageRepository,
          districtPurchasedPackageRepository,
          studentGroupPackageAssignmentRepository,
        )
        const method = useCase['create']
        const authenticatedUser = createTestAuthenticatedUser('internalOperator')
        const result = await method(
          authenticatedUser,
          {
            studentGroupId: 'studentGroupId',
            curriculumPackageId: 'curriculumPackageId',
          },
          {
            id: 'curriculumPackageId1',
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          },
        )

        expect(result.hasError).toEqual(true)
        expect(result.error?.type).toEqual('UnknownRuntimeError')
        expect(result.error?.message).toBeDefined()
        expect(result.value).toBeNull()
      })
    })
  })

  const createSuccessMockDatetimeRepository = () => {
    const repo: DatetimeRepository = {
      now: async () => {
        return {
          hasError: false,
          error: null,
          value: new Date(nowStr),
        }
      },
    }

    return {
      now: jest.fn(() => repo.now()),
    }
  }
  const createSuccessMockDistrictRepository = () => {
    const repo: DistrictRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testDistrictId1',
            name: 'testDistrict1',
            stateId: 'testStateId1',
            lmsId: 'testLmsId1',
            externalLmsDistrictId: 'testExternalLmsDistrictId1',
            enableRosterSync: true,
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId1',
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }

  const createSuccessMockOrganizationRepository = () => {
    const repo: OrganizationRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testOrganizationId1',
            name: 'testOrganization1',
            districtId: 'testDistrictId1',
            externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }
  const createSuccessMockStudentGroupRepository = () => {
    const repo: StudentGroupRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testStudentGroupId1',
            name: 'testName1',
            grade: 'testGrade1',
            externalLmsStudentGroupId: 'testExternalLmsStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            updatedUserId: 'testUpdatedUserId1',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
            organizationId: 'testOrganizationId1',
            classlinkTenantId: 'testClasslinkTenantId1',
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }
  const createSuccessMockCurriculumPackageRepository = () => {
    const repo: CurriculumPackageRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'curriculumPackageId1',
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          },
        }
      },
      findByIds: async (_ids: string[]) => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'curriculumPackageId1',
              curriculumBrandId: 'codeillusion',
              name: 'name1',
              level: 'basic',
            },
          ],
        }
      },
    }
    const mockRepo = {
      findById: jest.fn((id: string) => repo.findById(id)),
      findByIds: jest.fn((ids: string[]) => repo.findByIds(ids)),
    }

    mockRepo.findByIds = jest
      .fn(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'curriculumPackageId1',
              curriculumBrandId: 'codeillusion',
              name: 'name1',
              level: 'basic',
            },
          ],
        }
      })
      .mockImplementationOnce(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [], // for studentGroupAssignment package
        }
      })
      .mockImplementationOnce(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'curriculumPackageId1',
              curriculumBrandId: 'codeillusion',
              name: 'name1',
              level: 'basic',
            },
          ], // for districtPurchasedPackage
        }
      })

      .mockImplementationOnce(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      })

    return mockRepo
  }
  const createSuccessMockDistrictPurchasedPackageRepository = () => {
    const repo: DistrictPurchasedPackageRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testDistrictPurchasedPackageId1',
              curriculumPackageId: 'testPackageId1',
              districtId: 'testDistrictId1',
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testDistrictPurchasedPackageId2',
              curriculumPackageId: 'testPackageId2',
              districtId: 'testDistrictId2',
              createdUserId: 'testCreatedUserId2',
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
    }

    return {
      findByDistrictId: jest.fn((districtId: string) => repo.findByDistrictId(districtId)),
    }
  }
  const createSuccessMockStudentGroupPackageAssignmentRepository = () => {
    const repo: StudentGroupPackageAssignmentRepository = {
      findByStudentGroupId: async (_studentGroupId: string): Promise<Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentGroupPackageAssignmentId1',
              curriculumBrandId: `testPackageCategoryId1`,
              curriculumPackageId: `curriculumPackageId1`,
              studentGroupId: `studentGroupId1`,
              createdAt: new Date(nowStr),
            },
            {
              id: 'testStudentGroupPackageAssignmentId2',
              curriculumBrandId: `testPackageCategoryId2`,
              curriculumPackageId: `curriculumPackageId2`,
              studentGroupId: `studentGroupId2`,
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-student-group-package-assignment-id',
        }
      },
      create: async (_districtPurchasedPackage) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByStudentGroupId: jest.fn((studentGroupId: string) => repo.findByStudentGroupId(studentGroupId)),
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((studentGroupPackageAssignment: StudentGroupPackageAssignment) => repo.create(studentGroupPackageAssignment)),
    }
  }
})
