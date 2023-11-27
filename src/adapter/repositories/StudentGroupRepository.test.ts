import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { StudentGroupRepository } from './StudentGroupRepository'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { AdministratorRepository } from './AdministratorRepository'
import { randomUUID } from 'crypto'
import { StudentGroupPackageAssignmentTypeormEntity } from '../typeorm/entity/StudentGroupPackageAssignment'
import { In } from 'typeorm'
import { packagesMapById } from '../typeorm/hardcoded-data/Pacakges/Packages'

let createdOrganizationId1: string

const districtId = randomUUID()
const StudentGroupInfo = [
  {
    name: 'Student-group-1',
    grade: '1',
    studentGroupLmsId: 'student-group-lms-1',
  },
  {
    name: 'Student-group-2',
    grade: '2',
    studentGroupLmsId: 'student-group-lms-2',
  },
]

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('Error appDataSource not found')
  }

  //create district
  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const createDistrictResult = await districtRepository.save([
    {
      id: districtId,
      name: 'district-name-1',
    },
  ])

  //create organization
  const organizationRepository = appDataSource.getRepository(OrganizationTypeormEntity)
  const createOrganizationResult = await organizationRepository.save([
    {
      name: 'organization-name-1',
      district_id: createDistrictResult[0].id,
    },
    {
      name: 'organization-name-2',
      district_id: createDistrictResult[0].id,
    },
  ])

  createdOrganizationId1 = createOrganizationResult[0].id
})

afterEach(teardownEnvironment)

