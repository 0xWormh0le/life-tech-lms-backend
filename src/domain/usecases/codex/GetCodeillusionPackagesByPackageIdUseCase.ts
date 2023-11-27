import { UserCodeIllusionPackage } from '../../entities/codex/UserCodeIllusionPackage'
import { E, Errorable, wrapError } from '../shared/Errors'
import { User } from '../../entities/codex/User'

export interface ICodeillusionPackagesRepository {
  getById(
    codeIllusionPackageId: string,
  ): Promise<
    Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>
  >
}

export class GetCodeillusionPackagesByPackageIdUseCase {
  constructor(
    private codeillusionPackagesRepository: ICodeillusionPackagesRepository,
  ) {}

  async run(
    user: User,
    packageId: string,
  ): Promise<
    Errorable<
      UserCodeIllusionPackage,
      E<'CodeIllusionPackageNotFoundError'> | E<'UnknownRuntimeError'>
    >
  > {
    // Get Codeillusion Packages from CodeillusionPackages Repository by packageId
    const codeillusionPackgesResult =
      await this.codeillusionPackagesRepository.getById(packageId)

    if (codeillusionPackgesResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          codeillusionPackgesResult.error,
          `failed to getCodeillusionPacakgesByPackageId ${packageId}`,
        ),
        value: null,
      }
    }

    if (!codeillusionPackgesResult.value) {
      return {
        hasError: true,
        error: {
          type: 'CodeIllusionPackageNotFoundError',
          message: `The specified package not found for package id ${packageId}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: codeillusionPackgesResult.value,
    }
  }
}
