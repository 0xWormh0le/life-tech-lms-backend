import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { User } from '../entities/User'

type WithId<TIdName extends string> = {
  [key in TIdName]: string
}
type WithTwoIds<TIdNameA extends string, TIdNameB extends string> = {
  [key in TIdNameA | TIdNameB]: string
}
type WithThreeIds<
  TIdNameA extends string,
  TIdNameB extends string,
  TIdNameC extends string,
> = {
  [key in TIdNameA | TIdNameB | TIdNameC]: string
}

export const takeDiffs = async <TDestination, TSource, TError>(
  existingDestinations: TDestination[],
  afterSources: TSource[],
  identify: (
    destination: TDestination,
    source: TSource,
  ) => Promise<Errorable<boolean, E<'UnknownRuntimeError'> | TError>>,
  mapSourceToDestinationWhenCreate: (
    source: TSource,
  ) => Promise<Errorable<TDestination, E<'UnknownRuntimeError'> | TError>>,
  mapSourceToDestinationWhenUpdate: (
    destination: TDestination,
    source: TSource,
  ) => Promise<Errorable<TDestination, E<'UnknownRuntimeError'> | TError>>,
): Promise<
  Errorable<
    {
      toCreate: TDestination[]
      toUpdate: TDestination[]
      toDelete: TDestination[]
    },
    E<'UnknownRuntimeError'> | TError
  >
> => {
  const toCreate: TDestination[] = []
  const toUpdate: TDestination[] = []
  const toDelete: TDestination[] = []

  for (const after of afterSources) {
    let existingInDestinations: TDestination | undefined

    for (const existing of existingDestinations) {
      const identifyResult = await identify(existing, after)

      if (identifyResult.hasError) {
        return identifyResult
      }

      if (identifyResult.value) {
        existingInDestinations = existing
        break
      }
    }

    if (!existingInDestinations) {
      const mapResult = await mapSourceToDestinationWhenCreate(after)

      if (mapResult.hasError) {
        return unknownRuntimeError(
          `mapSourceToDestinationWhenCreate failed: ${JSON.stringify(
            mapResult.error,
          )}`,
        )
      }
      toCreate.push(mapResult.value)
    } else {
      const mapResult = await mapSourceToDestinationWhenUpdate(
        existingInDestinations,
        after,
      )

      if (mapResult.hasError) {
        return unknownRuntimeError(
          `mapSourceToDestinationWhenCreate failed: ${JSON.stringify(
            mapResult.error,
          )}`,
        )
      }
      toUpdate.push(mapResult.value)
    }
  }

  for (const existing of existingDestinations) {
    let existsInSources: TSource | undefined

    for (const source of afterSources) {
      const identifyResult = await identify(existing, source)

      if (identifyResult.hasError) {
        return identifyResult
      }

      if (identifyResult.value) {
        existsInSources = source
        break
      }
    }

    if (!existsInSources) {
      toDelete.push(existing)
    }
  }

  return successErrorable({
    toCreate,
    toUpdate,
    toDelete,
  })
}

export const compareSourceLmsEntitiesAndCodexEntities = async <
  TCodexEntity extends WithId<'id'>,
  TSourceLmsEntity extends Omit<TCodexEntity, 'id'>,
>(
  codexEntities: TCodexEntity[],
  sourceLmsEntities: TSourceLmsEntity[],
  identify: (codex: TCodexEntity, sourceLms: TSourceLmsEntity) => boolean,
  mapSourceLmsToCodex: (
    id: string,
    sourceLms: TSourceLmsEntity,
  ) => TCodexEntity,
  issueId: () => Promise<Errorable<string, E<'UnknownRuntimeError'>>>,
): Promise<
  Errorable<
    {
      entitiesToCreate: TCodexEntity[]
      entitiesToUpdate: TCodexEntity[]
      entitiesToDelete: TCodexEntity[]
    },
    E<'UnknownRuntimeError'>
  >
