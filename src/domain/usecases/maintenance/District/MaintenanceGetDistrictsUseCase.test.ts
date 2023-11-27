import { MaintenanceDistrict } from '../../../entities/maintenance/District'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceGetDistrictsUseCase, IDistrictRepository } from './MaintenanceGetDistrictsUseCase'

describe('test MaintenanceGetDistrictsUseCase', () => {
  test('success', async () => {
    const districtRepository: IDistrictRepository = {
      getAllDistricts: jest.fn(async function (): Promise<Errorable<MaintenanceDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'district-id-1',
              name: 'district-1',
              stateId: 'AL',
              lmsId: 'lms-id-1',
              enableRosterSync: true,
              districtLmsId: 'district-lms-id-1',
            },
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
        }
      }),
    }

    const usecase = new MaintenanceGetDistrictsUseCase(districtRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual<typeof result.value>([
      {
        id: 'district-id-1',
        name: 'district-1',
        stateId: 'AL',
        lmsId: 'lms-id-1',
        enableRosterSync: true,
        districtLmsId: 'district-lms-id-1',
      },
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
    ])
  })

  test('fail with getAllDistricts occurs error', async () => {})
})
