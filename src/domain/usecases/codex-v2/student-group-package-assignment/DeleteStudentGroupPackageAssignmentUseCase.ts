import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentGroupPackageAssignmentRepository {
  findById(
    id: string,
  ): Promise<
    Errorable<StudentGroupPackageAssignment | null, E<'UnknownRuntimeError'>>
  >
  delete(id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class DeleteStudentGroupPackageAssignmentUseCase {
  constructor(
    private readonly studentGroupPackageAssignmentRepository: StudentGroupPackageAssignmentRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    id: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'StudentGroupPackageAssignmentNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const savedRes =
      await this.studentGroupPackageAssignmentRepository.findById(id)

    if (savedRes.hasError) {
      return savedRes
    }

    if (!savedRes.value) {
      return failureErrorable(
        'StudentGroupPackageAssignmentNotFound',
        `studentGroupPackageAssignment not found. id: ${id}`,
      )
    }

    const deletedRes =
      await this.studentGroupPackageAssignmentRepository.delete(id)

    if (deletedRes.hasError) {
      return deletedRes
    }

    return successErrorable(undefined)
  }
}
