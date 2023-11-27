import { E, Errorable } from '../../../shared/Errors'
import { Organization } from '../../../../entities/codex-v2/Organization'

export interface OrganizationRepository {
  findById(
    organizationId: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>>

  findByIds(
    organizationIds: string[],
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>>
}
