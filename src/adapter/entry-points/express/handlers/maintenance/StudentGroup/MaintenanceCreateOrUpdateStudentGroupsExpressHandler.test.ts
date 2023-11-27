import { randomUUID } from 'crypto'
import { StudentGroupPackageAssignment } from '../../../../../../domain/entities/codex/StudentGroupPackageAssignment'
import { MaintenanceStudentGroup } from '../../../../../../domain/entities/maintenance/StudentGroup'
import { OrganizationTypeormEntity } from '../../../../../typeorm/entity/Organization'
import { StudentGroupTypeormEntity } from '../../../../../typeorm/entity/StudentGroup'
import { StudentGroupPackageAssignmentTypeormEntity } from '../../../../../typeorm/entity/StudentGroupPackageAssignment'
import { packagesMapById } from '../../../../../typeorm/hardcoded-data/Pacakges/Packages'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../_testShared/testUtilities'
import { MaintenanceCreateOrUpdateStudentGroupsExpressHandler } from './MaintenanceCreateOrUpdateStudentGroupsExpressHandler'

const organizationId1 = randomUUID()
const studentGroupId1 = randomUUID()
const studentGroupId2 = randomUUID()

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  const organizationRepository = appDataSource.getRepository(OrganizationTypeormEntity)

  await organizationRepository.save({
    id: organizationId1,
    district_id: 'district-id',
    name: 'organization-name',
  })
})

afterEach(teardownEnvironment)

