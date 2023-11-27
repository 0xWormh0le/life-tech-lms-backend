import { User, UserRole } from '../../../entities/codex/User'
import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

export interface ITeacherRepository {
  deactivateTeacher(
    teacherId: string,
  ): Promise<Errorable<{ message: string }, E<'UnknownRuntimeError'>>>
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

const ALLOWED_ROLES: UserRole[] = ['internalOperator', 'administrator']

export class CleverDeleteTeacherUseCase {
  constructor(
    private teacherRepository: ITeacherRepository,
    private administratorRepository: IAdministratorRepository,
  ) {}

  async run(
    user: User,
    teacherId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidTeacherId'>
      | E<'TeacherNotFound'>
      | E<'AdministratorNotFound'>
      | E<'FailedToLoadAdministratorData'>
    >
  > {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'The token does not have permission to delete an teacher',
        },
        value: null,
      }
    }

    if (!isValidUUID(teacherId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidTeacherId',
          message: 'Invalid teacherId',
        },
        value: null,
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

    if (user.role === 'administrator') {
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
            message: 'The token does not have permission to delete an teacher',
          },
          value: null,
        }
      }
    }

    const deleteTeacherResult = await this.teacherRepository.deactivateTeacher(
      teacherId,
    )

    if (deleteTeacherResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          deleteTeacherResult.error,
          `Failed to deleteTeacher ${teacherId}`,
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
