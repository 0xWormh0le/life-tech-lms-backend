import { User } from '../../../entities/codex-v2/User'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { UserRoles } from '../../shared/Constants'

export interface UserRepository {
  findById(
    id: string,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>>
  update(user: User): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class UpdateUserUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly userRepository: UserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
      role: User['role']
      isDemo: boolean
    },
  ): Promise<
    Errorable<
      User,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'UserNotFound'>
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

    const savedUserRes = await this.userRepository.findById(input.id)

    if (savedUserRes.hasError) {
      return savedUserRes
    }

    if (!savedUserRes.value) {
      return failureErrorable(
        'UserNotFound',
        `user not found. userId: ${input.id}`,
      )
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const user: User = {
      ...input,
      id: savedUserRes.value.id,
      createdAt: savedUserRes.value.createdAt,
      updatedAt: nowRes.value,
    }
    const res = await this.userRepository.update(user)

    if (res.hasError) {
      return res
    }

    return successErrorable(user)
  }
}
