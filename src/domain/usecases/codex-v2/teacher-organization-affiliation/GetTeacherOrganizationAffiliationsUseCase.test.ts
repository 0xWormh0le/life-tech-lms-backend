import GetTeacherOrganizationAffiliationsUseCase, { TeacherOrganizationAffiliationRepository } from './GetTeacherOrganizationAffiliationsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetTeacherOrganizationAffiliationsUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `(
      'userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ',
      async ({ userRole, expectAuthorizationError }: { userRole: UserRole; expectAuthorizationError: boolean }) => {
        const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()
        const useCase = new GetTeacherOrganizationAffiliationsUseCase(teacherOrganizationAffiliationRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser)

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeDefined()
        }
      },
    )
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const teacherOrganizationAffiliationRepository = createSuccessMockTeacherOrganizationAffiliationRepository()

      if (hasRepositoryError) {
        teacherOrganizationAffiliationRepository.findAll = jest.fn(async (): Promise<Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>> => {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: 'something went wrong',
            },
            value: null,
          }
        })
      }

      const useCase = new GetTeacherOrganizationAffiliationsUseCase(teacherOrganizationAffiliationRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser)

      if (expectUnknownError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'UnknownRuntimeError',
          message: 'something went wrong',
        })
        expect(result.value).toBeNull()
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toEqual([
          {
            id: 'testTeacherOrganizationAffiliationId1',
            teacherId: 'testTeacherId1',
            organizationId: 'testOrganizationId1',
            createdUserId: 'testCreatedUserId1',
            createdAt: new Date(nowStr),
          },
          {
            id: 'testTeacherOrganizationAffiliationId2',
            teacherId: 'testTeacherId2',
            organizationId: 'testOrganizationId2',
            createdUserId: 'testCreatedUserId2',
            createdAt: new Date(nowStr),
          },
        ])
      }
    })
  })

  const createSuccessMockTeacherOrganizationAffiliationRepository = () => {
    const repo: TeacherOrganizationAffiliationRepository = {
      findAll: async (): Promise<Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testTeacherOrganizationAffiliationId1',
              teacherId: 'testTeacherId1',
              organizationId: 'testOrganizationId1',
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
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
    }

    return {
      findAll: jest.fn(() => repo.findAll()),
    }
  }
})
