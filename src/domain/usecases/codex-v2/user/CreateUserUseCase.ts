import { User } from '../../../entities/codex-v2/User'
import { E, Errorable, successErrorable } from '../../shared/Errors'
import { UserRoles } from '../../shared/Constants'

export interface UserRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(user: User): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly datetimeRepository: DatetimeRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      role: User['role']
      isDemo: boolean
    },
  ): Promise<
    Errorable<
      User,
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

    const issueIdRes = await this.userRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const user: User = {
      ...input,
      id: issueIdRes.value,
      createdAt: nowRes.value,
      updatedAt: nowRes.value,
    }
    const createRes = await this.userRepository.create(user)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(user)
  }
}
