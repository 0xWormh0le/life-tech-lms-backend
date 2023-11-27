import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { OnMemoryRdbUserAccessTokenRepository, UserAccessToken } from './OnMemoryRdbUserAccessTokenRepository'
import { RdbUserAccessTokenRepository } from './RdbUserAccessTokenRepository'
import { OnMemoryUserAccessTokenRepository } from './OnMemoryUserAccessTokenRepository'
import { Errorable, E } from '../../../domain/usecases/shared/Errors'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('OnMemoryRdbUserAccessTokenRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'

  describe('test without mock', () => {
    let onMemoryRdbUserAccessTokenRepository: OnMemoryRdbUserAccessTokenRepository

    beforeAll(async () => {
      if (!appDataSource) {
        throw new Error('Error appDataSource not found')
      }

      const rdbUserAccessTokenRepository = new RdbUserAccessTokenRepository(appDataSource)
      const onMemoryUserAccessTokenRepository = new OnMemoryUserAccessTokenRepository()

      onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)
    })

    describe('issueId', () => {
      test('success', async () => {
        const result = await onMemoryRdbUserAccessTokenRepository.issueId()

        expect(result.hasError).toEqual(false)
        expect(result.value).toBeDefined()
        expect(result.error).toBeNull()

        const resultSecond = await onMemoryRdbUserAccessTokenRepository.issueId()

        expect(resultSecond.hasError).toEqual(false)
        expect(resultSecond.value).toBeDefined()
        expect(resultSecond.error).toBeNull()
        expect(resultSecond.value).not.toEqual(result.value)
      })
    })

    describe('create & find & update', () => {
      let id: string
      let userAccessToken: UserAccessToken
      let userAccessTokenToBeUpdated: UserAccessToken
      let userAccessTokenToBeUntouched: UserAccessToken

      test('issue new id', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.issueId()

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeDefined()

        if (!res.value) {
          throw new Error()
        }
        id = res.value
      })

      test('create userAccessTokenToBeUntouched', async () => {
        const userAccessTokenToBeUntouchedIdRes = await onMemoryRdbUserAccessTokenRepository.issueId()

        if (!userAccessTokenToBeUntouchedIdRes.value) {
          throw new Error('failed to create id for userAccessTokenToBeUntouched')
        }

        const userAccessTokenToBeUntouchedId = userAccessTokenToBeUntouchedIdRes.value

        userAccessTokenToBeUntouched = {
          id: userAccessTokenToBeUntouchedId,
          userId: `testUserId1-${userAccessTokenToBeUntouchedId}`,
          accessToken: `accessToken-${userAccessTokenToBeUntouchedId}`,
          createdAt: new Date(nowStr),
        }

        const res = await onMemoryRdbUserAccessTokenRepository.create(userAccessTokenToBeUntouched)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()
      })

      test('find by unsaved userAccessToken id', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findById(id)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeNull()
      })

      test('find by unsaved userAccessToken accessToken', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findByAccessToken(`testAccessToken1-${id}`)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeNull()
      })

      test('find all other userAccessTokens', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findAll()

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeInstanceOf(Array)

        if (!res.value) {
          throw new Error('value is undefined.')
        }
        expect(res.value.length).toEqual(1)
        expect(res.value[0]).toEqual(userAccessTokenToBeUntouched)
      })

      test('create', async () => {
        userAccessToken = {
          id,
          userId: `testUserId1-${id}`,
          accessToken: `testAccessToken1-${id}`,
          createdAt: new Date(nowStr),
        }

        const res = await onMemoryRdbUserAccessTokenRepository.create(userAccessToken)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        const resUntouched = await onMemoryRdbUserAccessTokenRepository.findById(userAccessTokenToBeUntouched.id)

        expect(resUntouched.value).toEqual(userAccessTokenToBeUntouched)
      })

      test('find by id', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findById(id)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toEqual(userAccessToken)
      })

      test('find by accessToken', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findByAccessToken(userAccessToken.accessToken)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toEqual(userAccessToken)
      })

      test('find all', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findAll()

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeDefined()
        expect(res.value?.length).toBeGreaterThan(0)

        const target = res.value?.find((e) => e.id === id)

        expect(target).toEqual(userAccessToken)
      })

      test('update', async () => {
        userAccessTokenToBeUpdated = {
          id: id,
          userId: `testUserId1-${id}-updated1`,
          accessToken: `testAccessToken-${id}`,
          createdAt: new Date(futureStr),
        }

        const res = await onMemoryRdbUserAccessTokenRepository.update(userAccessTokenToBeUpdated)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()

        const resUntouched = await onMemoryRdbUserAccessTokenRepository.findById(userAccessTokenToBeUntouched.id)

        expect(resUntouched.value).toEqual(userAccessTokenToBeUntouched)
      })

      test('find by id after update', async () => {
        const res = await onMemoryRdbUserAccessTokenRepository.findById(id)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toEqual(userAccessTokenToBeUpdated)
      })
    })
  })

  describe('test with mock', () => {
    describe('issueId', () => {
      test('success', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()
        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const result = await onMemoryRdbUserAccessTokenRepository.issueId()

        expect(result.hasError).toEqual(false)
        expect(result.value).toBeDefined()
        expect(result.error).toBeNull()
        expect(rdbUserAccessTokenRepository.issueId.mock.calls.length).toEqual(1)
      })
    })

    describe('create', () => {
      test('success', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()
        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const userAccessToken = {
          id: 'testUsreAccessTokenId1',
          userId: `testUserId1`,
          accessToken: `testAccessToken1`,
          createdAt: new Date(nowStr),
        }

        const res = await onMemoryRdbUserAccessTokenRepository.create(userAccessToken)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()
        expect(rdbUserAccessTokenRepository.create.mock.calls.length).toEqual(1)
        expect(onMemoryUserAccessTokenRepository.create.mock.calls.length).toEqual(1)
      })
    })

    describe('findById', () => {
      test('success', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()
        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const res = await onMemoryRdbUserAccessTokenRepository.findById('someId')

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(rdbUserAccessTokenRepository.findById.mock.calls.length).toEqual(1)
      })
    })

    describe('findByAccessToken', () => {
      test('find by memory', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()
        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const res = await onMemoryRdbUserAccessTokenRepository.findByAccessToken('accessToken')

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(onMemoryUserAccessTokenRepository.findByAccessToken.mock.calls.length).toEqual(1)
        expect(rdbUserAccessTokenRepository.findByAccessToken.mock.calls.length).toEqual(0)
      })

      test('find by rdb', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()

        onMemoryUserAccessTokenRepository.findByAccessToken = jest.fn(
          async (_accessToken: string): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
            return {
              hasError: false,
              error: null,
              value: null,
            }
          },
        )

        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const res = await onMemoryRdbUserAccessTokenRepository.findByAccessToken('accessToken')

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(rdbUserAccessTokenRepository.findByAccessToken.mock.calls.length).toEqual(1)
        expect(onMemoryUserAccessTokenRepository.findByAccessToken.mock.calls.length).toEqual(1)
      })
    })

    describe('findAll', () => {
      test('success', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()
        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const res = await onMemoryRdbUserAccessTokenRepository.findAll()

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeDefined()
        expect(res.value?.length).toBeGreaterThan(0)
        expect(rdbUserAccessTokenRepository.findAll.mock.calls.length).toEqual(1)
      })
    })

    describe('update', () => {
      test('success', async () => {
        const rdbUserAccessTokenRepository = createSuccessMockRdbUserAccessTokenRepository()
        const onMemoryUserAccessTokenRepository = createSuccessMockOnMemoryUserAccessTokenRepository()
        const onMemoryRdbUserAccessTokenRepository = new OnMemoryRdbUserAccessTokenRepository(rdbUserAccessTokenRepository, onMemoryUserAccessTokenRepository)

        const userAccessTokenToBeUpdated = {
          id: 'testUserAccessToken1',
          userId: `testUserId1-updated1`,
          accessToken: `testAccessToken`,
          createdAt: new Date(futureStr),
        }

        const res = await onMemoryRdbUserAccessTokenRepository.update(userAccessTokenToBeUpdated)

        if (res.hasError) {
          throw new Error(res.error.message)
        }
        expect(res.error).toBeNull()
        expect(res.value).toBeUndefined()
        expect(rdbUserAccessTokenRepository.update.mock.calls.length).toEqual(1)
        expect(onMemoryUserAccessTokenRepository.update.mock.calls.length).toEqual(1)
      })
    })
  })

  const createSuccessMockOnMemoryUserAccessTokenRepository = () => {
    const repo: OnMemoryUserAccessTokenRepository = {
      create: async (_userAccessToken: UserAccessToken): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },

      findByAccessToken: async (_accessToken: string): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testUserAccessTokenId1',
            userId: 'testUserId1',
            accessToken: 'testAccessToken1',
            createdAt: new Date(nowStr),
          },
        }
      },

      update: async (_userAccessToken: UserAccessToken): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      create: jest.fn((userAccessToken: UserAccessToken) => repo.create(userAccessToken)),
      findByAccessToken: jest.fn((accessToken: string) => repo.findByAccessToken(accessToken)),
      update: jest.fn((userAccessToken: UserAccessToken) => repo.update(userAccessToken)),
    }
  }
  const createSuccessMockRdbUserAccessTokenRepository = () => {
    if (!appDataSource) {
      throw new Error(`appDataSource is empty`)
    }

    const repo = {
      issueId: jest.fn(async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: 'testUserAccessTokenId1',
        }
      }),
      create: jest.fn(async (_userAccessToken: UserAccessToken): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      findAll: jest.fn(async (): Promise<Errorable<UserAccessToken[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testUserAccessTokenId1',
              userId: 'testUserId1',
              accessToken: 'testAccessToken1',
              createdAt: new Date(nowStr),
            },
            {
              id: 'testUserAccessTokenId2',
              userId: 'testUserId2',
              accessToken: 'testAccessToken2',
              createdAt: new Date(nowStr),
            },
          ],
        }
      }),
      findById: jest.fn(async (_id: string): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testUserAccessTokenId1',
            userId: 'testUserId1',
            accessToken: 'testAccessToken1',
            createdAt: new Date(nowStr),
          },
        }
      }),

      findByAccessToken: jest.fn(async (_accessToken: string): Promise<Errorable<UserAccessToken | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testUserAccessTokenId1',
            userId: 'testUserId1',
            accessToken: 'testAccessToken1',
            createdAt: new Date(nowStr),
          },
        }
      }),

      update: jest.fn(async (_userAccessToken: UserAccessToken): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }

    return repo
  }
})
