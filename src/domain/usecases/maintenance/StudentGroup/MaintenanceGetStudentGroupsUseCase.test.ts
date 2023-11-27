import { MaintenanceStudentGroup } from '../../../entities/maintenance/StudentGroup'
import { E, Errorable } from '../../shared/Errors'
import { MaintenanceGetStudentGroupsUseCase, IStudentGroupRepository } from './MaintenanceGetStudentGroupsUseCase'

describe('test MaintenanceGetStudentGroupsUseCase', () => {
  test('success', async () => {
    const StudentGroupRepository: IStudentGroupRepository = {
      getAllStudentGroups: jest.fn(async function (): Promise<Errorable<MaintenanceStudentGroup[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'studentGroup-id-1',
              name: 'studentGroup-1',
              grade: '4',
              organizationId: 'studentGroup-organizationId-1',
              codeillusionPackageId: 'studentGroup-codeillusionPackageId-1',
              csePackageId: 'studentGroup-csePackageId-1',
              studentGroupLmsId: 'student-group-lms-id',
            },
            {
              id: 'studentGroup-id-2',
              name: 'studentGroup-2',
              grade: '4',
              organizationId: 'studentGroup-organizationId-2',
              codeillusionPackageId: 'studentGroup-codeillusionPackageId-2',
              csePackageId: 'studentGroup-csePackageId-2',
              studentGroupLmsId: null,
            },
            {
              id: 'studentGroup-id-3',
              name: 'studentGroup-3',
              grade: '4',
              organizationId: 'studentGroup-organizationId-3',
              codeillusionPackageId: 'studentGroup-codeillusionPackageId-3',
              csePackageId: null,
              studentGroupLmsId: null,
            },
          ],
        }
      }),
    }

    const usecase = new MaintenanceGetStudentGroupsUseCase(StudentGroupRepository)

    const result = await usecase.run()

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        id: 'studentGroup-id-1',
        name: 'studentGroup-1',
        grade: '4',
        organizationId: 'studentGroup-organizationId-1',
        codeillusionPackageId: 'studentGroup-codeillusionPackageId-1',
        csePackageId: 'studentGroup-csePackageId-1',
        studentGroupLmsId: 'student-group-lms-id',
      },
      {
        id: 'studentGroup-id-2',
        name: 'studentGroup-2',
        grade: '4',
        organizationId: 'studentGroup-organizationId-2',
        codeillusionPackageId: 'studentGroup-codeillusionPackageId-2',
        csePackageId: 'studentGroup-csePackageId-2',
        studentGroupLmsId: null,
      },
      {
        id: 'studentGroup-id-3',
        name: 'studentGroup-3',
        grade: '4',
        organizationId: 'studentGroup-organizationId-3',
        codeillusionPackageId: 'studentGroup-codeillusionPackageId-3',
        csePackageId: null,
        studentGroupLmsId: null,
      },
    ])
  })

  test('fail with getAllStudentGroups occurs error', async () => {})
})
