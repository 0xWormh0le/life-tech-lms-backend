import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { TeacherOrganizationRepository } from './TeacherOrganizationRepository'
import { appDataSource, setupEnvironment, teardownEnvironment } from '../../../../../adapter/_testShared/testUtilities'
import { TeacherTypeormEntity } from '../../../../../adapter/typeorm/entity/Teacher'
import { OrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/Organization'
import { TeacherOrganizationTypeormEntity } from '../../../../../adapter/typeorm/entity/TeacherOrganization'

beforeEach(setupEnvironment)

afterEach(teardownEnvironment)

describe('test TeacherOrganizationRepository for Classlink', () => {
  test('success getAllByOrganizationId', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create Organization */
    const organizationRepo = appDataSource.getRepository(OrganizationTypeormEntity)
    const organization1 = await organizationRepo.save({
      name: 'Organization-1',
      district_id: 'district-id-1',
    })
    const organization2 = await organizationRepo.save({
      name: 'Organization-2',
      district_id: 'district-id-2',
    })

    /* Create Teacher */
    const teacherRepo = appDataSource.getRepository(TeacherTypeormEntity)
    const teacher1 = await teacherRepo.save({
      first_name: 'teacher_first_name_1',
      last_name: 'teacher_last_name_1',
      user_id: 'user-id-1',
    })
    const teacher2 = await teacherRepo.save({
      first_name: 'teacher_first_name_2',
      last_name: 'teacher_last_name_2',
      user_id: 'user-id-2',
    })

    const teacherOrganizationRepo = appDataSource.getRepository(TeacherOrganizationTypeormEntity)

    await teacherOrganizationRepo
      .createQueryBuilder()
      .insert()
      .values([
        {
          teacher: teacher1.id,
          organization: organization1.id,
        },
        {
          teacher: teacher2.id,
          organization: organization2.id,
        },
      ] as QueryDeepPartialEntity<TeacherOrganizationTypeormEntity>[])
      .execute()

    const teacherOrganizationRepository = new TeacherOrganizationRepository(appDataSource)
    const result = await teacherOrganizationRepository.getAllByOrganizationId(organization1.id)

    if (result.hasError) {
      throw new Error(`failed getAllByOrganizationId`)
    }
    expect(result.value).toEqual<typeof result.value>([
      {
        organizationId: organization1.id,
        teacherId: teacher1.id,
      },
    ])
  })

  test('success createTeacherOrganizations', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create Organization */
    const organizationRepo = appDataSource.getRepository(OrganizationTypeormEntity)
    const organization3 = await organizationRepo.save({
      name: 'Organization-3',
      district_id: 'district-id-3',
    })
    const organization4 = await organizationRepo.save({
      name: 'Organization-4',
      district_id: 'district-id-4',
    })

    /* Create Teacher */
    const teacherRepo = appDataSource.getRepository(TeacherTypeormEntity)
    const teacher3 = await teacherRepo.save({
      first_name: 'teacher_first_name_3',
      last_name: 'teacher_last_name_3',
      user_id: 'user-id-3',
    })
    const teacher4 = await teacherRepo.save({
      first_name: 'teacher_first_name_4',
      last_name: 'teacher_last_name_4',
      user_id: 'user-id-4',
    })

    const teacherOrganizationRepository = new TeacherOrganizationRepository(appDataSource)

    const result = await teacherOrganizationRepository.createTeacherOrganizations([
      { organizationId: organization3.id, teacherId: teacher3.id },
      { organizationId: organization4.id, teacherId: teacher4.id },
    ])

    if (result.hasError) {
      throw new Error(`failed createTeacherOrganizations`)
    }

    const getResult = await teacherOrganizationRepository.getAllByOrganizationId(organization3.id)

    if (getResult.hasError) {
      throw new Error(`failed getAllByOrganizationId`)
    }
    expect(getResult.value).toEqual<typeof getResult.value>([
      {
        organizationId: organization3.id,
        teacherId: teacher3.id,
      },
    ])
  })

  test('success deleteTeacherOrganizations', async () => {
    if (!appDataSource) {
      throw new Error('Error')
    }

    /* Create Organization */
    const organizationRepo = appDataSource.getRepository(OrganizationTypeormEntity)
    const organization5 = await organizationRepo.save({
      name: 'Organization-5',
      district_id: 'district-id-5',
    })
    const organization6 = await organizationRepo.save({
      name: 'Organization-6',
      district_id: 'district-id-6',
    })

    /* Create Teacher */
    const teacherRepo = appDataSource.getRepository(TeacherTypeormEntity)
    const teacher5 = await teacherRepo.save({
      first_name: 'teacher_first_name_5',
      last_name: 'teacher_last_name_5',
      user_id: 'user-id-5',
    })
    const teacher6 = await teacherRepo.save({
      first_name: 'teacher_first_name_6',
      last_name: 'teacher_last_name_6',
      user_id: 'user-id-6',
    })
    const teacher7 = await teacherRepo.save({
      first_name: 'teacher_first_name_7',
      last_name: 'teacher_last_name_7',
      user_id: 'user-id-7',
    })

    /* Create TeacherOrganization */
    const teacherOrganizationRepo = appDataSource.getRepository(TeacherOrganizationTypeormEntity)

    await teacherOrganizationRepo.save([
      {
        organization: { id: organization5.id },
        teacher: { id: teacher5.id },
      },
      {
        organization: { id: organization5.id },
        teacher: { id: teacher6.id },
      },
      {
        organization: { id: organization6.id },
        teacher: { id: teacher5.id },
      },
      {
        organization: { id: organization6.id },
        teacher: { id: teacher6.id },
      },
      {
        organization: { id: organization6.id },
        teacher: { id: teacher7.id },
      },
    ])

    const teacherOrganizationRepository = new TeacherOrganizationRepository(appDataSource)

    const result = await teacherOrganizationRepository.deleteTeacherOrganizations([
      { organizationId: organization5.id, teacherId: teacher5.id },
      { organizationId: organization6.id, teacherId: teacher6.id },
    ])

    if (result.hasError) {
      throw new Error(`failed createTeacherOrganizations`)
    }

    const getResultRemoved = await teacherOrganizationRepository.getAllByOrganizationId(organization5.id)

    if (getResultRemoved.hasError) {
      throw new Error(`failed getAllByOrganizationId`)
    }
    expect(getResultRemoved.value).toEqual<typeof getResultRemoved.value>([
      {
        organizationId: organization5.id,
        teacherId: teacher6.id,
      },
    ])

    const getResultNotRemoved = await teacherOrganizationRepository.getAllByOrganizationId(organization6.id)

    if (getResultNotRemoved.hasError) {
      throw new Error(`failed getAllByOrganizationId`)
    }
    expect(getResultNotRemoved.value).toEqual<typeof getResultNotRemoved.value>([
      { organizationId: organization6.id, teacherId: teacher5.id },
      {
        organizationId: organization6.id,
        teacherId: teacher7.id,
      },
    ])
  })
})
