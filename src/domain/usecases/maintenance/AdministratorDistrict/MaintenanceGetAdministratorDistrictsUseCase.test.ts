import { MaintenanceAdministratorDistrict } from '../../../entities/maintenance/AdministratorDistrict'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceGetAdministratorDistrictsUseCase, IAdministratorDistrictRepository } from './MaintenanceGetAdministratorDistrictsUseCase'

describe('test MaintenanceGetAdministratorDistrictsUseCase', () => {
  test('success', async () => {
    const administratorDistrictRepository: IAdministratorDistrictRepository = {
      getAllAdministratorDistricts: jest.fn(async function (): Promise<Errorable<MaintenanceAdministratorDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId: 'administrator-id-1',
              districtId: 'district-id-1',
            },
            {
              userId: 'administrator-id-1',
              districtId: 'district-id-2',
            },
            {
              userId: 'administrator-id-2',
              districtId: 'district-id-2',
            },
            {
              userId: 'administrator-id-3',
              districtId: 'district-id-3',
            },
          ],
        }
      }),
    }

    const usecase = new MaintenanceGetAdministratorDistrictsUseCase(administratorDistrictRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        userId: 'administrator-id-1',
        districtId: 'district-id-1',
      },
      {
        userId: 'administrator-id-1',
        districtId: 'district-id-2',
      },
      {
        userId: 'administrator-id-2',
        districtId: 'district-id-2',
      },
      {
        userId: 'administrator-id-3',
        districtId: 'district-id-3',
      },
    ])
  })

  test('fail with getAllAdministratorDistricts occurs error', async () => {})
})
