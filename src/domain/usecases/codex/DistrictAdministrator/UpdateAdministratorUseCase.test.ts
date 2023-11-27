import { Administrator } from '../../../entities/codex/DistrictAdministrator'
import { UpdateAdministratorUseCase, IAdministratorRepository } from './UpdateAdministratorUseCase'
import { E, Errorable } from '../../shared/Errors'

const VALID_ADMINISTRATOR_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_ADMINISTRATOR_ID = 'district-id-00001'
const VALID_INPUT_DATA: Administrator = {
  email: 'admin_mock@email.com',
  firstName: 'admin_mock_firstname',
  lastName: 'admin_mock_lastname',
  administratorLMSId: 'admin_mock_lms_id',
}
const INVALID_INPUT_DATA: Administrator = {
  email: 'admin_mock',
  firstName: 'admin_mock_firstname',
  lastName: 'admin_mock_lastname',
  administratorLMSId: 'admin_mock_lms_id',
}
const VALID_OUTPUT_DATA: Administrator = {
  email: 'admin_mock@email.com',
  firstName: 'admin_mock_firstname',
  lastName: 'admin_mock_lastname',
  administratorLMSId: 'admin_mock_lms_id',
}

describe('Test UpdateDistrictAdministratorsUseCase', () => {
  test('Test UpdateDistrictAdministratorsUseCase - success', async () => {
    const districtAdministratorRepository: IAdministratorRepository = {
      updateAdministratorById: jest.fn(async function (): Promise<
        Errorable<Administrator, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'> | E<'EmailAlreadyExists'>>
      > {
        return {
          hasError: false,
          error: null,
          value: VALID_OUTPUT_DATA,
        }
      }),
    }
    const usecase = new UpdateAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(false)

    const updateDistrictAdministratorsSpy = districtAdministratorRepository.updateAdministratorById as jest.Mock

    expect(updateDistrictAdministratorsSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        VALID_ADMINISTRATOR_ID,
        VALID_INPUT_DATA,
      ],
    ])
    expect(result.value).toEqual(undefined)
  })

  test('When district administrator repository returns runtime error', async () => {
    const districtAdministratorRepository: IAdministratorRepository = {
      updateAdministratorById: jest.fn(async function (): Promise<
        Errorable<Administrator, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'> | E<'EmailAlreadyExists'>>
      > {
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
    const usecase = new UpdateAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const updateDistrictAdministratorsSpy = districtAdministratorRepository.updateAdministratorById as jest.Mock

    expect(updateDistrictAdministratorsSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        VALID_ADMINISTRATOR_ID,
        VALID_INPUT_DATA,
      ],
    ])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid administratorId returns invalid error', async () => {
    const districtAdministratorRepository: IAdministratorRepository = {
      updateAdministratorById: jest.fn(async function (): Promise<
        Errorable<Administrator, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'> | E<'EmailAlreadyExists'>>
      > {
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
    const usecase = new UpdateAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_ADMINISTRATOR_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const updateDistrictAdministratorsSpy = districtAdministratorRepository.updateAdministratorById as jest.Mock

    expect(updateDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidAdministratorId')
    expect(result.error?.message).toEqual('Invalid administratorId')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator or administrator - permission denied', async () => {
    const districtAdministratorRepository: IAdministratorRepository = {
      updateAdministratorById: jest.fn(async function (): Promise<
        Errorable<Administrator, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'> | E<'EmailAlreadyExists'>>
      > {
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
    const usecase = new UpdateAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_ADMINISTRATOR_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual("The user does not have permission to edit the specified administrator's information")
    expect(result.value).toEqual(null)
  })

  test('When provided invalid emails returns invalid email error', async () => {
    const districtAdministratorRepository: IAdministratorRepository = {
      updateAdministratorById: jest.fn(async function (): Promise<
        Errorable<Administrator, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'> | E<'EmailAlreadyExists'>>
      > {
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
    const usecase = new UpdateAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const updateDistrictAdministratorsSpy = districtAdministratorRepository.updateAdministratorById as jest.Mock

    expect(updateDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidEmail')
    expect(result.error?.message).toEqual('Invalid email is provided')
    expect(result.value).toEqual(null)
  })

  test('When provied Administrator is not found', async () => {
    const districtAdministratorRepository: IAdministratorRepository = {
      updateAdministratorById: jest.fn(async function (): Promise<
        Errorable<Administrator, E<'UnknownRuntimeError'> | E<'AdministratorNotFound'> | E<'EmailAlreadyExists'>>
      > {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: 'Administrator Id not found',
          },
          value: null,
        }
      }),
    }
    const usecase = new UpdateAdministratorUseCase(districtAdministratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ADMINISTRATOR_ID,
      VALID_INPUT_DATA,
    )

    const updateDistrictAdministratorsSpy = districtAdministratorRepository.updateAdministratorById as jest.Mock

    expect(updateDistrictAdministratorsSpy.mock.calls).toEqual([
      [
        {
          id: 'requested-user-id',
          loginId: 'login-id',
          role: 'internalOperator',
        },
        VALID_ADMINISTRATOR_ID,
        VALID_INPUT_DATA,
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.error?.message).toContain('Administrator Id not found')
  })
})
