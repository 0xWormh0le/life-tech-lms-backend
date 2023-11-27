import { User } from '../../../entities/codex/User'
import { isValidUUID } from '../../shared/Ensure'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { OrganizationInfo } from './CreateOrganizationUseCase'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export interface IOrganizationRepository {
  updateOrganization(
    organizationId: string,
    organization: OrganizationInfo,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'OrganizationNotFoundError'>
    >
  >
}

export class UpdateOrganizationUseCase {
  constructor(private organizationRepositroy: IOrganizationRepository) {}

  async run(
    user: User,
    organizationId: string,
    organization: OrganizationInfo,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'AlreadyExistError'>
      | E<'OrganizationNotFoundError'>
      | E<'InvalidOrganizationId'>
    >
  > {
    //validate with provided organizationId
    if (!isValidUUID(organizationId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidOrganizationId',
          message: 'Invalid OrganizationId',
        },
        value: null,
      }
    }

    // Check authorization for this User
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
      await this.organizationRepositroy.updateOrganization(
        organizationId,
        organization,
      )

    if (organizationResult.hasError) {
      switch (organizationResult.error.type) {
        case 'AlreadyExistError': {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              `${organization.name} is already exists in same district.`,
            ),
            value: null,
          }
        }
        case 'OrganizationNotFoundError': {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              'requested organizationId information not found',
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              `failed to update organization ${JSON.stringify(organization)}`,
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
