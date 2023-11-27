import { District } from '../../../entities/codex-v2/District'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface DistrictRepository {
  findAll(): Promise<Errorable<District[], E<'UnknownRuntimeError'>>>
}

export default class GetDistrictsUseCase {
  constructor(private readonly districtRepository: DistrictRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<District[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.districtRepository.findAll()
  }
}
