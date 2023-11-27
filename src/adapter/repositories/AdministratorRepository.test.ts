import { randomUUID } from 'crypto'
import { DeepPartial, In } from 'typeorm'
import { AdminitaratorInfo } from '../../domain/usecases/codex/DistrictAdministrator/PostDistrictAdminitratorsUseCase'
import { excludeNull } from '../../_shared/utils'
import { AdministratorTypeormEntity } from '../typeorm/entity/Administrator'
import { AdministratorDistrictTypeormEntity } from '../typeorm/entity/AdministratorDistrict'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { UserTypeormEntity } from '../typeorm/entity/User'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { AdministratorRepository } from './AdministratorRepository'

let createdDistrictId1: string
let createdDistrictId2: string
const administratorInfo: Omit<AdminitaratorInfo, 'id'>[] = [
  {
    email: 'admin1@gmail.com',
    password: 'admin1',
    firstName: 'administrator-firstName-1',
    lastName: 'administrator-lastName-1',
    administratorLMSId: 'administrator-administratorLMSId-1',
  },

  {
    email: 'admin2@gmail.com',
    password: 'admin2',
    firstName: 'administrator-firstName-2',
    lastName: 'administrator-lastName-2',
    administratorLMSId: 'administrator-administratorLMSId-2',
  },
]
const administrator1 = randomUUID()
const administrator2 = randomUUID()
const administrator3 = randomUUID()
const administrator4 = randomUUID()
const userId1 = randomUUID()
const userId2 = randomUUID()
const userId3 = randomUUID()
const userId4 = randomUUID()

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  // create district
  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const createDistrictResult = await districtRepository.save([
    {
      name: 'district-name-1',
    },
    {
      name: 'district-name-2',
    },
  ])

  createdDistrictId1 = createDistrictResult[0].id
  createdDistrictId2 = createDistrictResult[1].id

  // create administrators
  const administratorRepository = appDataSource.getRepository(AdministratorTypeormEntity)
  const createAdministratorResult = await administratorRepository.save([
    {
      id: administrator1,
      administrator_lms_id: 'administrator-administratorLMSId-5',
      first_name: 'admin',
      last_name: '_1',
      user_id: userId1,
    },
    {
      id: administrator2,
      administrator_lms_id: 'administrator-administratorLMSId-6',
      first_name: 'admin',
      last_name: '_2',
      user_id: userId2,
    },
    {
      id: administrator3,
      administrator_lms_id: 'administrator-administratorLMSId-7',
      first_name: 'admin',
      last_name: '_3',
      user_id: userId3,
    },
    {
      id: administrator4,
      administrator_lms_id: 'administrator-administratorLMSId-8',
      first_name: 'admin',
      last_name: '_4',
      user_id: userId4,
    },
  ])
  const userRepository = appDataSource.getRepository(UserTypeormEntity)

  await userRepository.save([
    { role: 'administrator', email: 'user1@gmail.com', id: userId1 },
    { role: 'administrator', email: 'user2@gmail.com', id: userId2 },
    { role: 'administrator', email: 'user3@gmail.com', id: userId3 },
    { role: 'administrator', email: 'user4@gmail.com', id: userId4 },
  ])

  const districtAdministratorRepository = appDataSource.getRepository(AdministratorDistrictTypeormEntity)
  const districtAdministratorResult = await districtAdministratorRepository.save([
    {
      district: createdDistrictId1,
      administrator: administrator1,
    },
    {
      district: createdDistrictId1,
      administrator: administrator2,
    },
    {
      district: createdDistrictId1,
      administrator: administrator3,
    },
    {
      district: createdDistrictId1,
      administrator: administrator4,
    },
  ] as DeepPartial<AdministratorDistrictTypeormEntity>[])
})

afterEach(teardownEnvironment)

