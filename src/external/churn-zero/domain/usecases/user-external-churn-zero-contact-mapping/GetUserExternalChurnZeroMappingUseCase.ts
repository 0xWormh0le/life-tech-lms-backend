import { UserExternalChurnZeroMapping } from '../../entities/UserExternalChurnZeroMapping'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../../../domain/usecases/shared/Errors'
import { User } from '../../../../../domain/entities/codex-v2/User'
import { UserRoles } from '../../../../../domain/usecases/shared/Constants'

export interface UserExternalChurnZeroMappingRepository {
  findByUserId(
    userId: string,
  ): Promise<
    Errorable<UserExternalChurnZeroMapping | null, E<'UnknownRuntimeError'>>
  >
}

export default class GetUserExternalChurnZeroMappingUseCase {
  constructor(
    private readonly userExternalChurnZeroMappingRepository: UserExternalChurnZeroMappingRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    userId: string,
  ): Promise<
    Errorable<
      UserExternalChurnZeroMapping,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'UserExternalChurnZeroMappingNotFound'>
    >
  > => {
    if (
      authenticatedUser.role !== UserRoles.internalOperator &&
      authenticatedUser.id !== userId
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
      await this.userExternalChurnZeroMappingRepository.findByUserId(userId)

    if (userExternalChurnZeroMappingRes.hasError) {
      return userExternalChurnZeroMappingRes
    }

    if (!userExternalChurnZeroMappingRes.value) {
      return failureErrorable(
        'UserExternalChurnZeroMappingNotFound',
        `userExternalChurnZeroMappingNotFound. userId: ${userId}`,
      )
    }

    return successErrorable(userExternalChurnZeroMappingRes.value)
  }
}
