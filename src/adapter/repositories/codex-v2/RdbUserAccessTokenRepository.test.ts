import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbUserAccessTokenRepository, UserAccessToken } from './RdbUserAccessTokenRepository'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserAccessTokenRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbUserAccessTokenRepository: RdbUserAccessTokenRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbUserAccessTokenRepository = new RdbUserAccessTokenRepository(appDataSource)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbUserAccessTokenRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbUserAccessTokenRepository.issueId()

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
      const res = await rdbUserAccessTokenRepository.issueId()

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
      const userAccessTokenToBeUntouchedIdRes = await rdbUserAccessTokenRepository.issueId()

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

      const res = await rdbUserAccessTokenRepository.create(userAccessTokenToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userAccessToken id', async () => {
      const res = await rdbUserAccessTokenRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find by unsaved userAccessToken accessToken', async () => {
      const res = await rdbUserAccessTokenRepository.findByAccessToken(`testAccessToken1-${id}`)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other userAccessTokens', async () => {
      const res = await rdbUserAccessTokenRepository.findAll()

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

      const res = await rdbUserAccessTokenRepository.create(userAccessToken)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserAccessTokenRepository.findById(userAccessTokenToBeUntouched.id)

      expect(resUntouched.value).toEqual(userAccessTokenToBeUntouched)
    })

    test('find by id', async () => {
      const res = await rdbUserAccessTokenRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userAccessToken)
    })

    test('find by accessToken', async () => {
      const res = await rdbUserAccessTokenRepository.findByAccessToken(userAccessToken.accessToken)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userAccessToken)
    })

    test('find all', async () => {
      const res = await rdbUserAccessTokenRepository.findAll()

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

      const res = await rdbUserAccessTokenRepository.update(userAccessTokenToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserAccessTokenRepository.findById(userAccessTokenToBeUntouched.id)

      expect(resUntouched.value).toEqual(userAccessTokenToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserAccessTokenRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userAccessTokenToBeUpdated)
    })
  })
})