describe('test AdministratorRepository for Classlink', () => {
  test('success createAdministrator  for codex', async () => {
    const createdUserId = '2bf93634-5267-4b80-8b68-4c6f036857e9'

    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)

    const createdAdministrators = await administratorRepository.postDistrictAdministrators(createdDistrictId1, administratorInfo, createdUserId)

    if (createdAdministrators.hasError) {
      throw new Error(`administratorRepository.createAdministrators failed ${JSON.stringify(createdAdministrators.error)}`)
    }

    const administratorTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    const findAdministratorIdsResult = await administratorTypeormRepository
      .find({
        where: {
          first_name: In(['administrator-firstName-2', 'administrator-firstName-1']),
        },
      })
      .then((res) => {
        return res.map((e) => e.id)
      })
      .catch((err) => {
        throw new Error(`unknown runtime error occurred ${JSON.stringify(err)}`)
      })
    const getAdministratorsResult = await administratorRepository.getDistrictAdministrators(createdDistrictId1, findAdministratorIdsResult)

    expect(
      getAdministratorsResult.value?.map((e, index) => {
        return {
          email: e.email,
          firstName: e.firstName,
          lastName: e.lastName,
          administratorLMSId: e.administratorLMSId,
          password: administratorInfo[index].password,
        }
      }),
    ).toStrictEqual([
      {
        email: 'admin1@gmail.com',
        password: 'admin1',
        firstName: 'administrator-firstName-1',
        lastName: 'administrator-lastName-1',
        administratorLMSId: 'administrator-administratorLMSId-1',
      },

      {
        email: 'admin2@gmail.com',
        password: 'admin2',
        firstName: 'administrator-firstName-2',
        lastName: 'administrator-lastName-2',
        administratorLMSId: 'administrator-administratorLMSId-2',
      },
    ])

    expect(createdAdministrators.hasError).toEqual(false)
    expect(createdAdministrators.value).toEqual(undefined)
    expect(createdAdministrators.error).toEqual(null)
  })

  test('success getDistrictAdministrators', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)

    const getCreatedAdministratorResult = await administratorRepository.getDistrictAdministrators(createdDistrictId1, [administrator1, administrator2])
    const administratorTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    const findAdministratorsResult = await administratorTypeormRepository.find({
      where: {
        id: In([administrator1, administrator2]),
      },
    })

    expect(
      getCreatedAdministratorResult.value?.map((e, index) => {
        return {
          firstName: e.firstName,
          lastName: e.lastName,
          administratorLMSId: e.administratorLMSId,
        }
      }),
    ).toEqual(
      findAdministratorsResult.map((e) => {
        return {
          firstName: e.first_name,
          lastName: e.last_name,
          administratorLMSId: e.administrator_lms_id,
        }
      }),
    )
  })

  test('success getDistrictAdministratorByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    const createdAdministratorUserId = await administratorDistrictTypeormRepository.find({
      where: {
        id: administrator1,
      },
    })

    const getCreatedAdministratorResult = await administratorRepository.getAdministratorDetailByUserId(createdAdministratorUserId[0].user_id)

    expect(getCreatedAdministratorResult.value).toEqual({
      id: createdAdministratorUserId[0].id,
      firstName: 'admin',
      lastName: '_1',
      userId: createdAdministratorUserId[0].user_id,
      administratorLMSId: 'administrator-administratorLMSId-5',
    })
  })

  // TODO : Need to fix getAdministratorByAdministratorLMSId() method to return actual email instead of ''
  test('success getDistrictAdministratorByAdministratorLMSId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    // test scenario for get administrators by administrator_lms_id:'administrator-administratorLMSId-1' or 'administrator-administratorLMSId-2'only.
    const createdAdministratorLmsId = await administratorDistrictTypeormRepository
      .find({
        where: {
          id: In([administrator1, administrator2]),
        },
      })
      .then((res) => {
        return res.map((administrator) => administrator.administrator_lms_id)
      })
      .catch((err) => {
        throw new Error(`unknown runtime error occurred ${JSON.stringify(err)}`)
      })
    const getCreatedAdministratorResult = await administratorRepository.getAdministratorByAdministratorLMSId(excludeNull(createdAdministratorLmsId))

    expect(
      getCreatedAdministratorResult.value?.map((e) => {
        return {
          email: e.email,
          firstName: e.firstName,
          lastName: e.lastName,
          administratorLMSId: e.administratorLMSId,
        }
      }),
    ).toEqual([
      {
        email: '',
        firstName: 'admin',
        lastName: '_1',
        administratorLMSId: 'administrator-administratorLMSId-5',
      },
      {
        email: '',
        firstName: 'admin',
        lastName: '_2',
        administratorLMSId: 'administrator-administratorLMSId-6',
      },
    ])

    // test scenario for get administrators by administrator_lms_id:'administrator-administratorLMSId-1' only.
    const createdAdministratorLmsIdScenarioTwo = await administratorDistrictTypeormRepository
      .find({
        where: {
          id: In([administrator1]),
        },
      })
      .then((res) => {
        return res.map((administrator) => administrator.administrator_lms_id)
      })
      .catch((err) => {
        throw new Error(`unknown runtime error occurred ${JSON.stringify(err)}`)
      })
    const getCreatedAdministratorResultScenarioTwo = await administratorRepository.getAdministratorByAdministratorLMSId(
      excludeNull(createdAdministratorLmsIdScenarioTwo),
    )

    expect(
      getCreatedAdministratorResultScenarioTwo.value?.map((e) => {
        return {
          email: e.email,
          firstName: e.firstName,
          lastName: e.lastName,
          administratorLMSId: e.administratorLMSId,
        }
      }),
    ).toEqual([
      {
        email: '',
        firstName: 'admin',
        lastName: '_1',
        administratorLMSId: 'administrator-administratorLMSId-5',
      },
    ])
  })

  test('success getDistrictAdministratorByAdministratorLMSId for clever', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    const getDistrictAdministratorByAdministratorLMSIdResult = await administratorRepository.getDistrictAdministratorByAdministratorLMSId(
      'administrator-administratorLMSId-5',
    )
    const resultToExpected = await administratorDistrictTypeormRepository.find({
      where: {
        administrator_lms_id: 'administrator-administratorLMSId-5',
      },
    })

    expect({
      firstName: getDistrictAdministratorByAdministratorLMSIdResult.value?.firstName,
      lastName: getDistrictAdministratorByAdministratorLMSIdResult.value?.lastName,
      administratorLMSId: getDistrictAdministratorByAdministratorLMSIdResult.value?.administratorLMSId,
    }).toEqual({
      firstName: resultToExpected[0].first_name,
      lastName: resultToExpected[0].last_name,
      administratorLMSId: resultToExpected[0].administrator_lms_id,
    })
  })

  test('success checkDistrictAdministratorIsExistsByAdministratorLmsId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    // scenario in which lmsId is  exist in our Database.
    const administratorRepository = new AdministratorRepository(appDataSource)
    const checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioOne =
      await administratorRepository.checkDistrictAdministratorIsExistsByAdministratorLmsId('administrator-administratorLMSId-5')

    expect(checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioOne.error).toBe(null)
    expect(checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioOne.value).toBe(true)
    expect(checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioOne.hasError).toBe(false)

    // scenario in which lmsId is not exist in our Database.
    const checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioTwo =
      await administratorRepository.checkDistrictAdministratorIsExistsByAdministratorLmsId('administrator-administratorLMSId-1')

    expect(checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioTwo.error).toBe(null)
    expect(checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioTwo.value).toBe(false)
    expect(checkDistrictAdministratorIsExistsByAdministratorLmsIdScenarioTwo.hasError).toBe(false)
  })

  test('success getAdministratorDetailByUserId ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    const createdAdministratorUserDetails = await administratorDistrictTypeormRepository.find({
      where: {
        id: administrator1,
      },
    })

    const getAdministratorDetailsByUserId = await administratorRepository.getAdministratorDetailByUserId(createdAdministratorUserDetails[0].user_id)

    expect(getAdministratorDetailsByUserId.error).toEqual(null)
    expect(getAdministratorDetailsByUserId.hasError).toEqual(false)

    expect(
      getAdministratorDetailsByUserId.value &&
        (({ firstName, lastName, administratorLMSId }) => ({ firstName, lastName, administratorLMSId }))(getAdministratorDetailsByUserId.value),
    ).toEqual(
      (({ first_name, last_name, administrator_lms_id }) => ({ firstName: first_name, lastName: last_name, administratorLMSId: administrator_lms_id }))(
        createdAdministratorUserDetails[0],
      ),
    )
  })

  test('success deactivateDistrictAdministrators ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    //before deactivating the administrator

    const deactivateDistrictAdministratorsResult = await administratorRepository.deactivateDistrictAdministrators(administrator1)

    expect(deactivateDistrictAdministratorsResult.error).toEqual(null)
    expect(deactivateDistrictAdministratorsResult.hasError).toEqual(false)
    expect(deactivateDistrictAdministratorsResult.value?.message).toBe('ok')

    // after updating the administrator varifying the is_deactivate field
    const afterUpdatingAdministrator = await administratorDistrictTypeormRepository.find({
      where: {
        id: administrator1,
      },
    })

    expect(afterUpdatingAdministrator[0].is_deactivated).toBe(true)
  })

  test('success deleteDistrictAdministrators ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)

    const deactivateDistrictAdministratorsResult = await administratorRepository.deleteDistrictAdministrators(administrator1)

    expect(deactivateDistrictAdministratorsResult.error).toEqual(null)
    expect(deactivateDistrictAdministratorsResult.hasError).toEqual(false)
    expect(deactivateDistrictAdministratorsResult.value?.message).toBe('ok')

    // after deleteing the administrator varifying the delete event
    const afterUpdatingAdministrator = await administratorDistrictTypeormRepository.find({
      where: {
        id: administrator1,
      },
    })

    expect(afterUpdatingAdministrator[0]).toBe(undefined)
  })

  test('success updateAdministrator ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    // const createdAdministratorUserDetails = await administratorDistrictTypeormRepository.find({
    //   where: {
    //     id: administrator1,
    //   },
    // })

    const updateResult = await administratorRepository.updateAdministratorById(
      {
        id: 'user-id',
        role: 'internalOperator',
      },
      administrator1,
      {
        email: 'changedEmail',
        administratorLMSId: 'changedLmsId',
        firstName: 'changedFirstName',
        lastName: 'changedLastName',
      },
    )

    expect(updateResult.error).toBe(null)
    expect(updateResult.hasError).toBe(false)
    expect(updateResult.value).toStrictEqual({
      email: 'changedEmail',
      administratorLMSId: 'changedLmsId',
      firstName: 'changedFirstName',
      lastName: 'changedLastName',
    })
  })
})
