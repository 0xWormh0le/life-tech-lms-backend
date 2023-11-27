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
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(district: District): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateDistrictUseCase {
  constructor(
    private readonly districtRepository: DistrictRepository,
    private readonly datetimeRepository: DatetimeRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      name: string
      stateId: string
      lmsId: string | null
      externalLmsDistrictId: string | null
      enableRosterSync: boolean
    },
  ): Promise<
    Errorable<
      District,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'DuplicatedName'>
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

    const duplicatedNameDistrictRes = await this.districtRepository.findByName(
      input.name,
    )

    if (duplicatedNameDistrictRes.hasError) {
      return duplicatedNameDistrictRes
    }

    if (duplicatedNameDistrictRes.value) {
      return failureErrorable(
        'DuplicatedName',
        `name is duplicated. duplicated districtId: ${duplicatedNameDistrictRes.value.id}`,
      )
    }

    const issueIdRes = await this.districtRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const district: District = {
      ...input,
      id: issueIdRes.value,
      createdAt: nowRes.value,
      createdUserId: authenticatedUser.id,
    }
    const createRes = await this.districtRepository.create(district)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(district)
  }
}
