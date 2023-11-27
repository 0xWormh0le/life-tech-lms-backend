import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbHumanUserRepository } from './RdbHumanUserRepository'
import { HumanUser } from '../../../domain/entities/codex-v2/HumanUser'
import { RdbUserRepository } from './RdbUserRepository'
import { User } from '../../../domain/entities/codex-v2/User'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbHumanUserRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbHumanUserRepository: RdbHumanUserRepository
  let rdbUserRepository: RdbUserRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbHumanUserRepository = new RdbHumanUserRepository(appDataSource)
    rdbUserRepository = new RdbUserRepository(appDataSource)
  })

  describe('hashPassword & verify', () => {
    test('success', async () => {
      const result = await rdbHumanUserRepository.hashPassword(`some-valid-password1`)

      if (!result.value) {
        throw new Error(`value should be defined.`)
      }
      expect(result.hasError).toEqual(false)
      expect(result.value.startsWith('$2b$10$')).toEqual(true)
      expect(result.error).toBeNull()

      const validResult = await rdbHumanUserRepository.verifyPassword(`some-valid-password1`, result.value)

      expect(validResult.hasError).toEqual(false)
      expect(validResult.value).toEqual(true)
      expect(validResult.error).toBeNull()

      const invalidResult = await rdbHumanUserRepository.verifyPassword(`invalid-password1`, result.value)

      expect(invalidResult.hasError).toEqual(false)
      expect(invalidResult.value).toEqual(false)
      expect(invalidResult.error).toBeNull()
    })
  })

  describe('create & find & update', () => {
    let userId: string
    let humanUser: HumanUser
    let humanUserToBeUpdated: HumanUser
    let humanUserToBeUntouched: HumanUser
    let humanUserToBeUpdatedWithNullValue: HumanUser
    let userToBeUntouched: User
    let targetUser: User

    test('create humanUserToBeUntouched', async () => {
      const userToBeUntouchedIdRes = await rdbUserRepository.issueId()

      if (!userToBeUntouchedIdRes.value) {
        throw new Error('failed to create id for userToBeUntouched')
      }

      const userToBeUntouchedId = userToBeUntouchedIdRes.value

      userToBeUntouched = {
        id: userToBeUntouchedId,
        role: 'internalOperator',
        isDemo: false,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const resUserCreation = await rdbUserRepository.create(userToBeUntouched)

      expect(resUserCreation.hasError).toEqual(false)
      expect(resUserCreation.error).toBeNull()
      expect(resUserCreation.value).toBeUndefined()
      humanUserToBeUntouched = {
        userId: userToBeUntouchedId,
        loginId: `loginId1-${userToBeUntouchedId}`,
        email: `email1-${userToBeUntouchedId}`,
        hashedPassword: `hashedPassword1-${userToBeUntouchedId}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbHumanUserRepository.create(humanUserToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by invalid humanUser id', async () => {
      const resUnsavedUserId = await rdbUserRepository.issueId()

      if (!resUnsavedUserId.value) {
        throw new Error(`failed to create new userId`)
      }

      const unsavedUserId = resUnsavedUserId.value
      const res = await rdbHumanUserRepository.findByUserId(unsavedUserId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other humanUsers', async () => {
      const res = await rdbHumanUserRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is undefined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(humanUserToBeUntouched)
    })

    test('find by new user id before saving humanUser', async () => {
      const resId = await rdbUserRepository.issueId()

      if (!resId.value) {
        throw new Error('failed to issue user id.')
      }
      userId = resId.value
      targetUser = {
        id: userId,
        role: 'internalOperator',
        isDemo: false,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }
      await rdbUserRepository.create(targetUser)

      const resUser = await rdbUserRepository.findById(userId)

      expect(resUser.hasError).toEqual(false)
      expect(resUser.error).toBeNull()
      expect(resUser.value).toEqual(targetUser)

      const res = await rdbHumanUserRepository.findByUserId(userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('create', async () => {
      humanUser = {
        userId: userId,
        loginId: `loginId1-${userId}`,
        email: `email1-${userId}`,
        hashedPassword: `hashedPassword1-${userId}`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbHumanUserRepository.create(humanUser)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouchedUser = await rdbUserRepository.findById(userToBeUntouched.id)

      expect(resUntouchedUser.value).toEqual(userToBeUntouched)

      const resUntouched = await rdbHumanUserRepository.findByUserId(humanUserToBeUntouched.userId)

      expect(resUntouched.value).toEqual(humanUserToBeUntouched)
    })

    test('find by userId after creating', async () => {
      const res = await rdbHumanUserRepository.findByUserId(userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(humanUser)
    })

    test('find all', async () => {
      const res = await rdbHumanUserRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.userId === userId)

      expect(target).toEqual(humanUser)
    })

    test('update', async () => {
      humanUserToBeUpdated = {
        userId,
        loginId: `loginId1-${userId}-updated1`,
        email: `email1-${userId}-updated1`,
        hashedPassword: `hashedPassword1-${userId}-updated1`,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbHumanUserRepository.update(humanUserToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouchedUser = await rdbUserRepository.findById(userToBeUntouched.id)

      expect(resUntouchedUser.value).toEqual(userToBeUntouched)

      const resUntouched = await rdbHumanUserRepository.findByUserId(humanUserToBeUntouched.userId)

      expect(resUntouched.value).toEqual(humanUserToBeUntouched)
    })

    test('find by userId after updating', async () => {
      const res = await rdbHumanUserRepository.findByUserId(userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(humanUserToBeUpdated)
    })

    test('update after changing fields for user', async () => {
      const userToBeUpdated: User = {
        id: userId,
        isDemo: true,
        role: 'administrator',
        createdAt: new Date(futureStr),
        updatedAt: new Date(futureStr),
      }

      await rdbUserRepository.update(userToBeUpdated)

      const resUser = await rdbUserRepository.findById(userId)

      expect(resUser.hasError).toEqual(false)
      expect(resUser.error).toBeNull()
      expect(resUser.value).toEqual(userToBeUpdated)

      const res = await rdbHumanUserRepository.findByUserId(userId)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(humanUserToBeUpdated)

      const resUntouchedUser = await rdbUserRepository.findById(userToBeUntouched.id)

      expect(resUntouchedUser.value).toEqual(userToBeUntouched)

      const resUntouched = await rdbHumanUserRepository.findByUserId(humanUserToBeUntouched.userId)

      expect(resUntouched.value).toEqual(humanUserToBeUntouched)
    })

    test('update with null value', async () => {
      humanUserToBeUpdatedWithNullValue = {
        userId,
        loginId: null,
        email: null,
        hashedPassword: null,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbHumanUserRepository.update(humanUserToBeUpdatedWithNullValue)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id after update with null value', async () => {
      const res = await rdbHumanUserRepository.findByUserId(userId)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual(humanUserToBeUpdatedWithNullValue)

      const resUntouched = await rdbHumanUserRepository.findByUserId(humanUserToBeUntouched.userId)

      expect(resUntouched.value).toEqual(humanUserToBeUntouched)
    })

    test('findByEmail with null', async () => {
      const res = await rdbHumanUserRepository.findByEmail(null)
      const resAll = await rdbHumanUserRepository.findAll()

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value?.length).toEqual(resAll.value?.length)
    })

    test('findByEmail with non existing string', async () => {
      const res = await rdbHumanUserRepository.findByEmail('non-existing')

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value?.length).toEqual(0)
    })

    test('findByEmail with string', async () => {
      const res = await rdbHumanUserRepository.findByEmail('email')

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value?.length).toBeGreaterThan(0)
    })
  })
})
