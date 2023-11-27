import { E, Errorable } from '../../../shared/Errors'
import { StudentStudentGroupAffiliation } from '../../../../entities/codex-v2/StudentStudentGroupAffiliation'

export interface StudentStudentGroupAffiliationRepository {
  findByStudentId(
    studentId: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  >
}
