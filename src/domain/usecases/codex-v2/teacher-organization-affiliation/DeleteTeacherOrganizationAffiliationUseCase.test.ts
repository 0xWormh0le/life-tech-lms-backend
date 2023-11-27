import DeleteTeacherOrganizationAffiliationUseCase, { TeacherOrganizationAffiliationRepository } from './DeleteTeacherOrganizationAffiliationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'

describe('DeleteTeacherOrganizationAffiliationUseCase', () => {
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
      const useCase = new DeleteTeacherOrganizationAffiliationUseCase(teacherOrganizationAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'id')

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(teacherOrganizationAffiliationRepository.delete.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeUndefined()
        expect(teacherOrganizationAffiliationRepository.delete.mock.calls.length).toEqual(1)
      }
    })
  })

  describe('.run(authenticatedUser, id)', () => {
    test('success', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
      const useCase = new DeleteTeacherOrganizationAffiliationUseCase(teacherOrganizationAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeUndefined()
      expect(teacherOrganizationAffiliationRepository.delete.mock.calls.length).toEqual(1)
      expect(teacherOrganizationAffiliationRepository.delete.mock.calls[0][0]).toEqual('id')
    })

    test('error on teacherOrganizationAffiliationRepository.findById', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()

      teacherOrganizationAffiliationRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<TeacherOrganizationAffiliation, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new DeleteTeacherOrganizationAffiliationUseCase(teacherOrganizationAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(teacherOrganizationAffiliationRepository.delete.mock.calls.length).toEqual(0)
    })

    test('not found saved data on teacherOrganizationAffiliationRepository.findById', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()

      teacherOrganizationAffiliationRepository.findById = jest.fn(
        async (_id: string): Promise<Errorable<TeacherOrganizationAffiliation | null, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        },
      )

      const useCase = new DeleteTeacherOrganizationAffiliationUseCase(teacherOrganizationAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'TeacherOrganizationAffiliationNotFound',
        message: 'teacherOrganizationAffiliation not found. id: id',
      })
      expect(result.value).toBeNull()

      expect(teacherOrganizationAffiliationRepository.delete.mock.calls.length).toEqual(0)
    })

    test('error on teacherOrganizationAffiliationRepository.delete', async () => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()

      teacherOrganizationAffiliationRepository.delete = jest.fn(async (_id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      })

      const useCase = new DeleteTeacherOrganizationAffiliationUseCase(teacherOrganizationAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'id')

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'something went wrong',
      })
      expect(result.value).toBeNull()

      expect(teacherOrganizationAffiliationRepository.delete.mock.calls.length).toEqual(1)
    })
  })

  const createSuccessMockTeacherOrganizationAffiliationRepository = () => {
    const repo: TeacherOrganizationAffiliationRepository = {
      findById: async (_id: string): Promise<Errorable<TeacherOrganizationAffiliation | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testTeacherOrganizationAffiliationId1',
            teacherId: 'testTeacherId1',
            organizationId: 'testOrganizationId1',
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
