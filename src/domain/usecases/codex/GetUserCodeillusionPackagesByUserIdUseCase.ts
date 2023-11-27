import { UserCodeIllusionPackage } from '../../entities/codex/UserCodeIllusionPackage'
import { E, Errorable, wrapError } from '../shared/Errors'
import { User } from '../../entities/codex/User'
import { StudentGroupPackageAssignment } from '../../entities/codex/StudentGroupPackageAssignment'

export interface ICodeillusionPackagesRepository {
  getById(
    codeIllusionPackageId: string,
  ): Promise<
    Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>
  >
  getUserCodeillusionPacakgesByUserId(
    userId: string,
    studentDataResult: StudentGroupPackageAssignment[],
  ): Promise<
    Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>
  >
}

export interface IStudentrepository {
  getStudentPackagesByUserId(
    userId: string,
  ): Promise<
    Errorable<
      StudentGroupPackageAssignment[] | undefined,
      E<'UnknownRuntimeError'>
    >
  >
}

export class GetUserCodeillusionPackagesByUserIdUseCase {
  constructor(
    private codeillusionPackagesRepository: ICodeillusionPackagesRepository,
    private studentRepository: IStudentrepository,
  ) {}

  async run(
    requestedUser: User,
    targetUserId: string,
  ): Promise<
    Errorable<
      UserCodeIllusionPackage,
      | E<'UserCodeIllusionPackageNotFoundError'>
      | E<'StudentNotFound'>
      | E<'UnknownRuntimeError'>
    >
  > {
    // FIXME: This is a temporary fix. related to DSB-1257
    // https://lifeistech-usa.atlassian.net/browse/DSB-1257?atlOrigin=eyJpIjoiMTAzMGMyNjU4YTE1NGIzNGI4YTdjZjY5NjI0MGI5ZDkiLCJwIjoiaiJ9
    if (requestedUser.role !== 'student') {
      const getCodeillusinPackageByIdResult =
        await this.codeillusionPackagesRepository.getById(
          'codeillusion-package-basic-full-premium-heroic',
        )

      if (getCodeillusinPackageByIdResult.hasError) {
        return getCodeillusinPackageByIdResult
      }

      if (!getCodeillusinPackageByIdResult.value) {
        return {
          hasError: true,
          error: {
            type: 'UserCodeIllusionPackageNotFoundError',
            message: `packageId codeillusion-package-basic-full-premium-heroic not exist`,
          },
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: getCodeillusinPackageByIdResult.value,
      }
    }
    // FIXME: ↑↑ This is a temporary fix.

    //Get student data by userId
    const studentDataResult =
      await this.studentRepository.getStudentPackagesByUserId(targetUserId)

    if (studentDataResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          studentDataResult.error,
          `failed to getStudentDataByUserId ${targetUserId}`,
        ),
        value: null,
      }
    }

    if (!studentDataResult.value) {
      return {
        hasError: true,
        error: {
          type: 'StudentNotFound',
          message: `The specified student not found for ${targetUserId}`,
        },
        value: null,
      }
    }

    // Get Codeillusion Packages from CodeillusionPackages Repository by userId
    const userCodeillusionPackgesResult =
      await this.codeillusionPackagesRepository.getUserCodeillusionPacakgesByUserId(
        targetUserId,
        studentDataResult.value,
      )

    if (userCodeillusionPackgesResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          userCodeillusionPackgesResult.error,
          `failed to getUserCodeillusionPacakgesByUserId ${targetUserId}`,
        ),
        value: null,
      }
    }

    if (!userCodeillusionPackgesResult.value) {
      return {
        hasError: true,
        error: {
          type: 'UserCodeIllusionPackageNotFoundError',
          message: `no codeillusion packages found for user id ${targetUserId}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: userCodeillusionPackgesResult.value,
    }
  }
}
