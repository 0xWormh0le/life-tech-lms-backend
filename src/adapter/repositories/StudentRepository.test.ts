import { randomUUID } from 'crypto'
import { DeepPartial, In } from 'typeorm'
import { Student } from '../../domain/entities/codex/Student'
import { StudentTypeormEntity } from '../typeorm/entity/Student'
import { StudentGroupStudentTypeormEntity } from '../typeorm/entity/StudentGroupStudent'
import { StudentGroupTypeormEntity } from '../typeorm/entity/StudentGroup'
import { appDataSource, setupEnvironment, teardownEnvironment } from './../_testShared/testUtilities'
import { StudentRepository } from './StudentRepository'

import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { UserTypeormEntity } from '../typeorm/entity/User'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { StudentGroupPackageAssignmentTypeormEntity } from '../typeorm/entity/StudentGroupPackageAssignment'
import { excludeNull } from '../../_shared/utils'

const createDistrict1: string = randomUUID()
const createdOrganizationId1: string = randomUUID()
const createdOrganizationId2: string = randomUUID()
const createdStudentGroupId11: string = randomUUID()
const createdStudentGroupId12: string = randomUUID()
const createdStudentGroupId21: string = randomUUID()
const createdStudentGroupId22: string = randomUUID()
const studentId1 = randomUUID()
const studentId2 = randomUUID()
const studentId3 = randomUUID()
const userId1 = randomUUID()
const userId2 = randomUUID()
const userId3 = randomUUID()
const userId4 = randomUUID()
const userId5 = randomUUID()

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
    },
    {
      id: createdOrganizationId2,
      name: 'organization-name-2',
      district_id: createDistrictResult[0].id,
    },
  ])

  //create student group
  const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)

  await studentGroupRepository.save([
    {
      id: createdStudentGroupId11,
      name: 'organization-name-1-1',
      organization_id: { id: createdOrganizationId1 },
    },
    {
      id: createdStudentGroupId12,
      name: 'organization-name-1-2',
      organization_id: { id: createdOrganizationId1 },
    },
    {
      id: createdStudentGroupId21,
      name: 'organization-name-2-1',
      organization_id: { id: createdOrganizationId2 },
    },
    {
      id: createdStudentGroupId22,
      name: 'organization-name-2-2',
      organization_id: { id: createdOrganizationId2 },
    },
  ])

  //assign package in student group assignment table
  const studentGroupPackageAssignmentTypeormEntity = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

  await studentGroupPackageAssignmentTypeormEntity.save([
    {
      student_group_id: createdStudentGroupId11,
      package_id: 'codeillusion-package-basic-full-standard',
      package_category_id: 'codeillusion',
    },
    {
      student_group_id: createdStudentGroupId12,
      package_id: 'codeillusion-package-basic-full-standard',
      package_category_id: 'codeillusion',
    },
    {
      student_group_id: createdStudentGroupId21,
      package_id: 'codeillusion-package-basic-full-standard',
      package_category_id: 'codeillusion',
    },
    {
      student_group_id: createdStudentGroupId22,
      package_id: 'codeillusion-package-basic-full-standard',
      package_category_id: 'codeillusion',
    },
  ])

  // create users
  const userTypeormRepository = appDataSource.getRepository(UserTypeormEntity)

  await userTypeormRepository.save([
    {
      id: userId1,
      email: 'user1@gmail.com',
      login_id: 'user-login-id-1',
      password: 'user1',
      role: 'student',
    },
    {
      id: userId2,
      email: 'user2@gmail.com',
      login_id: 'user-login-id-2',
      password: 'user2',
      role: 'student',
    },
    {
      id: userId3,
      email: 'user3@gmail.com',
      login_id: 'user-login-id-3',
      password: 'user3',
      role: 'student',
    },
    {
      id: userId4,
      email: 'user4@gmail.com',
      login_id: 'user-login-id-4',
      password: 'user4',
      role: 'internal_operator',
    },
    {
      id: userId5,
      email: 'user5@gmail.com',
      login_id: 'user-login-id-5',
      password: 'user5',
      role: 'student',
    },
  ])

  const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)

  await studentTypeormRepository.save<DeepPartial<StudentTypeormEntity>>([
    {
      id: studentId1,
      nick_name: 'student-nickName-1',
      user_id: userId1,
      student_lms_id: 'student-studentLMSId-1',
      classlink_tenant_id: 'student-classlinkTenantId',
    },
    {
      id: studentId2,
      nick_name: 'student-nickName-2',
      user_id: userId2,
      student_lms_id: 'student-studentLMSId-2',
      classlink_tenant_id: 'student-classlinkTenantId',
    },
    {
      id: studentId3,
      nick_name: 'student-nickName-3',
      user_id: userId3,
      student_lms_id: 'student-studentLMSId-3',
      classlink_tenant_id: 'student-classlinkTenantId',
    },
  ])

  const studentStudentGroupTypeormRepository = appDataSource.getRepository(StudentGroupStudentTypeormEntity)

  await studentStudentGroupTypeormRepository.save<DeepPartial<StudentGroupStudentTypeormEntity>>([
    {
      student_group_id: { id: createdStudentGroupId11 },
      student_id: { id: studentId1 },
    },
    {
      student_group_id: { id: createdStudentGroupId11 },
      student_id: { id: studentId2 },
    },
    {
      student_group_id: { id: createdStudentGroupId21 },
      student_id: { id: studentId2 },
    },
    {
      student_group_id: { id: createdStudentGroupId12 },
      student_id: { id: studentId1 },
    },
    {
      student_group_id: { id: createdStudentGroupId22 },
      student_id: { id: studentId3 },
    },
  ])
})

