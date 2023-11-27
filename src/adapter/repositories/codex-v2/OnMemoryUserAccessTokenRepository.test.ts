import { OnMemoryUserAccessTokenRepository, UserAccessToken } from './OnMemoryUserAccessTokenRepository'
import { v4 as uuid } from 'uuid'

describe('OnMemoryUserAccessTokenRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  const onMemoryUserAccessTokenRepository = new OnMemoryUserAccessTokenRepository()

  describe('create & find & update', () => {
    const id: string = uuid()
    let userAccessToken: UserAccessToken
    let userAccessTokenToBeUpdated: UserAccessToken
    let userAccessTokenToBeUntouched: UserAccessToken

    test('create userAccessTokenToBeUntouched', async () => {
      const userAccessTokenToBeUntouchedId = uuid()

      userAccessTokenToBeUntouched = {
        id: userAccessTokenToBeUntouchedId,
        userId: `testUserId1-${userAccessTokenToBeUntouchedId}`,
        accessToken: `accessToken-${userAccessTokenToBeUntouchedId}`,
        createdAt: new Date(nowStr),
      }

      const res = await onMemoryUserAccessTokenRepository.create(userAccessTokenToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userAccessToken accessToken', async () => {
      const res = await onMemoryUserAccessTokenRepository.findByAccessToken(`testAccessToken1-${id}`)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('create', async () => {
      userAccessToken = {
        id,
        userId: `testUserId1-${id}`,
        accessToken: `testAccessToken1-${id}`,
        createdAt: new Date(nowStr),
      }

      const res = await onMemoryUserAccessTokenRepository.create(userAccessToken)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await onMemoryUserAccessTokenRepository.findByAccessToken(userAccessTokenToBeUntouched.accessToken)

      expect(resUntouched.value).toEqual(userAccessTokenToBeUntouched)
    })

    test('find by accessToken', async () => {
      const res = await onMemoryUserAccessTokenRepository.findByAccessToken(userAccessToken.accessToken)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userAccessToken)
    })

    test('update', async () => {
      userAccessTokenToBeUpdated = {
        id: id,
        userId: `testUserId1-${id}-updated1`,
        accessToken: userAccessToken.accessToken,
        createdAt: new Date(futureStr),
      }

      const res = await onMemoryUserAccessTokenRepository.update(userAccessTokenToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await onMemoryUserAccessTokenRepository.findByAccessToken(userAccessTokenToBeUntouched.accessToken)

      expect(resUntouched.value).toEqual(userAccessTokenToBeUntouched)
    })

    test('find by token after update', async () => {
      const res = await onMemoryUserAccessTokenRepository.findByAccessToken(userAccessToken.accessToken)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userAccessTokenToBeUpdated)
    })
  })
})
