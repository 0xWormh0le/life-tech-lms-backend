import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { Student } from '../../../entities/codex/Student'
import { Option, userRoles } from '../../shared/Constants'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { StudentGroup } from '../../../entities/codex/StudentGroup'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IStudentRepository {
  getStudents(
    studentGroupId: string,
    studentIds?: string[],
    name?: string | null,
    queryOption?: Option,
    role?: string | null,
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
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

export class GetStudentsUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentGroupId: string,
    studentIds?: string[],
    name?: string | null,
    queryOption?: Option,
  ): Promise<
    Errorable<
      Student[],
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidStudentGroupId'>
      | E<'StudentGroupNotFound'>
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
            "The token does not have permission to view the specified student's information.",
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
              "The token does not have permission to view the specified student's information.",
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
              message: 'The user does not have permission to add the students.',
            },
            value: null,
          }
        }
      }
    }

    const studentRepositoryResult = await this.studentRepository.getStudents(
      studentGroupId,
      studentIds,
      name,
      queryOption,
      user.role,
    )

    if (studentRepositoryResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          studentRepositoryResult.error,
          `Failed to get students`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: studentRepositoryResult.value,
    }
  }
}
