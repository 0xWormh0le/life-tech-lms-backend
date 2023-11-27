import { User } from '../../../../../domain/entities/codex-v2/User'
import { RdbUserAccessTokenRepository } from '../../../../repositories/codex-v2/RdbUserAccessTokenRepository'
import { RdbUserRepository } from '../../../../repositories/codex-v2/RdbUserRepository'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../../../domain/usecases/shared/Errors'
import { DataSource } from 'typeorm'
import { OnMemoryRdbUserAccessTokenRepository } from '../../../../repositories/codex-v2/OnMemoryRdbUserAccessTokenRepository'
import { OnMemoryUserAccessTokenRepository } from '../../../../repositories/codex-v2/OnMemoryUserAccessTokenRepository'

export const findUserByToken = async (
  accessToken: string,
  appDataSource: DataSource,
): Promise<
  Errorable<User, E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
> => {
  const userAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(
    new RdbUserAccessTokenRepository(appDataSource),
    new OnMemoryUserAccessTokenRepository(),
  )
  const userRepository = new RdbUserRepository(appDataSource)

  const userAccessTokenRes = await userAccessTokenRepository.findByAccessToken(
    accessToken,
  )

  if (userAccessTokenRes.hasError) {
    return userAccessTokenRes
  } else if (!userAccessTokenRes.value) {
    return failureErrorable('PermissionDenied', 'unauthorized', new Error())
  }

  const userId = userAccessTokenRes.value?.userId
  const authenticatedUserRes = await userRepository.findById(userId)

  if (authenticatedUserRes.hasError) {
    return authenticatedUserRes
  } else if (!authenticatedUserRes.value) {
    return failureErrorable('PermissionDenied', 'unauthorized', new Error())
  }

  const authenticatedUser = authenticatedUserRes.value

  return successErrorable(authenticatedUser)
}
