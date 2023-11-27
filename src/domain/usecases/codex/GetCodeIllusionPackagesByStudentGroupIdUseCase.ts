import { User } from '../../entities/codex/User'
import { E, Errorable, wrapError } from '../shared/Errors'
import { isValidUUID } from '../shared/Ensure'
import { DistrictAdministrator } from '../../entities/codex/DistrictAdministrator'
import { userRoles } from '../shared/Constants'
import { TeacherOrganization } from '../../entities/codex/Teacher'
import { OrgnaizationsList } from '../../entities/codex/Teacher'
import { UserCodeIllusionPackage } from '../../entities/codex/UserCodeIllusionPackage'
import { StudentGroup } from '../../entities/codex/StudentGroup'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export interface IStudentGroupRepository {
  getDistrictIdByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>
  >
  getStudentGroupById(
    studentGroupId: string,
  ): Promise<
    Errorable<
      StudentGroup | undefined,
      E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>
    >
  >
}

export interface ICodeillusionPackagesRepository {
  getCodeIllusionPackagesByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<
      UserCodeIllusionPackage | undefined,
      | E<'UnknownRuntimeError'>
      | E<'StudentGroupNotFound'>
      | E<'PackageNotAssigned'>
    >
  >
}

export interface IAdministratorRepository {
  getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<
      DistrictAdministrator | undefined,
      E<'UnknownRuntimeError'> | E<'AdministratorNotFound'>
    >
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
    Errorable<
      TeacherOrganization | undefined,
      E<'UnknownRuntimeError'> | E<'TeacherNotFound'>
    >
  >
}

export class getCodeIllusionPackagesByStudentGroupIdUseCase {
  constructor(
    private administratorRepository: IAdministratorRepository,
    private studentGroupRepository: IStudentGroupRepository,
    private teacherRepository: ITeacherRepository,
    private codeIllusionRepository: ICodeillusionPackagesRepository,
  ) {}

  async run(
    user: User,
    studentGroupId: string,
  ): Promise<
    Errorable<
      UserCodeIllusionPackage,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidStudentGroupId'>
      | E<'AdministratorNotFound'>
      | E<'StudentGroupNotFound'>
      | E<'TeacherNotFound'>
      | E<'PackageNotAssigned'>
    >
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to view the information of packages.',
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
          message: 'Invalid format of studentGroupId.',
        },
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

    if (!getStudentGroupInfo.value) {
      return {
        hasError: true,
        error: {
          type: 'StudentGroupNotFound',
          message: `The specified studentGroup not found for studentGroupId ${studentGroupId}`,
        },
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      const studentGroupResult =
        await this.studentGroupRepository.getDistrictIdByStudentGroupId(
          studentGroupId,
        )

      if (studentGroupResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            studentGroupResult.error,
            `failed to get district id of studentGroupId`,
          ),
          value: null,
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
        studentGroupResult.value
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to view the package details.',
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

      const isPermission = getTeacherInfo?.value?.teacherOrganizations?.find(
        (i) => i.id === getStudentGroupInfo.value?.organizationId,
      )

      if (!isPermission) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message: `The user does not have permission to View the package details for studentGroupId : ${studentGroupId} `,
          },
          value: null,
        }
      }
    }

    const getCodeIllusionPackagesByStudentGroupIdResult =
      await this.codeIllusionRepository.getCodeIllusionPackagesByStudentGroupId(
        studentGroupId,
      )

    if (getCodeIllusionPackagesByStudentGroupIdResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          getCodeIllusionPackagesByStudentGroupIdResult.error,
          `student group information not found.`,
        ),
        value: null,
      }
    }

    if (!getCodeIllusionPackagesByStudentGroupIdResult.value) {
      return {
        hasError: true,
        error: {
          type: 'PackageNotAssigned',
          message: `The student-group with studentGroupId :${studentGroupId} does not have assigned any codeillusion packages.`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: getCodeIllusionPackagesByStudentGroupIdResult.value,
    }
  }
}
