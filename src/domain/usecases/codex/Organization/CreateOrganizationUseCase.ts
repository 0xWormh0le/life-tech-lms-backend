import { Organizations } from '../../../entities/codex/Organization'
import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export type OrganizationInfo = Omit<
  Organizations,
  'id' | 'createdDate' | 'updatedDate' | 'organizationLMSId' | 'createdUserId'
> & { organizationLMSId?: string; createdUserId?: string }

export interface IOrganizationRepository {
  createOrganization(
    organization: OrganizationInfo,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>>
}

export class CreateOrganizationUseCase {
  constructor(private organizationRepositroy: IOrganizationRepository) {}

  async run(
    user: User,
    organization: OrganizationInfo,
  ): Promise<
    Errorable<
      void,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'AlreadyExistError'>
    >
  > {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const organizationResult =
      await this.organizationRepositroy.createOrganization(organization)

    if (organizationResult.hasError) {
      switch (organizationResult.error.type) {
        case 'AlreadyExistError': {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              `${organization.name} organization is already exists.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              `failed to create organization ${JSON.stringify(organization)}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
