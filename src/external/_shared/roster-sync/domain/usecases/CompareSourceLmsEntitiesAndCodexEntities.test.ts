import dayjs from 'dayjs'
import { E, Errorable, successErrorable } from '../../../../../domain/usecases/shared/Errors'
import {
  compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities,
  compareSourceLmsEntitiesAndCodexEntities,
  compareSourceLmsEntitiesAndCodexEntitiesWithParents,
  compareSourceLmsEntitiesAndCodexEntitiesWithUsers,
  takeDiffs,
} from './CompareSourceLmsEntitiesAndCodexEntities'

describe('takeDiffs', () => {
  test('success', async () => {
    const result = await takeDiffs(
      [
        {
          id: 'id-3',
          email: 'email-3',
          attributeA: 'attributeA-3',
        },
        {
          id: 'id-4',
          email: 'email-4',
          attributeA: 'attributeA-4',
        },
        {
          id: 'id-5',
          email: 'email-5',
          attributeA: 'attributeA-5',
        },
        {
          id: 'id-6',
          email: 'email-6',
          attributeA: 'attributeA-6',
        },
      ],
      [
        {
          email: 'email-1',
          attributeB: 'attributeB-1',
        },
        {
          email: 'email-2',
          attributeB: 'attributeB-2',
        },
        {
          email: 'email-3',
          attributeB: 'attributeB-3',
        },
        {
          email: 'email-4',
          attributeB: 'attributeB-4',
        },
      ],
      async (dest, src) => successErrorable(dest.email === src.email),
      async (src) =>
        successErrorable({
          id: `issued-id-${src.email}`,
          email: src.email,
          attributeA: src.attributeB,
        }),
      async (dest, src) =>
        successErrorable({
          id: dest.id,
          email: src.email,
          attributeA: src.attributeB,
        }),
    )

    if (result.hasError) {
      throw result
    }

    expect(result.value).toEqual<typeof result.value>({
      toCreate: [
        {
          id: 'issued-id-email-1',
          email: 'email-1',
          attributeA: 'attributeB-1',
        },
        {
          id: 'issued-id-email-2',
          email: 'email-2',
          attributeA: 'attributeB-2',
        },
      ],
      toUpdate: [
        {
          id: 'id-3',
          email: 'email-3',
          attributeA: 'attributeB-3',
        },
        {
          id: 'id-4',
          email: 'email-4',
          attributeA: 'attributeB-4',
        },
      ],
      toDelete: [
        {
          id: 'id-5',
          email: 'email-5',
          attributeA: 'attributeA-5',
        },
        {
          id: 'id-6',
          email: 'email-6',
          attributeA: 'attributeA-6',
        },
      ],
    })
  })
})

class IdIssuer {
  constructor(private counter: number, private prefix: string) {}

  issueId = (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
    const ret = `${this.prefix}${this.counter}`

    this.counter += 1

    return new Promise((resolve) => resolve({ hasError: false, error: null, value: ret }))
  }
}

describe('compareSourceLmsEntitiesAndCodexEntities', () => {
  test('success', async () => {
    const idIssuer = new IdIssuer(1, 'issued-id-')
    const result = await compareSourceLmsEntitiesAndCodexEntities<
      { id: string; lmsIdName: string; attributeA: string; attributeB: number },
      { lmsIdName: string; attributeA: string; attributeB: number }
    >(
      [
        {
          id: 'id-3',
          lmsIdName: 'lmsId-3',
          attributeA: 'attributeA-3',
          attributeB: 3,
        },
        {
          id: 'id-4',
          lmsIdName: 'lmsId-4',
          attributeA: 'attributeA-4',
          attributeB: 4,
        },
        {
          id: 'id-5',
          lmsIdName: 'lmsId-5',
          attributeA: 'attributeA-5',
          attributeB: 5,
        },
        {
          id: 'id-6',
          lmsIdName: 'lmsId-6',
          attributeA: 'attributeA-6',
          attributeB: 6,
        },
      ],
      [
        {
          lmsIdName: 'lmsId-1',
          attributeA: 'attributeA-1',
          attributeB: 1,
        },
        {
          lmsIdName: 'lmsId-2',
          attributeA: 'attributeA-2',
          attributeB: 2,
        },
        {
          lmsIdName: 'lmsId-3',
          attributeA: 'attributeA-10',
          attributeB: 11,
        },
        {
          lmsIdName: 'lmsId-4',
          attributeA: 'attributeA-12',
          attributeB: 13,
        },
      ],
      (codex, sourceLms) => codex.lmsIdName === sourceLms.lmsIdName,
      (id, sourceLms) => ({
        ...sourceLms,
        id,
      }),
      idIssuer.issueId,
    )

    if (result.hasError) {
      throw result.error
    }
    expect(result.value).toEqual<typeof result.value>({
      entitiesToCreate: [
        { id: 'issued-id-1', lmsIdName: 'lmsId-1', attributeA: 'attributeA-1', attributeB: 1 },
        { id: 'issued-id-2', lmsIdName: 'lmsId-2', attributeA: 'attributeA-2', attributeB: 2 },
      ],
      entitiesToUpdate: [
        { id: 'id-3', lmsIdName: 'lmsId-3', attributeA: 'attributeA-10', attributeB: 11 },
        { id: 'id-4', lmsIdName: 'lmsId-4', attributeA: 'attributeA-12', attributeB: 13 },
      ],
      entitiesToDelete: [
        { id: 'id-5', lmsIdName: 'lmsId-5', attributeA: 'attributeA-5', attributeB: 5 },
        { id: 'id-6', lmsIdName: 'lmsId-6', attributeA: 'attributeA-6', attributeB: 6 },
      ],
    })
  })
})

