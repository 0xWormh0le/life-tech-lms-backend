import { UserTypeormEntity } from '../../../../../adapter/typeorm/entity/User'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { In } from 'typeorm'
import { UserRepository } from './UserRepository'
import { randomUUID } from 'crypto'
import { User } from '../../domain/entities/User'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

describe('test UserRepository for Classlink', () => {
  test('success getByIds', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    const userRepository = new UserRepository(appDataSource)
    const usersIds: string[] = []
    let result = await userRepository.getByIds(usersIds)

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value?.length).toEqual(0)

    /* Create User */
    const userTypeormEntity = appDataSource.getRepository(UserTypeormEntity)

    await userTypeormEntity.save({
      role: 'student',
      email: 'stu1@gmail.com',
      human_user_created_at: new Date(),
      human_user_updated_at: new Date(),
    })
    await userTypeormEntity.save({
      role: 'student',
      email: 'stu2@gmail.com',
      human_user_created_at: new Date(),
      human_user_updated_at: new Date(),
    })

    const usersData = await userTypeormEntity.find({})

    for (const s of usersData) {
      usersIds.push(s.id)
    }

    result = await userRepository.getByIds(usersIds)

    const getUserResult: User[] = []

    for (const s of usersData) {
      usersIds.push(s.id)

      if (s.email && s.role) {
        getUserResult.push({
          id: s.id,
          loginId: s.login_id ?? undefined,
          email: s.email,
          role: s.role as User['role'],
          isDeactivated: s.is_deactivated,
        })
      }
    }

    if (!result.value) {
      throw new Error('No user found')
    }

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value?.length).toEqual(2)
    expect(result.value).toEqual(getUserResult)
  })

  test('success createUsers', async () => {
    const userId1 = randomUUID()
    const userId2 = randomUUID()

    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create User */
    const userTypeormEntity = appDataSource.getRepository(UserTypeormEntity)
    const userRepository = new UserRepository(appDataSource)

    await userRepository.createUsers([
      {
        id: userId1,
        role: 'student',
        email: 'stu3@gmail.com',
        isDeactivated: false,
      },
      {
        id: userId2,
        role: 'student',
        email: 'stu4@gmail.com',
        isDeactivated: false,
      },
    ])

    const usersData = await userTypeormEntity.find({})

    const getUserResult: User[] = []
    const usersIds: string[] = []

    for (const s of usersData) {
      usersIds.push(s.id)

      if (s.email && s.role) {
        getUserResult.push({
          id: s.id,
          loginId: s.login_id ?? undefined,
          email: s.email,
          role: s.role as User['role'],
          isDeactivated: s.is_deactivated,
        })
      }
    }

    const result = await userRepository.getByIds(usersIds)

    if (!result.value) {
      throw new Error('No user found')
    }
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value?.length).toEqual(4)
    expect(result.value).toEqual(getUserResult)

    const users = await userTypeormEntity.find({
      where: { id: In(usersIds) },
    })

    expect(users.find((e) => !e.human_user_created_at)).toBeUndefined()
    expect(users.find((e) => !e.human_user_updated_at)).toBeUndefined()
  })

  test('success updateUsers', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    const userTypeormEntity = appDataSource.getRepository(UserTypeormEntity)
    const userRepository = new UserRepository(appDataSource)

    const usersIds: string[] = []
    const usersData = await userTypeormEntity.find({})

    for (const s of usersData) {
      usersIds.push(s.id)
    }

    /* Update User */
    await userRepository.updateUsers([
      {
        id: usersIds[0],
        role: 'student',
        email: 'stu11@gmail.com',
        isDeactivated: false,
      },
      {
        id: usersIds[1],
        role: 'student',
        email: 'stu22@gmail.com',
        isDeactivated: false,
      },
      {
        id: usersIds[2],
        role: 'student',
        email: 'stu33@gmail.com',
        isDeactivated: false,
      },
      {
        id: usersIds[3],
        role: 'student',
        email: 'stu44@gmail.com',
        isDeactivated: false,
      },
    ])

    await userRepository.getByIds(usersIds)

    const result = await userRepository.getByIds(usersIds)

    if (!result.value) {
      throw new Error('No user found')
    }
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value?.length).toEqual(4)
    expect(result.value[0].email).toEqual('stu11@gmail.com')
    expect(result.value[1].email).toEqual('stu22@gmail.com')

    const users = await userTypeormEntity.find({
      where: { id: In(usersIds) },
    })

    expect(users.find((e) => !e.human_user_created_at)).toBeUndefined()
    expect(users.find((e) => !e.human_user_updated_at)).toBeUndefined()
  })

  test('success deleteUsers', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    const userTypeormEntity = appDataSource.getRepository(UserTypeormEntity)
    const userRepository = new UserRepository(appDataSource)

    const usersIds: string[] = []
    const usersData = await userTypeormEntity.find({})

    for (const s of usersData) {
      usersIds.push(s.id)
    }

    const result = await userRepository.getByIds(usersIds)

    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value?.length).toEqual(4)

    /* Delete User */
    await userRepository.deleteUsers(usersIds)

    const getUserResult = await userRepository.getByIds(usersIds)

    expect(getUserResult.hasError).toEqual(false)
    expect(getUserResult.error).toEqual(null)
    expect(getUserResult.value?.map((e) => e.isDeactivated === true).length).toEqual(4)
  })
})
