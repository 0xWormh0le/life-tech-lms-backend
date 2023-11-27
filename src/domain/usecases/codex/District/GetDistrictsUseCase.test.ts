import { District } from '../../../entities/codex/District'
import { Errorable, E } from '../../shared/Errors'
import { GetDistrictsUseCase, IDistrictRepository } from './GetDistrictsUseCase'

describe('test GetDistrictsUseCase', () => {
  test('test GetDistrictsUseCase - success', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (
        districtIds?: string[],
        LMSId?: string,
        enabledRosterSync?: boolean,
      ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'district-1',
              name: 'District of Columbia',
              districtLMSId: '1',
              lmsId: null,
            },
            {
              id: 'district-2',
              name: 'District of Florida',
              districtLMSId: '1',
              lmsName: 'clever',
            },
          ] as District[],
        }
      }),
    }
    const usecase = new GetDistrictsUseCase(districtsRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      ['district-id-1', 'district-id-2'],
    )

    expect(result.hasError).toEqual(false)

    const getDistrictsByUserIdSpy = districtsRepository.getDistricts as jest.Mock

    expect(getDistrictsByUserIdSpy.mock.calls).toEqual([[['district-id-1', 'district-id-2'], undefined, undefined]])

    expect(result.value).toEqual([
      {
        id: 'district-1',
        name: 'District of Columbia',
        districtLMSId: '1',
        lmsId: null,
      },
      {
        id: 'district-2',
        name: 'District of Florida',
        districtLMSId: '1',
        lmsName: 'clever',
      },
    ] as District[])
  })

  test('when districts repository returns runtime error', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (
        districtIds?: string[],
        LMSId?: string,
        enabledRosterSync?: boolean,
      ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> {
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

    const usecase = new GetDistrictsUseCase(districtsRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      ['district-id-1', 'district-id-2'],
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator - permission denied', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (
        districtIds?: string[],
        LMSId?: string,
        enabledRosterSync?: boolean,
      ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetDistrictsUseCase(districtsRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      ['district-id-1', 'district-id-2'],
      undefined,
      undefined,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when one of district id not found', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (
        districtIds?: string[],
        LMSId?: string,
        enabledRosterSync?: boolean,
      ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'district-1',
              name: 'District of Florida',
              districtLMSId: '1',
              lmsId: 'clever',
            },
          ] as District[],
        }
      }),
    }

    const usecase = new GetDistrictsUseCase(districtsRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      ['district-id-1', 'district-id-2'],
    )

    const getDistrictsByUserIdSpy = districtsRepository.getDistricts as jest.Mock

    expect(getDistrictsByUserIdSpy.mock.calls).toEqual([[['district-id-1', 'district-id-2'], undefined, undefined]])

    expect(result.hasError).toEqual(false)
    expect(result.value?.length).not.toEqual(2)
  })
})
