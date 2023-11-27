import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'
import { StudentGroupTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroup'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { StudentGroup } from '../../domain/entities/StudentGroup'
import { StudentGroupRepository } from './StudentGroupRepository'

let createdDistrictId: string
let createdOrganizationId: string
let anotherOrganizationId: string

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  //create district
  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const createDistrictResult = await districtRepository.save([
    {
      name: 'district-name1',
    },
  ])

  createdDistrictId = createDistrictResult[0].id

  //create organization
  const organizationRepository = appDataSource.getRepository(OrganizationTypeormEntity)
  const createOrganizationResult = await organizationRepository.save([
    {
      district_id: createdDistrictId,
      name: 'organization-name1',
    },
    {
      district_id: createdDistrictId,
      name: 'organization-name2',
    },
  ])

  createdOrganizationId = createOrganizationResult[0].id
  anotherOrganizationId = createOrganizationResult[1].id
})

afterEach(teardownEnvironment)

describe('test StudentGroupRepository for Classlink', () => {
  const studentGroupId1 = randomUUID()
  const studentGroupId2 = randomUUID()
  const studentGroupId3 = randomUUID()

  test('success getAllByOrganizationId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentGroupTypeormRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

    await studentGroupTypeormRepository.save<DeepPartial<StudentGroupTypeormEntity>>([
      {
        id: studentGroupId1,
        name: 'StudentGroup 1',
        organization_id: { id: createdOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-1',
        grade: 'student-group-grade-1',
      },
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organization_id: { id: createdOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
      {
        id: studentGroupId3,
        name: 'StudentGroup 3',
        organization_id: { id: anotherOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-3',
        grade: 'student-group-grade-3',
      },
    ])

    const studentGroupRepository = new StudentGroupRepository(appDataSource)
    const getStudentGroups = await studentGroupRepository.getAllByOrganizationId(createdOrganizationId)

    if (getStudentGroups.hasError) {
      throw new Error(`studentGroupRepository.getAllByOrganizationId failed ${JSON.stringify(getStudentGroups.error)}`)
    }
    expect(
      getStudentGroups.value.map((e) => ({
        id: e.id,
        name: e.name,
        organizationId: e.organizationId,
        classlinkTenantId: e.classlinkTenantId,
        studentGroupLmsId: e.studentGroupLmsId,
        grade: e.grade,
      })),
    ).toEqual<StudentGroup[]>([
      {
        id: studentGroupId1,
        name: 'StudentGroup 1',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-1',
        grade: 'student-group-grade-1',
      },
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
    ])
  })

  test('success createStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentGroupRepository = new StudentGroupRepository(appDataSource)
    const studentGroupInfo: StudentGroup[] = [
      {
        id: studentGroupId1,
        name: 'StudentGroup 1',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-1',
        grade: 'student-group-grade-1',
      },
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
      {
        id: studentGroupId3,
        name: 'StudentGroup 3',
        organizationId: anotherOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-3',
        grade: 'student-group-grade-3',
      },
    ]
    const createdStudentGroups = await studentGroupRepository.createStudentGroups(studentGroupInfo)

    if (createdStudentGroups.hasError) {
      throw new Error(`studentGroupRepository.createStudentGroups failed ${JSON.stringify(createdStudentGroups.error)}`)
    }
    expect(createdStudentGroups.value[0].id).toBeTruthy()
    expect(createdStudentGroups.value[1].id).toBeTruthy()
    expect(createdStudentGroups.value[2].id).toBeTruthy()

    const studentGroupTypeormRepository = appDataSource.getRepository(StudentGroupTypeormEntity)
    const findStudentGroupsResult = await studentGroupTypeormRepository.find({ relations: ['organization_id'] })

    expect(
      findStudentGroupsResult.map<StudentGroup>((e) => ({
        id: e.id,
        name: e.name,
        organizationId: e.organization_id.id,
        classlinkTenantId: e.classlink_tenant_id,
        studentGroupLmsId: e.student_group_lms_id,
        grade: e.grade,
      })),
    ).toEqual<StudentGroup[]>([
      {
        id: studentGroupId1,
        name: 'StudentGroup 1',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-1',
        grade: 'student-group-grade-1',
      },
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
      {
        id: studentGroupId3,
        name: 'StudentGroup 3',
        organizationId: anotherOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-3',
        grade: 'student-group-grade-3',
      },
    ])
  })

  test('success updateStudentGroup ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentGroupTypeormRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

    await studentGroupTypeormRepository.save<DeepPartial<StudentGroupTypeormEntity>>([
      {
        id: studentGroupId1,
        name: 'StudentGroup 1',
        organization_id: { id: createdOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-1',
        grade: 'student-group-grade-1',
      },
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organization_id: { id: createdOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
      {
        id: studentGroupId3,
        name: 'StudentGroup 3',
        organization_id: { id: anotherOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-3',
        grade: 'student-group-grade-3',
      },
    ])

    const studentGroupRepository = new StudentGroupRepository(appDataSource)

    const updateStudentGroups = await studentGroupRepository.updateStudentGroups([
      {
        id: studentGroupId1,
        organizationId: createdOrganizationId,
        name: 'changed-name-1',
        grade: 'changed-grade-1',
        studentGroupLmsId: 'changed-studentGroupLmsId-1',
        classlinkTenantId: 'changed-classlinkTenantId-1',
      },
      {
        id: studentGroupId2,
        organizationId: anotherOrganizationId,
        name: 'changed-name-2',
        grade: 'changed-grade-2',
        studentGroupLmsId: 'changed-studentGroupLmsId-2',
        classlinkTenantId: 'changed-classlinkTenantId-2',
      },
    ])

    expect(updateStudentGroups.value).toEqual(undefined)
    expect(updateStudentGroups.error).toEqual(null)
    expect(updateStudentGroups.hasError).toEqual(false)

    const findStudentGroupsResult = await studentGroupTypeormRepository.find({ relations: ['organization_id'] })
    const mappedStudentGroupsResult = findStudentGroupsResult.map((e) => ({
      id: e.id,
      name: e.name,
      organization_id: { id: e.organization_id.id },
      classlink_tenant_id: e.classlink_tenant_id,
      student_group_lms_id: e.student_group_lms_id,
      grade: e.grade,
    }))

    // expect(mappedStudentGroupsResult.find((e) => e.id === studentGroupId1)).toEqual<DeepPartial<StudentGroupTypeormEntity>>({
    //   id: studentGroupId1,
    //   organization_id: { id: createdOrganizationId },
    //   name: 'changed-name-1',
    //   package_id: 'changed-packageId-1',
    //   grade: 'changed-grade-1',
    //   student_group_lms_id: 'changed-studentGroupLmsId-1',
    //   classlink_tenant_id: 'changed-classlinkTenantId-1',
    // })
    expect(mappedStudentGroupsResult.find((e) => e.id === studentGroupId2)).toEqual<DeepPartial<StudentGroupTypeormEntity>>({
      id: studentGroupId2,
      organization_id: { id: anotherOrganizationId },
      name: 'changed-name-2',
      grade: 'changed-grade-2',
      student_group_lms_id: 'changed-studentGroupLmsId-2',
      classlink_tenant_id: 'changed-classlinkTenantId-2',
    })
    expect(mappedStudentGroupsResult.find((e) => e.id === studentGroupId3)).toEqual<DeepPartial<StudentGroupTypeormEntity>>({
      id: studentGroupId3,
      name: 'StudentGroup 3',
      organization_id: { id: anotherOrganizationId },
      classlink_tenant_id: 'tenant-id',
      student_group_lms_id: 'student-group-lms-id-3',
      grade: 'student-group-grade-3',
    })
  })

  test('success delete studentGroup', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentGroupId1 = randomUUID()
    const studentGroupId2 = randomUUID()
    const studentGroupId3 = randomUUID()
    const studentGroupTypeormRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

    await studentGroupTypeormRepository.save<DeepPartial<StudentGroupTypeormEntity>>([
      {
        id: studentGroupId1,
        name: 'StudentGroup 1',
        organization_id: { id: createdOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-1',
        grade: 'student-group-grade-1',
      },
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organization_id: { id: createdOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
      {
        id: studentGroupId3,
        name: 'StudentGroup 3',
        organization_id: { id: anotherOrganizationId },
        classlink_tenant_id: 'tenant-id',
        student_group_lms_id: 'student-group-lms-id-3',
        grade: 'student-group-grade-3',
      },
    ])

    const studentGroupRepository = new StudentGroupRepository(appDataSource)

    const resultDelete = await studentGroupRepository.deleteStudentGroups([studentGroupId1, studentGroupId3])

    expect(resultDelete.value).toEqual(undefined)
    expect(resultDelete.hasError).toEqual(false)
    expect(resultDelete.error).toEqual(null)

    const getResultAfterDeleted = await studentGroupRepository.getAllByOrganizationId(createdOrganizationId)

    if (getResultAfterDeleted.hasError) {
      throw new Error(`studentGroupRepository.getAllByOrganizationId failed ${JSON.stringify(getResultAfterDeleted.error)}`)
    }
    expect(
      getResultAfterDeleted.value.map<StudentGroup>((e) => ({
        id: e.id,
        name: e.name,
        organizationId: e.organizationId,
        classlinkTenantId: e.classlinkTenantId,
        studentGroupLmsId: e.studentGroupLmsId,
        grade: e.grade,
      })),
    ).toEqual<StudentGroup[]>([
      {
        id: studentGroupId2,
        name: 'StudentGroup 2',
        organizationId: createdOrganizationId,
        classlinkTenantId: 'tenant-id',
        studentGroupLmsId: 'student-group-lms-id-2',
        grade: 'student-group-grade-2',
      },
    ])
  })
})
