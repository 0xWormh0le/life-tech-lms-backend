import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { StudentGroup } from '../../../entities/codex/StudentGroup'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IStudentRepository {
  removeStudentFromStudentGroup(
    studentGroupId: string,
    studentId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'StudentNotFoundError'>
      | E<'PermissionDenied'>
    >
  >
}

export interface IStudentGroupRepository {
  getDistrictIdByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>
  >
  getStudentGroupById(
    studentGroupId: string,
  ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface ITeacherRepository {
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export class RemoveStudentFromStudentGroupUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentGroupId: string,
    studentId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidStudentGroupId'>
      | E<'InvalidStudentId'>
      | E<'StudentGroupNotFound'>
      | E<'StudentNotFoundError'>
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
            'The user does not have permission to delete the specified student from student-group.',
        },
        value: null,
      }
    }

    //validate with provided studentGroupId
    if (!isValidUUID(studentGroupId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentGroupId',
          message: 'Invalid studentGroupId.',
        },
        value: null,
      }
    }

    //validate with provided studentId
    if (!isValidUUID(studentId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentId',
          message: 'Invalid studentId.',
        },
        value: null,
      }
    }

    //find district id from studentGroupId
    const studentGroupResult =
      await this.studentGroupRepository.getDistrictIdByStudentGroupId(
        studentGroupId,
      )

    if (studentGroupResult.hasError) {
      switch (studentGroupResult.error.type) {
        case 'StudentGroupNotFound': {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `The specified student group not found for studentGroupId: ${studentGroupId}.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentGroupResult.error,
              `failed to get district id of studentGroupId`,
            ),
            value: null,
          }
        }
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

      if (
        districtAdministratorResult.value.districtId !==
        studentGroupResult.value
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to delete the specified student from student-group.',
          },
          value: null,
        }
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
                'The user does not have permission to delete the specified student from student-group.',
            },
            value: null,
          }
        }
      }
    }

    const studentRepositoryResult =
      await this.studentRepository.removeStudentFromStudentGroup(
        studentGroupId,
        studentId,
      )

    if (studentRepositoryResult.hasError) {
      switch (studentRepositoryResult.error.type) {
        case 'PermissionDenied': {
          return {
            hasError: true,
            error: wrapError(
              studentRepositoryResult.error,
              `Permission denied,student at least in one student group.`,
            ),
            value: null,
          }
        }
        case 'StudentNotFoundError': {
          return {
            hasError: true,
            error: wrapError(
              studentRepositoryResult.error,
              `The specified student not found in student group`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentRepositoryResult.error,
              `Failed to delete student from student-group`,
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
