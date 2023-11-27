import { randomUUID } from 'crypto'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'

import { DistrictTypeormEntity } from '../typeorm/entity/District'

import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { OrganizationsRepository } from './OrganizationRepository'

const createDistrict1: string = randomUUID()
const createdOrganizationId1: string = randomUUID()
const createdOrganizationId2: string = randomUUID()
const createUserId1: string = randomUUID()

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  //create district
  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const createDistrictResult = await districtRepository.save([
    {
      id: createDistrict1,
      name: 'district-name-1',
    },
  ])

  //create organization
  const organizationRepository = appDataSource.getRepository(OrganizationTypeormEntity)

  await organizationRepository.save([
    {
      id: createdOrganizationId1,
      name: 'organization-name-1',
      district_id: createDistrictResult[0].id,
      state_id: 'AL',
      created_user_id: createUserId1,
      organization_lms_id: 'organization-lms-id-1',
    },
    {
      id: createdOrganizationId2,
      name: 'organization-name-2',
      district_id: createDistrictResult[0].id,
      state_id: 'GA',
      created_user_id: createUserId1,
      organization_lms_id: 'organization-lms-id-2',
    },
  ])
})

afterEach(teardownEnvironment)

describe('test OrganizationRepository for Codex', () => {
  test('success getOrganizations', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationsRepository(appDataSource)
    const getOrganizationsResult = await organizationRepository.getOrganizations(createDistrict1, [createdOrganizationId1, createdOrganizationId2])

    expect(
      getOrganizationsResult.value?.map((e) => {
        return {
          district_id: e.districtId,
          state_id: e.stateId,
          created_user_id: e.createdUserId,
          name: e.name,
          id: e.id,
          organization_lms_id: e.organizationLMSId,
        }
      }),
    ).toStrictEqual([
      {
        id: createdOrganizationId1,
        name: 'organization-name-1',
        district_id: createDistrict1,
        state_id: 'AL',
        created_user_id: createUserId1,
        organization_lms_id: 'organization-lms-id-1',
      },
      {
        id: createdOrganizationId2,
        name: 'organization-name-2',
        district_id: createDistrict1,
        state_id: 'GA',
        created_user_id: createUserId1,
        organization_lms_id: 'organization-lms-id-2',
      },
    ])
  })

  test('success getOrganizationByOrganizationLmsId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationsRepository(appDataSource)
    const getOrganizationsResult = await organizationRepository.getOrganizationByOrganizationLmsId('organization-lms-id-1')

    expect({
      id: getOrganizationsResult.value?.id,
      name: getOrganizationsResult.value?.name,
      district_id: getOrganizationsResult.value?.districtId,
      state_id: getOrganizationsResult.value?.stateId,
      created_user_id: getOrganizationsResult.value?.createdUserId,
      organization_lms_id: getOrganizationsResult.value?.organizationLMSId,
    }).toStrictEqual({
      id: createdOrganizationId1,
      name: 'organization-name-1',
      district_id: createDistrict1,
      state_id: 'AL',
      created_user_id: createUserId1,
      organization_lms_id: 'organization-lms-id-1',
    })
    expect(getOrganizationsResult.hasError).toBe(false)
    expect(getOrganizationsResult.error).toBe(null)
  })

  test('success getOrganizationById', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationsRepository(appDataSource)
    const getOrganizationsResult = await organizationRepository.getOrganizationById(createdOrganizationId1)

    expect({
      id: getOrganizationsResult.value?.id,
      name: getOrganizationsResult.value?.name,
      district_id: getOrganizationsResult.value?.districtId,
      state_id: getOrganizationsResult.value?.stateId,
      created_user_id: getOrganizationsResult.value?.createdUserId,
      organization_lms_id: getOrganizationsResult.value?.organizationLMSId,
    }).toStrictEqual({
      id: createdOrganizationId1,
      name: 'organization-name-1',
      district_id: createDistrict1,
      state_id: 'AL',
      created_user_id: createUserId1,
      organization_lms_id: 'organization-lms-id-1',
    })
    expect(getOrganizationsResult.hasError).toBe(false)
    expect(getOrganizationsResult.error).toBe(null)
  })

  test('success createOrganization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationsRepository(appDataSource)
    const createOrganizationResult = await organizationRepository.createOrganization({
      districtId: createDistrict1,
      name: 'create-test',
      stateId: 'AL',
      createdUserId: createUserId1,
      organizationLMSId: 'create-organization-lms-id',
    })
    //checkking after creating
    const organizationTypeORMRepository = appDataSource.getRepository(OrganizationTypeormEntity)
    const createdResult = await organizationTypeORMRepository.find({
      where: {
        name: 'create-test',
        organization_lms_id: 'create-organization-lms-id',
      },
    })

    expect({
      districtId: createdResult[0].district_id,
      name: createdResult[0].name,
      stateId: createdResult[0].state_id,
      createdUserId: createdResult[0].created_user_id,
      organizationLMSId: createdResult[0].organization_lms_id,
    }).toStrictEqual({
      districtId: createDistrict1,
      name: 'create-test',
      stateId: 'AL',
      createdUserId: createUserId1,
      organizationLMSId: 'create-organization-lms-id',
    })
    expect(createOrganizationResult.hasError).toBe(false)
    expect(createOrganizationResult.error).toBe(null)
    expect(createOrganizationResult.value).toBe(undefined)
  })

  test('success updateOrganization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationsRepository(appDataSource)
    const createOrganizationResult = await organizationRepository.updateOrganization(createdOrganizationId1, {
      districtId: createDistrict1,
      name: 'changed-name',
      stateId: 'changed-state-id',
      createdUserId: createUserId1,
      organizationLMSId: 'changed-lms-id',
    })
    //checkking after updating
    const organizationTypeORMRepository = appDataSource.getRepository(OrganizationTypeormEntity)
    const updateResult = await organizationTypeORMRepository.find({
      where: {
        id: createdOrganizationId1,
      },
    })

    expect({
      districtId: updateResult[0].district_id,
      name: updateResult[0].name,
      stateId: updateResult[0].state_id,
      createdUserId: updateResult[0].created_user_id,
      organizationLMSId: updateResult[0].organization_lms_id,
    }).toStrictEqual({
      districtId: createDistrict1,
      name: 'changed-name',
      stateId: 'changed-state-id',
      createdUserId: createUserId1,
      organizationLMSId: 'changed-lms-id',
    })
    expect(createOrganizationResult.hasError).toBe(false)
    expect(createOrganizationResult.error).toBe(null)
    expect(createOrganizationResult.value).toBe(undefined)
  })

  test('success deleteOrganization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationsRepository(appDataSource)
    const createOrganizationResult = await organizationRepository.deleteOrganization(createdOrganizationId1)
    //checkking after deleting
    const organizationTypeORMRepository = appDataSource.getRepository(OrganizationTypeormEntity)
    const deleteResult = await organizationTypeORMRepository.find({
      where: {
        id: createdOrganizationId1,
      },
    })

    expect(deleteResult).toStrictEqual([])
    expect(createOrganizationResult.hasError).toBe(false)
    expect(createOrganizationResult.error).toBe(null)
    expect(createOrganizationResult.value).toBe(undefined)
  })
})
