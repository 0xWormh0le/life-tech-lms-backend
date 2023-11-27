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

export interface DistrictRepository {
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
}

export interface OrganizationRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    organization: Organization,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateOrganizationUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      name: string
      districtId: string
      externalLmsOrganizationId: string | null
      classlinkTenantId: string | null
    },
  ): Promise<
    Errorable<
      Organization,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'DistrictNotFound'>
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

    const issueIdRes = await this.organizationRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const organization: Organization = {
      ...input,
      id: issueIdRes.value,
      createdAt: nowRes.value,
      updatedAt: nowRes.value,
    }
    const createRes = await this.organizationRepository.create(organization)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(organization)
  }
}
