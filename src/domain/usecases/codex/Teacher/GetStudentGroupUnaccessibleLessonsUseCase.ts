import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { userRoles } from '../../shared/Constants'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { UnaccessibleLesson } from '../../../entities/codex/UnaccessibleLesson'
import { StudentGroup } from '../../../entities/codex/StudentGroup'

const ALLOWED_ROLES: User['role'][] = [
  'internalOperator',
  'administrator',
  'teacher',
  'student',
]

export interface IUnaccessibleLessonRepository {
  getUnaccessibleLessons(
    studentGroupId: string,
  ): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>>
}

export interface ITeacherRepository {
  getTeacherByTeacherId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
  getTeacherIdByUserId(
    userId: string,
  ): Promise<Errorable<string | undefined, E<'UnknownRuntimeError'>>>
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

export class GetUnaccessibleLessonsUseCase {
  constructor(
    private unaccessibleLessonRepository: IUnaccessibleLessonRepository,
    private teacherRepository: ITeacherRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    studentGroupId: string,
    user: User,
  ): Promise<
    Errorable<
      UnaccessibleLesson[],
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidStudentGroupId'>
      | E<'StudentGroupNotFound'>
      | E<'UserNotFound'>
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
            'The user does not have permission to view restrict lesson access from provided student group',
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
              `The specified student group not found for ${studentGroupId}.`,
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
            message: `The specified administrator not found for ${user.id}`,
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
              'The user does not have permission to view restrict lesson access from provided student group',
          },
          value: null,
        }
      }
    }

    if (user.role === userRoles.teacher) {
      const userId = user.id
      const userResult = await this.teacherRepository.getTeacherIdByUserId(
        userId,
      )

      if (userResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            userResult.error,
            `failed to getTeacherIdByUserId ${userId}`,
          ),
          value: null,
        }
      }

      if (!userResult.value) {
        return {
          hasError: true,
          error: {
            type: 'UserNotFound',
            message: `The specified user not found for ${userId}`,
          },
          value: null,
        }
      }

      const teacherResult = await this.teacherRepository.getTeacherByTeacherId(
        userResult.value,
      )

      if (teacherResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            teacherResult.error,
            `failed to getTeacherByTeacherId ${userResult.value}`,
          ),
          value: null,
        }
      }

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

      if (!teacherResult.value) {
        return {
          hasError: true,
          error: {
            type: 'TeacherNotFound',
            message: `The specified teacher not found for ${user.id}`,
          },
          value: null,
        }
      }

      if (teacherResult.value.teacherOrganizations) {
        const teacherOrganizations =
          teacherResult.value.teacherOrganizations.find(
            (i) => i.id === getStudentGroupInfo?.value?.organizationId,
          )

        if (!teacherOrganizations) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message:
                'The user does not have permission to view restrict lesson access from provided student group.',
            },
            value: null,
          }
        }
      }
    }

    // get unaccessible lessons for student group
    const unaccessibleLessonResult =
      await this.unaccessibleLessonRepository.getUnaccessibleLessons(
        studentGroupId,
      )

    if (unaccessibleLessonResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          unaccessibleLessonResult.error,
          `failed to get unaccessible lesson for student group ${studentGroupId}`,
        ),
        value: null,
      }
    }

    if (unaccessibleLessonResult.value.length === 0) {
      return {
        hasError: false,
        error: null,
        value: [],
      }
    }

    return {
      hasError: false,
      error: null,
      value: unaccessibleLessonResult.value,
    }
  }
}
