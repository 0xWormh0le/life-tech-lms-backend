import { MaintenanceStudentGroupStudent } from '../../../entities/maintenance/StudentGroupStudent'
import { E, Errorable } from '../../shared/Errors'

export interface IStudentGroupStudentRepository {
  getAllStudentGroupStudents(): Promise<
    Errorable<MaintenanceStudentGroupStudent[], E<'UnknownRuntimeError'>>
  >
}

export class MaintenanceGetStudentGroupStudentsUseCase {
  constructor(
    private studentGroupStudentRepository: IStudentGroupStudentRepository,
  ) {}

  async run(): Promise<
    Errorable<MaintenanceStudentGroupStudent[], E<'UnknownRuntimeError'>>
  > {
    return this.studentGroupStudentRepository.getAllStudentGroupStudents()
  }
}
