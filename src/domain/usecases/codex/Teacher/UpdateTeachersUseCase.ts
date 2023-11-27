import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import {
  TeacherOrganization,
  UpdateTeacher,
} from '../../../entities/codex/Teacher'
import { User, UserRole } from '../../../entities/codex/User'
import { isValidEmail, isValidUUID } from '../../shared/Ensure'
import { Errorable, E, wrapError } from '../../shared/Errors'

export interface ITeacherRepository {
  updateTeacherById(
    teacherId: string,
    teacherUserId: string,
    teacher: UpdateTeacher,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>
  >
  getTeacherByTeacherId(
    teacherId: string,
  ): Promise<
    Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>
  >
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  >
}

const ALLOWED_ROLES: UserRole[] = [
  'internalOperator',
  'administrator',
  'teacher',
]

export class UpdateTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    user: User,
    teacherId: string,
    teacher: UpdateTeacher,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'TeacherNotFound'>
      | E<'PermissionDenied'>
      | E<'InvalidTeacherId'>
      | E<'EmailAlreadyExists'>
      | E<'AdministratorNotFound'>
      | E<'FailedToLoadAdministratorData'>
      | E<'InvalidEmail'>
    >
  > {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to edit the specified teacher information',
        },
        value: null,
      }
    }

    if (!isValidUUID(teacherId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidTeacherId',
          message: 'teacherId is invalid',
        },
        value: null,
      }
    }

    if (teacher.email) {
      if (!isValidEmail(teacher.email)) {
        return {
          hasError: true,
          error: {
            type: 'InvalidEmail',
            message: 'Invalid email is provided',
          },
          value: null,
        }
      }
    }

    const teacherResult = await this.teacherRepository.getTeacherByTeacherId(
      teacherId,
    )

    if (teacherResult.hasError) {
      return teacherResult
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

    if (user.role === 'teacher' && teacherResult.value.userId !== user.id) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to edit the specified teacher information',
        },
        value: null,
      }
    } else if (user.role === 'administrator') {
      const getAdminisratorResult =
        await this.administratorRepository.getDistrictAdministratorByUserId(
          user.id,
        )

      if (getAdminisratorResult.hasError) {
        return {
          hasError: true,
          error: {
            type: 'FailedToLoadAdministratorData',
            message: `Failed to getDistrictAdministratorByUserId ${user.id}`,
          },
          value: null,
        }
      }

      if (!getAdminisratorResult.value) {
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
        getAdminisratorResult.value.districtId !==
        teacherResult.value.districtId
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to edit the specified teacher information',
          },
          value: null,
        }
      }
    }

    if (user.role === 'teacher') {
      delete teacher.teacherLMSId
    }

    const updateTeacherResult = await this.teacherRepository.updateTeacherById(
      teacherId,
      teacherResult.value.userId,
      teacher,
    )

    if (updateTeacherResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          updateTeacherResult.error,
          'This email is already exist',
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
