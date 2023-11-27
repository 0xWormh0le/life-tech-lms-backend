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

export interface HumanUserRepository {
  findByUserId(
    userId: string,
  ): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>>
}

export default class GetHumanUserByUserIdUseCase {
  constructor(private readonly humanUserRepository: HumanUserRepository) {}

  run = async (
    authenticatedUser: User,
    userId: string,
  ): Promise<
    Errorable<
      HumanUser,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'HumanUserNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const res = await this.humanUserRepository.findByUserId(userId)

    if (res.hasError) {
      return res
    }

    if (!res.value) {
      return failureErrorable(
        'HumanUserNotFound',
        `HumanUser not found. userId ${userId}`,
      )
    }

    return successErrorable(transformHumanUserMaskedPassword(res.value))
  }
}