describe('compareSourceLmsEntitiesAndCodexEntitiesWithUsers', () => {
  test('success', async () => {
    const idIssuer = new IdIssuer(1, 'issued-id-')
    const userIdIssuer = new IdIssuer(1, 'issued-userId-')
    const result = await compareSourceLmsEntitiesAndCodexEntitiesWithUsers<
      { id: string; lmsIdName: string; userId: string; attributeA: string; attributeB: number; isDeactivated: false },
      { lmsIdName: string; email: string; attributeA: string; attributeB: number; isDeactivated: false },
      'lmsIdName'
    >(
      'teacher',
      [
        {
          id: 'id-3',
          userId: 'userId-3',
          lmsIdName: 'lmsId-3',
          attributeA: 'attributeA-3',
          attributeB: 3,
          isDeactivated: false,
        },
        {
          id: 'id-4',
          userId: 'userId-4',
          lmsIdName: 'lmsId-4',
          attributeA: 'attributeA-4',
          attributeB: 4,
          isDeactivated: false,
        },
        {
          id: 'id-5',
          userId: 'userId-5',
          lmsIdName: 'lmsId-5',
          attributeA: 'attributeA-5',
          attributeB: 5,
          isDeactivated: false,
        },
        {
          id: 'id-6',
          userId: 'userId-6',
          lmsIdName: 'lmsId-6',
          attributeA: 'attributeA-6',
          attributeB: 6,
          isDeactivated: false,
        },
      ],
      [
        {
          id: 'userId-3',
          email: 'email-3',
          role: 'teacher',
          isDeactivated: false,
        },
        {
          id: 'userId-4',
          email: 'email-4',
          role: 'student', // role will be changed
          isDeactivated: false,
        },
        {
          id: 'userId-5',
          email: 'email-5',
          role: 'teacher',
          isDeactivated: false,
        },
        {
          id: 'userId-6',
          email: 'email-6',
          role: 'teacher',
          isDeactivated: false,
        },
      ],
      [
        {
          lmsIdName: 'lmsId-1',
          attributeA: 'attributeA-1',
          attributeB: 1,
          email: 'email-1',
          isDeactivated: false,
        },
        {
          lmsIdName: 'lmsId-2',
          attributeA: 'attributeA-2',
          attributeB: 2,
          email: 'email-2',
          isDeactivated: false,
        },
        {
          lmsIdName: 'lmsId-3',
          attributeA: 'attributeA-3',
          attributeB: 3,
          email: 'email-100', // email will be changed
          isDeactivated: false,
        },
        {
          lmsIdName: 'lmsId-4',
          attributeA: 'attributeA-4',
          attributeB: 400, // attributeB will be changed
          email: 'email-4',
          isDeactivated: false,
        },
      ],
      'lmsIdName',
      idIssuer.issueId,
      userIdIssuer.issueId,
    )

    if (result.hasError) {
      throw result.error
    }
    expect(result.value).toEqual<typeof result.value>({
      entitiesToCreate: [
        { id: 'issued-id-1', lmsIdName: 'lmsId-1', userId: 'issued-userId-1', attributeA: 'attributeA-1', attributeB: 1, isDeactivated: false },
        { id: 'issued-id-2', lmsIdName: 'lmsId-2', userId: 'issued-userId-2', attributeA: 'attributeA-2', attributeB: 2, isDeactivated: false },
      ],
      usersToCreate: [
        { id: 'issued-userId-1', role: 'teacher', email: 'email-1', isDeactivated: false },
        { id: 'issued-userId-2', role: 'teacher', email: 'email-2', isDeactivated: false },
      ],
      entitiesToUpdate: [
        { id: 'id-3', lmsIdName: 'lmsId-3', userId: 'userId-3', attributeA: 'attributeA-3', attributeB: 3, isDeactivated: false },
        { id: 'id-4', lmsIdName: 'lmsId-4', userId: 'userId-4', attributeA: 'attributeA-4', attributeB: 400, isDeactivated: false },
      ],
      usersToUpdate: [
        { id: 'userId-3', role: 'teacher', email: 'email-100', isDeactivated: false }, // email is changed
        { id: 'userId-4', role: 'teacher', email: 'email-4', isDeactivated: false },
      ],
      entitiesToDelete: [
        { id: 'id-5', lmsIdName: 'lmsId-5', userId: 'userId-5', attributeA: 'attributeA-5', attributeB: 5, isDeactivated: false },
        { id: 'id-6', lmsIdName: 'lmsId-6', userId: 'userId-6', attributeA: 'attributeA-6', attributeB: 6, isDeactivated: false },
      ],
      usersToDelete: [
        { id: 'userId-5', role: 'teacher', email: 'email-5', isDeactivated: false },
        { id: 'userId-6', role: 'teacher', email: 'email-6', isDeactivated: false },
      ],
    })
  })
})

