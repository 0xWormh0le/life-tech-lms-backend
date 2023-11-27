import { UserExternalChurnZeroMapping } from '../../entities/UserExternalChurnZeroMapping'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../../../domain/usecases/shared/Errors'
import { User } from '../../../../../domain/entities/codex-v2/User'
import { UserRoles } from '../../../../../domain/usecases/shared/Constants'

export interface UserExternalChurnZeroMappingRepository {
  create(
    entity: UserExternalChurnZeroMapping,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class CreateUserExternalChurnZeroMappingUseCase {
  constructor(
    private readonly userExternalChurnZeroMappingRepository: UserExternalChurnZeroMappingRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: UserExternalChurnZeroMapping,
  ): Promise<
    Errorable<
      UserExternalChurnZeroMapping,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (
      authenticatedUser.role !== UserRoles.internalOperator &&
      authenticatedUser.id !== input.userId
    ) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const userExternalChurnZeroMappingRes =
      await this.userExternalChurnZeroMappingRepository.create(input)

    if (userExternalChurnZeroMappingRes.hasError) {
      return userExternalChurnZeroMappingRes
    }

    return successErrorable(input)
  }
}
