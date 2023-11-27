import { MaintenanceTeacherOrganization } from '../../../entities/maintenance/TeacherOrganization'
import { E, Errorable } from '../../shared/Errors'

export interface ITeacherOrganizationRepository {
  deleteTeacherOrganizations(
    teacherOrganizations: MaintenanceTeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError'>>>>
}

export class MaintenanceDeleteTeacherOrganizationsUseCase {
  constructor(
    private teacherOrganizationRepository: ITeacherOrganizationRepository,
  ) {}

  async run(
    teacherOrganizations: MaintenanceTeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const deleteTeacherOrganizationsResult =
      await this.teacherOrganizationRepository.deleteTeacherOrganizations(
        teacherOrganizations,
      )

    if (deleteTeacherOrganizationsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: deleteTeacherOrganizationsResult.error.message,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
