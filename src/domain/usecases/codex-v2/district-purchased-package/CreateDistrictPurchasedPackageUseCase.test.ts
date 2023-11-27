import CreateDistrictPurchasedPackageUseCase, {
  DatetimeRepository,
  DistrictPurchasedPackageRepository,
  DistrictRepository,
  CurriculumPackageRepository,
} from './CreateDistrictPurchasedPackageUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import { createTestAuthenticatedUser } from '../_testShaerd/UseCaseTestUtility.test'
import { District } from '../../../entities/codex-v2/District'
import { CurriculumPackage } from '../../../entities/codex-v2/CurriculumPackage'

describe('GetDistrictPurchasedPackageUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('Authorization', () => {
    test.each`
      userRole              | expectAuthorizationError
      ${'student'}          | ${true}
      ${'teacher'}          | ${true}
      ${'administrator'}    | ${true}
      ${'internalOperator'} | ${false}
    `('userRole: $userRole, expectAuthorizationError: $expectAuthorizationError ', async ({ userRole, expectAuthorizationError }) => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const authenticatedUser = createTestAuthenticatedUser(userRole)
      const result = await useCase.run(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      if (expectAuthorizationError) {
        expect(result.hasError).toEqual(true)
        expect(result.error).toEqual({
          type: 'PermissionDenied',
          message: 'Access Denied',
        })
        expect(result.value).toBeNull()
        expect(districtPurchasedPackageRepository.create.mock.calls.length).toEqual(0)
      } else {
        expect(result.hasError).toEqual(false)
        expect(result.error).toBeNull()
        expect(result.value).toBeDefined()
      }
    })
  })

  describe('.run(authenticatedUser, input)', () => {
    test('success', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(false)
      expect(result.error).toBeNull()
      expect(result.value).toEqual({
        id: 'test-district-purchased-package-id',
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
        createdUserId: 'testId',
        createdAt: new Date(nowStr),
      })
      expect(districtPurchasedPackageRepository.create.mock.calls.length).toEqual(1)
      expect(districtPurchasedPackageRepository.create.mock.calls[0][0]).toEqual({
        id: 'test-district-purchased-package-id',
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
        createdUserId: 'testId',
        createdAt: new Date(nowStr),
      })
    })

    test('error on correctEntitiesToCheckError', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          districtId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              district: District | null
              curriculumPackage: CurriculumPackage | null
              districtCurriculumPackages: CurriculumPackage[]
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
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'unknown error',
      })
      expect(result.value).toEqual(null)
      expect(districtPurchasedPackageRepository.create.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError return null district', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          districtId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              district: District | null
              curriculumPackage: CurriculumPackage | null
              districtCurriculumPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              district: null,
              curriculumPackage: {
                id: 'curriculumPackageId',
                curriculumBrandId: 'codeillusion',
                name: 'name',
                level: 'basic',
              },
              districtCurriculumPackages: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DistrictNotFound',
        message: 'district not found. districtId: districtId',
      })
      expect(result.value).toEqual(null)
      expect(districtPurchasedPackageRepository.create.mock.calls.length).toEqual(0)
    })

    test('correctEntitiesToCheckError returns null curriculumPackageNotFound', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)

      useCase['correctEntitiesToCheckError'] = jest.fn(
        async (_input: {
          districtId: string
          curriculumPackageId: string
        }): Promise<
          Errorable<
            {
              district: District | null
              curriculumPackage: CurriculumPackage | null
              districtCurriculumPackages: CurriculumPackage[]
            },
            E<'UnknownRuntimeError'>
          >
        > => {
          return {
            hasError: false,
            error: null,
            value: {
              district: {
                id: 'districtId',
                name: 'name',
                stateId: 'stateId',
                lmsId: null,
                externalLmsDistrictId: null,
                enableRosterSync: true,
                createdAt: new Date(nowStr),
                createdUserId: null,
              },
              curriculumPackage: null,
              districtCurriculumPackages: [],
            },
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'CurriculumPackageNotFound',
        message: 'curriculumPackage not found. curriculumPackageId: curriculumPackageId',
      })
      expect(result.value).toEqual(null)
      expect(districtPurchasedPackageRepository.create.mock.calls.length).toEqual(0)
    })

    test('error on checkDuplicatedCurriculumPackageError', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)

      useCase['checkDuplicatedCurriculumPackageError'] = jest.fn(
        async (_curriculumPackage: CurriculumPackage, _districtsPackages: CurriculumPackage[]): Promise<Errorable<void, E<'DuplicatedCurriculumPackage'>>> => {
          return {
            hasError: true,
            error: {
              type: 'DuplicatedCurriculumPackage',
              message: 'error message',
            },
            value: null,
          }
        },
      )

      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const result = await useCase.run(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(result.hasError).toEqual(true)
      expect(result.error).toEqual({
        type: 'DuplicatedCurriculumPackage',
        message: 'error message',
      })
      expect(result.value).toEqual(null)
      expect(districtPurchasedPackageRepository.create.mock.calls.length).toEqual(0)
    })
  })

  describe('.correctEntitiesToCheckError(input)', () => {
    test('success', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        curriculumPackage: {
          id: 'curriculumPackageId1',
          level: 'basic',
          name: 'name1',
          curriculumBrandId: 'codeillusion',
        },
        district: {
          createdAt: new Date(nowStr),
          createdUserId: 'testCreatedUserId1',
          enableRosterSync: true,
          externalLmsDistrictId: 'testExternalLmsDistrictId1',
          id: 'testDistrictId1',
          lmsId: 'testLmsId1',
          name: 'testDistrict1',
          stateId: 'testStateId1',
        },
        districtCurriculumPackages: [],
      })
    })

    test('error on districtRepository.findById', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

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

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on curriculumPackageRepository.findById', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

      packageRepository.findById = jest.fn(async (_id: string): Promise<Errorable<CurriculumPackage | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on districtPurchasedPackageRepository.findByDistrictId', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

      districtPurchasedPackageRepository.findByDistrictId = jest.fn(
        async (_id: string): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })

    test('error on curriculumPackageRepository.findByIds', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

      packageRepository.findByIds = jest.fn(async (_ids: string[]): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const correctEntitiesToCheckError = useCase['correctEntitiesToCheckError']
      const res = await correctEntitiesToCheckError({
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error).toEqual({
        type: 'UnknownRuntimeError',
        message: 'error message',
      })
      expect(res.value).toBeNull()
    })
  })

  describe('.checkDuplicatedCurriculumPackageError(curriculumPackage, districtsPackages)', () => {
    test.each`
      targetPackageId | firstPackageId | secondPackageId | expectDuplicatedError
      ${'1'}          | ${'2'}         | ${'3'}          | ${false}
      ${'1'}          | ${null}        | ${null}         | ${false}
      ${'1'}          | ${'1'}         | ${'3'}          | ${true}
      ${'1'}          | ${'2'}         | ${'1'}          | ${true}
    `(
      '$targetPackageId, $firstPackageId, $secondPackageId, $expectDuplicatedError',
      async ({ targetPackageId, firstPackageId, secondPackageId, expectDuplicatedError }) => {
        const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
        const datetimeRepository = createSuccessMockDatetimeRepository()
        const districtRepository = createSuccessMockDistrictRepository()
        const packageRepository = createSuccessMockPackageRepository()
        const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
        const checkDuplicatedCurriculumPackageError = useCase['checkDuplicatedCurriculumPackageError']
        const curriculumPackage: CurriculumPackage = {
          id: targetPackageId as string,
          curriculumBrandId: 'codeillusion',
          name: 'name',
          level: 'basic',
        }
        const districtPackages: CurriculumPackage[] = []

        if (firstPackageId != null) {
          districtPackages.push({
            id: firstPackageId as string,
            curriculumBrandId: 'codeillusion',
            name: 'name',
            level: 'basic',
          })
        }

        if (secondPackageId != null) {
          districtPackages.push({
            id: secondPackageId as string,
            curriculumBrandId: 'codeillusion',
            name: 'name',
            level: 'basic',
          })
        }

        const res = await checkDuplicatedCurriculumPackageError(curriculumPackage, districtPackages)

        if (expectDuplicatedError) {
          expect(res.hasError).toEqual(true)
          expect(res.error).toEqual({
            type: 'DuplicatedCurriculumPackage',
            message: 'curriculumPackageId is already related to districtId. curriculumPackageId: 1',
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
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()
      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        createdAt: new Date(nowStr),
        createdUserId: 'testId',
        districtId: 'districtId',
        id: 'test-district-purchased-package-id',
        curriculumPackageId: 'curriculumPackageId',
      })
    })

    test('error on districtPurchasedPackageRepository.issueId', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

      districtPurchasedPackageRepository.issueId = jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      })

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })

    test('error on datetimeRepository.now', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

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

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })

    test('error on districtPurchasedPackageRepository.create', async () => {
      const districtPurchasedPackageRepository = createSuccessMockDistrictPurchasedPackageRepository()
      const datetimeRepository = createSuccessMockDatetimeRepository()
      const districtRepository = createSuccessMockDistrictRepository()
      const packageRepository = createSuccessMockPackageRepository()

      districtPurchasedPackageRepository.create = jest.fn(
        async (_districtPurchasedPackage: DistrictPurchasedPackage): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
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

      const useCase = new CreateDistrictPurchasedPackageUseCase(districtPurchasedPackageRepository, datetimeRepository, districtRepository, packageRepository)
      const create = useCase['create']
      const authenticatedUser = createTestAuthenticatedUser('internalOperator')
      const res = await create(authenticatedUser, {
        districtId: 'districtId',
        curriculumPackageId: 'curriculumPackageId',
      })

      expect(res.hasError).toEqual(true)
      expect(res.error?.type).toEqual('UnknownRuntimeError')
      expect(res.error?.message).toBeDefined()

      expect(res.value).toBeNull()
    })
  })

  const createSuccessMockDistrictPurchasedPackageRepository = () => {
    const repo: DistrictPurchasedPackageRepository = {
      findByDistrictId: async (_districtId: string): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testDistrictPurchasedPackageId1',
              curriculumPackageId: 'testPackageId1',
              districtId: 'testDistrictId1',
              createdUserId: 'testCreatedUserId1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testDistrictPurchasedPackageId2',
              curriculumPackageId: 'testPackageId2',
              districtId: 'testDistrictId2',
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
          value: 'test-district-purchased-package-id',
        }
      },
      create: async (_districtPurchasedPackage) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByDistrictId: jest.fn((districtId: string) => repo.findByDistrictId(districtId)),
      issueId: jest.fn(() => repo.issueId()),
      create: jest.fn((districtPurchasedPackage: DistrictPurchasedPackage) => repo.create(districtPurchasedPackage)),
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
  const createSuccessMockDistrictRepository = () => {
    const repo: DistrictRepository = {
      findById: async (_id: string) => {
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
  const createSuccessMockPackageRepository = () => {
    const repo: CurriculumPackageRepository = {
      findById: async (_id: string) => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'curriculumPackageId1',
            curriculumBrandId: 'codeillusion',
            name: 'name1',
            level: 'basic',
          },
        }
      },
      findByIds: async (_ids: string[]) => {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
      findByIds: jest.fn((ids: string[]) => repo.findByIds(ids)),
    }
  }
})
