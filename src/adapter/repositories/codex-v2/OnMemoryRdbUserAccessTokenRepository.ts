import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'

export type UserAccessToken = {
  id: string
  userId: string
  accessToken: string
  createdAt: Date
}

export class OnMemoryRdbUserAccessTokenRepository {
  constructor(
    private readonly rdbUserAccessTokenRepository: {
      issueId: () => Promise<Errorable<string, E<'UnknownRuntimeError'>>>
      create: (
        userAccessToken: UserAccessToken,
      ) => Promise<Errorable<void, E<'UnknownRuntimeError'>>>
      findAll: () => Promise<
        Errorable<UserAccessToken[], E<'UnknownRuntimeError'>>
      >
      findById: (
        id: string,
      ) => Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>>
      findByAccessToken: (
        accessToken: string,
      ) => Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>>
      update: (
        userAccessToken: UserAccessToken,
      ) => Promise<Errorable<void, E<'UnknownRuntimeError'>>>
    },

    private readonly onMemoryUserAccessTokenRepository: {
      create: (
        userAccessToken: UserAccessToken,
      ) => Promise<Errorable<void, E<'UnknownRuntimeError'>>>
      findByAccessToken: (
        accessToken: string,
      ) => Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>>
      update: (
        userAccessToken: UserAccessToken,
      ) => Promise<Errorable<void, E<'UnknownRuntimeError'>>>
    },
  ) {
    this.rdbUserAccessTokenRepository = rdbUserAccessTokenRepository
    this.onMemoryUserAccessTokenRepository = onMemoryUserAccessTokenRepository
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    this.rdbUserAccessTokenRepository.issueId()

  create = async (
    userAccessToken: UserAccessToken,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const resRdb = await this.rdbUserAccessTokenRepository.create(
        userAccessToken,
      )

      if (resRdb.hasError) {
        return resRdb
      }
      await this.onMemoryUserAccessTokenRepository.create(userAccessToken)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(userAccessToken)}`,
        e,
      )
    }
  }

  findAll = this.rdbUserAccessTokenRepository.findAll

  findById = this.rdbUserAccessTokenRepository.findById

  findByAccessToken = async (
    accessToken: string,
  ): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
    try {
      const onMemoryRes =
        await this.onMemoryUserAccessTokenRepository.findByAccessToken(
          accessToken,
        )

      if (onMemoryRes.hasError) {
        return onMemoryRes
      }

      if (onMemoryRes.value) {
        return onMemoryRes
      }

      const rdbRes = await this.rdbUserAccessTokenRepository.findByAccessToken(
        accessToken,
      )

      if (rdbRes.hasError) {
        return rdbRes
      }

      if (rdbRes.value) {
        await this.onMemoryUserAccessTokenRepository.create(rdbRes.value)
      }

      return rdbRes
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get userAccessToken. accessToken: ${accessToken}`,
        e,
      )
    }
  }

  update = async (
    userAccessToken: UserAccessToken,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const resRdb = await this.rdbUserAccessTokenRepository.update(
        userAccessToken,
      )

      if (resRdb.hasError) {
        return resRdb
      }
      await this.onMemoryUserAccessTokenRepository.update(userAccessToken)

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update userAccessToken. $${JSON.stringify(userAccessToken)}`,
        e,
      )
    }
  }
}
