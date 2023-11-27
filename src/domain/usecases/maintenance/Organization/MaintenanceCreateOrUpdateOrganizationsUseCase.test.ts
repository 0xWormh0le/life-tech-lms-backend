import { MaintenanceOrganization } from '../../../entities/maintenance/Organization'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceCreateOrUpdateOrganizationsUseCase, IOrganizationRepository } from './MaintenanceCreateOrUpdateOrganizationsUseCase'

describe('test MaintenanceCreateOrUpdateOrganizationsUseCase', () => {
  test('success', async () => {
    const requestedOrganizations: Parameters<MaintenanceCreateOrUpdateOrganizationsUseCase['run']>[0] = [
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-1',
        organizationLmsId: 'organization-lms-id-1',
      },
      {
        id: 'Organization-id-2', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-2',
        organizationLmsId: null,
      },
      {
        id: 'Organization-id-3', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-3',
        organizationLmsId: null,
      },
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-4',
        organizationLmsId: null,
      },
    ]
    const OrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (OrganizationIds: string[]): Promise<Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'Organization-id-2', // should be already exist
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-2-old',
              organizationLmsId: null,
            },
            {
              id: 'Organization-id-3', // should be already exist
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-3-old',
              organizationLmsId: null,
            },
          ],
        }
      }),
      createOrganizations: jest.fn(async function (
        Organizations: Omit<MaintenanceOrganization, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      updateOrganizations: jest.fn(async function (
        Organizations: MaintenanceOrganization[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateOrganizationsUseCase(OrganizationRepository)

    const result = await usecase.run(requestedOrganizations)

    expect(result.hasError).toEqual(false)

    const getOrganizationsSpy = OrganizationRepository.getOrganizations as jest.Mock

    expect(getOrganizationsSpy.mock.calls).toEqual([[['Organization-id-2', 'Organization-id-3']]])

    const createOrganizationsSpy = OrganizationRepository.createOrganizations as jest.Mock

    expect(createOrganizationsSpy.mock.calls).toEqual([
      [
        [
          {
            districtId: 'district-id',
            stateId: 'AL',
            name: 'Organization-1',
            organizationLmsId: 'organization-lms-id-1',
          },
          {
            districtId: 'district-id',
            stateId: 'AL',
            name: 'Organization-4',
            organizationLmsId: null,
          },
        ],
      ],
    ])

    const updateOrganizationsSpy = OrganizationRepository.updateOrganizations as jest.Mock

    expect(updateOrganizationsSpy.mock.calls).toEqual([
      [
        [
          {
            id: 'Organization-id-2',
            districtId: 'district-id',
            stateId: 'AL',
            name: 'Organization-2',
            organizationLmsId: null,
          },
          {
            id: 'Organization-id-3',
            districtId: 'district-id',
            stateId: 'AL',
            name: 'Organization-3',
            organizationLmsId: null,
          },
        ],
      ],
    ])
  })

  test('fail with unmatched number of Organizations those should be updated', async () => {
    const requestedOrganizations: Parameters<MaintenanceCreateOrUpdateOrganizationsUseCase['run']>[0] = [
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-1',
        organizationLmsId: 'organization-lms-id-1',
      },
      {
        id: 'Organization-id-2', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-2',
        organizationLmsId: null,
      },
      {
        id: 'Organization-id-3', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-3',
        organizationLmsId: null,
      },
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-4',
        organizationLmsId: null,
      },
    ]
    const OrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (OrganizationIds: string[]): Promise<Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            // should be exist but not somehow
            // {
            //   id: 'Organization-id-2',
            //   districtId: 'district-id',
            //   name: 'Organization-2-old',
            // organizationLmsId: null,
            // },
            {
              id: 'Organization-id-3', // should be already exist
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-3-old',
              organizationLmsId: null,
            },
          ],
        }
      }),
      createOrganizations: jest.fn(async function (
        Organizations: Omit<MaintenanceOrganization, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      updateOrganizations: jest.fn(async function (
        Organizations: MaintenanceOrganization[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateOrganizationsUseCase(OrganizationRepository)

    const result = await usecase.run(requestedOrganizations)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getOrganizationsSpy = OrganizationRepository.getOrganizations as jest.Mock

    expect(getOrganizationsSpy.mock.calls).toEqual([[['Organization-id-2', 'Organization-id-3']]])

    const createOrganizationsSpy = OrganizationRepository.createOrganizations as jest.Mock

    expect(createOrganizationsSpy).not.toHaveBeenCalled()

    const updateOrganizationsSpy = OrganizationRepository.updateOrganizations as jest.Mock

    expect(updateOrganizationsSpy).not.toHaveBeenCalled()
  })

  test('fail with createOrganizations occuring error', async () => {
    const requestedOrganizations: Parameters<MaintenanceCreateOrUpdateOrganizationsUseCase['run']>[0] = [
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-1',
        organizationLmsId: 'organization-lms-id-1',
      },
      {
        id: 'Organization-id-2', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-2',
        organizationLmsId: null,
      },
      {
        id: 'Organization-id-3', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-3',
        organizationLmsId: null,
      },
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-4',
        organizationLmsId: null,
      },
    ]
    const OrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (OrganizationIds: string[]): Promise<Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong',
          },
          value: null,
        }
      }),
      createOrganizations: jest.fn(async function (
        Organizations: Omit<MaintenanceOrganization, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      updateOrganizations: jest.fn(async function (
        Organizations: MaintenanceOrganization[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateOrganizationsUseCase(OrganizationRepository)

    const result = await usecase.run(requestedOrganizations)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getOrganizationsSpy = OrganizationRepository.getOrganizations as jest.Mock

    expect(getOrganizationsSpy.mock.calls).toEqual([[['Organization-id-2', 'Organization-id-3']]])

    const createOrganizationsSpy = OrganizationRepository.createOrganizations as jest.Mock

    expect(createOrganizationsSpy).not.toHaveBeenCalled()

    const updateOrganizationsSpy = OrganizationRepository.updateOrganizations as jest.Mock

    expect(updateOrganizationsSpy).not.toHaveBeenCalled()
  })

  test('fail with createOrganizations/updateOrganizations occuring error', async () => {
    const requestedOrganizations: Parameters<MaintenanceCreateOrUpdateOrganizationsUseCase['run']>[0] = [
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-1',
        organizationLmsId: 'organization-lms-id-1',
      },
      {
        id: 'Organization-id-2', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-2',
        organizationLmsId: null,
      },
      {
        id: 'Organization-id-3', // will be updated
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-3',
        organizationLmsId: null,
      },
      {
        id: null, // will be created
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-4',
        organizationLmsId: null,
      },
    ]
    const OrganizationRepository: IOrganizationRepository = {
      getOrganizations: jest.fn(async function (OrganizationIds: string[]): Promise<Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'Organization-id-2', // should be already exist
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-2-old',
              organizationLmsId: null,
            },
            {
              id: 'Organization-id-3', // should be already exist
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-3-old',
              organizationLmsId: null,
            },
          ],
        }
      }),
      createOrganizations: jest.fn(async function (
        Organizations: Omit<MaintenanceOrganization, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong',
          },
          value: null,
        }
      }),
      updateOrganizations: jest.fn(async function (
        Organizations: MaintenanceOrganization[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong',
          },
          value: null,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateOrganizationsUseCase(OrganizationRepository)

    const result = await usecase.run(requestedOrganizations)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getOrganizationsSpy = OrganizationRepository.getOrganizations as jest.Mock

    expect(getOrganizationsSpy.mock.calls).toEqual([[['Organization-id-2', 'Organization-id-3']]])
    // We can't determine the order of being called
    // const createOrganizationsSpy = OrganizationRepository.createOrganizations as jest.Mock
    // expect(createOrganizationsSpy).not.toHaveBeenCalled()
    // const updateOrganizationsSpy = OrganizationRepository.updateOrganizations as jest.Mock
    // expect(updateOrganizationsSpy).not.toHaveBeenCalled()
  })
})
