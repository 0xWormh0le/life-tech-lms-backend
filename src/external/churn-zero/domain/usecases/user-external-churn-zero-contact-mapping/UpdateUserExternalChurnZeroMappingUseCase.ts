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
  update(
    entity: UserExternalChurnZeroMapping,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
  findByUserId(
    userId: string,
  ): Promise<
    Errorable<UserExternalChurnZeroMapping | null, E<'UnknownRuntimeError'>>
  >
}

export default class UpdateUserExternalChurnZeroMappingUseCase {
  constructor(
    private readonly userExternalChurnZeroMappingRepository: UserExternalChurnZeroMappingRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: UserExternalChurnZeroMapping,
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

    const saved =
      await this.userExternalChurnZeroMappingRepository.findByUserId(
        input.userId,
      )

    if (saved.hasError) {
      return saved
    }

    if (!saved.value) {
      return failureErrorable(
        'UserExternalChurnZeroMappingNotFound',
        `UserExternalChurnZeroMappingNotFound not found. userid: ${input.userId}`,
      )
    }

    const userExternalChurnZeroMappingRes =
      await this.userExternalChurnZeroMappingRepository.update(input)

    if (userExternalChurnZeroMappingRes.hasError) {
      return userExternalChurnZeroMappingRes
    }

    return successErrorable(input)
  }
}
