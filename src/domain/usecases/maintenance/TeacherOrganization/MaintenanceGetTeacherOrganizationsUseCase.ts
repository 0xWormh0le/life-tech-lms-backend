import { MaintenanceTeacherOrganization } from '../../../entities/maintenance/TeacherOrganization'
import { E, Errorable } from '../../shared/Errors'

export interface ITeacherOrganizationRepository {
  getAllTeacherOrganizations(): Promise<
    Errorable<MaintenanceTeacherOrganization[], E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetTeacherOrganizationsUseCase {
  constructor(
    private teacherOrganizationRepository: ITeacherOrganizationRepository,
  ) {}

  async run(): Promise<
    Errorable<MaintenanceTeacherOrganization[], E<'UnknownRuntimeError'>>
  > {
    return this.teacherOrganizationRepository.getAllTeacherOrganizations()
  }
}