afterEach(teardownEnvironment)

describe('test StudentRepository for Codex', () => {
  test('success createStudents', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const createStudentsResult = await studentRepository.createStudents(
      [
        {
          nickName: 'student-nickName-11',
          loginId: 'login-id-11',
          password: 'password-11',
          studentLMSId: 'student-lms-id-11',
          email: 'student11@gmail.com',
        },
        {
          nickName: 'student-nickName-12',
          loginId: 'login-id-12',
          password: 'password-12',
          studentLMSId: 'student-lms-id-12',
          email: 'student12@gmail.com',
        },
      ],
      userId4,
      createdStudentGroupId11,
    )
    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const findStudents = await studentTypeormRepository.find({
      where: {
        nick_name: In(['student-nickName-11', 'student-nickName-12']),
      },
    })

    expect(
      findStudents.map((e) => {
        return {
          nickName: e.nick_name,
          studentLMSId: e.student_lms_id,
        }
      }),
    ).toStrictEqual([
      {
        nickName: 'student-nickName-11',
        studentLMSId: 'student-lms-id-11',
      },
      {
        nickName: 'student-nickName-12',
        studentLMSId: 'student-lms-id-12',
      },
    ])
    expect(createStudentsResult.value).toBe(undefined)
    expect(createStudentsResult.hasError).toBe(false)
    expect(createStudentsResult.error).toBe(null)
  })

  test('success findAlreadyExistsStudentLMSId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    // scenario-1 where LMSID already exists in DB
    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const studentLmsIds = await studentTypeormRepository
      .find({
        where: {
          id: In([studentId1, studentId2]),
        },
      })
      .then((res) => {
        return res.map((e) => e.student_lms_id)
      })
      .catch((err) => {
        throw new Error(`unknown runtime error occurred ${JSON.stringify(err)}`)
      })
    const studentRepository = new StudentRepository(appDataSource)
    const findAlreadyExistsStudentLMSIdResult = await studentRepository.findAlreadyExistsStudentLMSId(excludeNull(studentLmsIds))

    if (findAlreadyExistsStudentLMSIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(findAlreadyExistsStudentLMSIdResult.error)}`)
    }
    expect(findAlreadyExistsStudentLMSIdResult.hasError).toBe(false)
    expect(findAlreadyExistsStudentLMSIdResult.error).toBe(null)
    expect(findAlreadyExistsStudentLMSIdResult.value).toStrictEqual(studentLmsIds)

    // Scenario-2 where studentLMSId not exists in DB.

    const getStudentsResult2 = await studentRepository.findAlreadyExistsStudentLMSId(['Not-Exist_LMSId'])

    if (findAlreadyExistsStudentLMSIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentsResult2.error)}`)
    }
    expect(findAlreadyExistsStudentLMSIdResult.hasError).toBe(false)
    expect(findAlreadyExistsStudentLMSIdResult.error).toBe(null)

    expect(getStudentsResult2.value).toStrictEqual([])
  })

  test('success getStudentGroupsStudentsByStudentIdAndStudentGroupId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentGroupStudentTypeormRepository = appDataSource.getRepository(StudentGroupStudentTypeormEntity)

    const studentRepository = new StudentRepository(appDataSource)
    const getStudentGroupsStudentsByStudentIdAndStudentGroupIdResult = await studentRepository.getStudentGroupsStudentsByStudentIdAndStudentGroupId(
      studentId1,
      createdStudentGroupId11,
    )

    if (getStudentGroupsStudentsByStudentIdAndStudentGroupIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentGroupsStudentsByStudentIdAndStudentGroupIdResult.error)}`)
    }

    const resultToExpect = await studentGroupStudentTypeormRepository.find({
      where: {
        student_group_id: { id: createdStudentGroupId11 },
        student_id: { id: studentId1 },
      },
    })

    expect(resultToExpect[0].id).toBe(getStudentGroupsStudentsByStudentIdAndStudentGroupIdResult.value[0])
    expect(getStudentGroupsStudentsByStudentIdAndStudentGroupIdResult.hasError).toBe(false)
    expect(getStudentGroupsStudentsByStudentIdAndStudentGroupIdResult.error).toBe(null)
  })

  test('success getDistrictIdByStudentId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const studentRepository = new StudentRepository(appDataSource)
    const getDistrictIdByStudentIdResult = await studentRepository.getDistrictIdByStudentId(studentId1)

    if (getDistrictIdByStudentIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getDistrictIdByStudentIdResult.error)}`)
    }
    expect(getDistrictIdByStudentIdResult.value).toBe(createDistrict1)

    expect(getDistrictIdByStudentIdResult.hasError).toBe(false)
    expect(getDistrictIdByStudentIdResult.error).toBe(null)
  })

  test('success getStudentIdByStudentLMSId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const studentRepository = new StudentRepository(appDataSource)

    const studentLmsId = await studentTypeormRepository.find({
      where: {
        id: studentId1,
      },
    })
    const getStudentIdByStudentLMSIdResult = await studentRepository.getStudentByStudentLmsId(studentLmsId[0].student_lms_id ?? '')

    if (getStudentIdByStudentLMSIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentIdByStudentLMSIdResult.error)}`)
    }

    expect({
      id: getStudentIdByStudentLMSIdResult.value?.id,
      nick_name: getStudentIdByStudentLMSIdResult.value?.nickName,
      user_id: getStudentIdByStudentLMSIdResult.value?.userId,
      student_lms_id: getStudentIdByStudentLMSIdResult.value?.studentLMSId,
    }).toStrictEqual({
      id: studentId1,
      nick_name: 'student-nickName-1',
      user_id: userId1,
      student_lms_id: 'student-studentLMSId-1',
    })

    expect(getStudentIdByStudentLMSIdResult.hasError).toBe(false)
    expect(getStudentIdByStudentLMSIdResult.error).toBe(null)
  })

  test('success getStudents', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const studentRepository = new StudentRepository(appDataSource)
    const getStudentsResult = await studentRepository.getStudents(createdStudentGroupId11)

    if (getStudentsResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentsResult.error)}`)
    }
    expect(
      getStudentsResult.value.map((e) => {
        return {
          id: e.id,
          nick_name: e.nickName,
          user_id: e.userId,
          student_lms_id: e.studentLMSId,
        }
      }),
    ).toEqual([
      {
        id: studentId1,
        nick_name: 'student-nickName-1',
        user_id: userId1,
        student_lms_id: 'student-studentLMSId-1',
      },
      {
        id: studentId2,
        nick_name: 'student-nickName-2',
        user_id: userId2,
        student_lms_id: 'student-studentLMSId-2',
      },
    ])

    expect(getStudentsResult.hasError).toBe(false)
    expect(getStudentsResult.error).toBe(null)
  })

  test('success addStudentInStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentGroupStudentTypeormRepository = appDataSource.getRepository(StudentGroupStudentTypeormEntity)
    const studentRepository = new StudentRepository(appDataSource)
    const addStudentInStudentGroupResult = await studentRepository.addStudentInStudentGroup(userId4, createdStudentGroupId11, studentId3)

    if (addStudentInStudentGroupResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(addStudentInStudentGroupResult.error)}`)
    }

    // checking wheter student3 added in createdStudentGroupId11 or not?
    const getStudentsResult = await studentRepository.getStudents(createdStudentGroupId11)

    expect(getStudentsResult.value?.map((e) => e.id).includes(studentId3)).toBe(true)
    expect(addStudentInStudentGroupResult.hasError).toBe(false)
    expect(addStudentInStudentGroupResult.error).toBe(null)
    expect(addStudentInStudentGroupResult.value).toBe(undefined)
  })

  test('success removeStudentFromStudentGroup', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const removeStudentFromStudentGroupResult = await studentRepository.removeStudentFromStudentGroup(createdStudentGroupId11, studentId1)

    if (removeStudentFromStudentGroupResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(removeStudentFromStudentGroupResult.error)}`)
    }

    // checking wheter student3 added in createdStudentGroupId11 or not?
    const getStudentsResult = await studentRepository.getStudents(createdStudentGroupId11)

    expect(getStudentsResult.value?.map((e) => e.id).includes(studentId1)).toBe(false)
    expect(removeStudentFromStudentGroupResult.hasError).toBe(false)
    expect(removeStudentFromStudentGroupResult.error).toBe(null)
    expect(removeStudentFromStudentGroupResult.value).toBe(undefined)
  })

  test('success getStudentOrganizationsById', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const getStudentOrganizationsByIdResult = await studentRepository.getStudentOrganizationsById(studentId1)

    if (getStudentOrganizationsByIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentOrganizationsByIdResult.error)}`)
    }

    expect(getStudentOrganizationsByIdResult.value[0].id).toBe(createdOrganizationId1)
    expect(getStudentOrganizationsByIdResult.hasError).toBe(false)
    expect(getStudentOrganizationsByIdResult.error).toBe(null)
  })

  test('success getStudentDetailByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const getStudentDetailByUserIdResult = await studentRepository.getStudentDetailByUserId(userId1)

    if (getStudentDetailByUserIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentDetailByUserIdResult.error)}`)
    }

    expect({
      id: getStudentDetailByUserIdResult.value?.id,
      user_id: getStudentDetailByUserIdResult.value?.userId,
      nick_name: getStudentDetailByUserIdResult.value?.nickName,
      student_lms_id: getStudentDetailByUserIdResult.value?.studentLMSId,
    }).toStrictEqual({
      id: studentId1,
      nick_name: 'student-nickName-1',
      user_id: userId1,
      student_lms_id: 'student-studentLMSId-1',
    })
    expect(getStudentDetailByUserIdResult.hasError).toBe(false)
    expect(getStudentDetailByUserIdResult.error).toBe(null)
  })

  test('success getStudentPackagesByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const getStudentPackagesByUserIdResult = await studentRepository.getStudentPackagesByUserId(userId1)

    if (getStudentPackagesByUserIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentPackagesByUserIdResult.error)}`)
    }
    expect(getStudentPackagesByUserIdResult.value).toEqual([
      {
        studentGroupId: createdStudentGroupId11,
        packageId: 'codeillusion-package-basic-full-standard',
        packageCategoryId: 'codeillusion',
      },
      {
        studentGroupId: createdStudentGroupId12,
        packageId: 'codeillusion-package-basic-full-standard',
        packageCategoryId: 'codeillusion',
      },
    ])
    expect(getStudentPackagesByUserIdResult.hasError).toBe(false)
    expect(getStudentPackagesByUserIdResult.error).toBe(null)
  })

  test('success getStudentByStudentLmsId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const findDataByStudentId = await studentTypeormRepository.find({
      where: {
        id: studentId1,
      },
    })
    const studentRepository = new StudentRepository(appDataSource)
    const getStudentByStudentLmsIdResult = await studentRepository.getStudentByStudentLmsId(findDataByStudentId[0].student_lms_id ?? '')

    if (getStudentByStudentLmsIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentByStudentLmsIdResult.error)}`)
    }
    expect({
      id: getStudentByStudentLmsIdResult.value?.id,
      user_id: getStudentByStudentLmsIdResult.value?.userId,
      nick_name: getStudentByStudentLmsIdResult.value?.nickName,
      student_lms_id: getStudentByStudentLmsIdResult.value?.studentLMSId,
    }).toStrictEqual({
      id: studentId1,
      nick_name: 'student-nickName-1',
      user_id: userId1,
      student_lms_id: 'student-studentLMSId-1',
    })
    expect(getStudentByStudentLmsIdResult.hasError).toBe(false)
    expect(getStudentByStudentLmsIdResult.error).toBe(null)
  })

  test('success createStudentWithoutStudentGroupId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const studentGroupStudentTypeormRepository = appDataSource.getRepository(StudentGroupStudentTypeormEntity)

    const studentRepository = new StudentRepository(appDataSource)
    const createStudentWithoutStudentGroupIdResult = await studentRepository.createStudentWithoutStudentGroupId(
      {
        nickName: 'testing-nickname',
        email: 'test@yahoo.com',
        studentLMSId: 'testing-Student-lms-id',
        password: 'testing-password',
        loginId: 'testing-loginId',
      },
      userId4,
    )

    if (createStudentWithoutStudentGroupIdResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(createStudentWithoutStudentGroupIdResult.error)}`)
    }

    const findDataByStudentId = await studentTypeormRepository.find({
      where: {
        nick_name: 'testing-nickname',
      },
    })
    const findEntryInStudentMappingTable = await studentGroupStudentTypeormRepository.find({
      where: {
        student_id: { id: findDataByStudentId[0].id },
      },
    })

    expect(findEntryInStudentMappingTable).toStrictEqual([])
    expect(createStudentWithoutStudentGroupIdResult.value).toBe(undefined)
    expect(createStudentWithoutStudentGroupIdResult.hasError).toBe(false)
    expect(createStudentWithoutStudentGroupIdResult.error).toBe(null)
  })

  test('success updateStudent', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const updateStudentResult = await studentRepository.updateStudent(studentId2, {
      loginId: 'changedLoginId',
      email: 'changedemail',
      nickName: 'changedNickName',
      studentLMSId: 'changedLmsId',
    })

    if (updateStudentResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(updateStudentResult.error)}`)
    }

    const resultAfterUpdate = await studentRepository.getStudents(createdStudentGroupId11, [studentId2])

    expect({
      loginId: resultAfterUpdate.value?.[0].loginId,
      email: resultAfterUpdate.value?.[0].email,
      nickName: resultAfterUpdate.value?.[0].nickName,
      studentLMSId: resultAfterUpdate.value?.[0].studentLMSId,
    }).toStrictEqual({
      loginId: 'changedLoginId',
      email: 'changedemail',
      nickName: 'changedNickName',
      studentLMSId: 'changedLmsId',
    })
    expect(updateStudentResult.value).toBe(undefined)
    expect(updateStudentResult.hasError).toBe(false)
    expect(updateStudentResult.error).toBe(null)
  })

  test('success deleteStudent', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const deleteStudentResult = await studentRepository.deleteStudent(studentId2)

    if (deleteStudentResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(deleteStudentResult.error)}`)
    }

    const findAfterDelete = await studentTypeormRepository.find({
      where: {
        id: studentId2,
      },
    })
    const resultAfterUpdate = await studentRepository.getStudents(createdStudentGroupId11, [studentId2])

    expect(findAfterDelete).toStrictEqual([])
    expect(deleteStudentResult.value).toBe(undefined)
    expect(deleteStudentResult.hasError).toBe(false)
    expect(deleteStudentResult.error).toBe(null)
  })

  test('success deactivateStudent', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const deactivateStudentResult = await studentRepository.deactivateStudent(studentId2)

    if (deactivateStudentResult.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(deactivateStudentResult.error)}`)
    }

    const findAfterDeactivate = await studentTypeormRepository.find({
      where: {
        id: studentId2,
      },
    })

    expect(findAfterDeactivate[0].is_deactivated).toStrictEqual(true)
    expect(deactivateStudentResult.value).toBe(undefined)
    expect(deactivateStudentResult.hasError).toBe(false)
    expect(deactivateStudentResult.error).toBe(null)
  })
})
