import { E, Errorable } from '../../../shared/Errors'
import { Teacher } from '../../../../entities/codex-v2/Teacher'

export interface TeacherRepository {
  findByUserId(
    userId: string,
  ): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>>
}
