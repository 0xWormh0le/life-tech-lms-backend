import { User } from '../../../../../../domain/entities/codex-v2/User'
import {
  E,
  Errorable,
  failureErrorable,
} from '../../../../../../domain/usecases/shared/Errors'
import { DataSource } from 'typeorm'
import { findUserByToken } from '../../_shared/findUserByToken'

export const findUserByAuthorizationHeader = async (
  authorizationHeader: string | undefined,
  appDataSource: DataSource,
): Promise<
  Errorable<User, E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
> => {
  const accessTokenHeader = authorizationHeader

  if (!accessTokenHeader) {
    return failureErrorable('PermissionDenied', 'unauthorized', new Error())
  }

  const accessToken = accessTokenHeader.substring('Bearer '.length)

  return await findUserByToken(accessToken, appDataSource)
}