describe('compareSourceLmsEntitiesAndCodexEntitiesWithParents', () => {
  test('success', async () => {
    const idIssuer = new IdIssuer(1, 'issued-id-')
    const parentEntities = [
      {
        id: 'parentId-1',
        parentLmsIdName: 'parentLmsId-1',
      },
      {
        id: 'parentId-2',
        parentLmsIdName: 'parentLmsId-2',
      },
      {
        id: 'parentId-3',
        parentLmsIdName: 'parentLmsId-3',
      },
    ]
    const result = await compareSourceLmsEntitiesAndCodexEntitiesWithParents<
      { id: string; lmsIdName: string; parentIdName: string; attributeA: string; attributeB: number },
      { id: string; parentLmsIdName: string },
      { lmsIdName: string; parentLmsIdName: string; attributeA: string; attributeB: number }
    >(
      [
        {
          id: 'id-3',
          lmsIdName: 'lmsId-3',
          parentIdName: 'parentId-2',
          attributeA: 'attributeA-3',
          attributeB: 3,
        },
        {
          id: 'id-4',
          lmsIdName: 'lmsId-4',
          parentIdName: 'parentId-2',
          attributeA: 'attributeA-4',
          attributeB: 4,
        },
        {
          id: 'id-5',
          lmsIdName: 'lmsId-5',
          parentIdName: 'parentId-3',
          attributeA: 'attributeA-5',
          attributeB: 5,
        },
        {
          id: 'id-6',
          lmsIdName: 'lmsId-6',
          parentIdName: 'parentId-3',
          attributeA: 'attributeA-6',
          attributeB: 6,
        },
      ],
      [
        {
          lmsIdName: 'lmsId-1',
          parentLmsIdName: 'parentLmsId-1',
          attributeA: 'attributeA-1',
          attributeB: 1,
        },
        {
          lmsIdName: 'lmsId-2',
          parentLmsIdName: 'parentLmsId-2',
          attributeA: 'attributeA-2',
          attributeB: 2,
        },
        {
          lmsIdName: 'lmsId-3',
          parentLmsIdName: 'parentLmsId-2',
          attributeA: 'attributeA-300', // changed attributeB
          attributeB: 3,
        },
        {
          lmsIdName: 'lmsId-4',
          parentLmsIdName: 'parentLmsId-3', // changed parent id
          attributeA: 'attributeA-4',
          attributeB: 400, // changed attributeB
        },
      ],
      (codex, sourceLms) => codex.lmsIdName === sourceLms.lmsIdName,
      (sourceLms) => parentEntities.find((e) => e.parentLmsIdName === sourceLms.parentLmsIdName) ?? null,
      (id, parentCodexId, sourceLms) => ({
        id,
        parentIdName: parentCodexId,
        lmsIdName: sourceLms.lmsIdName,
        attributeA: sourceLms.attributeA,
        attributeB: sourceLms.attributeB,
      }),
      idIssuer.issueId,
    )

    if (result.hasError) {
      throw result.error
    }
    expect(result.value).toEqual<typeof result.value>({
      entitiesToCreate: [
        { id: 'issued-id-1', lmsIdName: 'lmsId-1', parentIdName: 'parentId-1', attributeA: 'attributeA-1', attributeB: 1 },
        { id: 'issued-id-2', lmsIdName: 'lmsId-2', parentIdName: 'parentId-2', attributeA: 'attributeA-2', attributeB: 2 },
      ],
      entitiesToUpdate: [
        { id: 'id-3', lmsIdName: 'lmsId-3', parentIdName: 'parentId-2', attributeA: 'attributeA-300', attributeB: 3 },
        { id: 'id-4', lmsIdName: 'lmsId-4', parentIdName: 'parentId-3', attributeA: 'attributeA-4', attributeB: 400 },
      ],
      entitiesToDelete: [
        { id: 'id-5', lmsIdName: 'lmsId-5', parentIdName: 'parentId-3', attributeA: 'attributeA-5', attributeB: 5 },
        { id: 'id-6', lmsIdName: 'lmsId-6', parentIdName: 'parentId-3', attributeA: 'attributeA-6', attributeB: 6 },
      ],
    })
  })
})

