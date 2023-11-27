import { DistrictRosterSyncStatus } from '../../entities/codex/DistrictRosterSyncStatus'
import { User } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'
import { E, Errorable } from '../shared/Errors'
import { GetDistrictRosterSyncStatusUseCase, IDistrictRosterSyncStatusRepository } from './GetDistrictRosterSyncStatusUseCase'

const VALID_DISTRICT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_DISTRICT_ID = 'district-id-00001'
const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: UserRoles.internalOperator,
}
const INVALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: UserRoles.student,
}

describe('test GetRosterSyncStatusUseCase', () => {
  test('GetRosterSyncStatusUseCase success', async () => {
    const districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository = {
      getDistrictRosterSyncStatus: jest.fn(async function (districtId: string): Promise<Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'id',
            districtId: 'districtId',
            startedAt: '2022-10-05T14:48:00.000Z',
            finishedAt: '2022-10-05T14:50:00.000Z',
            errorMessage: 'any-error',
            createdUserId: 'userId',
          },
        }
      }),
    }

    const getRosterSyncStatusUseCase = new GetDistrictRosterSyncStatusUseCase(districtRosterSyncStatusRepository)

    const result = await getRosterSyncStatusUseCase.run(VALID_USER_DATA, VALID_DISTRICT_ID)

    expect(result.hasError).toEqual(false)

    const getLessonsByPackageIdSpy = districtRosterSyncStatusRepository.getDistrictRosterSyncStatus as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])
    expect(result.value).toEqual<DistrictRosterSyncStatus>({
      id: 'id',
      districtId: 'districtId',
      startedAt: '2022-10-05T14:48:00.000Z',
      finishedAt: '2022-10-05T14:50:00.000Z',
      errorMessage: 'any-error',
      createdUserId: 'userId',
    })
  })

  test('when user provided invalid districtId', async () => {
    const districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository = {
      getDistrictRosterSyncStatus: jest.fn(async function (districtId: string): Promise<Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'id',
            districtId: 'districtId',
            startedAt: '2022-10-05T14:48:00.000Z',
            finishedAt: '2022-10-05T14:50:00.000Z',
            errorMessage: 'any-error',
            createdUserId: 'userId',
          },
        }
      }),
    }

    const getRosterSyncStatusUseCase = new GetDistrictRosterSyncStatusUseCase(districtRosterSyncStatusRepository)

    const result = await getRosterSyncStatusUseCase.run(VALID_USER_DATA, INVALID_DISTRICT_ID)

    const getLessonsByPackageIdSpy = districtRosterSyncStatusRepository.getDistrictRosterSyncStatus as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidDistrictId')
    expect(result.error?.message).toEqual('Invalid format of DistrictId.')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator - permission denied', async () => {
    const districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository = {
      getDistrictRosterSyncStatus: jest.fn(async function (districtId: string): Promise<Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'id',
            districtId: 'districtId',
            startedAt: '2022-10-05T14:48:00.000Z',
            finishedAt: '2022-10-05T14:50:00.000Z',
            errorMessage: 'any-error',
            createdUserId: 'userId',
          },
        }
      }),
    }

    const getRosterSyncStatusUseCase = new GetDistrictRosterSyncStatusUseCase(districtRosterSyncStatusRepository)
    const result = await getRosterSyncStatusUseCase.run(INVALID_USER_DATA, VALID_DISTRICT_ID)

    const getLessonsByPackageIdSpy = districtRosterSyncStatusRepository.getDistrictRosterSyncStatus as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view roster sync status.')
    expect(result.value).toEqual(null)
  })

  test('when DistrictRosterSyncStatusRepository returns unknown run time error', async () => {
    const districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository = {
      getDistrictRosterSyncStatus: jest.fn(async function (districtId: string): Promise<Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `Failed to get roster sync status of district : ${districtId}`,
          },
          value: null,
        }
      }),
    }

    const getRosterSyncStatusUseCase = new GetDistrictRosterSyncStatusUseCase(districtRosterSyncStatusRepository)
    const result = await getRosterSyncStatusUseCase.run(VALID_USER_DATA, VALID_DISTRICT_ID)

    const getLessonsByPackageIdSpy = districtRosterSyncStatusRepository.getDistrictRosterSyncStatus as jest.Mock

    expect(getLessonsByPackageIdSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
