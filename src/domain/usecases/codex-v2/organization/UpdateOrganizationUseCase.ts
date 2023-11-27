import { Organization } from '../../../entities/codex-v2/Organization'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { District } from '../../../entities/codex-v2/District'

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export interface DistrictRepository {
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
}

export interface OrganizationRepository {
  findById(
    id: string,
  ): Promise<Errorable<Organization | null, E<'UnknownRuntimeError'>>>
  update(
    organization: Organization,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class UpdateOrganizationUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
      name: string
      districtId: string
      externalLmsOrganizationId: string | null
      classlinkTenantId: string | null
    },
  ): Promise<
    Errorable<
      Organization,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'OrganizationNotFound'>
      | E<'DistrictNotFound'>
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

    const savedOrganizationRes = await this.organizationRepository.findById(
      input.id,
    )

    if (savedOrganizationRes.hasError) {
      return savedOrganizationRes
    }

    if (!savedOrganizationRes.value) {
      return failureErrorable(
        'OrganizationNotFound',
        `organization not found. organizationId: ${input.id}`,
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

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const organization: Organization = {
      ...input,
      id: savedOrganizationRes.value.id,
      createdAt: savedOrganizationRes.value.createdAt,
      updatedAt: nowRes.value,
    }
    const res = await this.organizationRepository.update(organization)

    if (res.hasError) {
      return res
    }

    return successErrorable(organization)
  }
}
