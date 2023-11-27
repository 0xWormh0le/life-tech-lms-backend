import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { IOrganizationRepository, DeleteOrganizationUseCase } from './DeleteOrganizationUseCase'

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

describe('test DeleteOrganizationUseCase', () => {
  test('test DeleteOrganizationUseCase - success', async () => {
    const oganizationRepository: IOrganizationRepository = {
      deleteOrganization: jest.fn(async function (organizationId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new DeleteOrganizationUseCase(oganizationRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID)
    const deleteOrganizationSpy = oganizationRepository.deleteOrganization as jest.Mock

    expect(deleteOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID]])
    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('when requested organizationId  not found', async () => {
    const oganizationRepository: IOrganizationRepository = {
      deleteOrganization: jest.fn(async function (organizationId: string): Promise<Errorable<void, E<'OrganizationIdNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'OrganizationIdNotFound',
            message: 'requested organizationId not found',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID)
    const deleteOrganizationSpy = oganizationRepository.deleteOrganization as jest.Mock

    expect(deleteOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('OrganizationIdNotFound')
    expect(result.value).toEqual(null)
  })

  test('invalid requested oraganizationId', async () => {
    const oganizationRepository: IOrganizationRepository = {
      deleteOrganization: jest.fn(async function (organizationId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new DeleteOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, INVALID_ORGANIZATION_ID)

    const deleteOrganizationSpy = oganizationRepository.deleteOrganization as jest.Mock

    expect(deleteOrganizationSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.value).toEqual(null)
  })

  test('when organization repository returns runtime error', async () => {
    const oganizationRepository: IOrganizationRepository = {
      deleteOrganization: jest.fn(async function (organizationId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new DeleteOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(VALID_USER_DATA, VALID_ORGANIZATION_ID)

    const deleteOrganizationSpy = oganizationRepository.deleteOrganization as jest.Mock

    expect(deleteOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator - permission denied', async () => {
    const oganizationRepository: IOrganizationRepository = {
      deleteOrganization: jest.fn(async function (organizationId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new DeleteOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(INVALID_USER_DATA, VALID_ORGANIZATION_ID)

    const deleteOrganizationSpy = oganizationRepository.deleteOrganization as jest.Mock

    expect(deleteOrganizationSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })
})