describe('test StudentGroupRepository for Codex', () => {
  test('success createStudentGroup and getStudentGroups', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      { ...StudentGroupInfo[0], packageId: 'codeillusion-package-basic-1-premium-heroic' },
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const createStudentGroupresult1 = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      { ...StudentGroupInfo[1], packageId: 'codeillusion-package-basic-full-standard' },
      createdOrganizationId1,
    )

    if (createStudentGroupresult1.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult1.hasError).toBe(false)
    expect(createStudentGroupresult1.error).toBe(null)
    expect(createStudentGroupresult1.value).toBe(undefined)

    const getStudentGroups = await studentGroupRepostiory.getStudentGroups(createdOrganizationId1)

    if (getStudentGroups.hasError) {
      throw new Error(`Failed to get Student-group`)
    }
    expect(getStudentGroups.hasError).toEqual(false)
    expect(getStudentGroups.error).toEqual(null)

    expect(
      getStudentGroups.value.map((item) => {
        return {
          name: item['name'],
          organizationId: item['organizationId'],
          grade: item['grade'],
          studentGroupLmsId: item['studentGroupLmsId'],
        }
      }),
    ).toEqual(
      StudentGroupInfo.map((item) => {
        return {
          ...item,
          organizationId: createdOrganizationId1,
        }
      }),
    )

    const studentGroupPackageAssignmentTypeormEntity = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

    const findPackage = await studentGroupPackageAssignmentTypeormEntity.find({
      where: {
        student_group_id: In([getStudentGroups.value[0].id, getStudentGroups.value[1].id]),
      },
    })

    if (!findPackage) {
      throw new Error(`Failed to get package id of student groups`)
    }
    expect(findPackage[0].student_group_id).toEqual(getStudentGroups.value[0].id)
    expect(findPackage[0].package_id).toEqual('codeillusion-package-basic-1-premium-heroic')
    expect(findPackage[0].package_category_id).toEqual(packagesMapById['codeillusion-package-basic-1-premium-heroic'].packageCategoryId)

    expect(findPackage[1].student_group_id).toEqual(getStudentGroups.value[1].id)
    expect(findPackage[1].package_id).toEqual('codeillusion-package-basic-full-standard')
    expect(findPackage[1].package_category_id).toEqual(packagesMapById['codeillusion-package-basic-full-standard'].packageCategoryId)
  })

  test('success getById', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      StudentGroupInfo[0],
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const createStudentGroupresult1 = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      StudentGroupInfo[1],
      createdOrganizationId1,
    )

    if (createStudentGroupresult1.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult1.hasError).toBe(false)
    expect(createStudentGroupresult1.error).toBe(null)
    expect(createStudentGroupresult1.value).toBe(undefined)

    const getStudentGroups = await studentGroupRepostiory.getStudentGroups(createdOrganizationId1)

    if (getStudentGroups.hasError) {
      throw new Error(`Failed to get Student-group`)
    }

    const studentGroupId = getStudentGroups.value[0].id
    const getStudentGroupById = await studentGroupRepostiory.getById(studentGroupId)

    expect(getStudentGroupById.hasError).toEqual(false)
    expect(getStudentGroupById.error).toEqual(null)

    if (getStudentGroupById.value) {
      expect({
        name: getStudentGroupById.value['name'],

        organizationId: getStudentGroupById.value['organizationId'],
        grade: getStudentGroupById.value['grade'],
        studentGroupLmsId: getStudentGroupById.value['studentGroupLmsId'],
      }).toEqual({ ...StudentGroupInfo[0], organizationId: createdOrganizationId1 })
    } else {
      expect(getStudentGroupById.value).toEqual(null)
    }
  })

  test('success getDistrictIdByStudentGroupId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      StudentGroupInfo[0],
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const getStudentGroups = await studentGroupRepostiory.getStudentGroups(createdOrganizationId1)

    if (getStudentGroups.hasError) {
      throw new Error(`Failed to get Student-group`)
    }

    const studentGroupId = getStudentGroups.value[0].id
    const getDistrictIdByStudentGroupIdResult = await studentGroupRepostiory.getDistrictIdByStudentGroupId(studentGroupId)

    expect(getDistrictIdByStudentGroupIdResult.hasError).toEqual(false)
    expect(getDistrictIdByStudentGroupIdResult.error).toEqual(null)
    expect(getDistrictIdByStudentGroupIdResult.value).toEqual(districtId)
  })

  test('success getStudentGroupByStudentGroupLMSId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      StudentGroupInfo[0],
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const getStudentGroupByStudentGroupLMSIdResult = await studentGroupRepostiory.getStudentGroupByStudentGroupLMSId('student-group-lms-1')

    expect(getStudentGroupByStudentGroupLMSIdResult.hasError).toEqual(false)
    expect(getStudentGroupByStudentGroupLMSIdResult.error).toEqual(null)

    if (getStudentGroupByStudentGroupLMSIdResult.value) {
      expect({
        name: getStudentGroupByStudentGroupLMSIdResult.value['name'],
        organizationId: getStudentGroupByStudentGroupLMSIdResult.value['organizationId'],
        grade: getStudentGroupByStudentGroupLMSIdResult.value['grade'],
        studentGroupLmsId: getStudentGroupByStudentGroupLMSIdResult.value['studentGroupLmsId'],
      }).toEqual({ ...StudentGroupInfo[0], organizationId: createdOrganizationId1 })
    } else {
      expect(getStudentGroupByStudentGroupLMSIdResult.value).toEqual(null)
    }
  })

  test('success getStudentGroupById', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      StudentGroupInfo[0],
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const getStudentGroups = await studentGroupRepostiory.getStudentGroups(createdOrganizationId1)

    if (getStudentGroups.hasError) {
      throw new Error(`Failed to get Student-group`)
    }
    expect(getStudentGroups.hasError).toEqual(false)
    expect(getStudentGroups.error).toEqual(null)

    const studentGroupId = getStudentGroups.value[0].id

    const getStudentGroupById = await studentGroupRepostiory.getStudentGroupById(studentGroupId)

    expect(getStudentGroupById.hasError).toEqual(false)
    expect(getStudentGroupById.error).toEqual(null)

    if (getStudentGroupById.value) {
      expect({
        name: getStudentGroupById.value['name'],
        organizationId: getStudentGroupById.value['organizationId'],
        grade: getStudentGroupById.value['grade'],
        studentGroupLmsId: getStudentGroupById.value['studentGroupLmsId'],
      }).toEqual({ ...StudentGroupInfo[0], organizationId: createdOrganizationId1 })
    } else {
      expect(getStudentGroupById.value).toEqual(undefined)
    }
  })

  test('success updateStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      { ...StudentGroupInfo[0], packageId: 'codeillusion-package-basic-full-standard' },
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const getStudentGroups = await studentGroupRepostiory.getStudentGroups(createdOrganizationId1)

    if (getStudentGroups.hasError) {
      throw new Error(`Failed to get Student-group`)
    }
    expect(getStudentGroups.hasError).toEqual(false)
    expect(getStudentGroups.error).toEqual(null)

    const studentGroupId = getStudentGroups.value[0].id

    const updateStudentGroupResult = await studentGroupRepostiory.updateStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      {
        name: 'change-student-group',
        packageId: 'codeillusion-package-basic-1-premium-heroic',
        grade: '3',
        studentGroupLmsId: 'student-group-lms-3',
      },
      studentGroupId,
    )

    expect(updateStudentGroupResult.hasError).toEqual(false)
    expect(updateStudentGroupResult.error).toEqual(null)
    expect(updateStudentGroupResult.value).toEqual(undefined)

    const studentGroupPackageAssignmentTypeormEntity = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

    const updatedPackage = await studentGroupPackageAssignmentTypeormEntity.findOneBy({
      student_group_id: studentGroupId,
    })

    if (!updatedPackage) {
      throw new Error(`Failed to update package id of student group id :${studentGroupId}`)
    }
    expect(updatedPackage.student_group_id).toEqual(studentGroupId)
    expect(updatedPackage.package_id).toEqual('codeillusion-package-basic-1-premium-heroic')
    expect(updatedPackage.package_category_id).toEqual(packagesMapById['codeillusion-package-basic-1-premium-heroic'].packageCategoryId)

    const getStudentGroupById = await studentGroupRepostiory.getById(studentGroupId)

    expect(getStudentGroupById.hasError).toEqual(false)
    expect(getStudentGroupById.error).toEqual(null)

    if (getStudentGroupById.value) {
      expect({
        name: getStudentGroupById.value['name'],
        grade: getStudentGroupById.value['grade'],
        studentGroupLmsId: getStudentGroupById.value['studentGroupLmsId'],
      }).toEqual({
        name: 'change-student-group',
        grade: '3',
        studentGroupLmsId: 'student-group-lms-3',
      })
    } else {
      expect(getStudentGroupById.value).toEqual(null)
    }
  })

  test('success deleteStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const administratorRepository = new AdministratorRepository(appDataSource)
    const studentGroupRepostiory = new StudentGroupRepository(appDataSource, administratorRepository)

    const createStudentGroupresult = await studentGroupRepostiory.createStudentGroup(
      { id: 'user-id-1', role: 'internalOperator' },
      StudentGroupInfo[0],
      createdOrganizationId1,
    )

    if (createStudentGroupresult.hasError) {
      throw new Error(`Student-group not created in database`)
    }
    expect(createStudentGroupresult.hasError).toBe(false)
    expect(createStudentGroupresult.error).toBe(null)
    expect(createStudentGroupresult.value).toBe(undefined)

    const getStudentGroups = await studentGroupRepostiory.getStudentGroups(createdOrganizationId1)

    if (getStudentGroups.hasError) {
      throw new Error(`Failed to get Student-group`)
    }
    expect(getStudentGroups.hasError).toEqual(false)
    expect(getStudentGroups.error).toEqual(null)

    const studentGroupId = getStudentGroups.value[0].id

    const deleteStudentGroupResult = await studentGroupRepostiory.deleteStudentGroup({ id: 'user-id-1', role: 'internalOperator' }, studentGroupId)

    expect(deleteStudentGroupResult.hasError).toEqual(false)
    expect(deleteStudentGroupResult.error).toEqual(null)
    expect(deleteStudentGroupResult.value).toEqual(undefined)

    const getStudentGroupById = await studentGroupRepostiory.getById(studentGroupId)

    expect(getStudentGroupById.hasError).toEqual(false)
    expect(getStudentGroupById.error).toEqual(null)
    expect(getStudentGroupById.value).toEqual(null)
  })
})
