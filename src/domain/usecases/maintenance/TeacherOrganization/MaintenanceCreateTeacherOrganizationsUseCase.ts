import { MaintenanceTeacherOrganization } from '../../../entities/maintenance/TeacherOrganization'
import { E, Errorable } from '../../shared/Errors'

export interface ITeacherOrganizationRepository {
  createTeacherOrganizations(
    teacherOrganizations: Omit<MaintenanceTeacherOrganization, 'id'>[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export class MaintenanceCreateTeacherOrganizationsUseCase {
  constructor(
    private teacherOrganizationRepository: ITeacherOrganizationRepository,
  ) {}

  async run(
    teacherOrganizations: MaintenanceTeacherOrganization[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const createTeacherOrganizationsResult =
      await this.teacherOrganizationRepository.createTeacherOrganizations(
        teacherOrganizations,
      )

    if (createTeacherOrganizationsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: createTeacherOrganizationsResult.error.message,
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
