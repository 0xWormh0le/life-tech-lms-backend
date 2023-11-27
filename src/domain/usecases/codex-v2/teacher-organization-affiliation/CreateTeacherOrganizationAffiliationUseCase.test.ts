import CreateTeacherOrganizationAffiliationUseCase, {
  DatetimeRepository,
  OrganizationRepository,
  TeacherOrganizationAffiliationRepository,
  TeacherRepository,
} from './CreateTeacherOrganizationAffiliationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { Organization } from '../../../entities/codex-v2/Organization'
import { Teacher } from '../../../entities/codex-v2/Teacher'

describe('CreateTeacherOrganizationAffiliationUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(teacherOrganizationAffiliationRepository.create.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeDefined()
      }
    })
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        id: 'test-organization-purchased-teacher-id',
        organizationId: 'organizationId',
        teacherId: 'teacherId',
        createdUserId: 'testId',
        createdAt: new Date(nowStr),
      })
      expect(teacherOrganizationAffiliationRepository.create.mock.calls.length).toEqual(1)
      expect(teacherOrganizationAffiliationRepository.create.mock.calls[0][0]).toEqual({
        id: 'test-organization-purchased-teacher-id',
        organizationId: 'organizationId',
        teacherId: 'teacherId',
        createdUserId: 'testId',
        createdAt: new Date(nowStr),
      })
    })

    test('error on correctEntitiesToCheckError', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          organizationId: string
          teacherId: string
        }): Promise<
          Errorable<
            {
              organization: Organization | null
              teacher: Teacher | null
              teacherOrganizationAffiliations: TeacherOrganizationAffiliation[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'unknown error',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'unknown error',
      })
      expect(result.value).toEqual(null)
      expect(teacherOrganizationAffiliationRepository.create.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError return null organization', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          organizationId: string
          teacherId: string
        }): Promise<
          Errorable<
            {
              organization: Organization | null
              teacher: Teacher | null
              teacherOrganizationAffiliations: TeacherOrganizationAffiliation[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              organization: null,
              teacher: {
                id: 'testTeacherId1',
                userId: 'testUserId1',
                role: 'teacher',
                firstName: 'testFirstName1',
                lastName: 'testLastName1',
                externalLmsTeacherId: 'testExternalLmsTeacherId1',
                isDeactivated: true,
                createdUserId: 'testCreatedUserId1',
                createdAt: new Date(nowStr),
              },
              teacherOrganizationAffiliations: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'OrganizationNotFound',
        message: 'organization not found. organizationId: organizationId',
      })
      expect(result.value).toEqual(null)
      expect(teacherOrganizationAffiliationRepository.create.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null teacherNotFound', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          organizationId: string
          teacherId: string
        }): Promise<
          Errorable<
            {
              organization: Organization | null
              teacher: Teacher | null
              teacherOrganizationAffiliations: TeacherOrganizationAffiliation[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              organization: {
                id: 'testOrganizationId1',
                name: 'testOrganization1',
                districtId: 'testDistrictId1',
                externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
                classlinkTenantId: 'testClasslinkTenantId1',
                createdAt: new Date(nowStr),
                updatedAt: new Date(nowStr),
              },
              teacher: null,
              teacherOrganizationAffiliations: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'TeacherNotFound',
        message: 'teacher not found. teacherId: teacherId',
      })
      expect(result.value).toEqual(null)
      expect(teacherOrganizationAffiliationRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on checkDuplicatedTeacherError', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )

      useCase['checkDuplicatedTeacherError'] = jest.fn(
        async (_teacher: Teacher, _teacherOrganizationAffiliatiosns: TeacherOrganizationAffiliation[]): Promise<Errorable<void, E<'DuplicatedTeacher'>>> => {
          return {
            hasError: true,
            error: {
              type: 'DuplicatedTeacher',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedTeacher',
        message: 'error message',
      })
      expect(result.value).toEqual(null)
      expect(teacherOrganizationAffiliationRepository.create.mock.calls.length).toEqual(0)
    })
  })

  describe('.correctEntitiesToCheckError(input)', () => {
    test('success', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        organization: {
          classlinkTenantId: 'testClasslinkTenantId1',
          createdAt: new Date(nowStr),
          districtId: 'testDistrictId1',
          externalLmsOrganizationId: 'testExternalLmsOrganizationId1',
          id: 'testOrganizationId1',
          name: 'testName1',
          updatedAt: new Date(nowStr),
        },
        teacher: {
          createdAt: new Date(nowStr),
          createdUserId: 'testCreatedUserId1',
          externalLmsTeacherId: 'testExternalLmsTeacherId1',
          firstName: 'testFirstName1',
          id: 'testTeacherId1',
          isDeactivated: true,
          lastName: 'testLastName1',
          role: 'teacher',
          userId: 'testUserId1',
        },
        teacherOrganizationAffiliations: [
          {
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId2',
            id: 'testTeacherOrganizationAffiliationId2',
            organizationId: 'testOrganizationId2',
            teacherId: 'testTeacherId2',
          },
        ],
      })
    })

    test('error on organizationRepository.findById', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

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

      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on teacherRepository.findById', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on teacherOrganizationAffiliationRepository.findByOrganizationId', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherOrganizationAffiliationRepository.findByOrganizationId = jest.fn(
        async (_id: string): Promise<Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('.checkDuplicatedTeacherError(teacher, organizationsTeachers)', () => {
    test.each`
      targetTeacherId | firstTeacherId | secondTeacherId | expectDuplicatedError
      ${'1'}          | ${'2'}         | ${'3'}          | ${false}
      ${'1'}          | ${null}        | ${null}         | ${false}
      ${'1'}          | ${'1'}         | ${'3'}          | ${true}
      ${'1'}          | ${'2'}         | ${'1'}          | ${true}
    `(
      '$targetTeacherId, $firstTeacherId, $secondTeacherId, $expectDuplicatedError',
      async ({ targetTeacherId, firstTeacherId, secondTeacherId, expectDuplicatedError }) => {
        const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const organizationRepository = createSuccessMockOrganizationRepository()
        const teacherRepository = createSuccessMockTeacherRepository()
        const useCase = new CreateTeacherOrganizationAffiliationUseCase(
          teacherOrganizationAffiliationRepository,
          datetimeRepository,
          organizationRepository,
          teacherRepository,
        )
        const checkDuplicatedTeacherError = useCase['checkDuplicatedTeacherError']
        const teacher: Teacher = {
          id: targetTeacherId as string,
          userId: 'testUserId1',
          role: 'teacher',
          firstName: 'testFirstName1',
          lastName: 'testLastName1',
          externalLmsTeacherId: 'testExternalLmsTeacherId1',
          isDeactivated: true,
          createdUserId: 'testCreatedUserId1',
          createdAt: new Date(nowStr),
        }
        const teacherOrganizationAffiliations: TeacherOrganizationAffiliation[] = []

        if (firstTeacherId != null) {
          teacherOrganizationAffiliations.push({
            id: 'testTeacherOrganizationAffiliationId1',
            teacherId: firstTeacherId as string,
            organizationId: 'testOrganizationId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          })
        }

        if (secondTeacherId != null) {
          teacherOrganizationAffiliations.push({
            id: 'testTeacherOrganizationAffiliationId2',
            teacherId: secondTeacherId as string,
            organizationId: 'testOrganizationId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          })
        }

        const res = await checkDuplicatedTeacherError(teacher, teacherOrganizationAffiliations)

        if (expectDuplicatedError) {
          expect(res.hasError).toEqual(true)
          expect(res.error).toEqual({
            type: 'DuplicatedTeacher',
            message: 'teacherId is already related to organizationId. teacherId: 1',
          })
          expect(res.value).toBeNull()
        } else {
          if (res.hasError) {
            throw new Error(res.error.message)
          }
          expect(res.error).toBeNull()
          expect(res.value).toBeUndefined()
        }
      },
    )
  })

  describe('.create(authenticatedUser, input)', () => {
    test('success', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()
      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testId',
        organizationId: 'organizationId',
        id: 'test-organization-purchased-teacher-id',
        teacherId: 'teacherId',
      })
    })

    test('error on teacherOrganizationAffiliationRepository.issueId', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherOrganizationAffiliationRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })

    test('error on datetimeRepository.now', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

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

      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })

    test('error on teacherOrganizationAffiliationRepository.create', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const organizationRepository = createSuccessMockOrganizationRepository()
      const teacherRepository = createSuccessMockTeacherRepository()

      teacherOrganizationAffiliationRepository.create = jest.fn(
        async (_teacherOrganizationAffiliation: TeacherOrganizationAffiliation): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateTeacherOrganizationAffiliationUseCase(
        teacherOrganizationAffiliationRepository,
        datetimeRepository,
        organizationRepository,
        teacherRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        organizationId: 'organizationId',
        teacherId: 'teacherId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })
  })

  const createSuccessMockTeacherOrganizationAffiliationRepository = () => {
    const repo: TeacherOrganizationAffiliationRepository = {
      findByOrganizationId: async (_organizationId: string): Promise<Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testTeacherOrganizationAffiliationId2',
              teacherId: 'testTeacherId2',
              organizationId: 'testOrganizationId2',
              createdUserId: 'testCreatedUserId2',
              createdAt: new Date(nowStr),
            },
          ],
        }
      },
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-organization-purchased-teacher-id',
        }
      },
      create: async (_teacherOrganizationAffiliation) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByOrganizationId: jest.fn((organizationId: string) => repo.findByOrganizationId(organizationId)),
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((teacherOrganizationAffiliation: TeacherOrganizationAffiliation) => repo.create(teacherOrganizationAffiliation)),
    }
  }
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
  const createSuccessMockOrganizationRepository = () => {
    const repo: OrganizationRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testOrganizationId1',
            name: 'testName1',
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
  const createSuccessMockTeacherRepository = () => {
    const repo: TeacherRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testTeacherId1',
            userId: 'testUserId1',
            role: 'teacher',
            firstName: 'testFirstName1',
            lastName: 'testLastName1',
            externalLmsTeacherId: 'testExternalLmsTeacherId1',
            isDeactivated: true,
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }
})
