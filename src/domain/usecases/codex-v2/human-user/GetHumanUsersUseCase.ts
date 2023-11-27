import { HumanUser } from '../../../entities/codex-v2/HumanUser'
import { E, Errorable, successErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { transformHumanUserMaskedPassword } from './_shared/utility'

export interface HumanUserRepository {
  findByEmail(
    email: string | null,
  ): Promise<Errorable<HumanUser[], E<'UnknownRuntimeError'>>>
}

export default class GetHumanUsersUseCase {
  constructor(private readonly humanUserRepository: HumanUserRepository) {}

  run = async (
    authenticatedUser: User,
    email: string | null,
  ): Promise<
    Errorable<HumanUser[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    const res = await this.humanUserRepository.findByEmail(email)

    if (res.hasError) {
      return res
    }

    return successErrorable(res.value.map(transformHumanUserMaskedPassword))
  }
}
