import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { Student } from '../../../entities/codex/Student'
import { userRoles } from '../../shared/Constants'
import { TeacherOrganization } from '../../../entities/codex/Teacher'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IStudentRepository {
  getStudents(
    studentGroupId: string,
    studentIds?: string[],
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface ITeacherRepository {
  getTeacherByTeacherId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
  getTeacherByUserId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export class GetTeacherByTeacherIdUseCase {
  constructor(
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    teacherId: string,
  ): Promise<
    Errorable<
      TeacherOrganization,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidTeacherId'>
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
            "The user does not have permission to view the specified teacher's information.",
        },
        value: null,
      }
    }

    //validate with provided studentGroupId
    if (!isValidUUID(teacherId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidTeacherId',
          message: 'Invalid teacherId.',
        },
        value: null,
      }
    }

    const teacherResultByTeacherId =
      await this.teacherRepository.getTeacherByTeacherId(teacherId)

    if (teacherResultByTeacherId.hasError) {
      return {
        hasError: true,
        error: wrapError(
          teacherResultByTeacherId.error,
          `Failed to get Teacher's info`,
        ),
        value: null,
      }
    }

    if (!teacherResultByTeacherId.value) {
      return {
        hasError: true,
        error: {
          type: 'TeacherNotFound',
          message: `The specified teacher not found for ${teacherId}`,
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

      if (
        districtAdministratorResult.value.districtId !==
        teacherResultByTeacherId.value.districtId
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              "The user does not have permission to view the specified teacher's information.",
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

      if (getTeacherInfo.value.teacherId !== teacherId) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              "The user does not have permission to View the specified teacher's information",
          },
          value: null,
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: teacherResultByTeacherId.value,
    }
  }
}
