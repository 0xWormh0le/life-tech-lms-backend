import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { Organization } from '../../domain//entities/Organization'
import { OrganizationRepository } from './OrganizationRepository'

let createdDistrictId: string

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  //create district
  const createDistrictResult = await districtRepository.save([
    {
      name: 'demo-name1',
    },
  ])

  createdDistrictId = createDistrictResult[0].id
})

afterEach(teardownEnvironment)

describe('test OrganizationRepository for Classlink', () => {
  const organizationId1 = randomUUID()
  const organizationId2 = randomUUID()
  const organizationId3 = randomUUID()

  test('success getAllByDistrictId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const anotherDistrictId = randomUUID()
    const organizationTypeormRepository = appDataSource.getRepository(OrganizationTypeormEntity)

    await organizationTypeormRepository.save<DeepPartial<OrganizationTypeormEntity>>([
      {
        id: organizationId1,
        name: 'Organization 1',
        district_id: createdDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-1',
      },
      {
        id: organizationId2,
        name: 'Organization 2',
        district_id: createdDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-2',
      },
      {
        id: organizationId3,
        name: 'Organization 3',
        district_id: anotherDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-3',
      },
    ])

    const organizationRepository = new OrganizationRepository(appDataSource)
    const getOrganizations = await organizationRepository.getAllByDistrictId(createdDistrictId)

    if (getOrganizations.hasError) {
      throw new Error(`organizationRepository.getAllByDistrictId failed ${JSON.stringify(getOrganizations.error)}`)
    }
    expect(
      getOrganizations.value.map((e) => ({
        id: e.id,
        name: e.name,
        districtId: e.districtId,
        classlinkTenantId: e.classlinkTenantId,
        organizationLMSId: e.organizationLMSId,
      })),
    ).toEqual<Organization[]>([
      {
        id: organizationId1,
        name: 'Organization 1',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-1',
      },
      {
        id: organizationId2,
        name: 'Organization 2',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-2',
      },
    ])
  })

  test('success createOrganization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const organizationRepository = new OrganizationRepository(appDataSource)
    const organizationInfo: Organization[] = [
      {
        id: organizationId1,
        name: 'Sunrise',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id',
      },
      {
        id: organizationId2,
        name: 'Sunrise1',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-1',
      },
      {
        id: organizationId3,
        name: 'Sunrise2',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-2',
      },
    ]
    const createdOrganizations = await organizationRepository.createOrganizations(organizationInfo)

    if (createdOrganizations.hasError) {
      throw new Error(`organizationRepository.createOrganizations failed ${JSON.stringify(createdOrganizations.error)}`)
    }
    expect(createdOrganizations.value[0].id).toBeTruthy()
    expect(createdOrganizations.value[1].id).toBeTruthy()
    expect(createdOrganizations.value[2].id).toBeTruthy()

    const organizationTypeormRepository = appDataSource.getRepository(OrganizationTypeormEntity)
    const findOrganizationsResult = await organizationTypeormRepository.find()

    expect(
      findOrganizationsResult.map((e) => ({
        id: e.id,
        name: e.name,
        districtId: e.district_id,
        classlinkTenantId: e.classlink_tenant_id,
        organizationLMSId: e.organization_lms_id,
      })),
    ).toEqual<Organization[]>([
      {
        id: organizationId1,
        name: 'Sunrise',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id',
      },
      {
        id: organizationId2,
        name: 'Sunrise1',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-1',
      },
      {
        id: organizationId3,
        name: 'Sunrise2',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-2',
      },
    ])
  })

  test('success updateOrganization ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const anotherDistrictId = randomUUID()
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const organizationId3 = randomUUID()
    const organizationTypeormRepository = appDataSource.getRepository(OrganizationTypeormEntity)

    await organizationTypeormRepository.save<DeepPartial<OrganizationTypeormEntity>>([
      {
        id: organizationId1,
        name: 'Organization 1',
        district_id: createdDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-1',
      },
      {
        id: organizationId2,
        name: 'Organization 2',
        district_id: createdDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-2',
      },
      {
        id: organizationId3,
        name: 'Organization 3',
        district_id: anotherDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-3',
      },
    ])

    const organizationRepository = new OrganizationRepository(appDataSource)

    const updateOrganizations = await organizationRepository.updateOrganizations([
      {
        id: organizationId1,
        classlinkTenantId: 'changedTenantId',
        districtId: createdDistrictId,
        name: 'changedName1',
        organizationLMSId: 'changedLmsId1',
      },
      {
        id: organizationId2,
        classlinkTenantId: 'changedTenantId',
        districtId: createdDistrictId,
        name: 'changedName2',
        organizationLMSId: 'changedLmsId2',
      },
    ])

    expect(updateOrganizations.value).toEqual(undefined)
    expect(updateOrganizations.error).toEqual(null)
    expect(updateOrganizations.hasError).toEqual(false)

    const findOrganizationsResult = await organizationTypeormRepository.find()
    const mapped = findOrganizationsResult.map((e) => ({
      id: e.id,
      name: e.name,
      district_id: e.district_id,
      classlink_tenant_id: e.classlink_tenant_id,
      organization_lms_id: e.organization_lms_id,
    }))

    expect(mapped.find((e) => e.id === organizationId1)).toEqual<
      Pick<OrganizationTypeormEntity, 'id' | 'name' | 'district_id' | 'classlink_tenant_id' | 'organization_lms_id'>
    >({
      id: organizationId1,
      classlink_tenant_id: 'changedTenantId',
      district_id: createdDistrictId,
      name: 'changedName1',
      organization_lms_id: 'changedLmsId1',
    })
    expect(mapped.find((e) => e.id === organizationId2)).toEqual<
      Pick<OrganizationTypeormEntity, 'id' | 'name' | 'district_id' | 'classlink_tenant_id' | 'organization_lms_id'>
    >({
      id: organizationId2,
      classlink_tenant_id: 'changedTenantId',
      district_id: createdDistrictId,
      name: 'changedName2',
      organization_lms_id: 'changedLmsId2',
    })
    expect(mapped.find((e) => e.id === organizationId3)).toEqual<
      Pick<OrganizationTypeormEntity, 'id' | 'name' | 'district_id' | 'classlink_tenant_id' | 'organization_lms_id'>
    >({
      id: organizationId3,
      name: 'Organization 3',
      district_id: anotherDistrictId,
      classlink_tenant_id: 'tenant-id',
      organization_lms_id: 'organization-lms-id-3',
    })
  })

  test('success delete organization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const anotherDistrictId = randomUUID()
    const organizationTypeormRepository = appDataSource.getRepository(OrganizationTypeormEntity)

    await organizationTypeormRepository.save<DeepPartial<OrganizationTypeormEntity>>([
      {
        id: organizationId1,
        name: 'Organization 1',
        district_id: createdDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-1',
      },
      {
        id: organizationId2,
        name: 'Organization 2',
        district_id: createdDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-2',
      },
      {
        id: organizationId3,
        name: 'Organization 3',
        district_id: anotherDistrictId,
        classlink_tenant_id: 'tenant-id',
        organization_lms_id: 'organization-lms-id-3',
      },
    ])

    const organizationRepository = new OrganizationRepository(appDataSource)

    const resultDelete = await organizationRepository.deleteOrganizations([organizationId1, organizationId3])

    expect(resultDelete.value).toEqual(undefined)
    expect(resultDelete.hasError).toEqual(false)
    expect(resultDelete.error).toEqual(null)

    const getResultAfterDeleted = await organizationRepository.getAllByDistrictId(createdDistrictId)

    if (getResultAfterDeleted.hasError) {
      throw new Error(`organizationRepository.getAllByDistrictId failed ${JSON.stringify(getResultAfterDeleted.error)}`)
    }
    expect(
      getResultAfterDeleted.value.map((e) => ({
        id: e.id,
        name: e.name,
        districtId: e.districtId,
        classlinkTenantId: e.classlinkTenantId,
        organizationLMSId: e.organizationLMSId,
      })),
    ).toEqual<Organization[]>([
      {
        id: organizationId2,
        name: 'Organization 2',
        districtId: createdDistrictId,
        classlinkTenantId: 'tenant-id',
        organizationLMSId: 'organization-lms-id-2',
      },
    ])
  })
})
