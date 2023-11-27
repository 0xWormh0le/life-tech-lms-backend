import { E, Errorable } from '../../../shared/Errors'
import { Administrator } from '../../../../entities/codex-v2/Administrator'

export interface AdministratorRepository {
  findByUserId(
    userId: string,
  ): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>>
}
