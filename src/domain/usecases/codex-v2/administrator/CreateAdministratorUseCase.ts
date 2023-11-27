import { Administrator } from '../../../entities/codex-v2/Administrator'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { UserRoles } from '../../shared/Constants'
import { District } from '../../../entities/codex-v2/District'

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export interface UserRepository {
  findById(
    id: string,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>>
}

export interface HumanUserRepository {
  findByUserId(
    id: string,
  ): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>>
}

export interface DistrictRepository {
  findById(
    id: string,
  ): Promise<Errorable<District | null, E<'UnknownRuntimeError'>>>
}

export interface AdministratorRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    administrator: Administrator,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class CreateAdministratorUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly userRepository: UserRepository,
    private readonly humanUserRepository: HumanUserRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly administratorRepository: AdministratorRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
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
      | E<'UserNotFound'>
      | E<'HumanUserNotFound'>
      | E<'UserHasOtherRole'>
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

    const userRes = await this.userRepository.findById(input.userId)

    if (userRes.hasError) {
      return userRes
    }

    const humanUserRes = await this.humanUserRepository.findByUserId(
      input.userId,
    )

    if (humanUserRes.hasError) {
      return humanUserRes
    }

    if (!userRes.value) {
      return failureErrorable(
        'UserNotFound',
        `user not found. userId: ${input.userId}`,
      )
    }

    if (!humanUserRes.value) {
      return failureErrorable(
        'HumanUserNotFound',
        `human user not found. userId: ${input.userId}`,
      )
    }

    if (userRes.value.role !== 'administrator') {
      return failureErrorable(
        'UserHasOtherRole',
        `user is not administrator. userRole: ${userRes.value.role}`,
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

    const issueIdRes = await this.administratorRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const administrator: Administrator = {
      ...input,
      id: issueIdRes.value,
      role: 'administrator',
      createdAt: nowRes.value,
      createdUserId: authenticatedUser.id,
    }
    const createRes = await this.administratorRepository.create(administrator)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(administrator)
  }
}
