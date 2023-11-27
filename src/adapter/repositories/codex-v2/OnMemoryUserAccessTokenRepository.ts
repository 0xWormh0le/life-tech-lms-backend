import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'

export type UserAccessToken = {
  id: string
  userId: string
  accessToken: string
  createdAt: Date
}

const userAccessTokenMap: Map<string, UserAccessToken> = new Map()

export class OnMemoryUserAccessTokenRepository {
  create = async (
    userAccessToken: UserAccessToken,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    userAccessTokenMap.set(userAccessToken.accessToken, userAccessToken)

    return successErrorable(undefined)
  }

  findByAccessToken = async (
    accessToken: string,
  ): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
    return successErrorable(userAccessTokenMap.get(accessToken) ?? null)
  }

  update = async (
    userAccessToken: UserAccessToken,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    userAccessTokenMap.set(userAccessToken.accessToken, userAccessToken)

    return successErrorable(undefined)
  }
}