describe('compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities', () => {
  test('performance', async () => {
    const arrayLenght = 3500

    // Old naive algorithm: took 497s (on Macbook air (M2, 2022))
    // const parentEntities = [...Array(arrayLenght).keys()].map((i) => ({
    //   id: `idA-${i}`,
    //   lmsIdNameA: `lmsIdA-${i}`,
    // }))

    // const humanEntities = [...Array(arrayLenght).keys()].map((i) => ({
    //   id: `idB-${i}`,
    //   lmsIdNameB: `lmsIdB-${i}`,
    // }))

    // New optimized algorithm: took 5s
    const parentEntities = [...Array(arrayLenght).keys()].reduce<Record<string, { id: string; lmsIdNameA: string }>>((prev, i) => {
      const lmsIdNameA = `lmsIdA-${i}`

      return {
        ...prev,
        [lmsIdNameA]: {
          id: `idA-${i}`,
          lmsIdNameA,
        },
      }
    }, {})

    const humanEntities = [...Array(arrayLenght).keys()].reduce<Record<string, { id: string; lmsIdNameB: string }>>((prev, i) => {
      const lmsIdNameB = `lmsIdB-${i}`

      return {
        ...prev,
        [lmsIdNameB]: {
          id: `idB-${i}`,
          lmsIdNameB,
        },
      }
    }, {})

    const startedAt = dayjs()

    await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities<{ lmsIdNameA: string; lmsIdNameB: string }, 'idNameA', 'idNameB'>(
      'idNameA',
      'idNameB',
      [...Array(arrayLenght).keys()].map(() => ({
        idNameA: `idA-${Math.floor(Math.random() * arrayLenght)}`,
        idNameB: `idB-${Math.floor(Math.random() * arrayLenght)}`,
      })),
      [...Array(arrayLenght).keys()].map(() => ({
        lmsIdNameA: `lmsIdA-${Math.floor(Math.random() * arrayLenght)}`,
        lmsIdNameB: `lmsIdB-${Math.floor(Math.random() * arrayLenght)}`,
      })),

      // Old naive algorithm
      // (sourceLms) => parentEntities.find((e) => e.lmsIdNameA === sourceLms.lmsIdNameA) ?? null,
      // (sourceLms) => humanEntities.find((e) => e.lmsIdNameB === sourceLms.lmsIdNameB) ?? null,

      // New optimized algorithm
      (sourceLms) => parentEntities[sourceLms.lmsIdNameA] ?? null,
      (sourceLms) => humanEntities[sourceLms.lmsIdNameB] ?? null,

      (parentId, humanId, sourceLms) => ({
        ...sourceLms,
        idNameA: parentId,
        idNameB: humanId,
      }),
    )

    const finishedAt = dayjs()

    const elapsedSeconds = finishedAt.diff(startedAt, 'seconds', true)

    console.log({ 'compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities took': elapsedSeconds })
    expect(elapsedSeconds).toBeLessThan(30)
  })

  test('success', async () => {
    const parentEntities: Record<string, { id: string; lmsIdNameA: string }> = {
      'lmsIdA-1': {
        id: 'idA-1',
        lmsIdNameA: 'lmsIdA-1',
      },
      'lmsIdA-2': {
        id: 'idA-2',
        lmsIdNameA: 'lmsIdA-2',
      },
      'lmsIdA-3': {
        id: 'idA-3',
        lmsIdNameA: 'lmsIdA-3',
      },
    }
    const humanEntities: Record<string, { id: string; lmsIdNameB: string }> = {
      'lmsIdB-1': {
        id: 'idB-1',
        lmsIdNameB: 'lmsIdB-1',
      },
      'lmsIdB-2': {
        id: 'idB-2',
        lmsIdNameB: 'lmsIdB-2',
      },
      'lmsIdB-3': {
        id: 'idB-3',
        lmsIdNameB: 'lmsIdB-3',
      },
    }
    const result = await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities<{ lmsIdNameA: string; lmsIdNameB: string }, 'idNameA', 'idNameB'>(
      'idNameA',
      'idNameB',
      [
        {
          idNameA: 'idA-1',
          idNameB: 'idB-3',
        },
        {
          idNameA: 'idA-2',
          idNameB: 'idB-1',
        },
        {
          idNameA: 'idA-2',
          idNameB: 'idB-2',
        },
        {
          idNameA: 'idA-2',
          idNameB: 'idB-3',
        },
      ],
      [
        {
          lmsIdNameA: 'lmsIdA-1',
          lmsIdNameB: 'lmsIdB-1',
        },
        {
          lmsIdNameA: 'lmsIdA-1',
          lmsIdNameB: 'lmsIdB-2',
        },
        {
          lmsIdNameA: 'lmsIdA-1',
          lmsIdNameB: 'lmsIdB-3',
        },
        {
          lmsIdNameA: 'lmsIdA-2',
          lmsIdNameB: 'lmsIdB-1',
        },
      ],
      (sourceLms) => parentEntities[sourceLms.lmsIdNameA] ?? null,
      (sourceLms) => humanEntities[sourceLms.lmsIdNameB] ?? null,
      (parentId, humanId, sourceLms) => ({
        ...sourceLms,
        idNameA: parentId,
        idNameB: humanId,
      }),
    )

    if (result.hasError) {
      throw result.error
    }
    expect(result.value).toEqual<typeof result.value>({
      entitiesToCreate: [
        {
          idNameA: 'idA-1',
          idNameB: 'idB-1',
        },
        {
          idNameA: 'idA-1',
          idNameB: 'idB-2',
        },
      ],
      entitiesToDelete: [
        {
          idNameA: 'idA-2',
          idNameB: 'idB-2',
        },
        {
          idNameA: 'idA-2',
          idNameB: 'idB-3',
        },
      ],
    })
  })

  test('CodexEntityNotExist error for EntityA', async () => {
    const result = await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities(
      'idNameA',
      'idNameB',
      [
        {
          idNameA: 'idA-1',
          idNameB: 'idB-3',
        },
      ],
      [
        {
          lmsIdNameA: 'lmsIdA-1',
          lmsIdNameB: 'lmsIdB-1',
        },
        {
          lmsIdNameA: 'lmsIdA-4', // Not exist in Codex Entities A
          lmsIdNameB: 'lmsIdB-3',
        },
      ],
      () => null,
      () => ({ id: 'no-error-id' }),
      (parentId, humanId, sourceLms) => ({
        ...sourceLms,
        idNameA: parentId,
        idNameB: humanId,
      }),
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual<NonNullable<typeof result.error>['type']>('ParentCodexEntityNotExist')
  })

  test('CodexEntityNotExist error for EntityB', async () => {
    const result = await compareSourceLmsAffiliationEntitiesAndCodexAffiliationEntities(
      'idNameA',
      'idNameB',
      [
        {
          idNameA: 'idA-1',
          idNameB: 'idB-3',
        },
      ],
      [
        {
          lmsIdNameA: 'lmsIdA-1',
          lmsIdNameB: 'lmsIdB-1',
        },
        {
          lmsIdNameA: 'lmsIdA-3',
          lmsIdNameB: 'lmsIdB-4', // Not exist in Codex Entities A
        },
      ],
      () => ({ id: 'no-error-id' }),
      () => null,
      (parentId, humanId, sourceLms) => ({
        ...sourceLms,
        idNameA: parentId,
        idNameB: humanId,
      }),
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual<NonNullable<typeof result.error>['type']>('HumanCodexEntityNotExist')
  })
})
