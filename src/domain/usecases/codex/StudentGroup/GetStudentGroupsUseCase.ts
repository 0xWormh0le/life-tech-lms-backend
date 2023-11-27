import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { User } from '../../../entities/codex/User'
import { isValidUUID } from '../../shared/Ensure'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IStudentGroupRepository {
  getStudentGroups(
    organizationId: string,
  ): Promise<
    Errorable<
      StudentGroup[],
      E<'UnknownRuntimeError'> | E<'OrganizationNotFoundError'>
    >
  >
}

export interface ITeacherRepository {
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export class GetStudentGroupsUseCase {
  constructor(
    private studentGroupRepository: IStudentGroupRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    organizationId: string,
  ): Promise<
    Errorable<
      StudentGroup[],
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidOrganizationId'>
      | E<'OrganizationNotFoundError'>
      | E<'TeacherNotFound'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            "The user does not have permission to view the specified student groups's information",
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
              message: `Teacher with TeacherId : ${getTeacherInfo.value.teacherId} is not associated with organization : ${organizationId}. Please assign teacher to the organization first.`,
            },
            value: null,
          }
        }
      }
    }

    //Get Student Group From StudentGroupRepository
    const studentGroupsResult =
      await this.studentGroupRepository.getStudentGroups(organizationId)

    if (studentGroupsResult.hasError) {
      switch (studentGroupsResult.error.type) {
        case 'OrganizationNotFoundError': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupsResult.error,
              `organization id data not found : ${organizationId}`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentGroupsResult.error,
              'failed to get student groups',
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: studentGroupsResult.value,
    }
  }
}
