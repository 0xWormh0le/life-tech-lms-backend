import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { UserRoles } from '../../shared/Constants'
import { User } from '../../../entities/codex-v2/User'
import { transformHumanUserMaskedPassword } from './_shared/utility'

export interface UserRepository {
  findById(
    id: string,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>>
}

export interface HumanUserRepository {
  hashPassword(
    plainPassword: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    humanUser: HumanUser,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  credentialExist(
    loginId: string | null,
    email: string | null,
  ): Promise<boolean>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateHumanUserUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly userRepository: UserRepository,
    private readonly humanUserRepository: HumanUserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      userId: string
      loginId: string | null
      email: string | null
      plainPassword: string | null
    },
  ): Promise<
    Errorable<
      HumanUser,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'UserNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
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
      hashedPassword = null
    }

    const humanUser: HumanUser = {
      userId: input.userId,
      loginId: input.loginId,
      email: input.email,
      hashedPassword: hashedPassword,
      createdAt: nowRes.value,
      updatedAt: nowRes.value,
    }
    const createRes = await this.humanUserRepository.create(humanUser)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(transformHumanUserMaskedPassword(humanUser))
  }
}
