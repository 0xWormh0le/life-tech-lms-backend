import { E, Errorable } from '../../shared/Errors'
import { CleverDeleteDistrictAdministratorUseCase, IDistrictAdministratorRepository } from './CleverDeleteDistrictAdministratorUseCase'

const VALID_ADMINISTRATOR_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_ADMINISTRATOR_ID = 'district-id-00001'

describe('Test CleverDeleteDistrictAdministratorUseCase', () => {
  test('Test CleverDeleteDistrictAdministratorUseCase - success', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      deactivateDistrictAdministrators: jest.fn(async function (): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            message: 'ok',
          },
        }
      }),
    }
    const usecase = new CleverDeleteDistrictAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
    )

    expect(result.hasError).toEqual(false)

    const deleteDistrictAdministratorsSpy = districtAdministratorRepository.deactivateDistrictAdministrators as jest.Mock

    expect(deleteDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_ADMINISTRATOR_ID]])
    expect(result.value).toEqual(undefined)
  })

  test('When district administrator repository returns runtime error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      deactivateDistrictAdministrators: jest.fn(async function (): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
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
    const usecase = new CleverDeleteDistrictAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
    )

    expect(result.hasError).toEqual(true)

    const deleteDistrictAdministratorsSpy = districtAdministratorRepository.deactivateDistrictAdministrators as jest.Mock

    expect(deleteDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_ADMINISTRATOR_ID]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid administratorId returns invalid error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      deactivateDistrictAdministrators: jest.fn(async function (): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
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
    const usecase = new CleverDeleteDistrictAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_ADMINISTRATOR_ID,
    )

    expect(result.hasError).toEqual(true)

    const deleteDistrictAdministratorsSpy = districtAdministratorRepository.deactivateDistrictAdministrators as jest.Mock

    expect(deleteDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidAdministratorId')
    expect(result.error?.message).toEqual('Invalid administratorId')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator - permission denied', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      deactivateDistrictAdministrators: jest.fn(async function (): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: { message: 'failure' },
        }
      }),
    }
    const usecase = new CleverDeleteDistrictAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_ADMINISTRATOR_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('Access Denied')
    expect(result.value).toEqual(null)
  })

  test('When provied administrator is not found', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      deactivateDistrictAdministrators: jest.fn(async function (): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError' | 'AdministratorNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: 'Administrator not found',
          },
          value: null,
        }
      }),
    }
    const usecase = new CleverDeleteDistrictAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
    )

    const deleteDistrictAdministratorsSpy = districtAdministratorRepository.deactivateDistrictAdministrators as jest.Mock

    expect(deleteDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_ADMINISTRATOR_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.error?.message).toEqual('Administrator not found')
  })
})
