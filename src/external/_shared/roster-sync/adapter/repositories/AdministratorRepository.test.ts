import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { AdministratorTypeormEntity } from '../../../../../adapter/typeorm/entity/Administrator'
import { AdministratorDistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/AdministratorDistrict'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { Administrator } from '../../domain/entities/Administrator'

import { AdministratorRepository } from './AdministratorRepository'

let createdDistrictId1: string
let createdDistrictId2: string

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  //create district
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
})

afterEach(teardownEnvironment)

describe('test AdministratorRepository for Classlink', () => {
  const administratorId1 = randomUUID()
  const administratorId2 = randomUUID()
  const administratorId3 = randomUUID()

  test('success getAllByDistrictId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)

    await administratorTypeormRepository.save<DeepPartial<AdministratorTypeormEntity>>([
      {
        id: administratorId1,
        user_id: 'administrator-userId-1',
        first_name: 'administrator-firstName-1',
        last_name: 'administrator-lastName-1',
        administrator_lms_id: 'administrator-administratorLMSId-1',
        classlink_tenant_id: 'administrator-classlinkTenantId-1',
      },
      {
        id: administratorId2,
        user_id: 'administrator-userId-2',
        first_name: 'administrator-firstName-2',
        last_name: 'administrator-lastName-2',
        administrator_lms_id: 'administrator-administratorLMSId-2',
        classlink_tenant_id: 'administrator-classlinkTenantId-2',
      },
      {
        id: administratorId3,
        user_id: 'administrator-userId-3',
        first_name: 'administrator-firstName-3',
        last_name: 'administrator-lastName-3',
        administrator_lms_id: 'administrator-administratorLMSId-3',
        classlink_tenant_id: 'administrator-classlinkTenantId-3',
      },
    ])

    const administratorDistrictTypeormRepository = appDataSource.getRepository(AdministratorDistrictTypeormEntity)

    await administratorDistrictTypeormRepository.save<DeepPartial<AdministratorDistrictTypeormEntity>>([
      {
        district: { id: createdDistrictId1 },
        administrator: { id: administratorId1 },
      },
      {
        district: { id: createdDistrictId1 },
        administrator: { id: administratorId2 },
      },
      {
        district: { id: createdDistrictId2 },
        administrator: { id: administratorId3 },
      },
    ])

    const administratorRepository = new AdministratorRepository(appDataSource)
    const getAdministratorsResult1 = await administratorRepository.getAllByDistrictId(createdDistrictId1)

    if (getAdministratorsResult1.hasError) {
      throw new Error(`administratorRepository.getAllByDistrictId failed ${JSON.stringify(getAdministratorsResult1.error)}`)
    }
    expect(
      getAdministratorsResult1.value.map<Administrator>((e) => ({
        id: e.id,
        userId: e.userId,
        firstName: e.firstName,
        lastName: e.lastName,
        administratorLMSId: e.administratorLMSId,
        classlinkTenantId: e.classlinkTenantId,
        isDeactivated: e.isDeactivated,
      })),
    ).toEqual<Administrator[]>([
      {
        id: administratorId1,
        userId: 'administrator-userId-1',
        firstName: 'administrator-firstName-1',
        lastName: 'administrator-lastName-1',
        administratorLMSId: 'administrator-administratorLMSId-1',
        classlinkTenantId: 'administrator-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: administratorId2,
        userId: 'administrator-userId-2',
        firstName: 'administrator-firstName-2',
        lastName: 'administrator-lastName-2',
        administratorLMSId: 'administrator-administratorLMSId-2',
        classlinkTenantId: 'administrator-classlinkTenantId-2',
        isDeactivated: false,
      },
    ])

    const getAdministratorsResult2 = await administratorRepository.getAllByDistrictId(createdDistrictId2)

    if (getAdministratorsResult2.hasError) {
      throw new Error(`administratorRepository.getAllByDistrictId failed ${JSON.stringify(getAdministratorsResult2.error)}`)
    }
    expect(
      getAdministratorsResult2.value.map<Administrator>((e) => ({
        id: e.id,
        userId: e.userId,
        firstName: e.firstName,
        lastName: e.lastName,
        administratorLMSId: e.administratorLMSId,
        classlinkTenantId: e.classlinkTenantId,
        isDeactivated: e.isDeactivated,
      })),
    ).toEqual<Administrator[]>([
      {
        id: administratorId3,
        userId: 'administrator-userId-3',
        firstName: 'administrator-firstName-3',
        lastName: 'administrator-lastName-3',
        administratorLMSId: 'administrator-administratorLMSId-3',
        classlinkTenantId: 'administrator-classlinkTenantId-3',
        isDeactivated: false,
      },
    ])
  })

  test('success createAdministrator', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const administratorInfo: Administrator[] = [
      {
        id: administratorId1,
        userId: 'administrator-userId-1',
        firstName: 'administrator-firstName-1',
        lastName: 'administrator-lastName-1',
        administratorLMSId: 'administrator-administratorLMSId-1',
        classlinkTenantId: 'administrator-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: administratorId2,
        userId: 'administrator-userId-2',
        firstName: 'administrator-firstName-2',
        lastName: 'administrator-lastName-2',
        administratorLMSId: 'administrator-administratorLMSId-2',
        classlinkTenantId: 'administrator-classlinkTenantId-2',
        isDeactivated: false,
      },
    ]
    const createdAdministrators = await administratorRepository.createAdministrators(administratorInfo)

    if (createdAdministrators.hasError) {
      throw new Error(`administratorRepository.createAdministrators failed ${JSON.stringify(createdAdministrators.error)}`)
    }
    expect(createdAdministrators.value[0].id).toBeTruthy()
    expect(createdAdministrators.value[1].id).toBeTruthy()

    const administratorTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)
    const findAdministratorsResult = await administratorTypeormRepository.find()

    expect(
      findAdministratorsResult.map((e) => ({
        id: e.id,
        userId: e.user_id,
        firstName: e.first_name,
        lastName: e.last_name,
        administratorLMSId: e.administrator_lms_id,
        classlinkTenantId: e.classlink_tenant_id,
        isDeactivated: e.is_deactivated,
      })),
    ).toEqual<Administrator[]>([
      {
        id: administratorId1,
        userId: 'administrator-userId-1',
        firstName: 'administrator-firstName-1',
        lastName: 'administrator-lastName-1',
        administratorLMSId: 'administrator-administratorLMSId-1',
        classlinkTenantId: 'administrator-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: administratorId2,
        userId: 'administrator-userId-2',
        firstName: 'administrator-firstName-2',
        lastName: 'administrator-lastName-2',
        administratorLMSId: 'administrator-administratorLMSId-2',
        classlinkTenantId: 'administrator-classlinkTenantId-2',
        isDeactivated: false,
      },
    ])
  })

  test('success updateAdministrator ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)

    await administratorTypeormRepository.save<DeepPartial<AdministratorTypeormEntity>>([
      {
        id: administratorId1,
        user_id: 'administrator-userId-1',
        first_name: 'administrator-firstName-1',
        last_name: 'administrator-lastName-1',
        administrator_lms_id: 'administrator-administratorLMSId-1',
        classlink_tenant_id: 'administrator-classlinkTenantId-1',
      },
      {
        id: administratorId2,
        user_id: 'administrator-userId-2',
        first_name: 'administrator-firstName-2',
        last_name: 'administrator-lastName-2',
        administrator_lms_id: 'administrator-administratorLMSId-2',
        classlink_tenant_id: 'administrator-classlinkTenantId-2',
      },
      {
        id: administratorId3,
        user_id: 'administrator-userId-3',
        first_name: 'administrator-firstName-3',
        last_name: 'administrator-lastName-3',
        administrator_lms_id: 'administrator-administratorLMSId-3',
        classlink_tenant_id: 'administrator-classlinkTenantId-3',
      },
    ])

    const administratorRepository = new AdministratorRepository(appDataSource)

    const updateAdministrators = await administratorRepository.updateAdministrators([
      {
        id: administratorId1,
        userId: 'changed-administrator-userId-1',
        firstName: 'changed-administrator-firstName-1',
        lastName: 'changed-administrator-lastName-1',
        administratorLMSId: 'changed-administrator-administratorLMSId-1',
        classlinkTenantId: 'changed-administrator-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: administratorId2,
        userId: 'changed-administrator-userId-2',
        firstName: 'changed-administrator-firstName-2',
        lastName: 'changed-administrator-lastName-2',
        administratorLMSId: 'changed-administrator-administratorLMSId-2',
        classlinkTenantId: 'changed-administrator-classlinkTenantId-2',
        isDeactivated: false,
      },
    ])

    expect(updateAdministrators.value).toEqual(undefined)
    expect(updateAdministrators.error).toEqual(null)
    expect(updateAdministrators.hasError).toEqual(false)

    const findAdministratorsResult = await administratorTypeormRepository.find()
    const mapped = findAdministratorsResult.map<Administrator>((e) => ({
      id: e.id,
      userId: e.user_id,
      firstName: e.first_name,
      lastName: e.last_name,
      administratorLMSId: e.administrator_lms_id,
      classlinkTenantId: e.classlink_tenant_id,
      isDeactivated: e.is_deactivated,
    }))

    expect(mapped.find((e) => e.id === administratorId1)).toEqual<Administrator>({
      id: administratorId1,
      userId: 'changed-administrator-userId-1',
      firstName: 'changed-administrator-firstName-1',
      lastName: 'changed-administrator-lastName-1',
      administratorLMSId: 'changed-administrator-administratorLMSId-1',
      classlinkTenantId: 'changed-administrator-classlinkTenantId-1',
      isDeactivated: false,
    })
    expect(mapped.find((e) => e.id === administratorId2)).toEqual<Administrator>({
      id: administratorId2,
      userId: 'changed-administrator-userId-2',
      firstName: 'changed-administrator-firstName-2',
      lastName: 'changed-administrator-lastName-2',
      administratorLMSId: 'changed-administrator-administratorLMSId-2',
      classlinkTenantId: 'changed-administrator-classlinkTenantId-2',
      isDeactivated: false,
    })
    expect(mapped.find((e) => e.id === administratorId3)).toEqual<Administrator>({
      id: administratorId3,
      userId: 'administrator-userId-3',
      firstName: 'administrator-firstName-3',
      lastName: 'administrator-lastName-3',
      administratorLMSId: 'administrator-administratorLMSId-3',
      classlinkTenantId: 'administrator-classlinkTenantId-3',
      isDeactivated: false,
    })
  })

  test('success delete administrator', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorTypeormRepository = appDataSource.getRepository(AdministratorTypeormEntity)

    await administratorTypeormRepository.save<DeepPartial<AdministratorTypeormEntity>>([
      {
        id: administratorId1,
        user_id: 'administrator-userId-1',
        first_name: 'administrator-firstName-1',
        last_name: 'administrator-lastName-1',
        administrator_lms_id: 'administrator-administratorLMSId-1',
        classlink_tenant_id: 'administrator-classlinkTenantId-1',
      },
      {
        id: administratorId2,
        user_id: 'administrator-userId-2',
        first_name: 'administrator-firstName-2',
        last_name: 'administrator-lastName-2',
        administrator_lms_id: 'administrator-administratorLMSId-2',
        classlink_tenant_id: 'administrator-classlinkTenantId-2',
      },
      {
        id: administratorId3,
        user_id: 'administrator-userId-3',
        first_name: 'administrator-firstName-3',
        last_name: 'administrator-lastName-3',
        administrator_lms_id: 'administrator-administratorLMSId-3',
        classlink_tenant_id: 'administrator-classlinkTenantId-3',
      },
    ])

    const administratorRepository = new AdministratorRepository(appDataSource)

    const resultDelete = await administratorRepository.deleteAdministrators([administratorId1, administratorId3])

    expect(resultDelete.value).toEqual(undefined)
    expect(resultDelete.hasError).toEqual(false)
    expect(resultDelete.error).toEqual(null)

    const findAdministratorsAfterDeletedResult = await administratorTypeormRepository.find()
    const mappedFindAdministratorsAfterDeletedResult = findAdministratorsAfterDeletedResult.map<Administrator>((e) => ({
      id: e.id,
      userId: e.user_id,
      firstName: e.first_name,
      lastName: e.last_name,
      administratorLMSId: e.administrator_lms_id,
      classlinkTenantId: e.classlink_tenant_id,
      isDeactivated: e.is_deactivated,
    }))

    expect(mappedFindAdministratorsAfterDeletedResult.find((e) => e.id === administratorId1)?.isDeactivated).toEqual(true)
    expect(mappedFindAdministratorsAfterDeletedResult.find((e) => e.id === administratorId2)).toEqual<Administrator>({
      id: administratorId2,
      userId: 'administrator-userId-2',
      firstName: 'administrator-firstName-2',
      lastName: 'administrator-lastName-2',
      administratorLMSId: 'administrator-administratorLMSId-2',
      classlinkTenantId: 'administrator-classlinkTenantId-2',
      isDeactivated: false,
    })
    expect(mappedFindAdministratorsAfterDeletedResult.find((e) => e.id === administratorId3)?.isDeactivated).toEqual(true)
  })
})