> => {
  const takeDiffsResult = await takeDiffs(
    codexEntities,
    sourceLmsEntities,
    async (codex, sourceLms) => successErrorable(identify(codex, sourceLms)),
    async (sourceLms) => {
      const issuedId = await issueId()

      if (issuedId.hasError) {
        return issuedId
      }

      return successErrorable(mapSourceLmsToCodex(issuedId.value, sourceLms))
    },
    async (codex, sourceLms) => {
      return successErrorable(mapSourceLmsToCodex(codex.id, sourceLms))
    },
  )

  if (takeDiffsResult.hasError) {
    return takeDiffsResult
  }

  return {
    hasError: false,
    error: null,
    value: {
      entitiesToCreate: takeDiffsResult.value.toCreate,
      entitiesToUpdate: takeDiffsResult.value.toUpdate,
      entitiesToDelete: takeDiffsResult.value.toDelete,
    },
  }
}

export const compareSourceLmsEntitiesAndCodexEntitiesWithParents = async <
  TCodexEntity extends WithId<'id'>,
  TParentEntity extends WithId<'id'>,
  TSourceLmsEntity,
>(
  codexEntites: TCodexEntity[],
  sourceLmsEntities: TSourceLmsEntity[],
  identify: (codex: TCodexEntity, sourceLms: TSourceLmsEntity) => boolean,
  findCodexParent: (sourceLms: TSourceLmsEntity) => TParentEntity | null,
  mapSourceLmsToCodex: (
    id: string,
    parentCodexId: string,
    sourceLms: TSourceLmsEntity,
  ) => TCodexEntity,
  issueId: () => Promise<Errorable<string, E<'UnknownRuntimeError'>>>,
): Promise<
  Errorable<
    {
      entitiesToCreate: TCodexEntity[]
      entitiesToUpdate: TCodexEntity[]
      entitiesToDelete: TCodexEntity[]
    },
    E<'ParentCodexEntityNotExist'> | E<'UnknownRuntimeError'>
  >
> => {
  const takeDiffsResult = await takeDiffs<
    TCodexEntity,
    TSourceLmsEntity,
    E<'ParentCodexEntityNotExist'>
  >(
    codexEntites,
    sourceLmsEntities,
    async (codex, sourceLms) => successErrorable(identify(codex, sourceLms)),
    async (sourceLms) => {
      const codexParent = findCodexParent(sourceLms)

      if (!codexParent) {
        return {
          hasError: true,
          error: {
            type: 'ParentCodexEntityNotExist',
            message: `corresponding parent codex entity not exist for sourceLms: ${JSON.stringify(
              sourceLms,
            )}`,
          },
          value: null,
        }
      }

      const issuedId = await issueId()

      if (issuedId.hasError) {
        return issuedId
      }

      return successErrorable(
        mapSourceLmsToCodex(issuedId.value, codexParent.id, sourceLms),
      )
    },
    async (codex, sourceLms) => {
      const codexParent = findCodexParent(sourceLms)

      if (!codexParent) {
        return {
          hasError: true,
          error: {
            type: 'ParentCodexEntityNotExist',
            message: `corresponding parent codex entity not exist for sourceLms: ${JSON.stringify(
              sourceLms,
            )}`,
          },
          value: null,
        }
      }

      return successErrorable(
        mapSourceLmsToCodex(codex.id, codexParent.id, sourceLms),
      )
    },
  )

  if (takeDiffsResult.hasError) {
    return takeDiffsResult
  }

  return successErrorable({
    entitiesToCreate: takeDiffsResult.value.toCreate,
    entitiesToUpdate: takeDiffsResult.value.toUpdate,
    entitiesToDelete: takeDiffsResult.value.toDelete,
  })
}

export const compareSourceLmsEntitiesAndCodexEntitiesWithUsers = async <
  TCodexEntity extends WithThreeIds<'id', TLmsIdName, 'userId'> & {
    isDeactivated: boolean
  },
  TSourceLmsEntity extends Omit<TCodexEntity, 'id' | 'userId' | TLmsIdName> &
    WithTwoIds<TLmsIdName, 'email'>,
  TLmsIdName extends string,
