import { E, Errorable } from '../../../shared/Errors'
import { TeacherOrganizationAffiliation } from '../../../../entities/codex-v2/TeacherOrganizationAffiliation'

export interface TeacherOrganizationAffiliationRepository {
  findByTeacherId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  >
}
