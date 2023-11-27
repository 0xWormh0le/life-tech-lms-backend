import { User, UserRole } from '../../../entities/codex/User'
import { TeacherOrganization, Teachers } from '../../../entities/codex/Teacher'
import { isValidUUID } from '../../shared/Ensure'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { Organizations } from '../../../entities/codex/Organization'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface ITeacherRepository {
  getTeachers(
    organizationId: string,
    teacherIds?: string[] | undefined,
    role?: string | null,
  ): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>>
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface IOrganizationRepository {
  getOrganizationById(
    organizationId: string,
  ): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export class GetTeachersUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private organizationRepository: IOrganizationRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    user: User,
    organizationId: string,
    teacherIds: string[] | undefined,
  ): Promise<
    Errorable<
      Teachers[],
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidOrganizationId'>
      | E<'OrganizationNotFound'>
      | E<'TeacherNotFound'>
      | E<'AdministratorNotFound'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to view the specified teacher information',
        },
        value: null,
      }
    }

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

    const organizationResult =
      await this.organizationRepository.getOrganizationById(organizationId)

    if (organizationResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          organizationResult.error,
          `failed to getOrganizationById ${organizationId}`,
        ),
        value: null,
      }
    }

    if (!organizationResult.value) {
      return {
        hasError: true,
        error: {
          type: 'OrganizationNotFound',
          message: `The specified organization not found for ${organizationId}`,
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const getAdminisratorResult =
        await this.administratorRepository.getDistrictAdministratorByUserId(
          user.id,
        )

      if (getAdminisratorResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getAdminisratorResult.error,
            `Failed to getDistrictAdministratorByUserId ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getAdminisratorResult.value) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: `The specified administrator not found for ${user.id}`,
          },
          value: null,
        }
      }

      if (
        getAdminisratorResult.value.districtId !==
        organizationResult.value.districtId
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to view teacher information for organization id',
          },
          value: null,
        }
      }
    }

    if (user.role === userRoles.teacher) {
      const getTeacherInfo = await this.teacherRepository.getTeacherByUserId(
        user.id,
      )

      if (getTeacherInfo.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getTeacherInfo.error,
            `failed to fetch teachers from db for teacher id ${user.id}`,
          ),
          value: null,
        }
      }

      if (!getTeacherInfo.value) {
        return {
          hasError: true,
          error: {
            type: 'TeacherNotFound',
            message: `The specified teacher not found for ${user.id}`,
          },
          value: null,
        }
      }

      if (getTeacherInfo.value.teacherOrganizations) {
        const teacherOrganizations =
          getTeacherInfo.value.teacherOrganizations.find(
            (i) => i.id === organizationId,
          )

        if (!teacherOrganizations) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message:
                'The user does not have permission to view the specified teacher information',
            },
            value: null,
          }
        }
      }
    }

    const teachersResult = await this.teacherRepository.getTeachers(
      organizationId,
      teacherIds,
      user.role,
    )

    if (teachersResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          teachersResult.error,
          `Failed to getTeachers ${organizationId}`,
        ),
        value: null,
      }
    }

    if (teachersResult.value.length === 0) {
      return {
        hasError: true,
        error: {
          type: 'TeacherNotFound',
          message: `The specified teacher not found for ${organizationId}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: teachersResult.value,
    }
  }
}
