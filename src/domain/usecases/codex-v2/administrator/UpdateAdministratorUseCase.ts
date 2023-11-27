import { Administrator } from '../../../entities/codex-v2/Administrator'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { District } from '../../../entities/codex-v2/District'

export interface DistrictRepository {
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
}

export interface AdministratorRepository {
  findById(
    id: string,
  ): Promise<Errorable<Administrator | null, E<'UnknownRuntimeError'>>>
  update(
    administrator: Administrator,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class UpdateAdministratorUseCase {
  constructor(
    private readonly districtRepository: DistrictRepository,
    private readonly administratorRepository: AdministratorRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
      userId: string
      districtId: string
      firstName: string
      lastName: string
      externalLmsAdministratorId: string | null
      isDeactivated: boolean
    },
  ): Promise<
    Errorable<
      Administrator,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'DistrictNotFound'>
      | E<'AdministratorNotFound'>
    >
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

    const savedAdministratorRes = await this.administratorRepository.findById(
      input.id,
    )

    if (savedAdministratorRes.hasError) {
      return savedAdministratorRes
    }

    if (!savedAdministratorRes.value) {
      return failureErrorable(
        'AdministratorNotFound',
        `administrator not found. administratorId: ${input.id}`,
      )
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

    const administrator: Administrator = {
      ...input,
      id: savedAdministratorRes.value.id,
      role: savedAdministratorRes.value.role,
      createdAt: savedAdministratorRes.value.createdAt,
      createdUserId: savedAdministratorRes.value.createdUserId,
    }
    const res = await this.administratorRepository.update(administrator)

    if (res.hasError) {
      return res
    }

    return successErrorable(administrator)
  }
}
