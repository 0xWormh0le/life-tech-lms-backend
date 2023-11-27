import { Organizations } from '../../../entities/codex/Organization'
import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export interface IOrganizationRepository {
  getOrganizations(
    districtId: string,
    organizationIds?: string[],
  ): Promise<Errorable<Organizations[], E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export class GetOrganizationsUseCase {
  constructor(
    private organizationRepositroy: IOrganizationRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    user: User,
    districtId: string,
    organizationIds?: string[],
  ): Promise<
    Errorable<
      Organizations[],
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'AdministratorNotFound'>
    >
  > {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            "The user does not have permission to view the specified organization's information",
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const districtAdministratorResult =
        await this.administratorRepository.getDistrictAdministratorByUserId(
          user.id,
        )

      if (districtAdministratorResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            districtAdministratorResult.error,
            `failed to get  district AdministratorResult`,
          ),
          value: null,
        }
      }

      if (!districtAdministratorResult.value) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: `administrator not found for userId: ${user.id}`,
          },
          value: null,
        }
      }

      if (districtAdministratorResult.value.districtId !== districtId) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              "The user does not have permission to view the specified organization's information",
          },
          value: null,
        }
      }
    }

    //Get Organizations From OrganizationRepository
    const organizationsResult =
      await this.organizationRepositroy.getOrganizations(
        districtId,
        organizationIds,
      )

    if (organizationsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          organizationsResult.error,
          'failed to get organizations',
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: organizationsResult.value,
    }
  }
}
