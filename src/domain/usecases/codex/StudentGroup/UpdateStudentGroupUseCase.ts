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
  organizationId?: string
  packageId?: string
}

export interface IStudentGroupRepository {
  updateStudentGroup(
    user: User,
    studentGroup: StudentGroupInfo,
    studentGroupId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'OrganizationInfoNotFound'>
      | E<'PermissionDenied'>
      | E<'StudentGroupInfoNotFound'>
      | E<'AdministratorNotFound'>
    >
  >
  getStudentGroupById(
    studentGroupId: string,
  ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>>
}

export interface ITeacherRepository {
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export class UpdateStudentGroupUseCase {
  constructor(
    private studentGroupRepository: IStudentGroupRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentGroup: StudentGroupInfo,
    studentGroupId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'AlreadyExistError'>
      | E<'InvalidStudentGroupId'>
      | E<'StudentGroupInfoNotFound'>
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

    // Validate with provided studentGroupId
    if (!isValidUUID(studentGroupId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentGroupId',
          message: 'Invalid studentGroupId',
        },
        value: null,
      }
    }

    if (user.role === userRoles.teacher) {
      const getStudentGroupInfo =
        await this.studentGroupRepository.getStudentGroupById(studentGroupId)

      if (getStudentGroupInfo.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getStudentGroupInfo.error,
            `failed to get student group for ${studentGroupId}`,
          ),
          value: null,
        }
      }

      if (!getStudentGroupInfo.value) {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupInfoNotFound',
            message: 'student group information not found',
          },
          value: null,
        }
      }

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
            (i) => i.id === getStudentGroupInfo?.value?.organizationId,
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
      await this.studentGroupRepository.updateStudentGroup(
        user,
        studentGroup,
        studentGroupId,
      )

    if (studentGroupResult.hasError) {
      switch (studentGroupResult.error.type) {
        case 'StudentGroupInfoNotFound': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `student group information not found.`,
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
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `failed to update student group ${JSON.stringify(studentGroup)}`,
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
