import CreateDistrictUseCase, { DatetimeRepository, DistrictRepository } from './CreateDistrictUseCase'
import { E, Errorable } from '../../shared/Errors'
import { District } from '../../../entities/codex-v2/District'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { UserRole } from '../../../entities/codex-v2/User'

describe('CreateDistrictUseCase', () => {
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
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          name: 'name',
          stateId: 'stateId',
          lmsId: 'lmsId',
          externalLmsDistrictId: 'externalLmsId',
          enableRosterSync: true,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(districtRepository.create.mock.calls.length).toEqual(0)
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
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'name',
        stateId: 'stateId',
        lmsId: 'lmsId',
        externalLmsDistrictId: 'externalLmsId',
        enableRosterSync: true,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(districtRepository.create.mock.calls[0][0]).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testId',
        enableRosterSync: true,
        externalLmsDistrictId: 'externalLmsId',
        id: 'test-district-id',
        lmsId: 'lmsId',
        name: 'name',
        stateId: 'stateId',
      })
    })

    test('error on districtRepository.findByName', async () => {
      const districtRepository = createSuccessMockDistrictRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

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

      const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'name',
        stateId: 'stateId',
        lmsId: 'lmsId',
        externalLmsDistrictId: 'externalLmsId',
        enableRosterSync: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.create.mock.calls.length).toEqual(0)
    })

    test('districtRepository.findByName returns duplicated named district', async () => {
      const districtRepository = createSuccessMockDistrictRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

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
            enableRosterSync: true,
            createdAt: new Date(nowStr),
            createdUserId: 'testCreatedUserId1',
          },
        }
      })

      const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'name',
        stateId: 'stateId',
        lmsId: 'lmsId',
        externalLmsDistrictId: 'externalLmsId',
        enableRosterSync: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedName',
        message: 'name is duplicated. duplicated districtId: testDistrictId1',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.issueId', async () => {
      const districtRepository = createSuccessMockDistrictRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      districtRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'name',
        stateId: 'stateId',
        lmsId: 'lmsId',
        externalLmsDistrictId: 'externalLmsId',
        enableRosterSync: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const districtRepository = createSuccessMockDistrictRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

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

      const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'name',
        stateId: 'stateId',
        lmsId: 'lmsId',
        externalLmsDistrictId: 'externalLmsId',
        enableRosterSync: true,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(districtRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.create', async () => {
      const districtRepository = createSuccessMockDistrictRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()

      districtRepository.create = jest.fn(async (_district: District): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateDistrictUseCase(districtRepository, datetimeRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        name: 'name',
        stateId: 'stateId',
        lmsId: 'lmsId',
        externalLmsDistrictId: 'externalLmsId',
        enableRosterSync: true,
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
      findByName: async (_name: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      },
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-district-id',
        }
      },
      create: async (_district) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByName: jest.fn((name: string) => repo.findByName(name)),
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((district: District) => repo.create(district)),
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
})
