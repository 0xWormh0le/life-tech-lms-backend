import UpdateDistrictUseCase, { DistrictRepository } from './UpdateDistrictUseCase'
import { E, Errorable } from '../../shared/Errors'
import { District } from '../../../entities/codex-v2/District'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('UpdateDistrictUseCase', () => {
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
        const useCase = new UpdateDistrictUseCase(districtRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          id: 'id',
          name: 'name-updated',
          stateId: 'stateId-updated',
          lmsId: 'lmsId-updated',
          externalLmsDistrictId: 'externalLmsDistrictId-updated',
          enableRosterSync: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(districtRepository.update.mock.calls.length).toEqual(0)
        } else {
          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeDefined()
        }
      },
    )
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const districtRepository = createSuccessMockDistrictRepository()
      const useCase = new UpdateDistrictUseCase(districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testDistrictId1',
        name: 'name-updated',
        stateId: 'stateId-updated',
        lmsId: 'lmsId-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        enableRosterSync: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(districtRepository.update.mock.calls[0][0]).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testCreatedUserId1',
        enableRosterSync: false,
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        id: 'testDistrictId1',
        lmsId: 'lmsId-updated',
        name: 'name-updated',
        stateId: 'stateId-updated',
      })
    })

    test('error on districtRepository.findById', async () => {
      const districtRepository = createSuccessMockDistrictRepository()

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

      const useCase = new UpdateDistrictUseCase(districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testDistrictId1',
        name: 'name-updated',
        stateId: 'stateId-updated',
        lmsId: 'lmsId-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        enableRosterSync: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.update.mock.calls.length).toEqual(0)
    })

    test('not found saved data on districtRepository.findById', async () => {
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateDistrictUseCase(districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testDistrictId1',
        name: 'name-updated',
        stateId: 'stateId-updated',
        lmsId: 'lmsId-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        enableRosterSync: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district not found. districtId: testDistrictId1',
        type: 'DistrictNotFound',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.findByName', async () => {
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.findByName = jest.fn(async (_name: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateDistrictUseCase(districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testDistrictId1',
        name: 'name-updated',
        stateId: 'stateId-updated',
        lmsId: 'lmsId-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        enableRosterSync: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.update.mock.calls.length).toEqual(0)
    })

    test('districtRepository.findByName returns duplicated named district', async () => {
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.findByName = jest.fn(async (_name: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testDistrictId1',
            name: 'testDistrict1',
            stateId: 'testStateId1',
            lmsId: 'testLmsId1',
            externalLmsDistrictId: 'testExternalLmsDistrictId1',
            enableRosterSync: false,
            createdAt: new Date(nowStr),
            createdUserId: 'testUpdatedUserId1',
          },
        }
      })

      const useCase = new UpdateDistrictUseCase(districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testDistrictId',
        name: 'name-updated',
        stateId: 'stateId-updated',
        lmsId: 'lmsId-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        enableRosterSync: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedName',
        message: 'name is duplicated. duplicated districtId: testDistrictId1',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.update', async () => {
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.update = jest.fn(async (_district: District): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new UpdateDistrictUseCase(districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        id: 'testDistrictId',
        name: 'name-updated',
        stateId: 'stateId-updated',
        lmsId: 'lmsId-updated',
        externalLmsDistrictId: 'externalLmsDistrictId-updated',
        enableRosterSync: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockDistrictRepository = () => {
    const repo: DistrictRepository = {
      findById: async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
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

      findByName: async (_name: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      },
      update: async (_district) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      findByName: jest.fn((name: string) => repo.findByName(name)),
      update: jest.fn((district: District) => repo.update(district)),
    }
  }
})
