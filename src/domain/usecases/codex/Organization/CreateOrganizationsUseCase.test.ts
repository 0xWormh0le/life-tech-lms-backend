import { User } from '../../../entities/codex/User'
import { Errorable, E } from '../../shared/Errors'
import { IOrganizationRepository, OrganizationInfo, CreateOrganizationUseCase } from './CreateOrganizationUseCase'

describe('test CreateOrganizationUseCase', () => {
  test('test CreateOrganizationUseCase - success', async () => {
    const oganizationRepository: IOrganizationRepository = {
      createOrganization: jest.fn(async function (organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateOrganizationUseCase(oganizationRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Sunrise',
        districtId: 'district-1',
        stateId: 'state-1',
        organizationLMSId: 'lms-1',
        createdUserId: 'user-id-1',
      },
    )
    const createOrganizationSpy = oganizationRepository.createOrganization as jest.Mock

    expect(createOrganizationSpy.mock.calls).toEqual([
      [
        {
          name: 'Sunrise',
          districtId: 'district-1',
          stateId: 'state-1',
          organizationLMSId: 'lms-1',
          createdUserId: 'user-id-1',
        },
      ],
    ])
    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual(undefined)
  })

  test('given organization already exits in same district', async () => {
    const oganizationRepository: IOrganizationRepository = {
      createOrganization: jest.fn(async function (organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Sunrise',
        districtId: 'district-1',
        stateId: 'state-1',
        organizationLMSId: 'lms-1',
        createdUserId: 'user-id-1',
      },
    )

    const createOrganizationSpy = oganizationRepository.createOrganization as jest.Mock

    expect(createOrganizationSpy.mock.calls).toEqual([
      [
        {
          name: 'Sunrise',
          districtId: 'district-1',
          stateId: 'state-1',
          organizationLMSId: 'lms-1',
          createdUserId: 'user-id-1',
        },
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AlreadyExistError')
    expect(result.value).toEqual(null)
  })

  test('when organization repository returns runtime error', async () => {
    const oganizationRepository: IOrganizationRepository = {
      createOrganization: jest.fn(async function (organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>> {
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
    const usecase = new CreateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      {
        name: 'Sunrise',
        districtId: 'district-1',
        stateId: 'state-1',
        organizationLMSId: 'lms-1',
        createdUserId: 'user-id-1',
      },
    )

    const createOrganizationSpy = oganizationRepository.createOrganization as jest.Mock

    expect(createOrganizationSpy.mock.calls).toEqual([
      [
        {
          name: 'Sunrise',
          districtId: 'district-1',
          stateId: 'state-1',
          organizationLMSId: 'lms-1',
          createdUserId: 'user-id-1',
        },
      ],
    ])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator - permission denied', async () => {
    const oganizationRepository: IOrganizationRepository = {
      createOrganization: jest.fn(async function (organization: OrganizationInfo): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new CreateOrganizationUseCase(oganizationRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      {
        name: 'Sunrise',
        districtId: 'district-1',
        stateId: 'state-1',
        organizationLMSId: 'lms-1',
        createdUserId: 'user-id-1',
      },
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })
})
