import { E, Errorable, wrapError } from '../../shared/Errors'
import { StudentGroupPackageAssignment } from '../../../entities/codex/StudentGroupPackageAssignment'

export interface IStudentGroupPackageAssignmentRepository {
  getAllByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  >
}

export class GetStudentGroupPackageAssignmentsUseCase {
  constructor(
    private studentGroupPackageAssignmentRepository: IStudentGroupPackageAssignmentRepository,
  ) {}

  async run(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  > {
    const getStudentGroupPackageAssignmentsResult =
      await this.studentGroupPackageAssignmentRepository.getAllByStudentGroupId(
        studentGroupId,
      )

    if (getStudentGroupPackageAssignmentsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          getStudentGroupPackageAssignmentsResult.error,
          `failed to studentGroupPackageAssignmentRepository.getAllByStudentGroupId ${studentGroupId}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: getStudentGroupPackageAssignmentsResult.value,
    }
  }
}
