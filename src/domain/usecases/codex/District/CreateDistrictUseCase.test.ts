import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { CreateDistrictUseCase, DistrictInfo, IDistrictRepository } from './CreateDistrictUseCase'

describe('test CreateDistrictUseCase', () => {
  test('success', async () => {
    const districtRepository: IDistrictRepository = {
      createDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateDistrictUseCase(districtRepository)
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
    )

    expect(result.hasError).toEqual(false)

    const createDistrictSpy = districtRepository.createDistrict as jest.Mock

    expect(createDistrictSpy.mock.calls).toEqual([
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
      ],
    ])
    expect(result.value).toEqual(undefined)
  })

  test('given district already exists', async () => {
    const districtRepository: IDistrictRepository = {
      createDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateDistrictUseCase(districtRepository)

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
    )

    const createDistrictSpy = districtRepository.createDistrict as jest.Mock

    expect(createDistrictSpy.mock.calls).toEqual([
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
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistError')
    expect(result.value).toEqual(null)
  })

  test('the repository returns unknown runtime error', async () => {
    const districtRepository: IDistrictRepository = {
      createDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateDistrictUseCase(districtRepository)

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
    )
    const createDistrictSpy = districtRepository.createDistrict as jest.Mock

    expect(createDistrictSpy.mock.calls).toEqual([
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
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator - permission denied', async () => {
    const districtRepository: IDistrictRepository = {
      createDistrict: jest.fn(async function (user: User, district: DistrictInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new CreateDistrictUseCase(districtRepository)

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
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })
})