>(
  userRole: User['role'],
  codexEntities: TCodexEntity[],
  codexUsers: User[],
  sourceLmsEntities: TSourceLmsEntity[],
  lmsIdName: TLmsIdName,
  issueId: () => Promise<Errorable<string, E<'UnknownRuntimeError'>>>,
  issueIdForUser: () => Promise<Errorable<string, E<'UnknownRuntimeError'>>>,
): Promise<
  Errorable<
    {
      entitiesToCreate: (Omit<TCodexEntity, 'id' | TLmsIdName | 'userId'> &
        WithThreeIds<'id', TLmsIdName, 'userId'> & { isDeactivated: false })[]
      usersToCreate: User[]
      entitiesToUpdate: (Omit<TCodexEntity, 'id' | TLmsIdName | 'userId'> &
        WithThreeIds<'id', TLmsIdName, 'userId'> & { isDeactivated: false })[]
      usersToUpdate: User[]
      entitiesToDelete: TCodexEntity[]
      usersToDelete: User[]
    },
    E<'AssociatedUserNotExist'> | E<'UnknownRuntimeError'>
  >
> => {
  const entitiesToCreate: (Omit<TCodexEntity, 'id' | TLmsIdName | 'userId'> &
    WithThreeIds<'id', TLmsIdName, 'userId'> & { isDeactivated: false })[] = []
  const usersToCreate: User[] = []
  const entitiesToUpdate: (Omit<TCodexEntity, 'id' | TLmsIdName | 'userId'> &
    WithThreeIds<'id', TLmsIdName, 'userId'> & { isDeactivated: false })[] = []
  const usersToUpdate: User[] = []
  const entitiesToDelete: TCodexEntity[] = []
  const usersToDelete: User[] = []

  for (const sourceLms of sourceLmsEntities) {
    const existingCodex = codexEntities.find((codex) => {
      const sourceLmsId: string = sourceLms[lmsIdName]
      const codexLmsId: string = codex[lmsIdName]

      return sourceLmsId === codexLmsId
    })

    if (!existingCodex) {
      const issueIdResult = await issueId()

      if (issueIdResult.hasError) {
        return issueIdResult
      }

      const issuedUserIdResult = await issueIdForUser()

      if (issuedUserIdResult.hasError) {
        return issuedUserIdResult
      }

      const entityToCreate: (typeof entitiesToCreate)[0] & { email?: string } =
        {
          ...sourceLms,
          id: issueIdResult.value,
          userId: issuedUserIdResult.value,
          isDeactivated: false,
        }

      delete entityToCreate.email
      entitiesToCreate.push(entityToCreate)
      usersToCreate.push({
        id: issuedUserIdResult.value,
        role: userRole,
        email: sourceLms.email,
        isDeactivated: false,
      })
    } else {
      const existingUser = codexUsers.find((user) => {
        return existingCodex.userId === user.id
      })

      if (!existingUser) {
        return failureErrorable(
          'AssociatedUserNotExist',
          `user not exist for ${lmsIdName}: ${sourceLms[lmsIdName]}, id: ${existingCodex.id}`,
        )
      }

      const entityToUpdate: (typeof entitiesToUpdate)[0] & { email?: string } =
        {
          ...sourceLms,
          id: existingCodex.id,
          userId: existingUser.id,
          isDeactivated: false,
        }

      delete entityToUpdate.email
      entitiesToUpdate.push(entityToUpdate)
      usersToUpdate.push({
        ...existingUser,
        email: sourceLms.email,
        role: userRole,
        isDeactivated: false,
      })
    }
  }
  for (const codex of codexEntities) {
    if (
      !sourceLmsEntities.find((sourceLms) => {
        const sourceLmsId: string = sourceLms[lmsIdName]
        const codexLmsId: string = codex[lmsIdName]

        return sourceLmsId === codexLmsId
      })
    ) {
      const existingUser = codexUsers.find((user) => {
        return codex.userId === user.id
      })

      entitiesToDelete.push(codex)

      if (existingUser) {
        usersToDelete.push(existingUser)
      }
    }
  }

  return successErrorable({
    entitiesToCreate,
    usersToCreate,
    entitiesToUpdate,
    usersToUpdate,
    entitiesToDelete,
    usersToDelete,
  })
}

