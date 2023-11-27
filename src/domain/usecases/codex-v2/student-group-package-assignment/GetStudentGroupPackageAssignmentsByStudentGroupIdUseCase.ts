import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentGroupPackageAssignmentRepository {
  findByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  >
}

export default class GetStudentGroupPackageAssignmentsByStudentGroupIdUseCase {
  constructor(
    private readonly studentGroupPackageAssignmentRepository: StudentGroupPackageAssignmentRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    studentGroupId: string,
  ): Promise<
    Errorable<
      StudentGroupPackageAssignment[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.studentGroupPackageAssignmentRepository.findByStudentGroupId(
      studentGroupId,
    )
  }
}
