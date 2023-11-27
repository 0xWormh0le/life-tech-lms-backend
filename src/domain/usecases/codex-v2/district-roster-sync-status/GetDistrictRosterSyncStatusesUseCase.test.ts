import { E, Errorable } from '../../shared/Errors'
import { DistrictRosterSyncStatus } from '../../../entities/codex-v2/DistrictRosterSyncStatus'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import GetDistrictRosterSyncStatusesUseCase, { DistrictRosterSyncStatusRepository } from './GetDistrictRosterSyncStatusesUseCase'

describe('GetDistrictRosterSyncStatusesUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  const data = [
    {
      id: 'testDistrictRosterSyncStatusId1',
      districtId: 'test-districtId-1',
      startedAt: new Date(nowStr),
      finishedAt: null,
      errorMessage: null,
    },
    {
      id: 'testDistrictRosterSyncStatusId2',
      districtId: 'test-districtId-2',
      startedAt: new Date(nowStr),
      finishedAt: null,
      errorMessage: null,
    },
  ]

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const districtRosterSyncStatusRepository = createSuccessMockDistrictRosterSyncStatusRepository()
      const useCase = new GetDistrictRosterSyncStatusesUseCase(districtRosterSyncStatusRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, 'district-id')

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
    })
  })

  describe('run', () => {
    test.each`
      hasRepositoryError | expectUnknownError
      ${false}           | ${false}
      ${true}            | ${true}
    `(`hasRepositoryError: $hasRepositoryError, expectUnknownError: $expectUnknownError`, async ({ hasRepositoryError, expectUnknownError }) => {
      const districtRosterSyncStatusRepository = createSuccessMockDistrictRosterSyncStatusRepository()

      if (hasRepositoryError) {
        districtRosterSyncStatusRepository.findByDistrictId = jest.fn(
          async (_districtId: string): Promise<Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>> => {
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
      }

      const useCase = new GetDistrictRosterSyncStatusesUseCase(districtRosterSyncStatusRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, 'test-districtId-1')
      const resultAll = await useCase.run(authenticatedUser, null)

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
        expect(result.value).toEqual([data[0]])

        expect(resultAll.hasError).toEqual(false)
        expect(resultAll.error).toBeNull()
        expect(resultAll.value).toEqual(data)
      }
    })
  })

  const createSuccessMockDistrictRosterSyncStatusRepository = () => {
    const repo: DistrictRosterSyncStatusRepository = {
      findAll: async (): Promise<Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>> => ({
        hasError: false,
        error: null,
        value: data,
      }),
      findByDistrictId: async (districtId: string): Promise<Errorable<DistrictRosterSyncStatus[], E<'UnknownRuntimeError'>>> => ({
        hasError: false,
        error: null,
        value: data.filter((item) => item.districtId === districtId),
      }),
    }

    return {
      findByDistrictId: jest.fn((districtId: string) => repo.findByDistrictId(districtId)),
      findAll: jest.fn(() => repo.findAll()),
    }
  }
})
