import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'

import { DistrictInfo, EditDistrictUseCase, IDistrictRepository } from './EditDistrictUseCase'

describe('test EditDistrictUseCase.test', () => {
  test('success', async () => {
    const districtRepository: IDistrictRepository = {
      editDistrict: jest.fn(async function (user: User, district: DistrictInfo, districtId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new EditDistrictUseCase(districtRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'District of Columbia',
        districtLMSId: '1',
        lmsId: '1',
      },
      'district-id-1',
    )

    expect(result.hasError).toEqual(false)

    const editDistrictSpy = districtRepository.editDistrict as jest.Mock

    expect(editDistrictSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'District of Columbia',
          districtLMSId: '1',
          lmsId: '1',
        },
        'district-id-1',
      ],
    ])
    expect(result.value).toEqual(undefined)
  })

  test('given district already exists', async () => {
    const districtRepository: IDistrictRepository = {
      editDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'district already exists',
          },
          value: null,
        }
      }),
    }
    const usecase = new EditDistrictUseCase(districtRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'District of Columbia',
        districtLMSId: '1',
        lmsId: '1',
      },
      'district-id-1',
    )

    const editDistrictSpy = districtRepository.editDistrict as jest.Mock

    expect(editDistrictSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'District of Columbia',
          districtLMSId: '1',
          lmsId: '1',
        },
        'district-id-1',
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistError')
    expect(result.value).toEqual(null)
  })

  test('the repository returns unknown runtime error', async () => {
    const districtRepository: IDistrictRepository = {
      editDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new EditDistrictUseCase(districtRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'District of Columbia',
        districtLMSId: '1',
        lmsId: '1',
      },
      'district-id-1',
    )
    const editDistrictSpy = districtRepository.editDistrict as jest.Mock

    expect(editDistrictSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'District of Columbia',
          districtLMSId: '1',
          lmsId: '1',
        },
        'district-id-1',
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('there is no district information found to the requested district id', async () => {
    const districtRepository: IDistrictRepository = {
      editDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'DistrictInfoNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: 'District info not found',
          },
          value: null,
        }
      }),
    }
    const usecase = new EditDistrictUseCase(districtRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'District of Columbia',
        districtLMSId: '1',
        lmsId: '1',
      },
      'district-id-1',
    )
    const editDistrictSpy = districtRepository.editDistrict as jest.Mock

    expect(editDistrictSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        {
          name: 'District of Columbia',
          districtLMSId: '1',
          lmsId: '1',
        },
        'district-id-1',
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('DistrictInfoNotFound')
  })

  test('user is not internal operator - permission denied', async () => {
    const districtRepository: IDistrictRepository = {
      editDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new EditDistrictUseCase(districtRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      {
        name: 'District of Columbia',
        districtLMSId: '1',
        lmsId: '1',
      },
      'district-id-1',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })
})
