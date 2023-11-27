import { IDistrictRepository, GetDistrictLMSInformationByOrganizationUseCase } from './GetDistrictLMSInformationByOrganizationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictLMSInfo } from '../../../entities/codex/DistrictLMSInformation'

const VALID_ORGANIZATION_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_ORGANIZATION_ID = 'organization-id-00001'

describe('test GetDistrictLMSInformationByOrganizationUseCase', () => {
  test('test GetDistrictLMSInformationByOrganizationUseCase - success', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictLMSInformationByOrganizationId: jest.fn(async function (
        organizationId: string,
      ): Promise<Errorable<DistrictLMSInfo, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            districtId: 'district-id-1',
            districtName: 'AL',
            lmsId: 'clever',
          },
        }
      }),
    }

    const usecase = new GetDistrictLMSInformationByOrganizationUseCase(districtsRepository)
    const result = await usecase.run(VALID_ORGANIZATION_ID)

    const getDistrictLMSInformationByOrganizationIdSpy = districtsRepository.getDistrictLMSInformationByOrganizationId as jest.Mock

    expect(getDistrictLMSInformationByOrganizationIdSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual({
      districtId: 'district-id-1',
      districtName: 'AL',
      lmsId: 'clever',
    })
  })

  test('when user provided invalid format of organization id', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictLMSInformationByOrganizationId: jest.fn(async function (
        organizationId: string,
      ): Promise<Errorable<DistrictLMSInfo, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictLMSInfo,
        }
      }),
    }

    const usecase = new GetDistrictLMSInformationByOrganizationUseCase(districtsRepository)
    const result = await usecase.run(INVALID_ORGANIZATION_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.value).toEqual(null)
  })

  test('when disrict repository returns run time error', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictLMSInformationByOrganizationId: jest.fn(async function (
        organizationId: string,
      ): Promise<Errorable<DistrictLMSInfo, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }

    const usecase = new GetDistrictLMSInformationByOrganizationUseCase(districtsRepository)
    const result = await usecase.run(VALID_ORGANIZATION_ID)

    const getDistrictLMSInformationByOrganizationIdSpy = districtsRepository.getDistrictLMSInformationByOrganizationId as jest.Mock

    expect(getDistrictLMSInformationByOrganizationIdSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when disrict repository returns district not found error', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictLMSInformationByOrganizationId: jest.fn(async function (
        organizationId: string,
      ): Promise<Errorable<DistrictLMSInfo, E<'DistrictInfoNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'DistrictInfoNotFound',
            message: 'district information not found of organzation',
          },
          value: null,
        }
      }),
    }

    const usecase = new GetDistrictLMSInformationByOrganizationUseCase(districtsRepository)
    const result = await usecase.run(VALID_ORGANIZATION_ID)

    const getDistrictLMSInformationByOrganizationIdSpy = districtsRepository.getDistrictLMSInformationByOrganizationId as jest.Mock

    expect(getDistrictLMSInformationByOrganizationIdSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('DistrictInfoNotFound')
    expect(result.value).toEqual(null)
  })
})
