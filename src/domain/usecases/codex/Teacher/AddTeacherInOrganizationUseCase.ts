import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { userRoles } from '../../shared/Constants'
import { Organizations } from '../../../entities/codex/Organization'
import { TeacherOrganization } from '../../../entities/codex/Teacher'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export interface ITeacherRepository {
  addTeacherInOrganization(
    organizationId: string,
    teacherId: string,
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  getTeacherByTeacherId(
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

export class AddTeacherInOrganizationUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private organizationRepository: IOrganizationRepository,
  ) {}

  async run(
    organizationId: string,
    user: User,
    teacherId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidOrganizationId'>
      | E<'TeacherNotFound'>
      | E<'OrganizationNotFound'>
      | E<'InvalidTeacherId'>
      | E<'TeacherAlreadyExists'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The token does not have permission to add the specified teacher into organization.',
        },
        value: null,
      }
    }

    // Validate with provided distrcitId
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

    // Validate with provided teacherId
    if (!isValidUUID(teacherId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidTeacherId',
          message: 'Invalid teacherId',
        },
        value: null,
      }
    }

    const teacherResult = await this.teacherRepository.getTeacherByTeacherId(
      teacherId,
    )

    if (teacherResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          teacherResult.error,
          `failed to find teacher by teacherId`,
        ),
        value: null,
      }
    }

    if (!teacherResult.value) {
      return {
        hasError: true,
        error: {
          type: 'TeacherNotFound',
          message: `The specified teacher not found for ${teacherId}`,
        },
        value: null,
      }
    }

    if (
      teacherResult.value.teacherOrganizations?.some(
        (organization) => organization.id === organizationId,
      )
    ) {
      return {
        hasError: true,
        error: {
          type: 'TeacherAlreadyExists',
          message: 'Teacher already associate with the Organization',
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
          `failed to getOrganizationById '${organizationId}'`,
        ),
        value: null,
      }
    }

    if (!organizationResult.value) {
      return {
        hasError: true,
        error: {
          type: 'OrganizationNotFound',
          message: `The specified organization not found for '${organizationId}'`,
        },
        value: null,
      }
    }

    if (
      teacherResult.value.districtId !== organizationResult.value.districtId
    ) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    // Add teacher into organization
    const teacherOrganizationResult =
      await this.teacherRepository.addTeacherInOrganization(
        organizationId,
        teacherId,
        user.id,
      )

    if (teacherOrganizationResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          teacherOrganizationResult.error,
          `failed to add teacher into organization`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
