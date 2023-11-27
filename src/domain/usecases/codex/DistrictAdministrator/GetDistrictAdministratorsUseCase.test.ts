import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { GetDistrictAdministratorsUseCase, IDistrictAdministratorRepository } from './GetDistrictAdministratorsUseCase'
import { E, Errorable } from '../../shared/Errors'

const VALID_DISTRICT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_DISTRICT_ID = 'district-id-00001'
const VALID_ADMINISTRATOR_IDS = ['district-administrator-administrator-id-success-1', 'district-administrator-administrator-id-success-2']

describe('test GetDistrictAdministratorsUseCase', () => {
  test('test GetDistrictAdministratorsUseCase - success', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      getDistrictAdministrators: jest.fn(async function (): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              administratorId: 'district-administrator-administrator-id-success-1',
              userId: 'district-administrator-user-id-success-1',
              districtId: 'district-administrator-district-id-success-1',
              email: 'district-administrator-email-success-1',
              firstName: 'district-administrator-first-name-success-1',
              lastName: 'district-administrator-last-name-success-1',
              administratorLMSId: 'district-administrator-lms-id-success-1',
              createdUserId: 'district-administrator-created-user-id-success-1',
              createdDate: 'district-administrator-created-date-success-1',
            },
            {
              administratorId: 'district-administrator-administrator-id-success-2',
              userId: 'district-administrator-user-id-success-2',
              districtId: 'district-administrator-district-id-success-2',
              email: 'district-administrator-email-success-2',
              firstName: 'district-administrator-first-name-success-2',
              lastName: 'district-administrator-last-name-success-2',
              administratorLMSId: 'district-administrator-lms-id-success-2',
              createdUserId: 'district-administrator-created-user-id-success-2',
              createdDate: 'district-administrator-created-date-success-2',
            },
          ],
        }
      }),
    }
    const usecase = new GetDistrictAdministratorsUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      VALID_ADMINISTRATOR_IDS,
    )

    expect(result.hasError).toEqual(false)

    const getDistrictAdministratorsSpy = districtAdministratorRepository.getDistrictAdministrators as jest.Mock

    expect(getDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_DISTRICT_ID, VALID_ADMINISTRATOR_IDS]])
    expect(result.value).toEqual([
      {
        administratorId: 'district-administrator-administrator-id-success-1',
        userId: 'district-administrator-user-id-success-1',
        districtId: 'district-administrator-district-id-success-1',
        email: 'district-administrator-email-success-1',
        firstName: 'district-administrator-first-name-success-1',
        lastName: 'district-administrator-last-name-success-1',
        administratorLMSId: 'district-administrator-lms-id-success-1',
        createdUserId: 'district-administrator-created-user-id-success-1',
        createdDate: 'district-administrator-created-date-success-1',
      },
      {
        administratorId: 'district-administrator-administrator-id-success-2',
        userId: 'district-administrator-user-id-success-2',
        districtId: 'district-administrator-district-id-success-2',
        email: 'district-administrator-email-success-2',
        firstName: 'district-administrator-first-name-success-2',
        lastName: 'district-administrator-last-name-success-2',
        administratorLMSId: 'district-administrator-lms-id-success-2',
        createdUserId: 'district-administrator-created-user-id-success-2',
        createdDate: 'district-administrator-created-date-success-2',
      },
    ] as DistrictAdministrator[])
  })

  test('There is no district administrator', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      getDistrictAdministrators: jest.fn(async function (): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new GetDistrictAdministratorsUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      VALID_ADMINISTRATOR_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: `No district administrator found for district id ${VALID_DISTRICT_ID}`,
      type: 'DistrictAdministratorNotFoundError',
    })

    const getDistrictAdministratorsSpy = districtAdministratorRepository.getDistrictAdministrators as jest.Mock

    expect(getDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_DISTRICT_ID, VALID_ADMINISTRATOR_IDS]])
    expect(result.value).toEqual(null)
  })

  test('When district administrator repository returns runtime error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      getDistrictAdministrators: jest.fn(async function (): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetDistrictAdministratorsUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      VALID_ADMINISTRATOR_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getDistrictAdministratorsSpy = districtAdministratorRepository.getDistrictAdministrators as jest.Mock

    expect(getDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_DISTRICT_ID, VALID_ADMINISTRATOR_IDS]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid districtId returns invalid error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      getDistrictAdministrators: jest.fn(async function (): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetDistrictAdministratorsUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_DISTRICT_ID,
      VALID_ADMINISTRATOR_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getDistrictAdministratorsSpy = districtAdministratorRepository.getDistrictAdministrators as jest.Mock

    expect(getDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidDistrictId')
    expect(result.error?.message).toEqual('Invalid districtId')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator - permission denied', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      getDistrictAdministrators: jest.fn(async function (): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new GetDistrictAdministratorsUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_DISTRICT_ID,
      VALID_ADMINISTRATOR_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('Access Denied')
    expect(result.value).toEqual(null)
  })
})
