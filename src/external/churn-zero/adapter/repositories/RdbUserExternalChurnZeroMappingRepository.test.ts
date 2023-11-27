import { v4 as uuid } from 'uuid'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../adapter/_testShared/testUtilities'
import { RdbUserExternalChurnZeroMappingRepository } from './RdbUserExternalChurnZeroMappingRepository'
import { UserExternalChurnZeroMapping } from '../../domain/entities/UserExternalChurnZeroMapping'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserExternalChurnZeroMappingRepository', () => {
  let rdbUserExternalChurnZeroMappingRepository: RdbUserExternalChurnZeroMappingRepository

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    rdbUserExternalChurnZeroMappingRepository = new RdbUserExternalChurnZeroMappingRepository(appDataSource)
  })

  describe('create & find & update', () => {
    const userId = uuid()
    let userExternalChurnZeroMapping: UserExternalChurnZeroMapping
    let toBeUpdated: UserExternalChurnZeroMapping
    let toBeUntouched: UserExternalChurnZeroMapping

    test('create toBeUntouched', async () => {
      const toBeUntouchedUserId = uuid()

      toBeUntouched = {
        userId: toBeUntouchedUserId,
        externalChurnZeroContactExternalId: `externalChurnZeroContactExternalId-${toBeUntouchedUserId}`,
        externalChurnZeroAccountExternalId: `externalChurnZeroAccountExternalId-${toBeUntouchedUserId}`,
      }

      const res = await rdbUserExternalChurnZeroMappingRepository.create(toBeUntouched)

      expect(res.error).toBeNull()
      expect(res.hasError).toEqual(false)
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved userExternalChurnZeroMapping.userId', async () => {
      const res = await rdbUserExternalChurnZeroMappingRepository.findByUserId(userId)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all others', async () => {
      const res = await rdbUserExternalChurnZeroMappingRepository.findAll()

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is not defined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(toBeUntouched)
    })

    test('create', async () => {
      userExternalChurnZeroMapping = {
        userId: userId,
        externalChurnZeroContactExternalId: `test-externalChurnZeroContactExternalId-${userId}`,
        externalChurnZeroAccountExternalId: `test-externalChurnZeroAccountExternalId-${userId}`,
      }

      const res = await rdbUserExternalChurnZeroMappingRepository.create(userExternalChurnZeroMapping)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by id', async () => {
      const res = await rdbUserExternalChurnZeroMappingRepository.findByUserId(userId)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userExternalChurnZeroMapping)
    })

    test('find all', async () => {
      const res = await rdbUserExternalChurnZeroMappingRepository.findAll()

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.userId === userId)

      expect(target).toEqual(userExternalChurnZeroMapping)
    })

    test('find by user ids', async () => {
      let res = await rdbUserExternalChurnZeroMappingRepository.findByUserIds([toBeUntouched.userId])

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()

      expect(res.value).toEqual([toBeUntouched])

      res = await rdbUserExternalChurnZeroMappingRepository.findByUserIds([toBeUntouched.userId, userExternalChurnZeroMapping.userId])

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value?.length).toBeGreaterThan(0)

      expect(res.value).toEqual([toBeUntouched, userExternalChurnZeroMapping])
    })

    test('update', async () => {
      toBeUpdated = {
        userId: userId,
        externalChurnZeroContactExternalId: `test-externalChurnZeroContactExternalId-${userId}-updated`,
        externalChurnZeroAccountExternalId: `test-externalChurnZeroAccountExternalId-${userId}-updated`,
      }

      const res = await rdbUserExternalChurnZeroMappingRepository.update(toBeUpdated)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserExternalChurnZeroMappingRepository.findByUserId(toBeUntouched.userId)

      expect(resUntouched.value).toEqual(toBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserExternalChurnZeroMappingRepository.findByUserId(userId)

      expect(res.hasError).toEqual(false)
      expect(res.error).toBeNull()
      expect(res.value).toEqual(toBeUpdated)
    })
  })
})
