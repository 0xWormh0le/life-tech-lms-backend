import UpdateClasslinkTenantCredentialUseCase, { ClasslinkTenantCredentialRepository, DistrictRepository } from './UpdateClasslinkTenantCredentialUseCase'
import { E, Errorable } from '../../shared/Errors'
import { ClasslinkTenantCredential } from '../../../entities/codex-v2/ClasslinkTenantCredential'
import { createTestAuthenticatedUser, nowStr } from '../_testShaerd/UseCaseTestUtility.test'
import { District } from '../../../entities/codex-v2/District'

describe('UpdateClasslinkTenantCredentialUseCase', () => {
  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(classlinkTenantCredentialRepository.update.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeDefined()
      }
    })
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual(input)
      expect(classlinkTenantCredentialRepository.update.mock.calls[0][0]).toEqual(input)
    })

    test('error on districtRepository.findById', async () => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
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

      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(classlinkTenantCredentialRepository.update.mock.calls.length).toEqual(0)
    })

    test('districtRepository.findById returns null', async () => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      districtRepository.findById = jest.fn(async (_id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      })

      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'district not found. districtId: districtId',
        type: 'DistrictNotFound',
      })
      expect(result.value).toBeNull()
      expect(classlinkTenantCredentialRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on classlinkTenantCredentialRepository.findByDistrictId', async () => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      classlinkTenantCredentialRepository.findByDistrictId = jest.fn(
        async (_districtId: string): Promise<Errorable<ClasslinkTenantCredential | null, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(result.value).toBeNull()
      expect(classlinkTenantCredentialRepository.update.mock.calls.length).toEqual(0)
    })

    test('classlinkTenantCredentialRepository.findByDistrictId returns null', async () => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      classlinkTenantCredentialRepository.findByDistrictId = jest.fn(
        async (_districtId: string): Promise<Errorable<ClasslinkTenantCredential | null, E<'UnknownRuntimeError'>>> => {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        },
      )

      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      console.log(result) // TODO
      // expect(result.hasError).toEqual(true)
      // expect(result.error).toEqual({
      //   message: 'classlinkTenantCredential not found. districtId: districtId',
      //   type: 'ClasslinkTenantCredentialNotFound',
      // })
      // expect(result.value).toBeNull()
      // expect(classlinkTenantCredentialRepository.update.mock.calls.length).toEqual(0)
    })

    test('error on classlinkTenantCredentialRepository.update', async () => {
      const classlinkTenantCredentialRepository = createSuccessMockClasslinkTenantCredentialRepository()
      const districtRepository = createSuccessMockDistrictRepository()

      classlinkTenantCredentialRepository.update = jest.fn(
        async (_classlinkTenantCredential: ClasslinkTenantCredential): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new UpdateClasslinkTenantCredentialUseCase(classlinkTenantCredentialRepository, districtRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const input = {
        districtId: 'districtId',
        externalLmsAppId: 'externalLmsAppId',
        accessToken: 'accessToken',
        externalLmsTenantId: 'externalLmsTenantId',
      }
      const result = await useCase.run(authenticatedUser, input)

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        message: 'error message',
        type: 'UnknownRuntimeError',
      })
      expect(result.value).toBeNull()
      expect(classlinkTenantCredentialRepository.update.mock.calls.length).toEqual(1)
    })
  })

  const createSuccessMockClasslinkTenantCredentialRepository = () => {
    const repo: ClasslinkTenantCredentialRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<ClasslinkTenantCredential | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            districtId: 'testClasslinkTenantCredentialId1',
            externalLmsAppId: 'testExternalLmsAppId1',
            accessToken: 'testAccessToken1',
            externalLmsTenantId: 'testExternalLmsTenantId1',
          },
        }
      },
      update: async (_classlinkTenantCredential: ClasslinkTenantCredential): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByDistrictId: jest.fn((districtId: string) => repo.findByDistrictId(districtId)),
      update: jest.fn((classlinkTenantCredential: ClasslinkTenantCredential) => repo.update(classlinkTenantCredential)),
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
})
