import { E, Errorable } from '../../../shared/Errors'
import { StudentGroup } from '../../../../entities/codex-v2/StudentGroup'

export interface StudentGroupRepository {
  findById(
    studentGroupId: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>>

  findByIds(
    studentGroupIds: string[],
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>>
  findByOrganizationId(
    organizationId: string,
  ): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>>
}
