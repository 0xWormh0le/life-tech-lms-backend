import { Errorable, E } from '../../shared/Errors'
import { DeleteDistrictUseCase, IDistrictRepository } from './DeleteDistrictUseCase'

describe('test DeleteDistrictUseCase', () => {
  test('success', async () => {
    const deleteDistrictsRepository: IDistrictRepository = {
      deleteDistrict: jest.fn(async function (districtId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new DeleteDistrictUseCase(deleteDistrictsRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(false)

    const deleteDistrictSpy = deleteDistrictsRepository.deleteDistrict as jest.Mock

    expect(deleteDistrictSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])

    expect(result.value).toEqual(undefined)
  })

  test('user is not internal operator - permission denied', async () => {
    const deleteDistrictsRepository: IDistrictRepository = {
      deleteDistrict: jest.fn(async function (districtId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteDistrictUseCase(deleteDistrictsRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid districtId returns invalid error', async () => {
    const deleteDistrictsRepository: IDistrictRepository = {
      deleteDistrict: jest.fn(async function (districtId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteDistrictUseCase(deleteDistrictsRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'district-id-1',
    )

    expect(result.hasError).toEqual(true)

    const deleteDistrictSpy = deleteDistrictsRepository.deleteDistrict as jest.Mock

    expect(deleteDistrictSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidDistrictId')
    expect(result.error?.message).toEqual('Invalid districtId')
    expect(result.value).toEqual(null)
  })

  test('there is no district information found to the requested district id', async () => {
    const deleteDistrictsRepository: IDistrictRepository = {
      deleteDistrict: jest.fn(async function (districtId: string): Promise<Errorable<void, E<'DistrictInfoNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: 'District info not found of requested districtId',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteDistrictUseCase(deleteDistrictsRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const deleteDistrictSpy = deleteDistrictsRepository.deleteDistrict as jest.Mock

    expect(deleteDistrictSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('DistrictInfoNotFound')
  })

  test('the repository returns unknown runtime error', async () => {
    const deleteDistrictsRepository: IDistrictRepository = {
      deleteDistrict: jest.fn(async function (districtId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error occurred',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteDistrictUseCase(deleteDistrictsRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'b9484b02-2d71-4b3f-afb0-57057843a59d',
    )
    const deleteDistrictSpy = deleteDistrictsRepository.deleteDistrict as jest.Mock

    expect(deleteDistrictSpy.mock.calls).toEqual([['b9484b02-2d71-4b3f-afb0-57057843a59d']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
