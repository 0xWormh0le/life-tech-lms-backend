import { appDataSource, setupEnvironment, teardownEnvironment } from '../../_testShared/testUtilities'
import { RdbUserRepository } from './RdbUserRepository'
import { User } from '../../../domain/entities/codex-v2/User'
import { UserTypeormEntity } from '../../typeorm/entity/User'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Repository } from 'typeorm'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('RdbUserRepository', () => {
  const nowStr = '2000-01-01T00:00:00Z'
  const futureStr = '2000-01-01T00:05:00Z'
  let rdbUserRepository: RdbUserRepository
  let typeormRepository: Repository<UserTypeormEntity>

  beforeAll(async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }
    rdbUserRepository = new RdbUserRepository(appDataSource)
    typeormRepository = appDataSource.getRepository(UserTypeormEntity)
  })

  describe('issueId', () => {
    test('success', async () => {
      const result = await rdbUserRepository.issueId()

      expect(result.hasError).toEqual(false)
      expect(result.value).toBeDefined()
      expect(result.error).toBeNull()

      const resultSecond = await rdbUserRepository.issueId()

      expect(resultSecond.hasError).toEqual(false)
      expect(resultSecond.value).toBeDefined()
      expect(resultSecond.error).toBeNull()
      expect(resultSecond.value).not.toEqual(result.value)
    })
  })

  describe('create & find & update', () => {
    let id: string
    let user: User
    let userToBeUpdated: User
    let userToBeUntouched: User

    test('issue new id', async () => {
      const res = await rdbUserRepository.issueId()

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

    test('create userToBeUntouched', async () => {
      const userToBeUntouchedId = await rdbUserRepository.issueId()

      if (!userToBeUntouchedId.value) {
        throw new Error('failed to create id for userToBeUntouched')
      }
      userToBeUntouched = {
        id: userToBeUntouchedId.value,
        isDemo: false,
        role: 'internalOperator',
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbUserRepository.create(userToBeUntouched)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()
    })

    test('find by unsaved user id', async () => {
      const res = await rdbUserRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('find all other users', async () => {
      const res = await rdbUserRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeInstanceOf(Array)

      if (!res.value) {
        throw new Error('value is undefined.')
      }
      expect(res.value.length).toEqual(1)
      expect(res.value[0]).toEqual(userToBeUntouched)
    })

    test('create', async () => {
      user = {
        id,
        role: 'internalOperator',
        isDemo: true,
        createdAt: new Date(nowStr),
        updatedAt: new Date(nowStr),
      }

      const res = await rdbUserRepository.create(user)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserRepository.findById(userToBeUntouched.id)

      expect(resUntouched.value).toEqual(userToBeUntouched)
    })

    test('find by id', async () => {
      const res = await rdbUserRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(user)
    })

    test('find all', async () => {
      const res = await rdbUserRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeDefined()
      expect(res.value?.length).toBeGreaterThan(0)

      const target = res.value?.find((e) => e.id === id)

      expect(target).toEqual(user)
    })

    test('update', async () => {
      userToBeUpdated = {
        id: id,
        isDemo: false,
        role: 'administrator',
        createdAt: new Date(futureStr),
        updatedAt: new Date(futureStr),
      }

      const res = await rdbUserRepository.update(userToBeUpdated)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeUndefined()

      const resUntouched = await rdbUserRepository.findById(userToBeUntouched.id)

      expect(resUntouched.value).toEqual(userToBeUntouched)
    })

    test('find by id after update', async () => {
      const res = await rdbUserRepository.findById(id)

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual(userToBeUpdated)
    })

    test('update after changing fields for human user', async () => {
      const humanUserFiledToUpdateTypeormEntity: QueryDeepPartialEntity<UserTypeormEntity> = {
        id: id,
        login_id: `testLoginId-${id}`,
        email: undefined,
        is_demo: false,
        password: `testHashedPassword-${id}`,
        is_deactivated: false,
        created_at: new Date(`2000-01-01T00:10:00Z`),
        updated_at: new Date(`2000-01-01T00:10:00Z`),
      }

      await typeormRepository.update({ id: user.id }, humanUserFiledToUpdateTypeormEntity)

      const result = await typeormRepository.findOneBy({
        id,
      })

      expect(result).toEqual({
        ...humanUserFiledToUpdateTypeormEntity,
        id: userToBeUpdated.id,
        role: userToBeUpdated.role,
        email: null,
        human_user_created_at: null,
        human_user_updated_at: null,
      })

      const userAfterUpdatingHumanUserField: User = {
        id: id,
        role: 'administrator',
        isDemo: true,
        createdAt: new Date(`2000-01-01T00:15:00Z`),
        updatedAt: new Date(`2000-01-01T00:15:00Z`),
      }

      await rdbUserRepository.update(userAfterUpdatingHumanUserField)

      const resultAfterUpdate = await typeormRepository.findOneBy({
        id,
      })

      expect(resultAfterUpdate).toEqual({
        ...humanUserFiledToUpdateTypeormEntity,
        id: userAfterUpdatingHumanUserField.id,
        role: userAfterUpdatingHumanUserField.role,
        is_demo: userAfterUpdatingHumanUserField.isDemo,
        created_at: userAfterUpdatingHumanUserField.createdAt,
        updated_at: userAfterUpdatingHumanUserField.updatedAt,
        email: null,
        human_user_created_at: null,
        human_user_updated_at: null,
      })

      const resUntouched = await rdbUserRepository.findById(userToBeUntouched.id)

      expect(resUntouched.value).toEqual(userToBeUntouched)
    })
  })
})
