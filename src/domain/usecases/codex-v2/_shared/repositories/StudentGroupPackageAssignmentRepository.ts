import { StudentGroupPackageAssignment } from '../../../../entities/codex-v2/StudentGroupPackageAssignment'
import { E, Errorable } from '../../../shared/Errors'
import { StudentGroup } from '../../../../entities/codex-v2/StudentGroup'

export interface StudentGroupPackageAssignmentRepository {
  findAll(): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  >
  findByStudentGroupId(
    studentGroupId: StudentGroup['id'],
  ): Promise<
    Errorable<StudentGroupPackageAssignment[], E<'UnknownRuntimeError'>>
  >
}
