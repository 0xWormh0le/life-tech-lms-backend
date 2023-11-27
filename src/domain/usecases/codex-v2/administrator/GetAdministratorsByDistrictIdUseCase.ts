import { Administrator } from '../../../entities/codex-v2/Administrator'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface AdministratorRepository {
  findByDistrictId(
    districtId: string,
  ): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>>
}

export default class GetAdministratorsByDistrictIdUseCase {
  constructor(
    private readonly administratorRepository: AdministratorRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    districtId: string,
  ): Promise<
    Errorable<Administrator[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.administratorRepository.findByDistrictId(districtId)
  }
}
