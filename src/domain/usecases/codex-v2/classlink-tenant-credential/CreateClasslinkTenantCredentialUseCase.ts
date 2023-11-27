import { ClasslinkTenantCredential } from '../../../entities/codex-v2/ClasslinkTenantCredential'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { District } from '../../../entities/codex-v2/District'

export interface ClasslinkTenantCredentialRepository {
  findByDistrictId(
    districtId: string,
  ): Promise<
    Errorable<ClasslinkTenantCredential | null, E<'UnknownRuntimeError'>>
  >
  create(
    classlinkTenantCredential: ClasslinkTenantCredential,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DistrictRepository {
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
}

export default class CreateClasslinkTenantCredentialUseCase {
  constructor(
    private readonly classlinkTenantCredentialRepository: ClasslinkTenantCredentialRepository,
    private readonly districtRepository: DistrictRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      districtId: string
      externalLmsAppId: string
      accessToken: string
      externalLmsTenantId: string
    },
  ): Promise<
    Errorable<
      ClasslinkTenantCredential,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'DistrictNotFound'>
      | E<'ClasslinkTenantCredentialAlreadyExists'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const districtRes = await this.districtRepository.findById(input.districtId)

    if (districtRes.hasError) {
      return districtRes
    }

    if (!districtRes.value) {
      return failureErrorable(
        'DistrictNotFound',
        `district not found. districtId: ${input.districtId}`,
      )
    }

    const savedClasslinkTenantCredential =
      await this.classlinkTenantCredentialRepository.findByDistrictId(
        input.districtId,
      )

    if (savedClasslinkTenantCredential.hasError) {
      return savedClasslinkTenantCredential
    }

    if (savedClasslinkTenantCredential.value) {
      // return failureErrorable(
      //   'ClasslinkTenantCredentialAlreadyExists',
      //   `classlinkTenantCredential already exists. districtId: ${input.districtId}`,
      // )
    }

    const classlinkTenantCredential = {
      ...input,
    }
    const creationRes = await this.classlinkTenantCredentialRepository.create(
      classlinkTenantCredential,
    )

    if (creationRes.hasError) {
      return creationRes
    }

    return successErrorable(classlinkTenantCredential)
  }
}
