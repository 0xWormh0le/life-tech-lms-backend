import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'

export interface IOrganizationRepository {
  deleteOrganization(
    organizationId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'OrganizationIdNotFound'>>
  >
}

export class DeleteOrganizationUseCase {
  constructor(private organizationRepositroy: IOrganizationRepository) {}

  async run(
    user: User,
    organizationId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'OrganizationIdNotFound'>
      | E<'InvalidOrganizationId'>
    >
  > {
    // Validate with provided organizationId
    if (!isValidUUID(organizationId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidOrganizationId',
          message: 'Invalid organizationId',
        },
        value: null,
      }
    }

    // Check authorization for this User
    if (user.role !== 'internalOperator' && user.role !== 'administrator') {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    // Delete organization From organizationRepositroy
    const organizationResult =
      await this.organizationRepositroy.deleteOrganization(organizationId)

    if (organizationResult.hasError) {
      switch (organizationResult.error.type) {
        case 'OrganizationIdNotFound': {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              `organization id not found.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              organizationResult.error,
              `failed to delete organization ${organizationId}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: organizationResult.value,
    }
  }
}
