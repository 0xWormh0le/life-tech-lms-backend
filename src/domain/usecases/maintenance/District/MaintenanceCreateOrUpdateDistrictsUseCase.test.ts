import { MaintenanceDistrict } from '../../../entities/maintenance/District'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceCreateOrUpdateDistrictsUseCase, IDistrictRepository } from './MaintenanceCreateOrUpdateDistrictsUseCase'

describe('test MaintenanceCreateOrUpdateDistrictsUseCase', () => {
  test('success', async () => {
    const requestedDistricts: Parameters<MaintenanceCreateOrUpdateDistrictsUseCase['run']>[0] = [
      {
        id: null, // will be created
        name: 'district-1',
        stateId: 'AL',
        lmsId: 'lms-id-1',
        enableRosterSync: true,
        districtLmsId: 'district-lms-id-1',
      },
      {
        id: 'district-id-2', // will be updated
        name: 'district-2',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: 'district-id-3', // will be updated
        name: 'district-3',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: null, // will be created
        name: 'district-4',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
    ]
    const districtRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (districtIds: string[]): Promise<Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'district-id-2', // should be already exist
              name: 'district-2-old',
              stateId: 'AL',
              lmsId: null,
              enableRosterSync: false,
              districtLmsId: null,
            },
            {
              id: 'district-id-3', // should be already exist
              name: 'district-3-old',
              stateId: 'AL',
              lmsId: null,
              enableRosterSync: false,
              districtLmsId: null,
            },
          ],
        }
      }),
      createDistricts: jest.fn(async function (
        districts: Omit<MaintenanceDistrict, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      updateDistricts: jest.fn(async function (
        districts: MaintenanceDistrict[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateDistrictsUseCase(districtRepository)

    const result = await usecase.run(requestedDistricts)

    expect(result.hasError).toEqual(false)

    const getDistrictsSpy = districtRepository.getDistricts as jest.Mock

    expect(getDistrictsSpy.mock.calls).toEqual([[['district-id-2', 'district-id-3']]])

    const createDistrictsSpy = districtRepository.createDistricts as jest.Mock

    expect(createDistrictsSpy.mock.calls).toEqual<Parameters<typeof districtRepository.createDistricts>[]>([
      [
        [
          {
            name: 'district-1',
            stateId: 'AL',
            lmsId: 'lms-id-1',
            enableRosterSync: true,
            districtLmsId: 'district-lms-id-1',
          },
          {
            name: 'district-4',
            stateId: 'AL',
            lmsId: null,
            enableRosterSync: false,
            districtLmsId: null,
          },
        ],
      ],
    ])

    const updateDistrictsSpy = districtRepository.updateDistricts as jest.Mock

    expect(updateDistrictsSpy.mock.calls).toEqual<Parameters<typeof districtRepository.updateDistricts>[]>([
      [
        [
          {
            id: 'district-id-2',
            name: 'district-2',
            stateId: 'AL',
            lmsId: null,
            enableRosterSync: false,
            districtLmsId: null,
          },
          {
            id: 'district-id-3',
            name: 'district-3',
            stateId: 'AL',
            lmsId: null,
            enableRosterSync: false,
            districtLmsId: null,
          },
        ],
      ],
    ])
  })

  test('fail with unmatched number of districts those should be updated', async () => {
    const requestedDistricts: Parameters<MaintenanceCreateOrUpdateDistrictsUseCase['run']>[0] = [
      {
        id: null, // will be created
        name: 'district-1',
        stateId: 'AL',
        lmsId: 'lms-id-1',
        enableRosterSync: true,
        districtLmsId: 'district-lms-id-1',
      },
      {
        id: 'district-id-2', // will be updated
        name: 'district-2',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: 'district-id-3', // will be updated
        name: 'district-3',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: null, // will be created
        name: 'district-4',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
    ]
    const districtRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (districtIds: string[]): Promise<Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            // should be exist but not somehow
            // {
            //   id: 'district-id-2',
            //   name: 'district-2-old',
            //   stateId: 'AL',
            // lmsId: null,
            // enableRosterSync: false,
            // districtLmsId: null,
            // },
            {
              id: 'district-id-3', // should be already exist
              name: 'district-3-old',
              stateId: 'AL',
              lmsId: null,
              enableRosterSync: false,
              districtLmsId: null,
            },
          ],
        }
      }),
      createDistricts: jest.fn(async function (
        districts: Omit<MaintenanceDistrict, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      updateDistricts: jest.fn(async function (
        districts: MaintenanceDistrict[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateDistrictsUseCase(districtRepository)

    const result = await usecase.run(requestedDistricts)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getDistrictsSpy = districtRepository.getDistricts as jest.Mock

    expect(getDistrictsSpy.mock.calls).toEqual([[['district-id-2', 'district-id-3']]])

    const createDistrictsSpy = districtRepository.createDistricts as jest.Mock

    expect(createDistrictsSpy).not.toHaveBeenCalled()

    const updateDistrictsSpy = districtRepository.updateDistricts as jest.Mock

    expect(updateDistrictsSpy).not.toHaveBeenCalled()
  })

  test('fail with createDistricts occuring error', async () => {
    const requestedDistricts: Parameters<MaintenanceCreateOrUpdateDistrictsUseCase['run']>[0] = [
      {
        id: null, // will be created
        name: 'district-1',
        stateId: 'AL',
        lmsId: 'lms-id-1',
        enableRosterSync: true,
        districtLmsId: 'district-lms-id-1',
      },
      {
        id: 'district-id-2', // will be updated
        name: 'district-2',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: 'district-id-3', // will be updated
        name: 'district-3',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: null, // will be created
        name: 'district-4',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
    ]
    const districtRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (districtIds: string[]): Promise<Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong',
          },
          value: null,
        }
      }),
      createDistricts: jest.fn(async function (
        districts: Omit<MaintenanceDistrict, 'id'>[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      updateDistricts: jest.fn(async function (
        districts: MaintenanceDistrict[],
      ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError', string>, string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new MaintenanceCreateOrUpdateDistrictsUseCase(districtRepository)

    const result = await usecase.run(requestedDistricts)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getDistrictsSpy = districtRepository.getDistricts as jest.Mock

    expect(getDistrictsSpy.mock.calls).toEqual([[['district-id-2', 'district-id-3']]])

    const createDistrictsSpy = districtRepository.createDistricts as jest.Mock

    expect(createDistrictsSpy).not.toHaveBeenCalled()

    const updateDistrictsSpy = districtRepository.updateDistricts as jest.Mock

    expect(updateDistrictsSpy).not.toHaveBeenCalled()
  })

  test('fail with createDistricts/updateDistricts occuring error', async () => {
    const requestedDistricts: Parameters<MaintenanceCreateOrUpdateDistrictsUseCase['run']>[0] = [
      {
        id: null, // will be created
        name: 'district-1',
        stateId: 'AL',
        lmsId: 'lms-id-1',
        enableRosterSync: true,
        districtLmsId: 'district-lms-id-1',
      },
      {
        id: 'district-id-2', // will be updated
        name: 'district-2',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: 'district-id-3', // will be updated
        name: 'district-3',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
      {
        id: null, // will be created
        name: 'district-4',
        stateId: 'AL',
        lmsId: null,
        enableRosterSync: false,
        districtLmsId: null,
      },
    ]
    const districtRepository: IDistrictRepository = {
      getDistricts: jest.fn(async function (districtIds: string[]): Promise<Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'district-id-2', // should be already exist
              name: 'district-2-old',
              stateId: 'AL',
              lmsId: null,
              enableRosterSync: false,
              districtLmsId: null,
            },
            {
              id: 'district-id-3', // should be already exist
              name: 'district-3-old',
              stateId: 'AL',
              lmsId: null,
              enableRosterSync: false,
              districtLmsId: null,
            },
          ],
        }
      }),
      createDistricts: jest.fn(async function (
        districts: Omit<MaintenanceDistrict, 'id'>[],
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
      updateDistricts: jest.fn(async function (
        districts: MaintenanceDistrict[],
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
    const usecase = new MaintenanceCreateOrUpdateDistrictsUseCase(districtRepository)

    const result = await usecase.run(requestedDistricts)

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')

    const getDistrictsSpy = districtRepository.getDistricts as jest.Mock

    expect(getDistrictsSpy.mock.calls).toEqual([[['district-id-2', 'district-id-3']]])
    // We can't determine the order of being called
    // const createDistrictsSpy = districtRepository.createDistricts as jest.Mock
    // expect(createDistrictsSpy).not.toHaveBeenCalled()
    // const updateDistrictsSpy = districtRepository.updateDistricts as jest.Mock
    // expect(updateDistrictsSpy).not.toHaveBeenCalled()
  })
})
