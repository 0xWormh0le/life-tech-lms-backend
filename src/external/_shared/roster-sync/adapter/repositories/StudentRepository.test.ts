import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { StudentTypeormEntity } from '../../../../../adapter/typeorm/entity/Student'
import { StudentGroupStudentTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroupStudent'
import { StudentGroupTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroup'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { StudentRepository } from './StudentRepository'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { Student } from '../../domain//entities/Student'

let createdOrganizationId1: string
let createdOrganizationId2: string
let createdStudentGroupId11: string
let createdStudentGroupId12: string

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
  createdOrganizationId2 = createOrganizationResult[1].id

  //create student group
  const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)
  const createStudentGroupResult = await studentGroupRepository.save([
    {
      name: 'organization-name-1-1',
      organization_id: { id: createdOrganizationId1 },
    },
    {
      name: 'organization-name-1-2',
      organization_id: { id: createdOrganizationId1 },
    },
    {
      name: 'organization-name-2-1',
      organization_id: { id: createdOrganizationId2 },
    },
    {
      name: 'organization-name-2-2',
      organization_id: { id: createdOrganizationId2 },
    },
  ])

  createdStudentGroupId11 = createStudentGroupResult[0].id
  createdStudentGroupId12 = createStudentGroupResult[1].id
})

afterEach(teardownEnvironment)

