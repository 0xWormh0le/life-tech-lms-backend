/* eslint-disable line-length */
import dotenv from 'dotenv'
import { DatabaseType, QueryBuilder } from 'typeorm'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

import { createAppDataSource } from '../src/adapter/typeorm/data-source'
import { UserTypeormEntity } from '../src/adapter/typeorm/entity/User'
import { StudentTypeormEntity } from '../src/adapter/typeorm/entity/Student'
import { TeacherTypeormEntity } from '../src/adapter/typeorm/entity/Teacher'
import { AdministratorTypeormEntity } from '../src/adapter/typeorm/entity/Administrator'
import { DistrictTypeormEntity } from '../src/adapter/typeorm/entity/District'
import { OrganizationTypeormEntity } from '../src/adapter/typeorm/entity/Organization'
import { StudentGroupTypeormEntity } from '../src/adapter/typeorm/entity/StudentGroup'
import { AdministratorDistrictTypeormEntity } from '../src/adapter/typeorm/entity/AdministratorDistrict'
import { TeacherOrganizationTypeormEntity } from '../src/adapter/typeorm/entity/TeacherOrganization'
import { StudentGroupStudentTypeormEntity } from '../src/adapter/typeorm/entity/StudentGroupStudent'
import { UserLessonStatusTypeormEntity, UserLessonStatusTypeormEnum } from '../src/adapter/typeorm/entity/UserLessonStatus'

import { lessons as lessonHardCodedData } from '../src/adapter/typeorm/hardcoded-data/Lessons'
import { hashingPassword } from '../src/adapter/repositories/shared/PassWordHashing'
import { csePackageLessonDefinitionsMapByUnitId } from '../src/adapter/typeorm/hardcoded-data/Pacakges/CsePackageLessonDefinitions'
import { StudentGroupPackageAssignmentTypeormEntity } from '../src/adapter/typeorm/entity/StudentGroupPackageAssignment'
import { DistrictPurchasedPackageTypeormEntity } from '../src/adapter/typeorm/entity/DistrictPurchasedPackage'
import { faker } from '@faker-js/faker'

/**
 * `max` will be included
 */
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomBoolean = (trueProbablity: number) => {
  return Math.random() < trueProbablity
}

const getRandomDate = (startFromNow: number, endFromNow: number) => {
  return dayjs().add(getRandomInt(startFromNow, endFromNow), 'minutes')
}

/**
 * Fisher–Yates Shuffle
 * https://bost.ocks.org/mike/shuffle/
 */
const shuffle = <T>(array: T[]): T[] => {
  if (array.length === 0) {
    return []
  }

  let m = array.length
  let t = array[0]
  let i = 0

  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }

  return array
}

const pacakgeCandidates = [
  'codeillusion-package-basic-full-premium-heroic',
  'codeillusion-package-basic-full-standard',
  'codeillusion-package-basic-half-premium-heroic',
  'codeillusion-package-basic-half-standard',
  'codeillusion-package-basic-1-premium-heroic',
  'codeillusion-package-basic-1-standard',
]

const stateIdCandidates = [
  { id: 'AL' },
  { id: 'IN' },
  { id: 'NM' },
  { id: 'WV' },
  { id: 'GA' },
  { id: 'AK' },
  { id: 'AZ' },
  { id: 'AR' },
  // { id: 'CA' },
  // { id: 'CO' },
  // { id: 'CT' },
  // { id: 'DE' },
  // { id: 'FL' },
  // { id: 'HI' },
  // { id: 'ID' },
  // { id: 'IL' },
  // { id: 'IA' },
  // { id: 'KS' },
  // { id: 'KY' },
  // { id: 'LA' },
  // { id: 'ME' },
  // { id: 'MD' },
  // { id: 'MA' },
  // { id: 'MI' },
  // { id: 'MN' },
  // { id: 'MS' },
  // { id: 'MO' },
  // { id: 'MT' },
  // { id: 'NB' },
  // { id: 'NV' },
  // { id: 'NH' },
  // { id: 'NJ' },
  // { id: 'NY' },
  // { id: 'NC' },
  // { id: 'ND' },
  // { id: 'OH' },
  // { id: 'OK' },
  // { id: 'OR' },
  // { id: 'PA' },
  // { id: 'RI' },
  // { id: 'SC' },
  // { id: 'SD' },
  // { id: 'TN' },
  // { id: 'TX' },
  // { id: 'UT' },
  // { id: 'VT' },
  // { id: 'VA' },
  // { id: 'WA' },
  // { id: 'WI' },
  // { id: 'WY' },
  // { id: 'DC' },
]

