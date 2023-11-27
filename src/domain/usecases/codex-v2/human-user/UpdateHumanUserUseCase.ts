import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { transformHumanUserMaskedPassword } from './_shared/utility'

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export interface UserRepository {
  findById(
    id: string,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>>
}

export interface HumanUserRepository {
  hashPassword(
    plainPassword: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  findByUserId(
    userId: string,
  ): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>>
  update(
    humanUser: HumanUser,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  credentialExist(
    loginId: string | null,
    email: string | null,
  ): Promise<boolean>
}

export default class UpdateHumanUserUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly userRepository: UserRepository,
    private readonly humanUserRepository: HumanUserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: Omit<HumanUser, 'createdAt' | 'updatedAt' | 'hashedPassword'> & {
      plainPassword: string | null
    },
  ): Promise<
    Errorable<
      HumanUser,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'HumanUserNotFound'>
      | E<'UserNotFound'>
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

    const savedHumanUserRes = await this.humanUserRepository.findByUserId(
      input.userId,
    )

    if (savedHumanUserRes.hasError) {
      return savedHumanUserRes
    }

    if (!savedHumanUserRes.value) {
      return failureErrorable(
        'HumanUserNotFound',
        `humanUser not found. userId: ${input.userId}`,
      )
    }

    if (
      savedHumanUserRes.value.loginId !== input.loginId ||
      savedHumanUserRes.value.email !== input.email
    ) {
      const duplicated = await this.humanUserRepository.credentialExist(
        input.loginId,
        input.email,
      )

      if (duplicated) {
        return failureErrorable(
          'UnknownRuntimeError',
          `user duplicated. userId: ${input.userId}`,
        )
      }
    }

    const userRes = await this.userRepository.findById(input.userId)

    if (userRes.hasError) {
      return userRes
    }

    if (!userRes.value) {
      return failureErrorable(
        'UserNotFound',
        `user not found. userId: ${input.userId}`,
      )
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    let hashedPassword: string | null

    if (input.plainPassword) {
      const hashedPasswordRes = await this.humanUserRepository.hashPassword(
        input.plainPassword,
      )

      if (hashedPasswordRes.hasError) {
        return hashedPasswordRes
      }
      hashedPassword = hashedPasswordRes.value
    } else {
      hashedPassword = savedHumanUserRes.value.hashedPassword
    }

    const humanUser: HumanUser = {
      userId: input.userId,
      loginId: input.loginId,
      email: input.email,
      hashedPassword: hashedPassword,
      createdAt: savedHumanUserRes.value.createdAt,
      updatedAt: nowRes.value,
    }

    const res = await this.humanUserRepository.update(humanUser)

    if (res.hasError) {
      return res
    }

    return successErrorable(transformHumanUserMaskedPassword(humanUser))
  }
}
