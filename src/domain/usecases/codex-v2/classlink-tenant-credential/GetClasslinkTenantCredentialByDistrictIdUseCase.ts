import { ClasslinkTenantCredential } from '../../../entities/codex-v2/ClasslinkTenantCredential'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface ClasslinkTenantCredentialRepository {
  findByDistrictId(
    districtId: string,
  ): Promise<
    Errorable<ClasslinkTenantCredential | null, E<'UnknownRuntimeError'>>
  >
}

export default class GetClasslinkTenantCredentialByDistrictIdUseCase {
  constructor(
    private readonly classlinkTenantCredentialRepository: ClasslinkTenantCredentialRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    districtId: string,
  ): Promise<
    Errorable<
      ClasslinkTenantCredential | null,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.classlinkTenantCredentialRepository.findByDistrictId(
      districtId,
    )
  }
}
