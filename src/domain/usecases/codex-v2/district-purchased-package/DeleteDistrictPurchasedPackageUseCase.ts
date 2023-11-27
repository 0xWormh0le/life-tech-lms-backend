import { DistrictPurchasedPackage } from '../../../entities/codex-v2/DistrictPurchasedPackage'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface DistrictPurchasedPackageRepository {
  findById(
    id: string,
  ): Promise<
    Errorable<DistrictPurchasedPackage | null, E<'UnknownRuntimeError'>>
  >
  delete(id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class DeleteDistrictPurchasedPackageUseCase {
  constructor(
    private readonly districtPurchasedPackageRepository: DistrictPurchasedPackageRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    id: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'DistrictPurchasedPackageNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const savedRes = await this.districtPurchasedPackageRepository.findById(id)

    if (savedRes.hasError) {
      return savedRes
    }

    if (!savedRes.value) {
      return failureErrorable(
        'DistrictPurchasedPackageNotFound',
        `districtPurchasedPackage not found. id: ${id}`,
      )
    }

    const deletedRes = await this.districtPurchasedPackageRepository.delete(id)

    if (deletedRes.hasError) {
      return deletedRes
    }

    return successErrorable(undefined)
  }
}
