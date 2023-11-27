import { MaintenanceTeacherOrganization } from '../../../entities/maintenance/TeacherOrganization'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceGetTeacherOrganizationsUseCase, ITeacherOrganizationRepository } from './MaintenanceGetTeacherOrganizationsUseCase'

describe('test MaintenanceGetTeacherOrganizationsUseCase', () => {
  test('success', async () => {
    const teacherOrganizationRepository: ITeacherOrganizationRepository = {
      getAllTeacherOrganizations: jest.fn(async function (): Promise<Errorable<MaintenanceTeacherOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId: 'teacher-id-1',
              organizationId: 'organization-id-1',
            },
            {
              userId: 'teacher-id-1',
              organizationId: 'organization-id-2',
            },
            {
              userId: 'teacher-id-2',
              organizationId: 'organization-id-2',
            },
            {
              userId: 'teacher-id-3',
              organizationId: 'organization-id-3',
            },
          ],
        }
      }),
    }

    const usecase = new MaintenanceGetTeacherOrganizationsUseCase(teacherOrganizationRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        userId: 'teacher-id-1',
        organizationId: 'organization-id-1',
      },
      {
        userId: 'teacher-id-1',
        organizationId: 'organization-id-2',
      },
      {
        userId: 'teacher-id-2',
        organizationId: 'organization-id-2',
      },
      {
        userId: 'teacher-id-3',
        organizationId: 'organization-id-3',
      },
    ])
  })

  test('fail with getAllTeacherOrganizations occurs error', async () => {})
})
