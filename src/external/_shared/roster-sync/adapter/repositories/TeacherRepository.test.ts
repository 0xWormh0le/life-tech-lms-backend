import { randomUUID } from 'crypto'
import { DeepPartial } from 'typeorm'
import { TeacherTypeormEntity } from '../../../../../adapter/typeorm/entity/Teacher'
import { TeacherOrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/TeacherOrganization'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { TeacherRepository } from './TeacherRepository'
import { DistrictTypeormEntity } from '../../../../../adapter/typeorm/entity/District'
import { Teacher } from '../../domain//entities/Teacher'

let createdOrganizationId1: string
let createdOrganizationId2: string

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
})

afterEach(teardownEnvironment)

describe('test TeacherRepository for Classlink', () => {
  test('success getAllByOrganizationId', async () => {
    const teacherId1 = randomUUID()
    const teacherId2 = randomUUID()
    const teacherId3 = randomUUID()

    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherTypeormRepository = appDataSource.getRepository(TeacherTypeormEntity)

    await teacherTypeormRepository.save<DeepPartial<TeacherTypeormEntity>>([
      {
        id: teacherId1,
        user_id: 'teacher-userId-1',
        first_name: 'teacher-firstName-1',
        last_name: 'teacher-lastName-1',
        teacher_lms_id: 'teacher-teacherLMSId-1',
        classlink_tenant_id: 'teacher-classlinkTenantId-1',
      },
      {
        id: teacherId2,
        user_id: 'teacher-userId-2',
        first_name: 'teacher-firstName-2',
        last_name: 'teacher-lastName-2',
        teacher_lms_id: 'teacher-teacherLMSId-2',
        classlink_tenant_id: 'teacher-classlinkTenantId-2',
      },
      {
        id: teacherId3,
        user_id: 'teacher-userId-3',
        first_name: 'teacher-firstName-3',
        last_name: 'teacher-lastName-3',
        teacher_lms_id: 'teacher-teacherLMSId-3',
        classlink_tenant_id: 'teacher-classlinkTenantId-3',
      },
    ])

    const teacherOrganizationTypeormRepository = appDataSource.getRepository(TeacherOrganizationTypeormEntity)

    await teacherOrganizationTypeormRepository.save<DeepPartial<TeacherOrganizationTypeormEntity>>([
      {
        organization: { id: createdOrganizationId1 },
        teacher: { id: teacherId1 },
      },
      {
        organization: { id: createdOrganizationId1 },
        teacher: { id: teacherId2 },
      },
      {
        organization: { id: createdOrganizationId2 },
        teacher: { id: teacherId1 },
      },
      {
        organization: { id: createdOrganizationId2 },
        teacher: { id: teacherId3 },
      },
    ])

    const teacherRepository = new TeacherRepository(appDataSource)
    const getTeachersResult1 = await teacherRepository.getAllByOrganizationId(createdOrganizationId1)

    if (getTeachersResult1.hasError) {
      throw new Error(`teacherRepository.getAllByOrganizationId failed ${JSON.stringify(getTeachersResult1.error)}`)
    }
    expect(
      getTeachersResult1.value.map<Teacher>((e) => ({
        id: e.id,
        userId: e.userId,
        firstName: e.firstName,
        lastName: e.lastName,
        teacherLMSId: e.teacherLMSId,
        classlinkTenantId: e.classlinkTenantId,
        isDeactivated: false,
      })),
    ).toEqual<Teacher[]>([
      {
        id: teacherId1,
        userId: 'teacher-userId-1',
        firstName: 'teacher-firstName-1',
        lastName: 'teacher-lastName-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
        classlinkTenantId: 'teacher-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: teacherId2,
        userId: 'teacher-userId-2',
        firstName: 'teacher-firstName-2',
        lastName: 'teacher-lastName-2',
        teacherLMSId: 'teacher-teacherLMSId-2',
        classlinkTenantId: 'teacher-classlinkTenantId-2',
        isDeactivated: false,
      },
    ])

    const getTeachersResult2 = await teacherRepository.getAllByOrganizationId(createdOrganizationId2)

    if (getTeachersResult2.hasError) {
      throw new Error(`teacherRepository.getAllByOrganizationId failed ${JSON.stringify(getTeachersResult2.error)}`)
    }
    expect(
      getTeachersResult2.value.map<Teacher>((e) => ({
        id: e.id,
        userId: e.userId,
        firstName: e.firstName,
        lastName: e.lastName,
        teacherLMSId: e.teacherLMSId,
        classlinkTenantId: e.classlinkTenantId,
        isDeactivated: false,
      })),
    ).toEqual<Teacher[]>([
      {
        id: teacherId1,
        userId: 'teacher-userId-1',
        firstName: 'teacher-firstName-1',
        lastName: 'teacher-lastName-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
        classlinkTenantId: 'teacher-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: teacherId3,
        userId: 'teacher-userId-3',
        firstName: 'teacher-firstName-3',
        lastName: 'teacher-lastName-3',
        teacherLMSId: 'teacher-teacherLMSId-3',
        classlinkTenantId: 'teacher-classlinkTenantId-3',
        isDeactivated: false,
      },
    ])
  })

  test('success createTeacher', async () => {
    const teacherId1 = randomUUID()
    const teacherId2 = randomUUID()

    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)
    const teacherInfo: Teacher[] = [
      {
        id: teacherId1,
        userId: 'teacher-userId-1',
        firstName: 'teacher-firstName-1',
        lastName: 'teacher-lastName-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
        classlinkTenantId: 'teacher-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: teacherId2,
        userId: 'teacher-userId-2',
        firstName: 'teacher-firstName-2',
        lastName: 'teacher-lastName-2',
        teacherLMSId: 'teacher-teacherLMSId-2',
        classlinkTenantId: 'teacher-classlinkTenantId-2',
        isDeactivated: false,
      },
    ]
    const createdTeachers = await teacherRepository.createTeachers(teacherInfo)

    if (createdTeachers.hasError) {
      throw new Error(`teacherRepository.createTeachers failed ${JSON.stringify(createdTeachers.error)}`)
    }
    expect(createdTeachers.value[0].id).toBeTruthy()
    expect(createdTeachers.value[1].id).toBeTruthy()

    const teacherTypeormRepository = appDataSource.getRepository(TeacherTypeormEntity)
    const findTeachersResult = await teacherTypeormRepository.find()

    expect(
      findTeachersResult.map((e) => ({
        id: e.id,
        userId: e.user_id,
        firstName: e.first_name,
        lastName: e.last_name,
        teacherLMSId: e.teacher_lms_id,
        classlinkTenantId: e.classlink_tenant_id,
        isDeactivated: false,
      })),
    ).toEqual<Teacher[]>([
      {
        id: teacherId1,
        userId: 'teacher-userId-1',
        firstName: 'teacher-firstName-1',
        lastName: 'teacher-lastName-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
        classlinkTenantId: 'teacher-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: teacherId2,
        userId: 'teacher-userId-2',
        firstName: 'teacher-firstName-2',
        lastName: 'teacher-lastName-2',
        teacherLMSId: 'teacher-teacherLMSId-2',
        classlinkTenantId: 'teacher-classlinkTenantId-2',
        isDeactivated: false,
      },
    ])
  })

  test('success updateTeacher ', async () => {
    const teacherId1 = randomUUID()
    const teacherId2 = randomUUID()
    const teacherId3 = randomUUID()

    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherTypeormRepository = appDataSource.getRepository(TeacherTypeormEntity)

    await teacherTypeormRepository.save<DeepPartial<TeacherTypeormEntity>>([
      {
        id: teacherId1,
        user_id: 'teacher-userId-1',
        first_name: 'teacher-firstName-1',
        last_name: 'teacher-lastName-1',
        teacher_lms_id: 'teacher-teacherLMSId-1',
        classlink_tenant_id: 'teacher-classlinkTenantId-1',
      },
      {
        id: teacherId2,
        user_id: 'teacher-userId-2',
        first_name: 'teacher-firstName-2',
        last_name: 'teacher-lastName-2',
        teacher_lms_id: 'teacher-teacherLMSId-2',
        classlink_tenant_id: 'teacher-classlinkTenantId-2',
      },
      {
        id: teacherId3,
        user_id: 'teacher-userId-3',
        first_name: 'teacher-firstName-3',
        last_name: 'teacher-lastName-3',
        teacher_lms_id: 'teacher-teacherLMSId-3',
        classlink_tenant_id: 'teacher-classlinkTenantId-3',
      },
    ])

    const teacherRepository = new TeacherRepository(appDataSource)

    const updateTeachers = await teacherRepository.updateTeachers([
      {
        id: teacherId1,
        userId: 'changed-teacher-userId-1',
        firstName: 'changed-teacher-firstName-1',
        lastName: 'changed-teacher-lastName-1',
        teacherLMSId: 'changed-teacher-teacherLMSId-1',
        classlinkTenantId: 'changed-teacher-classlinkTenantId-1',
        isDeactivated: false,
      },
      {
        id: teacherId2,
        userId: 'changed-teacher-userId-2',
        firstName: 'changed-teacher-firstName-2',
        lastName: 'changed-teacher-lastName-2',
        teacherLMSId: 'changed-teacher-teacherLMSId-2',
        classlinkTenantId: 'changed-teacher-classlinkTenantId-2',
        isDeactivated: false,
      },
    ])

    expect(updateTeachers.value).toEqual(undefined)
    expect(updateTeachers.error).toEqual(null)
    expect(updateTeachers.hasError).toEqual(false)

    const findTeachersResult = await teacherTypeormRepository.find()
    const mapped = findTeachersResult.map<Teacher>((e) => ({
      id: e.id,
      userId: e.user_id,
      firstName: e.first_name,
      lastName: e.last_name,
      teacherLMSId: e.teacher_lms_id,
      classlinkTenantId: e.classlink_tenant_id,
      isDeactivated: false,
    }))

    expect(mapped.find((e) => e.id === teacherId1)).toEqual<Teacher>({
      id: teacherId1,
      userId: 'changed-teacher-userId-1',
      firstName: 'changed-teacher-firstName-1',
      lastName: 'changed-teacher-lastName-1',
      teacherLMSId: 'changed-teacher-teacherLMSId-1',
      classlinkTenantId: 'changed-teacher-classlinkTenantId-1',
      isDeactivated: false,
    })
    expect(mapped.find((e) => e.id === teacherId2)).toEqual<Teacher>({
      id: teacherId2,
      userId: 'changed-teacher-userId-2',
      firstName: 'changed-teacher-firstName-2',
      lastName: 'changed-teacher-lastName-2',
      teacherLMSId: 'changed-teacher-teacherLMSId-2',
      classlinkTenantId: 'changed-teacher-classlinkTenantId-2',
      isDeactivated: false,
    })
    expect(mapped.find((e) => e.id === teacherId3)).toEqual<Teacher>({
      id: teacherId3,
      userId: 'teacher-userId-3',
      firstName: 'teacher-firstName-3',
      lastName: 'teacher-lastName-3',
      teacherLMSId: 'teacher-teacherLMSId-3',
      classlinkTenantId: 'teacher-classlinkTenantId-3',
      isDeactivated: false,
    })
  })

  test('success delete teacher', async () => {
    const teacherId1 = randomUUID()
    const teacherId2 = randomUUID()
    const teacherId3 = randomUUID()

    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherTypeormRepository = appDataSource.getRepository(TeacherTypeormEntity)

    await teacherTypeormRepository.save<DeepPartial<TeacherTypeormEntity>>([
      {
        id: teacherId1,
        user_id: 'teacher-userId-1',
        first_name: 'teacher-firstName-1',
        last_name: 'teacher-lastName-1',
        teacher_lms_id: 'teacher-teacherLMSId-1',
        classlink_tenant_id: 'teacher-classlinkTenantId-1',
      },
      {
        id: teacherId2,
        user_id: 'teacher-userId-2',
        first_name: 'teacher-firstName-2',
        last_name: 'teacher-lastName-2',
        teacher_lms_id: 'teacher-teacherLMSId-2',
        classlink_tenant_id: 'teacher-classlinkTenantId-2',
      },
      {
        id: teacherId3,
        user_id: 'teacher-userId-3',
        first_name: 'teacher-firstName-3',
        last_name: 'teacher-lastName-3',
        teacher_lms_id: 'teacher-teacherLMSId-3',
        classlink_tenant_id: 'teacher-classlinkTenantId-3',
      },
    ])

    const teacherRepository = new TeacherRepository(appDataSource)

    const resultDelete = await teacherRepository.deleteTeachers([teacherId1, teacherId3])

    expect(resultDelete.value).toEqual(undefined)
    expect(resultDelete.hasError).toEqual(false)
    expect(resultDelete.error).toEqual(null)

    const findTeachersAfterDeletedResult = await teacherTypeormRepository.find()
    const mappedFindTeachersAfterDeletedResult = findTeachersAfterDeletedResult.map<Teacher>((e) => ({
      id: e.id,
      userId: e.user_id,
      firstName: e.first_name,
      lastName: e.last_name,
      teacherLMSId: e.teacher_lms_id,
      classlinkTenantId: e.classlink_tenant_id,
      isDeactivated: e.is_deactivated,
    }))

    expect(mappedFindTeachersAfterDeletedResult.find((e) => e.id === teacherId1)?.isDeactivated).toEqual(true)
    expect(mappedFindTeachersAfterDeletedResult.find((e) => e.id === teacherId2)).toEqual<Teacher>({
      id: teacherId2,
      userId: 'teacher-userId-2',
      firstName: 'teacher-firstName-2',
      lastName: 'teacher-lastName-2',
      teacherLMSId: 'teacher-teacherLMSId-2',
      classlinkTenantId: 'teacher-classlinkTenantId-2',
      isDeactivated: false,
    })
    expect(mappedFindTeachersAfterDeletedResult.find((e) => e.id === teacherId3)?.isDeactivated).toEqual(true)
  })
})
