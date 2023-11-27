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

export type StudentGroupInfo = Omit<
  StudentGroup,
  | 'id'
  | 'organizationId'
  | 'createdUserId'
  | 'updatedUserId'
  | 'createdDate'
  | 'updatedDate'
  | 'grade'
  | 'studentGroupLmsId'
> & {
  grade?: string
  studentGroupLmsId?: string
  packageId?: string
}

export interface IStudentGroupRepository {
  createStudentGroup(
    user: User,
    studentGroup: StudentGroupInfo,
    organizationId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'OrganizationInfoNotFound'>
      | E<'PermissionDenied'>
      | E<'AdministratorNotFound'>
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

export class CreateStudentGroupUseCase {
  constructor(
    private studentGroupRepository: IStudentGroupRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentGroup: StudentGroupInfo,
    organizationId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'AlreadyExistError'>
      | E<'InvalidOrganizationId'>
      | E<'OrganizationInfoNotFound'>
      | E<'AdministratorNotFound'>
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
            "The user does not have permission to add the specified student group's information",
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
              message:
                "The user does not have permission to add the specified student group's information",
            },
            value: null,
          }
        }
      }
    }

    const studentGroupResult =
      await this.studentGroupRepository.createStudentGroup(
        user,
        studentGroup,
        organizationId,
      )

    if (studentGroupResult.hasError) {
      switch (studentGroupResult.error.type) {
        case 'AlreadyExistError': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `${studentGroup.name} student group is already exists.`,
            ),
            value: null,
          }
        }
        case 'OrganizationInfoNotFound': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `organization information not found.`,
            ),
            value: null,
          }
        }
        case 'AdministratorNotFound': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `no administrator found for user ${user.id}`,
            ),
            value: null,
          }
        }
        case 'PermissionDenied': {
          return {
            hasError: true,
            error: wrapError(studentGroupResult.error, `Access Denied`),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `failed to create student group ${JSON.stringify(studentGroup)}`,
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
