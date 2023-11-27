import { Administrator } from '../../../entities/codex-v2/Administrator'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface AdministratorRepository {
  findAll(): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>>
}

export default class GetAdministratorsUseCase {
  constructor(
    private readonly administratorRepository: AdministratorRepository,
  ) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<Administrator[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    return await this.administratorRepository.findAll()
  }
}
