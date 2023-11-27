import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { OrganizationInfo } from './CreateOrganizationUseCase'
import { IOrganizationRepository, UpdateOrganizationUseCase } from './UpdateOrganizationUseCase'

const VALID_ORGANIZATION_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_ORGANIZATION_ID = 'organization-id-00001'
const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'internalOperator',
}
const INVALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'student',
}
const VALID_INPUT_DATA: OrganizationInfo = {
  name: 'Sunrise',
  districtId: 'district-1',
  stateId: 'state-1',
}

describe('test UpdateOrganizationUseCase', () => {
  test('test UpdateOrganizationUseCase - success', async () => {
    const oganizationRepository: IOrganizationRepository = {
      updateOrganization: jest.fn(async function (
        organizationId: string,
        organization: OrganizationInfo,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new UpdateOrganizationUseCase(oganizationRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID, VALID_INPUT_DATA)
    const updateOrganizationSpy = oganizationRepository.updateOrganization as jest.Mock

    expect(updateOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_INPUT_DATA]])
    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('when requested organizationId organization information not found', async () => {
    const oganizationRepository: IOrganizationRepository = {
      updateOrganization: jest.fn(async function (
        organizationId: string,
        organization: OrganizationInfo,
      ): Promise<Errorable<void, E<'OrganizationNotFoundError'>>> {
        return {
          hasError: true,
          error: {
            type: 'OrganizationNotFoundError',
            message: 'requested organizationId  information not found',
          },
          value: null,
        }
      }),
    }
    const usecase = new UpdateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID, VALID_INPUT_DATA)
    const updateOrganizationSpy = oganizationRepository.updateOrganization as jest.Mock

    expect(updateOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_INPUT_DATA]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('OrganizationNotFoundError')
    expect(result.value).toEqual(null)
  })

  test('invalid requested oraganizationId', async () => {
    const oganizationRepository: IOrganizationRepository = {
      updateOrganization: jest.fn(async function (organizationId: string, organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, INVALID_ORGANIZATION_ID, VALID_INPUT_DATA)

    const updateOrganizationSpy = oganizationRepository.updateOrganization as jest.Mock

    expect(updateOrganizationSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.value).toEqual(null)
  })

  test('given organization already exits in same district', async () => {
    const oganizationRepository: IOrganizationRepository = {
      updateOrganization: jest.fn(async function (organizationId: string, organization: OrganizationInfo): Promise<Errorable<void, E<'AlreadyExistError'>>> {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'organization already exists',
          },
          value: null,
        }
      }),
    }
    const usecase = new UpdateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID, VALID_INPUT_DATA)

    const updateOrganizationSpy = oganizationRepository.updateOrganization as jest.Mock

    expect(updateOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_INPUT_DATA]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistError')
    expect(result.value).toEqual(null)
  })

  test('when organization repository returns runtime error', async () => {
    const oganizationRepository: IOrganizationRepository = {
      updateOrganization: jest.fn(async function (organizationId: string, organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID, VALID_INPUT_DATA)

    const updateOrganizationSpy = oganizationRepository.updateOrganization as jest.Mock

    expect(updateOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_INPUT_DATA]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator - permission denied', async () => {
    const oganizationRepository: IOrganizationRepository = {
      updateOrganization: jest.fn(async function (organizationId: string, organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(INVALID_USER_DATA, VALID_ORGANIZATION_ID, VALID_INPUT_DATA)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })
})
