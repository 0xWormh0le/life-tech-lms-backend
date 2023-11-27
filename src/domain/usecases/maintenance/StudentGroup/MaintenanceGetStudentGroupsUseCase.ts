import { MaintenanceStudentGroup } from '../../../entities/maintenance/StudentGroup'
import { E, Errorable } from '../../shared/Errors'

export interface IStudentGroupRepository {
  getAllStudentGroups(): Promise<
    Errorable<MaintenanceStudentGroup[], E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetStudentGroupsUseCase {
  constructor(private StudentGroupRepository: IStudentGroupRepository) {}

  async run(): Promise<
    Errorable<MaintenanceStudentGroup[], E<'UnknownRuntimeError'>>
  > {
    return this.StudentGroupRepository.getAllStudentGroups()
  }
}
