import { Organization } from '../../../entities/codex-v2/Organization'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface OrganizationRepository {
  findAll(): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>>
}

export default class GetOrganizationsUseCase {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<Organization[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    return await this.organizationRepository.findAll()
  }
}