export const compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities =
  async <
    TSourceAffiliationLmsEntity,
    TParentIdName extends string,
    THumanIdName extends string,
  >(
    parentIdName: TParentIdName,
    humanIdName: THumanIdName,
    codexAffiliationEntites: WithTwoIds<TParentIdName, THumanIdName>[],
    sourceLmsAffiliationEntities: TSourceAffiliationLmsEntity[],
    findCodexParent: (
      sourceLms: TSourceAffiliationLmsEntity,
    ) => WithId<'id'> | null,
    findCodexHuman: (
      sourceLms: TSourceAffiliationLmsEntity,
    ) => WithId<'id'> | null,
    mapSourceLmsToCodex: (
      parentId: string,
      humanId: string,
      sourceLms: TSourceAffiliationLmsEntity,
    ) => WithTwoIds<TParentIdName, THumanIdName>,
  ): Promise<
    Errorable<
      {
        entitiesToCreate: WithTwoIds<TParentIdName, THumanIdName>[]
        entitiesToDelete: WithTwoIds<TParentIdName, THumanIdName>[]
      },
      | E<'ParentCodexEntityNotExist'>
      | E<'HumanCodexEntityNotExist'>
      | E<'UnknownRuntimeError'>
    >
  > => {
    const retrieveCodexIds = (
      sourceLms: TSourceAffiliationLmsEntity,
    ): Errorable<
      { codexParent: WithId<'id'>; codexHuman: WithId<'id'> },
      E<'ParentCodexEntityNotExist'> | E<'HumanCodexEntityNotExist'>
    > => {
      const codexParent = findCodexParent(sourceLms)

      if (!codexParent) {
        return {
          hasError: true,
          error: {
            type: 'ParentCodexEntityNotExist',
            message: `corresponding parent codex entity not exist for sourceLms: ${JSON.stringify(
              sourceLms,
            )}`,
          },
          value: null,
        }
      }

      const codexHuman = findCodexHuman(sourceLms)

      if (!codexHuman) {
        return {
          hasError: true,
          error: {
            type: 'HumanCodexEntityNotExist',
            message: `corresponding human codex entity not exist for sourceLms: ${JSON.stringify(
              sourceLms,
            )}`,
          },
          value: null,
        }
      }

      return successErrorable({
        codexParent,
        codexHuman,
      })
    }

    const takeDiffsResult = await takeDiffs<
      WithTwoIds<TParentIdName, THumanIdName>,
      TSourceAffiliationLmsEntity,
      E<'ParentCodexEntityNotExist'> | E<'HumanCodexEntityNotExist'>
    >(
      codexAffiliationEntites,
      sourceLmsAffiliationEntities,
      async (codex, sourceLms) => {
        const retrieveCodexIdsResult = retrieveCodexIds(sourceLms)

        if (retrieveCodexIdsResult.hasError) {
          return retrieveCodexIdsResult
        }

        return successErrorable(
          codex[parentIdName] === retrieveCodexIdsResult.value.codexParent.id &&
            codex[humanIdName] === retrieveCodexIdsResult.value.codexHuman.id,
        )
      },
      async (sourceLms) => {
        const retrieveCodexIdsResult = retrieveCodexIds(sourceLms)

        if (retrieveCodexIdsResult.hasError) {
          return retrieveCodexIdsResult
        }

        // Due to typescript's wrong specification, it doens't validate the type of the object below
        // eslint-disable-next-line no-type-assertion/no-type-assertion
        return successErrorable({
          [parentIdName]: retrieveCodexIdsResult.value.codexParent.id,
          [humanIdName]: retrieveCodexIdsResult.value.codexHuman.id,
        } as WithTwoIds<TParentIdName, THumanIdName>)
      },
      async (codex, sourceLms) =>
        successErrorable(mapSourceLmsToCodex('', '', sourceLms)),
    )

    if (takeDiffsResult.hasError) {
      return takeDiffsResult
    }

    return successErrorable({
      entitiesToCreate: takeDiffsResult.value.toCreate,
      entitiesToDelete: takeDiffsResult.value.toDelete,
    })
  }
