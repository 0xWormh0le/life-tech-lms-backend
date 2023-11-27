import { CodexPackage } from '../../../entities/codex/CodexPackage'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { User } from '../../../entities/codex/User'
import { userRoles } from '../../shared/Constants'
import { isValidUUID } from '../../shared/Ensure'
import { E, Errorable, wrapError } from '../../shared/Errors'

export interface IDistrictPurchasedPackageRepository {
  getDistrictPurchasedPackagesByDistrictId(
    districtId: string,
  ): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>>
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

export class GetDistrictPurchasedPackagesByDistrictIdUseCase {
  constructor(
    private districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository,
    private administratorRepository: IAdministratorRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  async run(
    user: User,
    districtId: string,
  ): Promise<
    Errorable<
      CodexPackage[],
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'InvalidDistrictId'>
      | E<'AdministratorNotFound'>
      | E<'TeacherNotFound'>
    >
  > {
    // Check authorization for this User
    if (user.role === userRoles.student) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to view district purchased packages.',
        },
        value: null,
      }
    }

    //validate with provided districtId
    if (!isValidUUID(districtId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidDistrictId',
          message: `Invalid format of districtId of ${districtId}.`,
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

      if (districtAdministratorResult.value.districtId !== districtId) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to view district purchased packages.',
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

      if (getTeacherInfo.value.districtId !== districtId) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              'The user does not have permission to view district purchased packages.',
          },
          value: null,
        }
      }
    }

    const allDistrictPurchasedPackages =
      await this.districtPurchasedPackageRepository.getDistrictPurchasedPackagesByDistrictId(
        districtId,
      )

    if (allDistrictPurchasedPackages.hasError) {
      return {
        hasError: true,
        error: wrapError(
          allDistrictPurchasedPackages.error,
          'failed to get packages',
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: allDistrictPurchasedPackages.value,
    }
  }
}
