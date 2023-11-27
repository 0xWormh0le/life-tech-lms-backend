import DeleteStudentStudentGroupAffiliationUseCase, { StudentStudentGroupAffiliationRepository } from './DeleteStudentStudentGroupAffiliationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('DeleteStudentStudentGroupAffiliationUseCase', () => {
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
      const useCase = new DeleteStudentStudentGroupAffiliationUseCase(studentStudentGroupAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'id')

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(studentStudentGroupAffiliationRepository.delete.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeUndefined()
        expect(studentStudentGroupAffiliationRepository.delete.mock.calls.length).toEqual(1)
      }
    })
  })

  describe('.run(authenticatedUser, id)', () => {
    test('success', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()
      const useCase = new DeleteStudentStudentGroupAffiliationUseCase(studentStudentGroupAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeUndefined()
      expect(studentStudentGroupAffiliationRepository.delete.mock.calls.length).toEqual(1)
      expect(studentStudentGroupAffiliationRepository.delete.mock.calls[0][0]).toEqual('id')
    })

    test('error on studentStudentGroupAffiliationRepository.findById', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

      studentStudentGroupAffiliationRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<StudentStudentGroupAffiliation, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'something went wrong',
            },
            value: null,
          }
        },
      )

      const useCase = new DeleteStudentStudentGroupAffiliationUseCase(studentStudentGroupAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(studentStudentGroupAffiliationRepository.delete.mock.calls.length).toEqual(0)
    })

    test('not found saved data on studentStudentGroupAffiliationRepository.findById', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

      studentStudentGroupAffiliationRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<StudentStudentGroupAffiliation | null, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        },
      )

      const useCase = new DeleteStudentStudentGroupAffiliationUseCase(studentStudentGroupAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'StudentStudentGroupAffiliationNotFound',
        message: 'studentStudentGroupAffiliation not found. id: id',
      })
      expect(result.value).toBeNull()

      expect(studentStudentGroupAffiliationRepository.delete.mock.calls.length).toEqual(0)
    })

    test('error on studentStudentGroupAffiliationRepository.delete', async () => {
      const studentStudentGroupAffiliationRepository = createSuccessMockStudentStudentGroupAffiliationRepository()

      studentStudentGroupAffiliationRepository.delete = jest.fn(async (_id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      })

      const useCase = new DeleteStudentStudentGroupAffiliationUseCase(studentStudentGroupAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(studentStudentGroupAffiliationRepository.delete.mock.calls.length).toEqual(1)
    })
  })

  const createSuccessMockStudentStudentGroupAffiliationRepository = () => {
    const repo: StudentStudentGroupAffiliationRepository = {
      findById: async (_id: string): Promise<Errorable<StudentStudentGroupAffiliation | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testStudentStudentGroupAffiliationId1',
            studentId: 'testStudentId1',
            studentGroupId: 'testStudentGroupId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
        }
      },
      delete: async (_id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      delete: jest.fn((id: string) => repo.delete(id)),
    }
  }
})
