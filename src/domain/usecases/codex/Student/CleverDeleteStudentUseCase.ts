import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { User } from '../../../entities/codex/User'
import { isValidUUID } from '../../shared/Ensure'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { userRoles } from '../../shared/Constants'
import {
  OrgnaizationsList,
  TeacherOrganization,
} from '../../../entities/codex/Teacher'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IStudentRepository {
  deactivateStudent(
    studentId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  >

  getDistrictIdByStudentId(
    studentId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  >
  getStudentOrganizationsById(
    studentId: string,
  ): Promise<
    Errorable<
      OrgnaizationsList[],
      E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>
    >
  >
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

export class CleverDeleteStudentUseCase {
  constructor(
    private studentRepository: IStudentRepository,
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    studentId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'StudentNotFoundError'>
      | E<'InvalidStudentId'>
      | E<'AdministratorNotFound'>
      | E<'TeacherNotFound'>
    >
  > {
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

    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to delete the specified student.',
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const getDistrictIdOfStudent =
        await this.studentRepository.getDistrictIdByStudentId(studentId)

      if (getDistrictIdOfStudent.hasError) {
        switch (getDistrictIdOfStudent.error.type) {
          case 'StudentNotFoundError': {
            return {
              hasError: true,
              error: wrapError(
                getDistrictIdOfStudent.error,
                `The specified student not found for studentId: ${studentId}.`,
              ),
              value: null,
            }
          }
          default: {
            return {
              hasError: true,
              error: wrapError(
                getDistrictIdOfStudent.error,
                `failed to get district id of student`,
              ),
              value: null,
            }
          }
        }
      }

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
        getDistrictIdOfStudent.value
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to delete the specified student.',
          },
          value: null,
        }
      }
    }

    if (user.role === userRoles.teacher) {
      const getStudentOrganizations =
        await this.studentRepository.getStudentOrganizationsById(studentId)

      if (getStudentOrganizations.hasError) {
        return {
          hasError: true,
          error: wrapError(
            getStudentOrganizations.error,
            `failed to get student organizations list from db`,
          ),
          value: null,
        }
      }

      if (getStudentOrganizations.value.length === 0) {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'requested student not found in any organization.',
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
        const deletePermission =
          getTeacherInfo.value.teacherOrganizations.filter((c) =>
            getStudentOrganizations.value.some((s) => s.id === c.id),
          )

        if (deletePermission.length === 0) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message:
                'The user does not have permission to delete the specified student.',
            },
            value: null,
          }
        }
      }
    }

    const studentResult = await this.studentRepository.deactivateStudent(
      studentId,
    )

    if (studentResult.hasError) {
      switch (studentResult.error.type) {
        case 'StudentNotFoundError': {
          return {
            hasError: true,
            error: wrapError(
              studentResult.error,
              `The specified student not found for studentId: ${studentId}.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              studentResult.error,
              `failed to delete student of studentId : ${studentId}`,
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
