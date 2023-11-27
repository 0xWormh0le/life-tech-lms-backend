import { MaintenanceStudentGroupStudent } from '../../../entities/maintenance/StudentGroupStudent'
import { E, Errorable } from '../../shared/Errors'

export interface IStudentGroupStudentRepository {
  deleteStudentGroupStudents(
    studentGroupStudents: MaintenanceStudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | E<'NotFoundError'>>>>
}

export class MaintenanceDeleteStudentGroupStudentsUseCase {
  constructor(
    private studentGroupStudentRepository: IStudentGroupStudentRepository,
  ) {}

  async run(
    studentGroupStudents: MaintenanceStudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const deleteStudentGroupStudentsResult =
      await this.studentGroupStudentRepository.deleteStudentGroupStudents(
        studentGroupStudents,
      )

    if (deleteStudentGroupStudentsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: deleteStudentGroupStudentsResult.error.message,
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
