import { MaintenanceStudentGroupStudent } from '../../../entities/maintenance/StudentGroupStudent'
import { E, Errorable } from '../../shared/Errors'

export interface IStudentGroupStudentRepository {
  createStudentGroupStudents(
    studentGroupStudents: Omit<MaintenanceStudentGroupStudent, 'id'>[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export class MaintenanceCreateStudentGroupStudentsUseCase {
  constructor(
    private studentGroupStudentRepository: IStudentGroupStudentRepository,
  ) {}

  async run(
    studentGroupStudents: MaintenanceStudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const createStudentGroupStudentsResult =
      await this.studentGroupStudentRepository.createStudentGroupStudents(
        studentGroupStudents,
      )

    if (createStudentGroupStudentsResult.hasError) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: createStudentGroupStudentsResult.error.message,
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
