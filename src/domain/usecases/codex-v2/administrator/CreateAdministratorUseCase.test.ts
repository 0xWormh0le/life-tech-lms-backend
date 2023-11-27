import CreateAdministratorUseCase, {
  DatetimeRepository,
  AdministratorRepository,
  DistrictRepository,
  UserRepository,
  HumanUserRepository,
} from './CreateAdministratorUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Administrator } from '../../../entities/codex-v2/Administrator'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { User } from '../../../entities/codex-v2/User'
import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { UserRole } from '../../../entities/codex-v2/User'
import { District } from '../../../entities/codex-v2/District'

describe('CreateAdministratorUseCase', () => {
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
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const userRepository = createSuccessMockUserRepository()
        const humanUserRepository = createSuccessMockHumanUserRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const administratorRepository = createSuccessMockAdministratorRepository()

        const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
        const authenticatedUser = createTestAuthenticatedUser(userRole)
        const result = await useCase.run(authenticatedUser, {
          userId: 'testUserId1',
          districtId: 'testDistrictId1',
          firstName: 'testFirstName1',
          lastName: 'testLastName1',
          externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
          isDeactivated: false,
        })

        if (expectAuthorizationError) {
          expect(result.hasError).toEqual(true)
          expect(result.error).toEqual({
            type: 'PermissionDenied',
            message: 'Access Denied',
          })
          expect(result.value).toBeNull()
          expect(administratorRepository.create.mock.calls.length).toEqual(0)
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
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()
      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toBeDefined()
      expect(administratorRepository.create.mock.calls[0][0]).toEqual({
        createdUserId: 'testId',
        districtId: 'testDistrictId1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        firstName: 'testFirstName1',
        id: 'test-administrator-id',
        isDeactivated: false,
        lastName: 'testLastName1',
        role: 'administrator',
        userId: 'testUserId1',
        createdAt: new Date(nowStr),
      })
    })

    test('error on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('not found on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'user not found. userId: testUserId1',
        type: 'UserNotFound',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('not administrator user found on userRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      userRepository.findById = jest.fn(async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'userId1',
            role: 'internalOperator',
            isDemo: false,
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'user is not administrator. userRole: internalOperator',
        type: 'UserHasOtherRole',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on humanUserRepository.findByUserId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      humanUserRepository.findByUserId = jest.fn(async (_id: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('not found on humanUserRepository.findByUserId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      humanUserRepository.findByUserId = jest.fn(async (_id: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'human user not found. userId: testUserId1',
        type: 'HumanUserNotFound',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on districtRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

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

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('not found on districtRepository.findById', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district not found. districtId: testDistrictId1',
        type: 'DistrictNotFound',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on administratorRepository.issueId', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      administratorRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on datetimeRepository.now', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

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

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(administratorRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on administratorRepository.create', async () => {
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const userRepository = createSuccessMockUserRepository()
      const humanUserRepository = createSuccessMockHumanUserRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const administratorRepository = createSuccessMockAdministratorRepository()

      administratorRepository.create = jest.fn(async (_administrator: Administrator): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateAdministratorUseCase(datetimeRepository, userRepository, humanUserRepository, districtRepository, administratorRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        userId: 'testUserId1',
        districtId: 'testDistrictId1',
        firstName: 'testFirstName1',
        lastName: 'testLastName1',
        externalLmsAdministratorId: 'testExternalLmsAdministratorId1',
        isDeactivated: false,
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
    })
  })

  const createSuccessMockUserRepository = () => {
    const repo: UserRepository = {
      findById: async (_id: string): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'userId1',
            role: 'administrator',
            isDemo: false,
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

  const createSuccessMockHumanUserRepository = () => {
    const repo: HumanUserRepository = {
      findByUserId: async (_id: string): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            userId: 'userId1',
            loginId: null,
            email: null,
            hashedPassword: 'pwd',
            createdAt: new Date(nowStr),
            updatedAt: new Date(nowStr),
          },
        }
      },
    }

    return {
      findByUserId: jest.fn((id: string) => repo.findByUserId(id)),
    }
  }

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
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }
  const createSuccessMockAdministratorRepository = () => {
    const repo: AdministratorRepository = {
      issueId: async () => {
        return {
          hasError: false,
          error: null,
          value: 'test-administrator-id',
        }
      },
      create: async (_administrator) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((administrator: Administrator) => repo.create(administrator)),
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
