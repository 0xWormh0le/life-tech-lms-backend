import { StudentGroupStudentRepository } from './StudentGroupStudentRepository'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { StudentTypeormEntity } from '../../../../../adapter/typeorm/entity/Student'
import { StudentGroupTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroup'
import { StudentGroupStudentTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroupStudent'
import { randomUUID } from 'crypto'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'

const organizationId1 = randomUUID()
const organizationId2 = randomUUID()
const organizationId3 = randomUUID()
const organizationId4 = randomUUID()
const organizationId5 = randomUUID()
const organizationId6 = randomUUID()

beforeEach(async () => {
  await setupEnvironment()

  if (!appDataSource) {
    throw new Error('appDataSource is undefined')
  }

  const organizationRepo = appDataSource.getRepository(OrganizationTypeormEntity)

  await organizationRepo.save([
    {
      id: organizationId1,
      name: 'Organization1',
      district_id: 'District',
    },
    {
      id: organizationId2,
      name: 'Organization2',
      district_id: 'District',
    },
    {
      id: organizationId3,
      name: 'Organization3',
      district_id: 'District',
    },
    {
      id: organizationId4,
      name: 'Organization4',
      district_id: 'District',
    },
    {
      id: organizationId5,
      name: 'Organization5',
      district_id: 'District',
    },
    {
      id: organizationId6,
      name: 'Organization6',
      district_id: 'District',
    },
  ])
})

afterEach(teardownEnvironment)

describe('test StudentGroupStudentRepository for Classlink', () => {
  test('success getAllByStudentGroupId', async () => {
    if (!appDataSource) {
      throw new Error('appDataSource is undefined')
    }

    /* Create StudentGroup */
    const studentGroupRepo = appDataSource.getRepository(StudentGroupTypeormEntity)
    const studentGroup1 = await studentGroupRepo.save({
      name: 'StudentGroup-1',
      organization_id: { id: organizationId1 },
    })
    const studentGroup2 = await studentGroupRepo.save({
      name: 'StudentGroup-2',
      organization_id: { id: organizationId2 },
    })

    /* Create Student */
    const studentRepo = appDataSource.getRepository(StudentTypeormEntity)
    const student1 = await studentRepo.save({
      nick_name: 'student_nick_name_1',
      user_id: 'user-id-1',
    })
    const student2 = await studentRepo.save({
      nick_name: 'student_nick_name_2',
      user_id: 'user-id-2',
    })

    /* Create StudentGroupStudent */
    const studentStudentGroupRepo = appDataSource.getRepository(StudentGroupStudentTypeormEntity)

    await studentStudentGroupRepo.save([
      {
        student_group_id: { id: studentGroup1.id },
        student_id: { id: student1.id },
      },
      {
        student_group_id: { id: studentGroup1.id },
        student_id: { id: student2.id },
      },
      {
        student_group_id: { id: studentGroup2.id },
        student_id: { id: student2.id },
      },
    ])

    const studentStudentGroupRepository = new StudentGroupStudentRepository(appDataSource)
    const result = await studentStudentGroupRepository.getAllByStudentGroupId(studentGroup1.id)

    if (result.hasError) {
      throw new Error(`failed getAllByStudentGroupId ${JSON.stringify(result.error)}`)
    }
    expect(result.value).toEqual<typeof result.value>([
      {
        studentGroupId: studentGroup1.id,
        studentId: student1.id,
      },
      {
        studentGroupId: studentGroup1.id,
        studentId: student2.id,
      },
    ])
  })

  test('success createStudentGroupStudents', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create StudentGroup */
    const studentGroupRepo = appDataSource.getRepository(StudentGroupTypeormEntity)
    const studentGroup3 = await studentGroupRepo.save({
      name: 'StudentGroup-3',
      organization_id: { id: organizationId3 },
    })
    const studentGroup4 = await studentGroupRepo.save({
      name: 'StudentGroup-4',
      organization_id: { id: organizationId4 },
    })

    /* Create Student */
    const studentRepo = appDataSource.getRepository(StudentTypeormEntity)
    const student3 = await studentRepo.save({
      nick_name: 'student_nick_name_3',
      user_id: 'user-id-3',
    })
    const student4 = await studentRepo.save({
      nick_name: 'student_nick_name_4',
      user_id: 'user-id-4',
    })

    const studentStudentGroupRepository = new StudentGroupStudentRepository(appDataSource)

    const result = await studentStudentGroupRepository.createStudentGroupStudents([
      { studentGroupId: studentGroup3.id, studentId: student3.id },
      { studentGroupId: studentGroup3.id, studentId: student4.id },
      { studentGroupId: studentGroup4.id, studentId: student4.id },
    ])

    if (result.hasError) {
      throw new Error(`failed createStudentGroupStudents ${JSON.stringify(result.error)}`)
    }

    const getResult3 = await studentStudentGroupRepository.getAllByStudentGroupId(studentGroup3.id)

    if (getResult3.hasError) {
      throw new Error(`failed getAllByStudentGroupId ${JSON.stringify(getResult3.error)}`)
    }
    expect(getResult3.value).toEqual<typeof getResult3.value>([
      {
        studentGroupId: studentGroup3.id,
        studentId: student3.id,
      },
      {
        studentGroupId: studentGroup3.id,
        studentId: student4.id,
      },
    ])

    const getResult4 = await studentStudentGroupRepository.getAllByStudentGroupId(studentGroup4.id)

    if (getResult4.hasError) {
      throw new Error(`failed getAllByStudentGroupId ${JSON.stringify(getResult4.error)}`)
    }
    expect(getResult4.value).toEqual<typeof getResult4.value>([
      {
        studentGroupId: studentGroup4.id,
        studentId: student4.id,
      },
    ])
  })

  test('success deleteStudentGroupStudents', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create StudentGroup */
    const studentGroupRepo = appDataSource.getRepository(StudentGroupTypeormEntity)
    const studentGroup5 = await studentGroupRepo.save({
      name: 'StudentGroup-5',
      organization_id: { id: organizationId5 },
    })
    const studentGroup6 = await studentGroupRepo.save({
      name: 'StudentGroup-6',
      organization_id: { id: organizationId6 },
    })

    /* Create Student */
    const studentRepo = appDataSource.getRepository(StudentTypeormEntity)
    const student5 = await studentRepo.save({
      nick_name: 'student_nick_name_5',
      user_id: 'user-id-5',
    })
    const student6 = await studentRepo.save({
      nick_name: 'student_nick_name_6',
      user_id: 'user-id-6',
    })
    const student7 = await studentRepo.save({
      nick_name: 'student_nick_name_7',
      user_id: 'user-id-7',
    })

    /* Create StudentGroupStudent */
    const studentStudentGroupRepo = appDataSource.getRepository(StudentGroupStudentTypeormEntity)

    await studentStudentGroupRepo.save([
      {
        student_group_id: { id: studentGroup5.id },
        student_id: { id: student5.id },
      },
      {
        student_group_id: { id: studentGroup5.id },
        student_id: { id: student6.id },
      },
      {
        student_group_id: { id: studentGroup6.id },
        student_id: { id: student5.id },
      },
      {
        student_group_id: { id: studentGroup6.id },
        student_id: { id: student6.id },
      },
      {
        student_group_id: { id: studentGroup6.id },
        student_id: { id: student7.id },
      },
    ])

    const studentStudentGroupRepository = new StudentGroupStudentRepository(appDataSource)

    const result = await studentStudentGroupRepository.deleteStudentGroupStudents([
      { studentGroupId: studentGroup5.id, studentId: student5.id },
      { studentGroupId: studentGroup6.id, studentId: student6.id },
    ])

    if (result.hasError) {
      throw new Error(`failed createStudentGroupStudents ${JSON.stringify(result.error)}`)
    }

    const getResultRemoved = await studentStudentGroupRepository.getAllByStudentGroupId(studentGroup5.id)

    if (getResultRemoved.hasError) {
      throw new Error(`failed getAllByStudentGroupId ${JSON.stringify(getResultRemoved.error)}`)
    }
    expect(getResultRemoved.value).toEqual<typeof getResultRemoved.value>([
      {
        studentGroupId: studentGroup5.id,
        studentId: student6.id,
      },
    ])

    const getResultNotRemoved = await studentStudentGroupRepository.getAllByStudentGroupId(studentGroup6.id)

    if (getResultNotRemoved.hasError) {
      throw new Error(`failed getAllByStudentGroupId ${JSON.stringify(getResultNotRemoved.error)}`)
    }
    expect(getResultNotRemoved.value).toEqual<typeof getResultNotRemoved.value>([
      { studentGroupId: studentGroup6.id, studentId: student5.id },
      {
        studentGroupId: studentGroup6.id,
        studentId: student7.id,
      },
    ])
  })
})
