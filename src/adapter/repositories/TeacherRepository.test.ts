import { appDataSource, setupEnvironment, teardownEnvironment } from '../_testShared/testUtilities'
import { TeacherRepository } from './TeacherRepository'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { TeacherTypeormEntity } from '../typeorm/entity/Teacher'
import { TeacherOrganizationTypeormEntity } from '../typeorm/entity/TeacherOrganization'

let createdOrganizationId1: string
let createdOrganizationId2: string

const TeacherInfo = [
  {
    firstName: 'teacher-first-1',
    lastName: 'teacher-last-1',
    email: 'teacher-first-1@gmail.com',
    teacherLMSId: 'teacher-lms-1',
  },
  {
    firstName: 'teacher-first-2',
    lastName: 'teacher-last-2',
    email: 'teacher-first-2@gmail.com',
    teacherLMSId: 'teacher-lms-2',
  },
  {
    firstName: 'teacher-first-3',
    lastName: 'teacher-last-3',
    email: 'teacher-first-3@gmail.com',
    teacherLMSId: 'teacher-lms-3',
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

describe('test TeacherRepository for Codex', () => {
  test('success createTeacher and getTeachers', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, 'user-id-1')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }
    expect(getTeachers.hasError).toEqual(false)
    expect(getTeachers.error).toEqual(null)
    expect(
      getTeachers.value?.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          teacherLMSId: item.teacherLMSId,
        }
      }),
    ).toEqual(TeacherInfo)
  })

  test('success updateTeacherById', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherIdToUpdate = getTeachers.value?.[0].id
    const teacherUserIdToUpdate = getTeachers.value?.[0].userId ?? ''

    const updateTeacherById = await teacherRepository.updateTeacherById(teacherIdToUpdate, teacherUserIdToUpdate, {
      email: 'updateteacher@gmail.com',
      firstName: 'update-first-name',
      lastName: 'update-last-name',
    })

    expect(updateTeacherById.hasError).toBe(false)
    expect(updateTeacherById.error).toBe(null)
    expect(updateTeacherById.value).toBe(undefined)

    const getTeachers1 = await teacherRepository.getTeachers(createdOrganizationId1, [teacherIdToUpdate])

    if (getTeachers1.hasError) {
      throw new Error(`Failed to get Teachers`)
    }
    expect((({ id, userId, email, firstName, lastName }) => ({ id, userId, email, firstName, lastName }))(getTeachers1.value[0])).toEqual({
      id: teacherIdToUpdate,
      userId: teacherUserIdToUpdate,
      email: 'updateteacher@gmail.com',
      firstName: 'update-first-name',
      lastName: 'update-last-name',
    })
  })

  test('success getTeacherByTeacherLMSIds', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const getTeacherInfo = await teacherRepository.getTeacherByTeacherLMSIds(['teacher-lms-1', 'teacher-lms-2'])

    if (getTeacherInfo.hasError) {
      throw new Error(`Failed to get Teachers`)
    }
    expect(getTeacherInfo.hasError).toBe(false)
    expect(getTeacherInfo.error).toBe(null)

    expect(
      getTeacherInfo.value.map((i) => {
        {
          return {
            firstName: i.firstName,
            lastName: i.lastName,
            teacherLMSId: i.teacherLMSId,
          }
        }
      }),
    ).toStrictEqual(
      TeacherInfo.map((i) => {
        if (i.teacherLMSId === 'teacher-lms-1' || i.teacherLMSId === 'teacher-lms-2') {
          return {
            firstName: i.firstName,
            lastName: i.lastName,
            teacherLMSId: i.teacherLMSId,
          }
        }
      }).filter((item) => item !== undefined),
    )
  })

  test('success deleteTeacher', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)
    const teacherTypeormRepository = appDataSource.getRepository(TeacherTypeormEntity)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherIdToDelete = getTeachers.value?.[0].id

    const teacherResult = await teacherRepository.deleteTeacher(teacherIdToDelete)

    if (teacherResult.hasError) {
      throw new Error(`Failed to get Teachers`)
    }
    expect(teacherResult.hasError).toBe(false)
    expect(teacherResult.error).toBe(null)

    const checkDeletedTeacher = await teacherTypeormRepository.findOneBy({
      id: teacherIdToDelete,
    })

    expect(checkDeletedTeacher).toEqual(null)
  })

  test('success deactivateTeacher', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)
    const teacherTypeormRepository = appDataSource.getRepository(TeacherTypeormEntity)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherIdToDeactivate = getTeachers.value?.[0].id
    const teacherResult = await teacherRepository.deactivateTeacher(teacherIdToDeactivate)

    if (teacherResult.hasError) {
      throw new Error(`Failed to deactivate the Teacher`)
    }
    expect(teacherResult.hasError).toBe(false)
    expect(teacherResult.error).toBe(null)
    expect(teacherResult.value?.message).toBe('ok')

    const teacherResult1 = await teacherTypeormRepository.findOneBy({ id: teacherIdToDeactivate })

    if (!teacherResult1) {
      throw new Error(`Failed to get the Teacher`)
    }
    expect(teacherResult1['is_deactivated']).toEqual(true)
    expect(teacherResult1['id']).toEqual(teacherIdToDeactivate)
  })

  test('success getTeacherByTeacherId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherId = getTeachers.value?.[0].id
    const getTeacherByTeacherIdResult = await teacherRepository.getTeacherByTeacherId(teacherId)

    if (getTeacherByTeacherIdResult.hasError) {
      throw new Error(`Failed to get Teacher info of ${teacherId}`)
    }

    expect(getTeacherByTeacherIdResult.hasError).toEqual(false)
    expect(getTeacherByTeacherIdResult.error).toEqual(null)

    if (getTeacherByTeacherIdResult.value) {
      expect({
        teacherId: getTeacherByTeacherIdResult.value['teacherId'],
        userId: getTeacherByTeacherIdResult.value['userId'],
        email: getTeacherByTeacherIdResult.value['email'],
        firstName: getTeacherByTeacherIdResult.value['firstName'],
        lastName: getTeacherByTeacherIdResult.value['lastName'],
        teacherOrganizations: getTeacherByTeacherIdResult.value['teacherOrganizations'],
      }).toEqual({
        teacherId: teacherId,
        userId: getTeachers.value?.[0].userId,
        email: getTeachers.value?.[0].email,
        firstName: getTeachers.value?.[0].firstName,
        lastName: getTeachers.value?.[0].lastName,
        teacherOrganizations: [
          {
            id: createdOrganizationId1,
            name: 'organization-name-1',
            stateId: null,
          },
        ],
      })
    } else {
      expect(getTeacherByTeacherIdResult.value).toEqual(undefined)
    }
  })

  test('success getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)
    const teacherOrganizationTypeormRepository = appDataSource.getRepository(TeacherOrganizationTypeormEntity)

    const createTeacherresult = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (createTeacherresult.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(createTeacherresult.hasError).toBe(false)
    expect(createTeacherresult.error).toBe(null)
    expect(createTeacherresult.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherId = getTeachers.value?.[0].id
    const result = await teacherRepository.getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId(teacherId, createdOrganizationId1)

    if (result.hasError) {
      throw new Error(`Failed to get Teacher`)
    }

    const teacherOrganization = await teacherOrganizationTypeormRepository
      .createQueryBuilder()
      .where('teacher_id =:teacherId', { teacherId })
      .andWhere('organization_id =:organizationId', { organizationId: createdOrganizationId1 })
      .select('id', 'id')
      .getRawOne()

    if (!teacherOrganization) {
      throw new Error(`Failed to get Teacher organization mapping data`)
    }
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual([teacherOrganization.id])
  })

  test('success removeTeacherFromOrganization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherId = getTeachers.value?.[0].id

    const removeTeacherFromOrganizationResult = await teacherRepository.removeTeacherFromOrganization(createdOrganizationId1, teacherId)

    if (removeTeacherFromOrganizationResult.hasError) {
      throw new Error(`Failed to remove Teacher in organization`)
    }
    expect(removeTeacherFromOrganizationResult.hasError).toEqual(false)
    expect(removeTeacherFromOrganizationResult.error).toEqual(null)
    expect(removeTeacherFromOrganizationResult.value).toEqual(undefined)

    const isTeacherRelatedToOrganization = await teacherRepository.getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId(
      teacherId,
      createdOrganizationId1,
    )

    if (isTeacherRelatedToOrganization.hasError) {
      throw new Error(`Failed to get Teacher`)
    }
    expect(isTeacherRelatedToOrganization.value.length).toEqual(0)
  })

  test('success addTeacherInOrganization', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherId = getTeachers.value?.[0].id

    const addTeacherInOrganizationResult = await teacherRepository.addTeacherInOrganization(createdOrganizationId2, teacherId, '')

    if (addTeacherInOrganizationResult.hasError) {
      throw new Error(`Failed to add Teacher in organization`)
    }
    expect(addTeacherInOrganizationResult.hasError).toEqual(false)
    expect(addTeacherInOrganizationResult.error).toEqual(null)
    expect(addTeacherInOrganizationResult.value).toEqual(undefined)

    const isTeacherRelatedToOrganization = await teacherRepository.getTeacherOrganizationsTeachersByTeacherIdAndOrganizationId(
      teacherId,
      createdOrganizationId2,
    )

    if (isTeacherRelatedToOrganization.hasError) {
      throw new Error(`Failed to get Teacher`)
    }
    expect(isTeacherRelatedToOrganization.value.length).toEqual(1)
  })

  test('success getTeacherByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const userId = getTeachers.value?.[0].userId ?? ''

    const getTeacherByUserIdResult = await teacherRepository.getTeacherByUserId(userId)

    if (getTeacherByUserIdResult.hasError) {
      throw new Error(`Failed to get Teacher info of user id ${userId}`)
    }

    expect(getTeacherByUserIdResult.hasError).toEqual(false)
    expect(getTeacherByUserIdResult.error).toEqual(null)

    if (getTeacherByUserIdResult.value) {
      expect({
        teacherId: getTeacherByUserIdResult.value['teacherId'],
        userId: getTeacherByUserIdResult.value['userId'],
        email: getTeacherByUserIdResult.value['email'],
        firstName: getTeacherByUserIdResult.value['firstName'],
        lastName: getTeacherByUserIdResult.value['lastName'],
        teacherOrganizations: getTeacherByUserIdResult.value['teacherOrganizations'],
      }).toEqual({
        teacherId: getTeachers.value?.[0].id,
        userId: userId,
        email: getTeachers.value?.[0].email,
        firstName: getTeachers.value?.[0].firstName,
        lastName: getTeachers.value?.[0].lastName,
        teacherOrganizations: [
          {
            id: createdOrganizationId1,
            name: 'organization-name-1',
            stateId: null,
          },
        ],
      })
    } else {
      expect(getTeacherByUserIdResult.value).toEqual(undefined)
    }
  })

  test('success getTeacherIdByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const userId = getTeachers.value?.[0].userId ?? ''

    const getTeacherByUserIdResult = await teacherRepository.getTeacherIdByUserId(userId)

    if (getTeacherByUserIdResult.hasError) {
      throw new Error(`Failed to get Teacher info of user id ${userId}`)
    }

    expect(getTeacherByUserIdResult.hasError).toEqual(false)
    expect(getTeacherByUserIdResult.error).toEqual(null)
    expect(getTeacherByUserIdResult.value).toEqual(getTeachers.value?.[0].id)
  })

  test('success getTeacherDetailByUserId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const userId = getTeachers.value?.[0].userId ?? ''

    const getTeacherByUserIdResult = await teacherRepository.getTeacherDetailByUserId(userId)

    if (getTeacherByUserIdResult.hasError) {
      throw new Error(`Failed to get Teacher info of user id ${userId}`)
    }

    expect(getTeacherByUserIdResult.hasError).toEqual(false)
    expect(getTeacherByUserIdResult.error).toEqual(null)

    if (getTeacherByUserIdResult.value) {
      expect({
        teacherId: getTeacherByUserIdResult.value['id'],
        userId: getTeacherByUserIdResult.value['userId'],
        teacherLMSId: getTeacherByUserIdResult.value['teacherLMSId'],
        firstName: getTeacherByUserIdResult.value['firstName'],
        lastName: getTeacherByUserIdResult.value['lastName'],
      }).toEqual({
        teacherId: getTeachers.value?.[0].id,
        userId: userId,
        teacherLMSId: getTeachers.value?.[0].teacherLMSId,
        firstName: getTeachers.value?.[0].firstName,
        lastName: getTeachers.value?.[0].lastName,
      })
    } else {
      expect(getTeacherByUserIdResult.value).toEqual(null)
    }
  })

  test('success getTeacherOrganizationIdsByTeacherId', async () => {
    if (!appDataSource) {
      throw new Error('Error appDataSource not found')
    }

    const teacherRepository = new TeacherRepository(appDataSource)

    const result = await teacherRepository.createTeachers(createdOrganizationId1, TeacherInfo, '43792175-b143-4aaa-b3b8-2a06bc6ae3e2')

    if (result.hasError) {
      throw new Error(`Teacher not created in database`)
    }
    expect(result.hasError).toBe(false)
    expect(result.error).toBe(null)
    expect(result.value).toBe(undefined)

    const getTeachers = await teacherRepository.getTeachers(createdOrganizationId1)

    if (getTeachers.hasError) {
      throw new Error(`Failed to get Teachers`)
    }

    const teacherId = getTeachers.value?.[0].id ?? ''

    const getTeacherOrganizationIdsResult = await teacherRepository.getTeacherOrganizationIdsByTeacherId(teacherId)

    if (getTeacherOrganizationIdsResult.hasError) {
      throw new Error(`Failed to get Teacher organization of user id ${teacherId}`)
    }

    expect(getTeacherOrganizationIdsResult.hasError).toEqual(false)
    expect(getTeacherOrganizationIdsResult.error).toEqual(null)
    expect(getTeacherOrganizationIdsResult.value).toEqual([createdOrganizationId1])
  })
})
