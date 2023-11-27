import GetDistrictsUseCase, { DistrictRepository } from './GetDistrictsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { District } from '../../../entities/codex-v2/District'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('GetDistrictsUseCase', () => {
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
        const districtRepository = createSuccessMockDistrictRepository()
        const useCase = new GetDistrictsUseCase(districtRepository)
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
      const districtRepository = createSuccessMockDistrictRepository()

      if (hasRepositoryError) {
        districtRepository.findAll = jest.fn(async (): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new GetDistrictsUseCase(districtRepository)
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
            id: 'testDistrictId1',
            name: 'testDistrict1',
            stateId: 'testStateId1',
            lmsId: 'testLmsId1',
            externalLmsDistrictId: 'testExternalLmsDistrictId1',
            enableRosterSync: true,
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId1',
          },
          {
            id: 'testDistrictId2',
            name: 'testDistrict2',
            stateId: 'testStateId2',
            lmsId: 'testLmsId2',
            externalLmsDistrictId: 'testExternalLmsDistrictId2',
            enableRosterSync: true,
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId2',
          },
        ])
      }
    })
  })

  const createSuccessMockDistrictRepository = () => {
    const repo: DistrictRepository = {
      findAll: async (): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testDistrictId1',
              name: 'testDistrict1',
              stateId: 'testStateId1',
              lmsId: 'testLmsId1',
              externalLmsDistrictId: 'testExternalLmsDistrictId1',
              enableRosterSync: true,
              createdAt: new Date(nowStr),
              createdUserId: 'testCreatedUserId1',
            },
            {
              id: 'testDistrictId2',
              name: 'testDistrict2',
              stateId: 'testStateId2',
              lmsId: 'testLmsId2',
              externalLmsDistrictId: 'testExternalLmsDistrictId2',
              enableRosterSync: true,
              createdAt: new Date(nowStr),
              createdUserId: 'testCreatedUserId2',
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
