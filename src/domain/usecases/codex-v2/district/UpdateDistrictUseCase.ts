import { District } from '../../../entities/codex-v2/District'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface DistrictRepository {
  findByName(
    name: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
  update(district: District): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class UpdateDistrictUseCase {
  constructor(private readonly districtRepository: DistrictRepository) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
      name: string
      stateId: string
      lmsId: string | null
      externalLmsDistrictId: string | null
      enableRosterSync: boolean
    },
  ): Promise<
    Errorable<
      District,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'DistrictNotFound'>
      | E<'DuplicatedName'>
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

    const savedDistrictRes = await this.districtRepository.findById(input.id)

    if (savedDistrictRes.hasError) {
      return savedDistrictRes
    }

    if (!savedDistrictRes.value) {
      return failureErrorable(
        'DistrictNotFound',
        `district not found. districtId: ${input.id}`,
      )
    }

    const duplicatedNameDistrictRes = await this.districtRepository.findByName(
      input.name,
    )

    if (duplicatedNameDistrictRes.hasError) {
      return duplicatedNameDistrictRes
    }

    if (
      duplicatedNameDistrictRes.value &&
      duplicatedNameDistrictRes.value.id !== input.id
    ) {
      return failureErrorable(
        'DuplicatedName',
        `name is duplicated. duplicated districtId: ${duplicatedNameDistrictRes.value.id}`,
      )
    }

    const district: District = {
      ...input,
      id: savedDistrictRes.value.id,
      createdAt: savedDistrictRes.value.createdAt,
      createdUserId: savedDistrictRes.value.createdUserId,
    }
    const res = await this.districtRepository.update(district)

    if (res.hasError) {
      return res
    }

    return successErrorable(district)
  }
}
