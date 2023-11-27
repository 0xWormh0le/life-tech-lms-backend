import { MaintenanceOrganization } from '../../../entities/maintenance/Organization'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceGetOrganizationsUseCase, IOrganizationRepository } from './MaintenanceGetOrganizationsUseCase'

describe('test MaintenanceGetOrganizationsUseCase', () => {
  test('success', async () => {
    const OrganizationRepository: IOrganizationRepository = {
      getAllOrganizations: jest.fn(async function (): Promise<Errorable<MaintenanceOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'Organization-id-1',
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-1',
              organizationLmsId: 'organizationLmsId-1',
            },
            {
              id: 'Organization-id-2',
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-2',
              organizationLmsId: 'organizationLmsId-2',
            },
            {
              id: 'Organization-id-3',
              districtId: 'district-id',
              stateId: 'AL',
              name: 'Organization-3',
              organizationLmsId: 'organizationLmsId-3',
            },
          ],
        }
      }),
    }

    const usecase = new MaintenanceGetOrganizationsUseCase(OrganizationRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        id: 'Organization-id-1',
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-1',
        organizationLmsId: 'organizationLmsId-1',
      },
      {
        id: 'Organization-id-2',
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-2',
        organizationLmsId: 'organizationLmsId-2',
      },
      {
        id: 'Organization-id-3',
        districtId: 'district-id',
        stateId: 'AL',
        name: 'Organization-3',
        organizationLmsId: 'organizationLmsId-3',
      },
    ])
  })

  test('fail with getAllOrganizations occurs error', async () => {})
})
