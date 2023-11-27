import { GetDistrictByDistrictId, IDistrictRepository } from './GetDistrictByDistrictByIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictLMSInfo } from '../../../entities/codex/DistrictLMSInformation'
import { DistrictInfo } from './CreateDistrictUseCase'
import { District } from '../../../entities/codex/District'

const VALID_DISTRICT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_DISTRICT_ID = 'district-id-00001'

describe('test GetDIstrictByDistrictIdUseCase', () => {
  test('test GetDIstrictByDistrictIdUseCase - success', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictByDistrictId: jest.fn(async function (disrictId: string): Promise<Errorable<District, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'district-1',
            name: 'District of Columbia',
            districtLMSId: 'district-lms-id-1',
            stateId: 'AL',
            lastRosterSyncEventId: '',
            enableRosterSync: false,
            lmsId: null,
            lastRosterSyncEventDate: '',
          },
        }
      }),
    }

    const usecase = new GetDistrictByDistrictId(districtsRepository)
    const result = await usecase.run(VALID_DISTRICT_ID)

    const getDistrictLMSInformationByOrganizationIdSpy = districtsRepository.getDistrictByDistrictId as jest.Mock

    expect(getDistrictLMSInformationByOrganizationIdSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual({
      id: 'district-1',
      name: 'District of Columbia',
      districtLMSId: 'district-lms-id-1',
      stateId: 'AL',
      lastRosterSyncEventId: '',
      enableRosterSync: false,
      lmsId: null,
      lastRosterSyncEventDate: '',
    })
  })

  test('when user provided invalid format of district id', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictByDistrictId: jest.fn(async function (disrictId: string): Promise<Errorable<District, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as District,
        }
      }),
    }

    const usecase = new GetDistrictByDistrictId(districtsRepository)
    const result = await usecase.run(INVALID_DISTRICT_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidDistrictId')
    expect(result.value).toEqual(null)
  })

  test('when disrict repository returns run time error', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictByDistrictId: jest.fn(async function (organizationId: string): Promise<Errorable<District, E<'UnknownRuntimeError'>>> {
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

    const usecase = new GetDistrictByDistrictId(districtsRepository)
    const result = await usecase.run(VALID_DISTRICT_ID)

    const getDistrictLMSInformationByOrganizationIdSpy = districtsRepository.getDistrictByDistrictId as jest.Mock

    expect(getDistrictLMSInformationByOrganizationIdSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when disrict repository returns district not found error', async () => {
    const districtsRepository: IDistrictRepository = {
      getDistrictByDistrictId: jest.fn(async function (organizationId: string): Promise<Errorable<District, E<'DistrictInfoNotFound'>>> {
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

    const usecase = new GetDistrictByDistrictId(districtsRepository)
    const result = await usecase.run(VALID_DISTRICT_ID)
    const getDistrictLMSInformationByOrganizationIdSpy = districtsRepository.getDistrictByDistrictId as jest.Mock

    expect(getDistrictLMSInformationByOrganizationIdSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('DistrictInfoNotFound')
    expect(result.value).toEqual(null)
  })
})