describe('test MaintenanceCreateOrUpdateStudentGroupsExpressHandler', () => {
  test('success getStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is not ready')
    }

    //
    // setup
    //
    const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)
    const studentGroupPackageAssignmentTypeormEntity = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

    //
    // test
    //
    const getStudentGroup = new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(appDataSource).getStudentGroup

    const getStudentGroupResult1 = await getStudentGroup(studentGroupId1)

    if (getStudentGroupResult1.hasError) {
      throw new Error(`getStudentGroupResult1 failed ${JSON.stringify(getStudentGroupResult1.error)}`)
    }
    expect(getStudentGroupResult1.value).toBeNull()

    const createdStudentGroups = await studentGroupRepository.save([
      {
        id: studentGroupId1,
        organization_id: { id: organizationId1 },
        name: 'studentGroup-name-1',
        package_id: 'codeillusion-package-basic-full-standard',
        grade: 'studentGroup-grade-1',
      },
      {
        id: studentGroupId2,
        organization_id: { id: organizationId1 },
        name: 'studentGroup-name-2',
        package_id: 'codeillusion-package-basic-full-standard',
        grade: 'studentGroup-grade-2',
      },
    ])

    await studentGroupPackageAssignmentTypeormEntity.save([
      {
        student_group_id: createdStudentGroups[0].id,
        package_category_id: 'codeillusion',
        package_id: 'codeillusion-package-basic-full-standard',
      },
      {
        student_group_id: createdStudentGroups[1].id,
        package_category_id: 'codeillusion',
        package_id: 'codeillusion-package-basic-full-standard',
      },
    ])

    const getStudentGroupResult2 = await getStudentGroup(studentGroupId1)

    if (getStudentGroupResult2.hasError) {
      throw new Error(`getStudentGroupResult2 failed ${JSON.stringify(getStudentGroupResult2.error)}`)
    }
    expect(getStudentGroupResult2.value).toEqual<MaintenanceStudentGroup>({
      id: studentGroupId1,
      organizationId: organizationId1,
      name: 'studentGroup-name-1',
      grade: 'studentGroup-grade-1',
      codeillusionPackageId: 'codeillusion-package-basic-full-standard',
      csePackageId: null,
      studentGroupLmsId: null,
    })
  })

  test('success createStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is not ready')
    }

    //
    // setup
    //
    const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

    const createStudentGroup = new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(appDataSource).createStudentGroup
    const createStudentGroupResult = await createStudentGroup({
      organizationId: organizationId1,
      name: 'studentGroup-name-1',
      grade: 'studentGroup-grade-1',
      codeillusionPackageId: 'codeillusion-package-basic-full-standard',
      csePackageId: null,
      studentGroupLmsId: null,
    })

    if (createStudentGroupResult.hasError) {
      throw new Error(`createStudentGroupResult failed ${JSON.stringify(createStudentGroupResult.error)}`)
    }

    const createdStudentGroups = await studentGroupRepository.find()

    expect(createdStudentGroups.length).toEqual(1)

    const createdStudentGroup = createdStudentGroups[0]

    expect(createdStudentGroup?.name).toEqual('studentGroup-name-1')
    expect(createdStudentGroup?.grade).toEqual('studentGroup-grade-1')

    const studentGroupPackageAssignmentTypeormEntity = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)
    const findAssignPackage = await studentGroupPackageAssignmentTypeormEntity.findOneBy({
      student_group_id: createdStudentGroup.id,
    })

    if (!findAssignPackage) {
      throw new Error(`Failed to assign package to studentGroupId :${createdStudentGroup.id}`)
    }

    expect(findAssignPackage.student_group_id).toEqual(createdStudentGroup.id)
    expect(findAssignPackage.package_id).toEqual('codeillusion-package-basic-full-standard')
    expect(findAssignPackage.package_category_id).toEqual(packagesMapById['codeillusion-package-basic-full-standard'].packageCategoryId)
  })

  test('success updateStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is not ready')
    }

    //
    // setup
    //
    const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

    await studentGroupRepository.save({
      id: studentGroupId1,
      organization_id: { id: organizationId1 },
      name: 'studentGroup-name-1',
      grade: 'studentGroup-grade-1',
    })

    const updateStudentGroup = new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(appDataSource).updateStudentGroup
    const updateStudentGroupResult = await updateStudentGroup({
      id: studentGroupId1,
      organizationId: organizationId1,
      name: 'studentGroup-name-1-updated',
      grade: 'studentGroup-grade-1-updated',
      codeillusionPackageId: 'codeillusion-package-basic-half-premium-heroic',
      csePackageId: null,
      studentGroupLmsId: null,
    })

    if (updateStudentGroupResult.hasError) {
      throw new Error(`updateStudentGroupResult failed ${JSON.stringify(updateStudentGroupResult.error)}`)
    }

    const createdStudentGroups = await studentGroupRepository.find()

    expect(createdStudentGroups.length).toEqual(1)

    const createdStudentGroup = createdStudentGroups[0]

    expect(createdStudentGroup?.name).toEqual('studentGroup-name-1-updated')
    expect(createdStudentGroup?.grade).toEqual('studentGroup-grade-1-updated')

    const studentGroupPackageAssignmentTypeormEntity = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)
    const findAssignPackage = await studentGroupPackageAssignmentTypeormEntity.findOneBy({
      student_group_id: studentGroupId1,
    })

    if (!findAssignPackage) {
      throw new Error(`Failed to assign package to studentGroupId :${studentGroupId1}`)
    }
    expect(findAssignPackage.student_group_id).toEqual(studentGroupId1)
    expect(findAssignPackage.package_id).toEqual('codeillusion-package-basic-half-premium-heroic')
    expect(findAssignPackage.package_category_id).toEqual(packagesMapById['codeillusion-package-basic-half-premium-heroic'].packageCategoryId)
  })

  test('success getStudentGroupPackageAssignmentsByStudentGroupId', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is not ready')
    }

    //
    // setup
    //
    const studentGroupPackageAssignmentRepository = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

    await studentGroupPackageAssignmentRepository.save([
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-1',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-2',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-2',
        student_group_id: studentGroupId2,
      },
    ])

    const getStudentGroupPackageAssignmentsByStudentGroupId = new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(appDataSource)
      .getStudentGroupPackageAssignmentsByStudentGroupId
    const getStudentGroupPackageAssignmentsByStudentGroupIdResult = await getStudentGroupPackageAssignmentsByStudentGroupId(studentGroupId1)

    if (getStudentGroupPackageAssignmentsByStudentGroupIdResult.hasError) {
      throw new Error(
        `getStudentGroupPackageAssignmentsByStudentGroupIdResult failed ${JSON.stringify(getStudentGroupPackageAssignmentsByStudentGroupIdResult.error)}`,
      )
    }
    expect(getStudentGroupPackageAssignmentsByStudentGroupIdResult.value).toEqual<StudentGroupPackageAssignment[]>([
      {
        packageCategoryId: 'codeillusion',
        packageId: 'studentGroup-packageId-1',
        studentGroupId: studentGroupId1,
      },
      {
        packageCategoryId: 'codeillusion',
        packageId: 'studentGroup-packageId-2',
        studentGroupId: studentGroupId1,
      },
    ])
  })

  test('success createStudentGroupPackageAssignment', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is not ready')
    }

    //
    // setup
    //
    const studentGroupPackageAssignmentRepository = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

    const createStudentGroupPackageAssignment = new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(appDataSource).createStudentGroupPackageAssignment
    const createStudentGroupPackageAssignmentResult = await createStudentGroupPackageAssignment({
      packageCategoryId: 'codeillusion',
      packageId: 'studentGroup-packageId-1',
      studentGroupId: studentGroupId1,
    })

    if (createStudentGroupPackageAssignmentResult.hasError) {
      throw new Error(`createStudentGroupPackageAssignmentResult failed ${JSON.stringify(createStudentGroupPackageAssignmentResult.error)}`)
    }

    const createdstudentGroupPackageAssignments = await studentGroupPackageAssignmentRepository.find()

    expect(createdstudentGroupPackageAssignments.length).toEqual(1)

    const createdstudentGroupPackageAssignment = createdstudentGroupPackageAssignments[0]

    expect(createdstudentGroupPackageAssignment.package_category_id).toEqual('codeillusion')
    expect(createdstudentGroupPackageAssignment.package_id).toEqual('studentGroup-packageId-1')
    expect(createdstudentGroupPackageAssignment.student_group_id).toEqual(studentGroupId1)
  })

  test('success deleteStudentGroupPackageAssignment', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is not ready')
    }

    //
    // setup
    //
    const studentGroupPackageAssignmentRepository = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

    await studentGroupPackageAssignmentRepository.save([
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-1',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'cse',
        package_id: 'studentGroup-packageId-1',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-2',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-2',
        student_group_id: studentGroupId2,
      },
    ])

    const deleteStudentGroupPackageAssignment = new MaintenanceCreateOrUpdateStudentGroupsExpressHandler(appDataSource).deleteStudentGroupPackageAssignment
    const deleteStudentGroupPackageAssignmentResult = await deleteStudentGroupPackageAssignment({
      packageCategoryId: 'codeillusion',
      packageId: 'studentGroup-packageId-1',
      studentGroupId: studentGroupId1,
    })

    if (deleteStudentGroupPackageAssignmentResult.hasError) {
      throw new Error(`deleteStudentGroupPackageAssignmentResult failed ${JSON.stringify(deleteStudentGroupPackageAssignmentResult.error)}`)
    }

    const createdstudentGroupPackageAssignments = await studentGroupPackageAssignmentRepository.find()

    expect(createdstudentGroupPackageAssignments.length).toEqual(3)
    for (const testCase of [
      {
        package_category_id: 'cse',
        package_id: 'studentGroup-packageId-1',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-2',
        student_group_id: studentGroupId1,
      },
      {
        package_category_id: 'codeillusion',
        package_id: 'studentGroup-packageId-2',
        student_group_id: studentGroupId2,
      },
    ]) {
      const createdstudentGroupPackageAssignment = createdstudentGroupPackageAssignments.find(
        (e) =>
          e.package_category_id === testCase.package_category_id && e.package_id === testCase.package_id && e.student_group_id === testCase.student_group_id,
      )

      if (!createdstudentGroupPackageAssignment) {
        throw new Error(`createdstudentGroupPackageAssignment for ${JSON.stringify(testCase)} not detected`)
      }
      expect(createdstudentGroupPackageAssignment.package_category_id).toEqual(testCase.package_category_id)
      expect(createdstudentGroupPackageAssignment.package_id).toEqual(testCase.package_id)
      expect(createdstudentGroupPackageAssignment.student_group_id).toEqual(testCase.student_group_id)
    }
  })
})
