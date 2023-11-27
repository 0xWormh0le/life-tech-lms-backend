import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { Organizations } from '../../../entities/codex/Organization'
import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { GetOrganizationsUseCase, IOrganizationRepository, IAdministratorRepository } from './GetOrganizationsUseCase'

describe('test GetOrganizationsUseCase', () => {
  test('test GetOrganizationsUseCase - success', async () => {
    const getOrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (districtId: string, organizationIds?: string[]): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'organization-1',
              name: 'Sunrise',
              districtId: 'district-1',
              stateId: 'state-1',
              createdUserId: 'user-id-1',
              organizationLMSId: 'lms-id-1',
              createdDate: '2022-05-17T11:54:02.141Z',
              updatedDate: '2022-05-17T11:54:02.141Z',
            },
            {
              id: 'organization-2',
              name: 'Delta',
              districtId: 'district-1',
              stateId: 'state-1',
              createdUserId: 'user-id-1',
              organizationLMSId: 'lms-id-1',
              createdDate: '2022-05-17T11:54:02.141Z',
              updatedDate: '2022-05-17T11:54:02.141Z',
            },
          ] as Organizations[],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetOrganizationsUseCase(getOrganizationRepository, districtAdministratorRepositroy)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'district-1',
      ['organization-id-1', 'organization-id-2'],
    )

    const getOrganizationsByUserIdSpy = getOrganizationRepository.getOrganizations as jest.Mock

    expect(getOrganizationsByUserIdSpy.mock.calls).toEqual([['district-1', ['organization-id-1', 'organization-id-2']]])
    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        id: 'organization-1',
        name: 'Sunrise',
        districtId: 'district-1',
        stateId: 'state-1',
        createdUserId: 'user-id-1',
        organizationLMSId: 'lms-id-1',
        createdDate: '2022-05-17T11:54:02.141Z',
        updatedDate: '2022-05-17T11:54:02.141Z',
      },
      {
        id: 'organization-2',
        name: 'Delta',
        districtId: 'district-1',
        stateId: 'state-1',
        createdUserId: 'user-id-1',
        organizationLMSId: 'lms-id-1',
        createdDate: '2022-05-17T11:54:02.141Z',
        updatedDate: '2022-05-17T11:54:02.141Z',
      },
    ] as Organizations[])
  })

  test('when organization repository returns runtime error', async () => {
    const getOrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (districtId: string, organizationIds?: string[]): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
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

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetOrganizationsUseCase(getOrganizationRepository, districtAdministratorRepositroy)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      'district-1',
      ['organization-id-1', 'organization-id-2'],
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator - permission denied', async () => {
    const getOrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (districtId: string, organizationIds?: string[]): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
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
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetOrganizationsUseCase(getOrganizationRepository, districtAdministratorRepositroy)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      'district-1',
      ['organization-id-1', 'organization-id-2'],
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('District administrator can get see of his organizations only', async () => {
    const getOrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (districtId: string, organizationIds?: string[]): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { districtId: 'district-2' } as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetOrganizationsUseCase(getOrganizationRepository, districtAdministratorRepositroy)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      'district-1',
      ['organization-id-1', 'organization-id-2'],
    )

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const getOrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (districtId: string, organizationIds?: string[]): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new GetOrganizationsUseCase(getOrganizationRepository, districtAdministratorRepositroy)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      'district-1',
      ['organization-id-1', 'organization-id-2'],
    )
    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('when administrator repository returns run time error', async () => {
    const getOrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (districtId: string, organizationIds?: string[]): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }

    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetOrganizationsUseCase(getOrganizationRepository, districtAdministratorRepositroy)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      'district-1',
      ['organization-id-1', 'organization-id-2'],
    )
    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
