import { User } from '../../entities/codex/User'
import { E, Errorable, wrapError } from '../shared/Errors'
import { isValidUUID } from '../shared/Ensure'
import { userRoles } from '../shared/Constants'

export const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
  userRoles.student,
]

export interface IUnaccessibleLessonRepository {
  getStudentUnaccessibleLessons(
    userId: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>>
}

export class GetStudentUnaccessibleLessonsUseCase {
  constructor(
    private unaccessibleLessonRepository: IUnaccessibleLessonRepository,
  ) {}

  async run(
    studentId: string,
    user: User,
  ): Promise<
    Errorable<
      string[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'InvalidStudentId'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to view restricted lesson',
        },
        value: null,
      }
    }

    // Validate with provided studentGroupId
    if (!isValidUUID(studentId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidStudentId',
          message: 'Invalid studentId',
        },
        value: null,
      }
    }

    // get student unaccessible lessons
    const studentUnaccessibleLessonResult =
      await this.unaccessibleLessonRepository.getStudentUnaccessibleLessons(
        studentId,
      )

    if (studentUnaccessibleLessonResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          studentUnaccessibleLessonResult.error,
          `failed to get unaccessible lesson for student ${studentId}`,
        ),
        value: null,
      }
    }

    if (studentUnaccessibleLessonResult.value.length === 0) {
      return {
        hasError: false,
        error: null,
        value: [],
      }
    }

    return {
      hasError: false,
      error: null,
      value: studentUnaccessibleLessonResult.value,
    }
  }
}