describe('test StudentRepository for Classlink', () => {
  const studentId1 = randomUUID()
  const studentId2 = randomUUID()
  const studentId3 = randomUUID()

  test('success getAllByStudentGroupId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)

    await studentTypeormRepository.save<DeepPartial<StudentTypeormEntity>>([
      {
        id: studentId1,
        nick_name: 'student-nickName-1',
        user_id: 'student-userId-1',
        student_lms_id: 'student-studentLMSId-1',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
      {
        id: studentId2,
        nick_name: 'student-nickName-2',
        user_id: 'student-userId-2',
        student_lms_id: 'student-studentLMSId-2',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
      {
        id: studentId3,
        nick_name: 'student-nickName-3',
        user_id: 'student-userId-3',
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
        student_group_id: { id: createdStudentGroupId12 },
        student_id: { id: studentId1 },
      },
      {
        student_group_id: { id: createdStudentGroupId12 },
        student_id: { id: studentId3 },
      },
    ])

    const studentRepository = new StudentRepository(appDataSource)
    const getStudentsResult1 = await studentRepository.getAllByStudentGroupId(createdStudentGroupId11)

    if (getStudentsResult1.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentsResult1.error)}`)
    }
    expect(
      getStudentsResult1.value.map<Student>((e) => ({
        id: e.id,
        nickName: e.nickName,
        userId: e.userId,
        studentLMSId: e.studentLMSId,
        classlinkTenantId: e.classlinkTenantId,
        isDeactivated: e.isDeactivated,
      })),
    ).toEqual<Student[]>([
      {
        id: studentId1,
        nickName: 'student-nickName-1',
        userId: 'student-userId-1',
        studentLMSId: 'student-studentLMSId-1',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
      {
        id: studentId2,
        nickName: 'student-nickName-2',
        userId: 'student-userId-2',
        studentLMSId: 'student-studentLMSId-2',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
    ])

    const getStudentsResult2 = await studentRepository.getAllByStudentGroupId(createdStudentGroupId12)

    if (getStudentsResult2.hasError) {
      throw new Error(`studentRepository.getAllByStudentGroupId failed ${JSON.stringify(getStudentsResult2.error)}`)
    }
    expect(
      getStudentsResult2.value.map<Student>((e) => ({
        id: e.id,
        nickName: e.nickName,
        userId: e.userId,
        studentLMSId: e.studentLMSId,
        classlinkTenantId: e.classlinkTenantId,
        isDeactivated: e.isDeactivated,
      })),
    ).toEqual<Student[]>([
      {
        id: studentId1,
        nickName: 'student-nickName-1',
        userId: 'student-userId-1',
        studentLMSId: 'student-studentLMSId-1',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
      {
        id: studentId3,
        nickName: 'student-nickName-3',
        userId: 'student-userId-3',
        studentLMSId: 'student-studentLMSId-3',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
    ])
  })

  test('success createStudent', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentRepository = new StudentRepository(appDataSource)
    const studentInfo: Student[] = [
      {
        id: studentId1,
        nickName: 'student-nickName-1',
        userId: 'student-userId-1',
        studentLMSId: 'student-studentLMSId-1',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
      {
        id: studentId3,
        nickName: 'student-nickName-3',
        userId: 'student-userId-3',
        studentLMSId: 'student-studentLMSId-3',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
    ]
    const createdStudents = await studentRepository.createStudents(studentInfo)

    if (createdStudents.hasError) {
      throw new Error(`studentRepository.createStudents failed ${JSON.stringify(createdStudents.error)}`)
    }
    expect(createdStudents.value[0].id).toBeTruthy()
    expect(createdStudents.value[1].id).toBeTruthy()

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)
    const findStudentsResult = await studentTypeormRepository.find()

    expect(
      findStudentsResult.map((e) => ({
        id: e.id,
        nickName: e.nick_name,
        userId: e.user_id,
        studentLMSId: e.student_lms_id,
        classlinkTenantId: e.classlink_tenant_id,
        isDeactivated: e.is_deactivated,
      })),
    ).toEqual<Student[]>([
      {
        id: studentId1,
        nickName: 'student-nickName-1',
        userId: 'student-userId-1',
        studentLMSId: 'student-studentLMSId-1',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
      {
        id: studentId3,
        nickName: 'student-nickName-3',
        userId: 'student-userId-3',
        studentLMSId: 'student-studentLMSId-3',
        classlinkTenantId: 'student-classlinkTenantId',
        isDeactivated: false,
      },
    ])
  })

  test('success updateStudent ', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)

    await studentTypeormRepository.save<DeepPartial<StudentTypeormEntity>>([
      {
        id: studentId1,
        nick_name: 'student-nickName-1',
        user_id: 'student-userId-1',
        student_lms_id: 'student-studentLMSId-1',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
      {
        id: studentId2,
        nick_name: 'student-nickName-2',
        user_id: 'student-userId-2',
        student_lms_id: 'student-studentLMSId-2',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
      {
        id: studentId3,
        nick_name: 'student-nickName-3',
        user_id: 'student-userId-3',
        student_lms_id: 'student-studentLMSId-3',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
    ])

    const studentRepository = new StudentRepository(appDataSource)

    const updateStudents = await studentRepository.updateStudents([
      {
        id: studentId1,
        nickName: 'changed-student-nickName-1',
        userId: 'changed-student-userId-1',
        studentLMSId: 'changed-student-studentLMSId-1',
        classlinkTenantId: 'changed-student-classlinkTenantId',
        isDeactivated: false,
      },
      {
        id: studentId2,
        nickName: 'changed-student-nickName-2',
        userId: 'changed-student-userId-2',
        studentLMSId: 'changed-student-studentLMSId-2',
        classlinkTenantId: 'changed-student-classlinkTenantId',
        isDeactivated: false,
      },
    ])

    expect(updateStudents.value).toEqual(undefined)
    expect(updateStudents.error).toEqual(null)
    expect(updateStudents.hasError).toEqual(false)

    const findStudentsResult = await studentTypeormRepository.find()
    const mapped = findStudentsResult.map<Student>((e) => ({
      id: e.id,
      nickName: e.nick_name,
      userId: e.user_id,
      studentLMSId: e.student_lms_id,
      classlinkTenantId: e.classlink_tenant_id,
      isDeactivated: e.is_deactivated,
    }))

    expect(mapped.find((e) => e.id === studentId1)).toEqual<Student>({
      id: studentId1,
      nickName: 'changed-student-nickName-1',
      userId: 'changed-student-userId-1',
      studentLMSId: 'changed-student-studentLMSId-1',
      classlinkTenantId: 'changed-student-classlinkTenantId',
      isDeactivated: false,
    })
    expect(mapped.find((e) => e.id === studentId2)).toEqual<Student>({
      id: studentId2,
      nickName: 'changed-student-nickName-2',
      userId: 'changed-student-userId-2',
      studentLMSId: 'changed-student-studentLMSId-2',
      classlinkTenantId: 'changed-student-classlinkTenantId',
      isDeactivated: false,
    })
    expect(mapped.find((e) => e.id === studentId3)).toEqual<Student>({
      id: studentId3,
      nickName: 'student-nickName-3',
      userId: 'student-userId-3',
      studentLMSId: 'student-studentLMSId-3',
      classlinkTenantId: 'student-classlinkTenantId',
      isDeactivated: false,
    })
  })

  test('success delete student', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const studentTypeormRepository = appDataSource.getRepository(StudentTypeormEntity)

    await studentTypeormRepository.save<DeepPartial<StudentTypeormEntity>>([
      {
        id: studentId1,
        nick_name: 'student-nickName-1',
        user_id: 'student-userId-1',
        student_lms_id: 'student-studentLMSId-1',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
      {
        id: studentId2,
        nick_name: 'student-nickName-2',
        user_id: 'student-userId-2',
        student_lms_id: 'student-studentLMSId-2',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
      {
        id: studentId3,
        nick_name: 'student-nickName-3',
        user_id: 'student-userId-3',
        student_lms_id: 'student-studentLMSId-3',
        classlink_tenant_id: 'student-classlinkTenantId',
      },
    ])

    const studentRepository = new StudentRepository(appDataSource)

    const resultDelete = await studentRepository.deleteStudents([studentId1, studentId3])

    expect(resultDelete.value).toEqual(undefined)
    expect(resultDelete.hasError).toEqual(false)
    expect(resultDelete.error).toEqual(null)

    const findStudentsAfterDeletedResult = await studentTypeormRepository.find()
    const mappedFindStudentsAfterDeletedResult = findStudentsAfterDeletedResult.map<Student>((e) => ({
      id: e.id,
      nickName: e.nick_name,
      userId: e.user_id,
      studentLMSId: e.student_lms_id,
      classlinkTenantId: e.classlink_tenant_id,
      isDeactivated: e.is_deactivated,
    }))

    expect(mappedFindStudentsAfterDeletedResult.find((e) => e.id === studentId1)?.isDeactivated).toEqual(true)
    expect(mappedFindStudentsAfterDeletedResult.find((e) => e.id === studentId2)).toEqual<Student>({
      id: studentId2,
      nickName: 'student-nickName-2',
      userId: 'student-userId-2',
      studentLMSId: 'student-studentLMSId-2',
      classlinkTenantId: 'student-classlinkTenantId',
      isDeactivated: false,
    })
    expect(mappedFindStudentsAfterDeletedResult.find((e) => e.id === studentId3)?.isDeactivated).toEqual(true)
  })
})