const main = async () => {
  /* Environment Variable Config */
  dotenv.config()

  if (!process.env.ROOT_FOLDER_PATH) {
    throw new Error(`process.env.ROOT_FOLDER_PATH is not defined`)
  }

  // Database Connection configs
  if (!process.env.POSTGRES_DATABASE_DIALECT) {
    throw new Error(`process.env.POSTGRES_DATABASE_DIALECT is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_HOST) {
    throw new Error(`process.env.POSTGRES_DATABASE_HOST is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_PORT) {
    throw new Error(`process.env.POSTGRES_DATABASE_PORT is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_USERNAME) {
    throw new Error(`process.env.POSTGRES_DATABASE_USERNAME is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_PASSWORD) {
    throw new Error(`process.env.POSTGRES_DATABASE_PASSWORD is not defined`)
  }

  if (!process.env.POSTGRES_DATABASE_NAME) {
    throw new Error(`process.env.POSTGRES_DATABASE_NAME is not defined`)
  }

  const lessons = lessonHardCodedData('http://localhost:3200/', 'http://localhost:3080/')

  console.log(`lessons.length ${lessons.length}`)

  // Database Connection
  const POSTGRES_DATABASE_PORT = parseInt(process.env.POSTGRES_DATABASE_PORT, 10)

  if (isNaN(POSTGRES_DATABASE_PORT)) {
    throw new Error(`process.env.POSTGRES_DATABASE_PORT is not a number`)
  }

  const appDataSource = createAppDataSource({
    POSTGRES_DATABASE_DIALECT: process.env.POSTGRES_DATABASE_DIALECT as DatabaseType,
    POSTGRES_DATABASE_HOST: process.env.POSTGRES_DATABASE_HOST,
    POSTGRES_DATABASE_PORT: parseInt(process.env.POSTGRES_DATABASE_PORT),
    POSTGRES_DATABASE_USERNAME: process.env.POSTGRES_DATABASE_USERNAME,
    POSTGRES_DATABASE_PASSWORD: process.env.POSTGRES_DATABASE_PASSWORD,
    POSTGRES_DATABASE_NAME: process.env.POSTGRES_DATABASE_NAME,
    ROOT_FOLDER_PATH: process.env.ROOT_FOLDER_PATH,
  })

  await appDataSource.initialize()
  await appDataSource.dropDatabase()
  await appDataSource.runMigrations()

  const userRepository = appDataSource.getRepository(UserTypeormEntity)
  const studentRepository = appDataSource.getRepository(StudentTypeormEntity)
  const teacherRepository = appDataSource.getRepository(TeacherTypeormEntity)
  const administratorRepository = appDataSource.getRepository(AdministratorTypeormEntity)
  const districtRepository = appDataSource.getRepository(DistrictTypeormEntity)
  const organizationRepository = appDataSource.getRepository(OrganizationTypeormEntity)
  const studentGroupRepository = appDataSource.getRepository(StudentGroupTypeormEntity)
  const administratorDistrictRepository = appDataSource.getRepository(AdministratorDistrictTypeormEntity)
  const teacherOrganizationRepository = appDataSource.getRepository(TeacherOrganizationTypeormEntity)
  const studentGroupStudentRepository = appDataSource.getRepository(StudentGroupStudentTypeormEntity)
  const userLessonStatusesRepository = appDataSource.getRepository(UserLessonStatusTypeormEntity)
  const districtPurchasedPackageRepository = appDataSource.getRepository(DistrictPurchasedPackageTypeormEntity)
  const studentGroupPackageAssignmentRepository = appDataSource.getRepository(StudentGroupPackageAssignmentTypeormEntity)

  const districtIdMap: () => {
    id: string
    administrators: {
      id: string
    }[]
    organizations: {
      id: string
      teachers: {
        id: string
      }[]
      studentgroups: {
        id: string
        students: {
          id: string
          lessonStatuses: {
            lessonId: string
          }[]
        }[]
      }[]
    }[]
  } = () => ({
    id: uuid(),
    administrators: [0, 1, 2].map((i) => ({ id: uuid() })),
    organizations: [0, 1].map((i) => ({
      id: uuid(),
      teachers: [0, 1, 2, 3, 4, 5].map((i) => ({ id: uuid() })),
      studentgroups: [0, 1, 2, 3, 4].map((i) => ({
        id: uuid(),
        students: shuffle([...Array((20 + i * 19) % 50).keys()]).map((j) => ({
          id: uuid(),
          lessonStatuses: [...Array(2 * j + i).keys()].map((k) => ({
            lessonId: lessons[k].id,
          })),
        })),
      })),
    })),
  })
  const idMap: {
    districts: ReturnType<typeof districtIdMap>[]
  } = {
    districts: [districtIdMap(), districtIdMap(), districtIdMap(), districtIdMap(), districtIdMap()],
  }

  await userRepository.insert({
    id: uuid(),
    email: 'lit',
    password: await hashingPassword('lit'),
    role: 'internal_operator',
    human_user_created_at: new Date(),
    human_user_updated_at: new Date(),
  })

  for (const [i, district] of idMap.districts.entries()) {
    console.log(`District ${i} ${district.id}`)

    // Insert District
    const districtIndex = `${i}`

    await districtRepository.insert({
      id: district.id,
      name: `${faker.address.city()} District ${districtIndex}`,
      lms_id: 'classlink',
      state_id: stateIdCandidates[getRandomInt(0, stateIdCandidates.length - 1)].id,
      created_user_id: uuid(),
      enable_roster_sync: i === 0,
      district_lms_id: i === 0 ? '1234567' : null,
      classlink_app_id: i === 0 ? 'jKWORGdUdX4%3D' : '',
      classlink_tenant_id: i === 0 ? '1356' : '',
      classlink_access_token: i === 0 ? '47078863-2fb8-4040-b697-8fe36ca78458' : '',
    })
    await districtPurchasedPackageRepository.insert({
      district_id: { id: district.id },
      package_id: pacakgeCandidates[i % pacakgeCandidates.length],
    })
    await districtPurchasedPackageRepository.insert({
      district_id: { id: district.id },
      package_id: 'cse-package-full-standard',
    })
    for (const [administratorIndex, administrator] of district.administrators.entries()) {
      console.log(`Administrator ${administratorIndex}`)

      // Insert Administrators to District
      const USER_ID = uuid()

      await userRepository.insert({
        id: USER_ID,
        email: `admin-${districtIndex}-${administratorIndex}@lit.com`,
        password: await hashingPassword(`${administratorIndex}${administratorIndex}${administratorIndex}${administratorIndex}`),
        role: 'administrator',
        human_user_created_at: new Date(),
        human_user_updated_at: new Date(),
      })
      await administratorRepository.insert({
        id: administrator.id,
        first_name: 'Administrator',
        last_name: `${districtIndex}-${administratorIndex}`,
        user_id: USER_ID,
        created_user_id: uuid(),
      })
      await administratorDistrictRepository.insert({
        administrator: {
          id: administrator.id,
        },
        district: {
          id: district.id,
        },
        created_user_id: uuid(),
      })
    }
    for (const [j, organization] of district.organizations.entries()) {
      console.log(`Organization ${j}`)

      // Insert Organizations
      const organizationIndex = `${districtIndex}-${j}`

      await organizationRepository.insert({ id: organization.id, district_id: district.id, name: `Organization ${organizationIndex}` })
      for (const [teacherIndex, teacher] of organization.teachers.entries()) {
        console.log(`Teacher ${teacherIndex}`)

        // Insert Teachers to Organization
        const USER_ID = uuid()

        await userRepository.insert({
          id: USER_ID,
          email: `teacher-${organizationIndex}-${teacherIndex}@lit.com`,
          password: await hashingPassword(`${teacherIndex}${teacherIndex}${teacherIndex}${teacherIndex}`),
          role: 'teacher',
          human_user_created_at: new Date(),
          human_user_updated_at: new Date(),
        })
        await teacherRepository.insert({
          id: teacher.id,
          first_name: 'Teacher',
          last_name: `${organizationIndex}-${teacherIndex}`,
          user_id: USER_ID,
          created_user_id: uuid(),
        })
        await teacherOrganizationRepository.insert({
          teacher: {
            id: teacher.id,
          },
          organization: {
            id: organization.id,
          },
          created_user_id: uuid(),
        })
      }
      for (const [k, studentGroup] of organization.studentgroups.entries()) {
        console.log(`StudentGroup ${k}`)

        // Insert StudentGroups
        const studentGroupIndex = `${organizationIndex}-${k}`

        await studentGroupRepository.insert({
          id: studentGroup.id,
          organization_id: {
            id: organization.id,
          },
          name: `Student Group ${studentGroupIndex}`,
          created_user_id: uuid(),
        })
        await studentGroupPackageAssignmentRepository.insert({
          student_group_id: studentGroup.id,
          package_category_id: 'codeillusion',
          package_id: pacakgeCandidates[k % pacakgeCandidates.length],
        })

        if (k % 2 === 0) {
          await studentGroupPackageAssignmentRepository.insert({
            student_group_id: studentGroup.id,
            package_category_id: 'cse',
            package_id: 'cse-package-full-standard',
          })
        }
        for (const [studentIndex, student] of studentGroup.students.entries()) {
          console.log(`Student ${studentIndex}`)

          // Insert Students to StudentGroup
          const USER_ID = uuid()

          await userRepository.insert({
            id: USER_ID,
            login_id: `student-${studentGroupIndex}-${studentIndex}`,
            password: await hashingPassword(`${studentIndex}${studentIndex}${studentIndex}${studentIndex}`),
            role: 'student',
            human_user_created_at: new Date(),
            human_user_updated_at: new Date(),
          })
          await studentRepository.insert({
            id: student.id,
            nick_name: `Student${studentGroupIndex}-${studentIndex}`,
            user_id: USER_ID,
          })
          await studentGroupStudentRepository.insert({
            student_group_id: { id: studentGroup.id },
            student_id: { id: student.id },
          })
          await userLessonStatusesRepository.insert(
            student.lessonStatuses.map((lessonStatus) => {
              const startedAt = getRandomDate(-1000, -100)
              const finishedAt = startedAt.add(getRandomInt(0, 1000), 'seconds')

              return {
                user_id: USER_ID,
                lesson_id: lessonStatus.lessonId,
                status: UserLessonStatusTypeormEnum.cleared,
                achieved_star_count: getRandomInt(1, 3),
                correct_answered_quiz_count: getRandomBoolean(0.8) ? getRandomInt(0, 1) : undefined,
                used_hint_count: getRandomBoolean(0.8) ? getRandomInt(0, 1) : undefined,
                step_id_skipping_detected: getRandomBoolean(0.25),
                started_at: startedAt.toISOString(),
                finished_at: finishedAt.toISOString(),
              }
            }),
          )

          if (k % 2 === 0) {
            // this student clered CSE lessons
            for (let i = 0; i < Object.entries(csePackageLessonDefinitionsMapByUnitId).length; i++) {
              const [unitId, lessonsDefinitions] = Object.entries(csePackageLessonDefinitionsMapByUnitId)[i]

              for (let j = 0; j < lessonsDefinitions.length; j++) {
                const lesson = lessonsDefinitions[j]

                if (i > j) {
                  await userLessonStatusesRepository.insert({
                    user_id: USER_ID,
                    lesson_id: lesson.lessonId,
                    status: UserLessonStatusTypeormEnum.cleared,
                    achieved_star_count: 3,
                    correct_answered_quiz_count: getRandomInt(0, 3),
                    step_id_skipping_detected: false,
                    started_at: getRandomDate(-1000, -100),
                    finished_at: getRandomDate(-1000, -100),
                  })
                }
              }
            }
          }
        }
      }
      // Insert student group without any students
      await studentGroupRepository.insert({
        id: uuid(),
        organization_id: {
          id: organization.id,
        },

        name: `Empty Student Group ${organizationIndex}`,
        created_user_id: uuid(),
      })

      // Insert student group with one student who did not clear any lessons
      const STUDENT_GROUP_WITH_NOT_CLEARED_STUDENT_ID = uuid()

      await studentGroupRepository.insert({
        id: STUDENT_GROUP_WITH_NOT_CLEARED_STUDENT_ID,
        organization_id: {
          id: organization.id,
        },

        name: `Student Not Cleared Lessons ${organizationIndex}`,
        created_user_id: uuid(),
      })
      for (const studentIndex of [0, 1, 2]) {
        const USER_ID = uuid()
        const STUDENT_ID = uuid()

        await userRepository.insert({
          id: USER_ID,
          login_id: `student-not-cleared-${organizationIndex}-${studentIndex}`,
          password: await hashingPassword(`${studentIndex}${studentIndex}${studentIndex}${studentIndex}`),
          role: 'student',
          human_user_created_at: new Date(),
          human_user_updated_at: new Date(),
        })
        await studentRepository.insert({
          id: STUDENT_ID,
          nick_name: `Studentnot-cleared-${organizationIndex}-${studentIndex}`,
          user_id: USER_ID,
        })
        await studentGroupStudentRepository.insert({
          student_group_id: { id: STUDENT_GROUP_WITH_NOT_CLEARED_STUDENT_ID },
          student_id: { id: STUDENT_ID },
        })

        if (studentIndex === 0) {
          // this student started the lesson but not cleared
          await userLessonStatusesRepository.insert({
            user_id: USER_ID,
            lesson_id: lessons[0].id,
            status: UserLessonStatusTypeormEnum.not_cleared,
            achieved_star_count: 0, // in half way
            correct_answered_quiz_count: 0,
            step_id_skipping_detected: false,
            started_at: getRandomDate(-1000, -100),
            finished_at: undefined, // in half way
          })
        } else {
          // This student didn't even start any lesson yet
          // DO NOTING
        }
      }
    }
  }
}

main()
