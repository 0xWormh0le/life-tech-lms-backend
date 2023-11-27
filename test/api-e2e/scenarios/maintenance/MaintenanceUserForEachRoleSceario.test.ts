import { AdministratorTypeormEntity } from '../../../../src/adapter/typeorm/entity/Administrator'
import { StudentTypeormEntity } from '../../../../src/adapter/typeorm/entity/Student'
import { TeacherTypeormEntity } from '../../../../src/adapter/typeorm/entity/Teacher'
import { MakeNullable } from '../../../../src/domain/usecases/shared/Types'
import { request } from '../../api/codex-api-request'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Check User Maintenance APIs create tables according to each role', async () => {
  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  // Create Users to assign to each District/Organization/StudentGroup
  const createUsersResponse1 = await request({
    url: '/maintenance/users',
    method: 'post',
    data: {
      users: [
        {
          role: 'student',
          loginId: 'student-login-id-1',
          email: 'student-email-id-1',
          password: 'student-password-1',
          nickname: 'student-nickname-1',
          lmsId: 'lms-id-1',
        },
        {
          role: 'student',
          loginId: 'student-login-id-2',
          email: '', // empty email is acceptable
          password: 'student-password-2',
          nickname: 'student-nickname-2',
        },
        {
          role: 'teacher',
          loginId: '', // empty loginId is acceptable
          email: 'teacher-email-id-3',
          password: 'teacher-password-3',
          firstName: 'teacher-first-name-3',
          lastName: 'teacher-last-name-3',
          lmsId: 'lms-id-3',
        },
        {
          role: 'teacher',
          loginId: 'teacher-login-id-4',
          email: '', // empty email is acceptable
          password: 'teacher-password-4',
          firstName: 'teacher-first-name-4',
          lastName: 'teacher-last-name-4',
        },
        {
          role: 'administrator',
          loginId: '', // empty loginId is acceptable
          email: 'administrator-email-id-5',
          password: 'administrator-password-5',
          firstName: 'administrator-first-name-5',
          lastName: 'administrator-last-name-5',
          lmsId: 'lms-id-5',
        },
        {
          role: 'administrator',
          loginId: 'administrator-login-id-6',
          email: 'administrator-email-id-6',
          password: 'administrator-password-6',
          firstName: 'administrator-first-name-6',
          lastName: 'administrator-last-name-6',
        },
        {
          role: 'internalOperator',
          loginId: 'internalOperator-login-id-7',
          email: 'internalOperator-email-id-7',
          password: 'internalOperator-password-7',
        },
      ],
    },
  })

  if (createUsersResponse1.hasError) {
    throw new Error(
      `POST /maintenance/users failed ${JSON.stringify(
        createUsersResponse1.error,
      )}`,
    )
  }
  expect(createUsersResponse1.value.users[0].role).toEqual('student')
  expect(createUsersResponse1.value.users[1].role).toEqual('student')
  expect(createUsersResponse1.value.users[2].role).toEqual('teacher')
  expect(createUsersResponse1.value.users[3].role).toEqual('teacher')
  expect(createUsersResponse1.value.users[4].role).toEqual('administrator')
  expect(createUsersResponse1.value.users[5].role).toEqual('administrator')
  expect(createUsersResponse1.value.users[6].role).toEqual('internalOperator')

  // Check each role records created correcly
  type StudentInDatabase = MakeNullable<
    Pick<StudentTypeormEntity, 'user_id' | 'nick_name' | 'student_lms_id'>,
    'student_lms_id'
  >
  type TeacherInDatabase = MakeNullable<
    Pick<
      TeacherTypeormEntity,
      'user_id' | 'first_name' | 'last_name' | 'teacher_lms_id'
    >,
    'teacher_lms_id'
  >
  type AdministratorInDatabase = MakeNullable<
    Pick<
      AdministratorTypeormEntity,
      'user_id' | 'first_name' | 'last_name' | 'administrator_lms_id'
    >,
    'administrator_lms_id'
  >

  const studentRepo = await appDataSource.getRepository(StudentTypeormEntity)
  const teacherRepo = await appDataSource.getRepository(TeacherTypeormEntity)
  const administratorRepo = await appDataSource.getRepository(
    AdministratorTypeormEntity,
  )
  const students1 = await studentRepo.find({
    order: {
      created_date: 'ASC',
    },
  })

  expect(
    students1.map<StudentInDatabase>((s) => ({
      user_id: s.user_id,
      nick_name: s.nick_name,
      student_lms_id: s.student_lms_id,
    })),
  ).toEqual<StudentInDatabase[]>([
    {
      user_id: createUsersResponse1.value.users[0].id,
      nick_name: 'student-nickname-1',
      student_lms_id: 'lms-id-1',
    },
    {
      user_id: createUsersResponse1.value.users[1].id,
      nick_name: 'student-nickname-2',
      student_lms_id: null,
    },
  ])

  const teachers1 = await teacherRepo.find({
    order: {
      created_date: 'ASC',
    },
  })

  expect(
    teachers1.map<TeacherInDatabase>((e) => ({
      user_id: e.user_id,
      first_name: e.first_name,
      last_name: e.last_name,
      teacher_lms_id: e.teacher_lms_id,
    })),
  ).toEqual<TeacherInDatabase[]>([
    {
      user_id: createUsersResponse1.value.users[2].id,
      first_name: 'teacher-first-name-3',
      last_name: 'teacher-last-name-3',
      teacher_lms_id: 'lms-id-3',
    },
    {
      user_id: createUsersResponse1.value.users[3].id,
      first_name: 'teacher-first-name-4',
      last_name: 'teacher-last-name-4',
      teacher_lms_id: null,
    },
  ])

  const administrators1 = await administratorRepo.find({
    order: {
      created_date: 'ASC',
    },
  })

  expect(
    administrators1.map<AdministratorInDatabase>((e) => ({
      user_id: e.user_id,
      first_name: e.first_name,
      last_name: e.last_name,
      administrator_lms_id: e.administrator_lms_id,
    })),
  ).toEqual<AdministratorInDatabase[]>([
    {
      user_id: createUsersResponse1.value.users[4].id,
      first_name: 'administrator-first-name-5',
      last_name: 'administrator-last-name-5',
      administrator_lms_id: 'lms-id-5',
    },
    {
      user_id: createUsersResponse1.value.users[5].id,
      first_name: 'administrator-first-name-6',
      last_name: 'administrator-last-name-6',
      administrator_lms_id: null,
    },
  ])

  // Update Users
  const updateUsersResponse1 = await request({
    url: '/maintenance/users',
    method: 'put',
    data: {
      users: [
        {
          id: createUsersResponse1.value.users[0].id,
          role: 'student',
          loginId: 'student-login-id-1',
          email: 'student-email-id-1',
          password: 'student-password-1',
          nickname: 'student-nickname-1',
          lmsId: 'lms-id-1',
        },
        {
          id: createUsersResponse1.value.users[1].id,
          role: 'teacher', // change role from student
          loginId: 'student-login-id-2',
          email: '', // empty email is acceptable
          password: 'student-password-2',
          firstName: 'teacher-first-name-2',
          lastName: 'teacher-last-name-2',
          lmsId: 'lms-id-2', // Update
        },
        {
          id: createUsersResponse1.value.users[2].id,
          role: 'teacher',
          loginId: '', // empty loginId is acceptable
          email: 'teacher-email-id-3',
          password: 'teacher-password-3',
          firstName: 'teacher-first-name-3',
          lastName: 'teacher-last-name-3',
          lmsId: 'lms-id-3',
        },
        {
          id: createUsersResponse1.value.users[3].id,
          role: 'student', // change role from teacher
          loginId: 'teacher-login-id-4',
          email: '', // empty email is acceptable
          password: 'teacher-password-4',
          nickname: 'student-nickname-4',
          lmsId: 'lms-id-4', // Update
        },
        {
          id: createUsersResponse1.value.users[4].id,
          role: 'administrator',
          loginId: '', // empty loginId is acceptable
          email: 'administrator-email-id-5',
          password: 'administrator-password-5',
          firstName: 'administrator-first-name-5',
          lastName: 'administrator-last-name-5',
          lmsId: 'lms-id-5',
        },
        {
          id: createUsersResponse1.value.users[5].id,
          role: 'teacher', // change role from administrator
          loginId: 'administrator-login-id-6',
          email: 'teacher-email-id-6',
          password: 'teacher-password-6',
          firstName: 'teacher-first-name-6',
          lastName: 'teacher-last-name-6',
          lmsId: 'lms-id-6', // Update
        },
        {
          id: createUsersResponse1.value.users[6].id,
          role: 'internalOperator',
          loginId: 'internalOperator-login-id-7',
          email: 'internalOperator-email-id-7',
          password: 'internalOperator-password-7',
        },
      ],
    },
  })

  if (updateUsersResponse1.hasError) {
    throw new Error(
      `PUT /maintenance/users failed ${JSON.stringify(
        updateUsersResponse1.error,
      )}`,
    )
  }
  expect(updateUsersResponse1.value.users[0].role).toEqual('student')
  expect(updateUsersResponse1.value.users[1].role).toEqual('teacher')
  expect(updateUsersResponse1.value.users[2].role).toEqual('teacher')
  expect(updateUsersResponse1.value.users[3].role).toEqual('student')
  expect(updateUsersResponse1.value.users[4].role).toEqual('administrator')
  expect(updateUsersResponse1.value.users[5].role).toEqual('teacher')
  expect(updateUsersResponse1.value.users[6].role).toEqual('internalOperator')

  const students2 = await studentRepo.find({
    order: {
      created_date: 'ASC',
    },
  })

  expect(students2.length).toEqual(2)
  expect({
    id: students2[0].id,
    user_id: students2[0].user_id,
    nick_name: students2[0].nick_name,
    student_lms_id: students2[0].student_lms_id,
  }).toEqual<StudentInDatabase & { id: string }>({
    id: students1[0].id, // Check id was NOT changed
    user_id: students1[0].user_id,
    nick_name: 'student-nickname-1',
    student_lms_id: 'lms-id-1',
  })
  expect({
    user_id: students2[1].user_id,
    nick_name: students2[1].nick_name,
    student_lms_id: students2[1].student_lms_id,
  }).toEqual<StudentInDatabase>({
    // id should be new one
    user_id: teachers1[1].user_id,
    nick_name: 'student-nickname-4',
    student_lms_id: 'lms-id-4',
  })

  const teachers2 = await teacherRepo.find({
    order: {
      created_date: 'ASC',
    },
  })

  expect(teachers2.length).toEqual(3)
  expect({
    id: teachers2[0].id,
    user_id: teachers2[0].user_id,
    first_name: teachers2[0].first_name,
    last_name: teachers2[0].last_name,
    teacher_lms_id: teachers2[0].teacher_lms_id,
  }).toEqual<TeacherInDatabase & { id: string }>({
    id: teachers1[0].id, // Check id was NOT changed
    user_id: teachers1[0].user_id,
    first_name: 'teacher-first-name-3',
    last_name: 'teacher-last-name-3',
    teacher_lms_id: 'lms-id-3',
  })
  expect({
    user_id: teachers2[1].user_id,
    first_name: teachers2[1].first_name,
    last_name: teachers2[1].last_name,
    teacher_lms_id: teachers2[1].teacher_lms_id,
  }).toEqual<TeacherInDatabase>({
    // id should be new one
    user_id: students1[1].user_id,
    first_name: 'teacher-first-name-2',
    last_name: 'teacher-last-name-2',
    teacher_lms_id: 'lms-id-2',
  })
  expect({
    user_id: teachers2[2].user_id,
    first_name: teachers2[2].first_name,
    last_name: teachers2[2].last_name,
    teacher_lms_id: teachers2[2].teacher_lms_id,
  }).toEqual<TeacherInDatabase>({
    // id should be new one
    user_id: administrators1[1].user_id,
    first_name: 'teacher-first-name-6',
    last_name: 'teacher-last-name-6',
    teacher_lms_id: 'lms-id-6',
  })

  const administrators2 = await administratorRepo.find({
    order: {
      created_date: 'ASC',
    },
  })

  expect(administrators2.length).toEqual(1)
  expect({
    id: administrators2[0].id,
    user_id: administrators2[0].user_id,
    first_name: administrators2[0].first_name,
    last_name: administrators2[0].last_name,
    administrator_lms_id: administrators2[0].administrator_lms_id,
  }).toEqual<AdministratorInDatabase & { id: string }>({
    id: administrators1[0].id,
    user_id: administrators1[0].user_id,
    first_name: 'administrator-first-name-5',
    last_name: 'administrator-last-name-5',
    administrator_lms_id: 'lms-id-5',
  })
})
