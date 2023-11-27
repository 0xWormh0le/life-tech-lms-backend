import { E, Errorable, wrapError } from '../shared/Errors'
import { User } from '../../entities/codex/User'
import { UserRoles } from '../shared/Constants'
import { CodexPackage } from '../../entities/codex/CodexPackage'

const ALLOWED_ROLES: string[] = [UserRoles.internalOperator]

export interface ICodexPackagesRepository {
  getAllCodexPackages(): Promise<
    Errorable<CodexPackage[], E<'UnknownRuntimeError'>>
  >
}

export class GetAllCodexPackagesUseCase {
  constructor(private CodexPackageRepository: ICodexPackagesRepository) {}

  async run(
    user: User,
  ): Promise<
    Errorable<CodexPackage[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > {
    // Check authorization for this User
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message:
            'The user does not have permission to view the codex-packages.',
        },
        value: null,
      }
    }

    const allCodexPackages =
      await this.CodexPackageRepository.getAllCodexPackages()

    if (allCodexPackages.hasError) {
      return {
        hasError: true,
        error: wrapError(allCodexPackages.error, 'failed to get packages'),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: allCodexPackages.value,
    }
  }
}
