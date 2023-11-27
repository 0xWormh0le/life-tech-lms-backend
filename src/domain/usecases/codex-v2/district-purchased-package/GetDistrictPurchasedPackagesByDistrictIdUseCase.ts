import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface DistrictPurchasedPackageRepository {
  findByDistrictId(
    districtId: string,
  ): Promise<Errorable<DistrictPurchasedPackage[], E<'UnknownRuntimeError'>>>
}

export default class GetDistrictPurchasedPackagesByDistrictIdUseCase {
  constructor(
    private readonly districtPurchasedPackageRepository: DistrictPurchasedPackageRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    districtId: string,
  ): Promise<
    Errorable<
      DistrictPurchasedPackage[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.districtPurchasedPackageRepository.findByDistrictId(
      districtId,
    )
  }
}
