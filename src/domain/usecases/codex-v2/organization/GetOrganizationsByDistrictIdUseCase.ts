import { Organization } from '../../../entities/codex-v2/Organization'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface OrganizationRepository {
  findByDistrictId(
    districtId: string,
  ): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>>
}

export default class GetOrganizationsByDistrictIdUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    districtId: string,
  ): Promise<
    Errorable<Organization[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.organizationRepository.findByDistrictId(districtId)
  }
}
