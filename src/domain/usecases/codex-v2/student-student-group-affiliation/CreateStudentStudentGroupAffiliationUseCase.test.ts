import CreateStudentStudentGroupAffiliationUseCase, {
  DatetimeRepository,
  StudentGroupRepository,
  StudentStudentGroupAffiliationRepository,
  StudentRepository,
} from './CreateStudentStudentGroupAffiliationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { Student } from '../../../entities/codex-v2/Student'

describe('CreateStudentStudentGroupAffiliationUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(studentStudentGroupAffiliationRepository.create.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeDefined()
      }
    })
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        id: 'test-studentGroup-purchased-student-id',
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
        createdUserId: 'testId',
        createdAt: new Date(nowStr),
      })
      expect(studentStudentGroupAffiliationRepository.create.mock.calls.length).toEqual(1)
      expect(studentStudentGroupAffiliationRepository.create.mock.calls[0][0]).toEqual({
        id: 'test-studentGroup-purchased-student-id',
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
        createdUserId: 'testId',
        createdAt: new Date(nowStr),
      })
    })

    test('error on correctEntitiesToCheckError', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          studentId: string
        }): Promise<
          Errorable<
            {
              studentGroup: StudentGroup | null
              student: Student | null
              studentStudentGroupAffiliations: StudentStudentGroupAffiliation[]
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
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'unknown error',
      })
      expect(result.value).toEqual(null)
      expect(studentStudentGroupAffiliationRepository.create.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError return null studentGroup', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          studentId: string
        }): Promise<
          Errorable<
            {
              studentGroup: StudentGroup | null
              student: Student | null
              studentStudentGroupAffiliations: StudentStudentGroupAffiliation[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              studentGroup: null,
              student: {
                id: 'testStudentId1',
                userId: 'testUserId1',
                role: 'student',
                nickName: 'testNickname1',
                externalLmsStudentId: 'externalLmsStudentId1',
                classlinkTenantId: 'classlinkTenantId1',
                isDeactivated: false,
                createdUserId: 'testCreatedUserId1',
                createdAt: new Date(nowStr),
              },
              studentStudentGroupAffiliations: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'StudentGroupNotFound',
        message: 'studentGroup not found. studentGroupId: studentGroupId',
      })
      expect(result.value).toEqual(null)
      expect(studentStudentGroupAffiliationRepository.create.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null studentNotFound', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          studentGroupId: string
          studentId: string
        }): Promise<
          Errorable<
            {
              studentGroup: StudentGroup | null
              student: Student | null
              studentStudentGroupAffiliations: StudentStudentGroupAffiliation[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
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
              student: null,
              studentStudentGroupAffiliations: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'StudentNotFound',
        message: 'student not found. studentId: studentId',
      })
      expect(result.value).toEqual(null)
      expect(studentStudentGroupAffiliationRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on checkDuplicatedStudentError', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )

      useCase['checkDuplicatedStudentError'] = jest.fn(
        async (_student: Student, _studentStudentGroupAffiliatiosns: StudentStudentGroupAffiliation[]): Promise<Errorable<void, E<'DuplicatedStudent'>>> => {
          return {
            hasError: true,
            error: {
              type: 'DuplicatedStudent',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedStudent',
        message: 'error message',
      })
      expect(result.value).toEqual(null)
      expect(studentStudentGroupAffiliationRepository.create.mock.calls.length).toEqual(0)
    })
  })

  describe('.correctEntitiesToCheckError(input)', () => {
    test('success', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        student: {
          createdAt: new Date(nowStr),
          createdUserId: 'testCreatedUserId1',
          externalLmsStudentId: 'externalLmsStudentId1',
          classlinkTenantId: 'classlinkTenantId1',
          id: 'testStudentId1',
          isDeactivated: false,
          nickName: 'testNickname1',
          role: 'student',
          userId: 'testUserId1',
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
        studentStudentGroupAffiliations: [
          {
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId2',
            id: 'testStudentStudentGroupAffiliationId2',
            studentGroupId: 'testStudentGroupId2',
            studentId: 'testStudentId2',
          },
        ],
      })
    })

    test('error on studentGroupRepository.findById', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()

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

      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on studentRepository.findById', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()

      studentRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on studentStudentGroupAffiliationRepository.findByStudentGroupId', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()

      studentStudentGroupAffiliationRepository.findByStudentGroupId = jest.fn(
        async (_id: string): Promise<Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('.checkDuplicatedStudentError(student, studentGroupsStudents)', () => {
    test.each`
      targetStudentId | firstStudentId | secondStudentId | expectDuplicatedError
      ${'1'}          | ${'2'}         | ${'3'}          | ${false}
      ${'1'}          | ${null}        | ${null}         | ${false}
      ${'1'}          | ${'1'}         | ${'3'}          | ${true}
      ${'1'}          | ${'2'}         | ${'1'}          | ${true}
    `(
      '$targetStudentId, $firstStudentId, $secondStudentId, $expectDuplicatedError',
      async ({ targetStudentId, firstStudentId, secondStudentId, expectDuplicatedError }) => {
        const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const studentGroupRepository = createSuccessMockStudentGroupRepository()
        const studentRepository = createSuccessMockStudentRepository()
        const useCase = new CreateStudentStudentGroupAffiliationUseCase(
          studentStudentGroupAffiliationRepository,
          datetimeRepository,
          studentGroupRepository,
          studentRepository,
        )
        const checkDuplicatedStudentError = useCase['checkDuplicatedStudentError']
        const student: Student = {
          id: targetStudentId as string,
          userId: 'testUserId1',
          role: 'student',
          nickName: 'testNickname1',
          externalLmsStudentId: 'externalLmsStudentId1',
          classlinkTenantId: 'classlinkTenantId1',
          isDeactivated: false,
          createdUserId: 'testCreatedUserId1',
          createdAt: new Date(nowStr),
        }
        const studentStudentGroupAffiliations: StudentStudentGroupAffiliation[] = []

        if (firstStudentId != null) {
          studentStudentGroupAffiliations.push({
            id: 'testStudentStudentGroupAffiliationId1',
            studentId: firstStudentId as string,
            studentGroupId: 'testStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          })
        }

        if (secondStudentId != null) {
          studentStudentGroupAffiliations.push({
            id: 'testStudentStudentGroupAffiliationId2',
            studentId: secondStudentId as string,
            studentGroupId: 'testStudentGroupId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          })
        }

        const res = await checkDuplicatedStudentError(student, studentStudentGroupAffiliations)

        if (expectDuplicatedError) {
          expect(res.hasError).toEqual(true)
          expect(res.error).toEqual({
            type: 'DuplicatedStudent',
            message: 'studentId is already related to studentGroupId. studentId: 1',
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
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()
      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testId',
        studentGroupId: 'studentGroupId',
        id: 'test-studentGroup-purchased-student-id',
        studentId: 'studentId',
      })
    })

    test('error on studentStudentGroupAffiliationRepository.issueId', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()

      studentStudentGroupAffiliationRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })

    test('error on datetimeRepository.now', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()

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

      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })

    test('error on studentStudentGroupAffiliationRepository.create', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const studentGroupRepository = createSuccessMockStudentGroupRepository()
      const studentRepository = createSuccessMockStudentRepository()

      studentStudentGroupAffiliationRepository.create = jest.fn(
        async (_studentStudentGroupAffiliation: StudentStudentGroupAffiliation): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateStudentStudentGroupAffiliationUseCase(
        studentStudentGroupAffiliationRepository,
        datetimeRepository,
        studentGroupRepository,
        studentRepository,
      )
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        studentGroupId: 'studentGroupId',
        studentId: 'studentId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })
  })

  const createSuccessMockStudentStudentGroupAffiliationRepository = () => {
    const repo: StudentStudentGroupAffiliationRepository = {
      findByStudentGroupId: async (_studentGroupId: string): Promise<Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testStudentStudentGroupAffiliationId2',
              studentId: 'testStudentId2',
              studentGroupId: 'testStudentGroupId2',
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
          value: 'test-studentGroup-purchased-student-id',
        }
      },
      create: async (_studentStudentGroupAffiliation) => {
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
      create: jest.fn((studentStudentGroupAffiliation: StudentStudentGroupAffiliation) => repo.create(studentStudentGroupAffiliation)),
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
  const createSuccessMockStudentRepository = () => {
    const repo: StudentRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testStudentId1',
            userId: 'testUserId1',
            role: 'student',
            nickName: 'testNickname1',
            externalLmsStudentId: 'externalLmsStudentId1',
            classlinkTenantId: 'classlinkTenantId1',
            isDeactivated: false,
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
