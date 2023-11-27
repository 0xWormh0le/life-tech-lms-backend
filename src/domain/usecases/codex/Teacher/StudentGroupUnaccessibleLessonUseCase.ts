import { User } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { Lesson } from '../../../entities/codex/Lesson'
import { userRoles } from '../../shared/Constants'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { StudentGroup } from '../../../entities/codex/StudentGroup'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IUnaccessibleLessonRepository {
  createUnaccessibleLesson(
    studentGroupId: string,
    lessonIds: string[],
    createdUserId: string,
    packageId: string | undefined,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
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

export interface ILessonRepository {
  getLessonsByLessonIds(
    lessonIds: string[],
  ): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>>
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

export class CreateUnaccessibleLessonUseCase {
  constructor(
    private unaccessibleLessonRepository: IUnaccessibleLessonRepository,
    private teacherRepository: ITeacherRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private lessonRepository: ILessonRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    studentGroupId: string,
    user: User,
    lessonIds: string[],
    packageId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidStudentGroupId'>
      | E<'StudentGroupNotFound'>
      | E<'LessonsNotFound'>
      | E<'UserNotFound'>
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
            'The user does not have permission to restrict lesson for access to provided student group',
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
              'The user does not have permission to restrict lesson for access to provided student group',
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
            `failed to getTeacherIdByUserId ${lessonIds}`,
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
            `failed to getTeacherByTeacherId ${lessonIds}`,
          ),
          value: null,
        }
      }

      if (teacherResult?.value?.districtId !== studentGroupResult.value) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to restrict lesson for access to provided student group',
          },
          value: null,
        }
      }
    }

    const lessonsResult = await this.lessonRepository.getLessonsByLessonIds(
      lessonIds,
    )

    if (lessonsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          lessonsResult.error,
          `failed to getLessonsByLessonIds ${lessonIds}`,
        ),
        value: null,
      }
    }

    const notFoundLessonIds: any[] = []

    lessonsResult?.value?.forEach((element) => {
      if (lessonIds.indexOf(element.id) === -1) {
        notFoundLessonIds.push(element.id)
      }
    })

    if (notFoundLessonIds.length > 0) {
      return {
        hasError: true,
        error: {
          type: 'LessonsNotFound',
          message: `The specified lessons are not found for lesson ids: ${notFoundLessonIds.join(
            ', ',
          )}`,
        },
        value: null,
      }
    }

    // Restrict lesson access for student group
    const unaccessibleLessonResult =
      await this.unaccessibleLessonRepository.createUnaccessibleLesson(
        studentGroupId,
        lessonIds,
        user.id,
        packageId,
      )

    if (unaccessibleLessonResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          unaccessibleLessonResult.error,
          `failed to restrict lesson access for student group`,
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
