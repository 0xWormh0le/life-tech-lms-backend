import { DataSource, In, QueryRunner } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { StudentInfo } from '../../domain/usecases/codex/Student/CreateStudentsUseCase'
import { StudentInfo as Student } from '../../domain/usecases/codex/Student/UpdateStudentUseCase'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { Student as Students } from '../../domain/entities/codex/Student'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { StudentTypeormEntity } from '../typeorm/entity/Student'
import { StudentGroupTypeormEntity } from '../typeorm/entity/StudentGroup'
import { StudentGroupStudentTypeormEntity } from '../typeorm/entity/StudentGroupStudent'
import { UserRoleTypeormEnum, UserTypeormEntity } from '../typeorm/entity/User'
import { AdministratorTypeormEntity } from '../typeorm/entity/Administrator'
import { OrgnaizationsList } from '../../domain/entities/codex/Teacher'
import { MeInfo } from '../../domain/entities/codex/User'
import { UserLessonStatusHistoryTypeormEntity } from '../typeorm/entity/UserLessonStatusHistory'
import { LessonTypeormEntity } from '../typeorm/entity/Lesson'
import { Option, userRoles } from '../../domain/usecases/shared/Constants'
import { hashingPassword } from './shared/PassWordHashing'
import { lessonsIndexedMap } from '../typeorm/hardcoded-data/Lessons'
import { StudentGroupPackageAssignmentTypeormEntity } from '../typeorm/entity/StudentGroupPackageAssignment'
import { StudentGroupPackageAssignment } from '../../domain/entities/codex/StudentGroupPackageAssignment'

export type StudentsInfo = Omit<
  Students,
  | 'loginId'
  | 'password'
  | 'emailsToNotify'
  | 'createdUserName'
  | 'createdDate'
  | 'lastLessionName'
  | 'lastLessonStartedAt'
> & {
  id: string
  nickName: string
  userId: string
  studentLMSId: string | null
  loginId?: string
  password?: string
  emailsToNotify?: string[] | undefined
  createdUserName?: string | null
  createdDate?: string
  lastLessionName?: string
  lastLessonStartedAt?: string
}

export class StudentRepository {
  constructor(private typeormDataSource: DataSource) {}

  async createStudents(
    data: StudentInfo[],
    createdUserId: string,
    studentGroupId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    let queryRunner: QueryRunner | null = null

    try {
      const userData = await Promise.all(
        data.map(async (item) => {
          if (item.password) {
            const password = await hashingPassword(item.password)

            return {
              login_id: item.loginId ? item.loginId : null,
              password: password ? password : null,
              role: UserRoleTypeormEnum.student,
              email: item.email ? item.email.toLowerCase() : null,
              human_user_created_at: new Date(),
              human_user_updated_at: new Date(),
            } as QueryDeepPartialEntity<{}>
          } else {
            return {
              login_id: item.loginId ? item.loginId : null,
              role: UserRoleTypeormEnum.student,
              email: item.email ? item.email.toLowerCase() : null,
              human_user_created_at: new Date(),
              human_user_updated_at: new Date(),
            } as QueryDeepPartialEntity<{}>
          }
        }),
      )

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const userRes = await userTypeormRepository
        .createQueryBuilder('users', queryRunner)
        .insert()
        .values(userData)
        .returning(['id', 'email'])
        .execute()

      const studentData = userRes.generatedMaps.map(
        (item, index) =>
          ({
            nick_name: data[index].nickName,
            user_id: item.id as string,
            student_lms_id: data[index].studentLMSId
              ? data[index].studentLMSId
              : null,
            emails_to_notify: data[index].emailsToNotify
              ? data[index].emailsToNotify?.join(';').toLocaleLowerCase()
              : null,
            created_user_id: createdUserId ? createdUserId : null,
            classlink_tenant_id: data[index].classLinkTenantId ?? null,
          } as QueryDeepPartialEntity<{}>),
      )

      const studentRepository =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const studentRes = await studentRepository
        .createQueryBuilder('students', queryRunner)
        .insert()
        .values(studentData)
        .execute()

      const studentMappingData = studentRes.generatedMaps.map((item) => {
        return {
          student_group_id: studentGroupId,
          student_id: item.id as string,
          created_user_id: createdUserId ? createdUserId : null,
        } as QueryDeepPartialEntity<{}>
      })

      const studentGroupStudentRepository =
        this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)

      await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students', queryRunner)
        .insert()
        .values(studentMappingData)
        .execute()

      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction()
      }

      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    } finally {
      if (queryRunner) {
        await queryRunner.release()
      }
    }
  }

  async getStudentIdByStudentLMSId(
    studentLMSId: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
    try {
      const studentTypeormEntity =
        this.typeormDataSource.getRepository(StudentTypeormEntity)

      const studentsResult = await studentTypeormEntity
        .createQueryBuilder('students')
        .where('students.student_lms_id = :studentLMSId', {
          studentLMSId,
        })
        .getRawOne()

      let res = ''

      if (studentsResult) {
        res = studentsResult.students_id
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student By StudentLMSId from db`,
        ),
        value: null,
      }
    }
  }

  async getStudentGroupsStudentsByStudentIdAndStudentGroupId(
    studentId: string,
    studentGroupId: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
    try {
      const studentGroupStudentTypeormEntity =
        this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)

      const studentGroupStudentResult = await studentGroupStudentTypeormEntity
        .createQueryBuilder('student_groups_students')
        .where(
          'student_groups_students.student_id= :studentId AND student_groups_students.student_group_id= :studentGroupId',
          {
            studentId: studentId,
            studentGroupId: studentGroupId,
          },
        )
        .select('student_groups_students.id', 'studentGroupStudentId')
        .getRawMany()

      const studentGroupStudentIds: string[] = studentGroupStudentResult.map(
        (item) => item.studentGroupStudentId,
      )

      return {
        hasError: false,
        error: null,
        value: studentGroupStudentIds,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get Organizations from db`,
        ),
        value: null,
      }
    }
  }

  async findAlreadyExistsStudentLMSId(
    studentLMSIds: string[],
    studentId?: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
    try {
      const studentRepository =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const query = studentLMSIds.toString().split(',')
      const alreadyExists = studentRepository
        .createQueryBuilder('students')
        .where('students.student_lms_id in (:...query)', {
          query,
        })
        .select('students.student_lms_id', 'student_lms_id')

      if (studentId) {
        alreadyExists.andWhere('students.id != :id', {
          id: studentId,
        })
      }

      const data = await alreadyExists.getRawMany()

      const alreadyExistsStudentLMSId = data.map((i) => i.student_lms_id)

      return {
        hasError: false,
        error: null,
        value: alreadyExistsStudentLMSId,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to find already exists login ids`,
        ),
        value: null,
      }
    }
  }

  async getDistrictIdByStudentId(
    studentId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  > {
    const studentMappingRepository = this.typeormDataSource.getRepository(
      StudentGroupStudentTypeormEntity,
    )

    try {
      const result = await studentMappingRepository
        .createQueryBuilder('student_groups_students')
        .innerJoin(
          StudentGroupTypeormEntity,
          'student_groups',
          'student_groups.id::VARCHAR = student_groups_students.student_group_id::VARCHAR',
        )
        .innerJoin(
          OrganizationTypeormEntity,
          'organizations',
          'organizations.id::VARCHAR = student_groups.organization_id::VARCHAR',
        )
        .select('organizations.district_id', 'district_id')
        .where('student_groups_students.student_id = :id', {
          id: studentId,
        })
        .getRawOne()

      if (result) {
        return {
          hasError: false,
          error: null,
          value: result.district_id,
        }
      } else {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: `student information not found of student id: ${studentId}`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district id by student id : ${studentId}`,
        ),
        value: null,
      }
    }
  }

  async updateStudent(
    studentId: string,
    student: Student,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  > {
    const studentRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)

    const userRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    try {
      const studentResult = await studentRepository.findOneBy({ id: studentId })

      let emailsToNotify: string | undefined = ''

      if (
        student.emailsToNotify !== undefined &&
        student.emailsToNotify.length > 0
      ) {
        emailsToNotify = student.emailsToNotify.join(';').toLocaleLowerCase()
      } else {
        emailsToNotify = undefined
      }

      const updateStudent = await studentRepository
        .createQueryBuilder()
        .update(StudentTypeormEntity, {
          nick_name: student.nickName ?? studentResult?.nick_name,
          student_lms_id: student.studentLMSId,
          emails_to_notify: emailsToNotify ?? studentResult?.emails_to_notify,
        } as QueryDeepPartialEntity<{}>)
        .where('id=:id', { id: studentId })
        .returning('*')
        .updateEntity(true)
        .execute()

      if (updateStudent?.raw[0] === undefined) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `failed to update student detail of studentId: ${studentId}`,
          },
          value: null,
        }
      }

      const userResult = await userRepository.findOneBy({
        id: studentResult?.user_id,
      })

      const updateStudentUserDetail = await userRepository
        .createQueryBuilder()
        .update(UserTypeormEntity, {
          login_id:
            student.loginId === undefined
              ? userResult?.login_id
              : student.loginId
              ? student.loginId
              : null,
          password:
            student.password === undefined
              ? userResult?.password
              : student.password
              ? await hashingPassword(student.password)
              : null,
          email:
            student.email === undefined
              ? userResult?.email
              : student.email
              ? student.email.toLowerCase()
              : null,
          human_user_updated_at: new Date(),
        } as QueryDeepPartialEntity<{}>)
        .where('id=:id', { id: studentResult?.user_id })
        .returning('*')
        .updateEntity(true)
        .execute()

      if (updateStudentUserDetail?.raw[0] === undefined) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `failed to update student detail of studentId: ${studentId}`,
          },
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district id by student id : ${studentId}`,
        ),
        value: null,
      }
    }
  }

  async deleteStudent(
    studentId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  > {
    const studentRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)
    const userRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    try {
      const studentResult = await studentRepository.findOneBy({
        id: studentId,
      })

      if (studentResult === null) {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: `student Id not found`,
          },
          value: null,
        }
      }
      await studentRepository.delete({ id: studentId })
      await userRepository.delete({ id: studentResult.user_id })

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to delete student of studentId: ${studentId}`,
        ),
        value: null,
      }
    }
  }

  async deactivateStudent(
    studentId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  > {
    const studentRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)
    const userRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    try {
      const studentResult = await studentRepository.findOneBy({
        id: studentId,
      })

      if (studentResult === null) {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: `student Id not found`,
          },
          value: null,
        }
      }

      await studentRepository.update(
        { id: studentId },
        {
          is_deactivated: true,
        },
      )

      await userRepository.update(
        { id: studentResult.user_id },
        {
          is_deactivated: true,
          human_user_updated_at: new Date(),
        },
      )

      await this.removeStudentFromStudentGroupClever(studentId)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to deactivate student of studentId: ${studentId}`,
        ),
        value: null,
      }
    }
  }

  async getStudents(
    studentGroupId: string,
    studentIds?: string[],
    name?: string | null,
    queryOption: Option = Option.In,
    role?: string | null,
  ): Promise<Errorable<Students[], E<'UnknownRuntimeError'>>> {
    try {
      const studentMappingRepository = this.typeormDataSource.getRepository(
        StudentGroupStudentTypeormEntity,
      )
      const organizationRepository = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )
      const studentGroupRepository = this.typeormDataSource.getRepository(
        StudentGroupTypeormEntity,
      )
      const studentRepository =
        this.typeormDataSource.getRepository(StudentTypeormEntity)

      const UserLessonStatusesRepository = this.typeormDataSource.getRepository(
        UserLessonStatusHistoryTypeormEntity,
      )

      let searchBasedOnStudentIds = []
      let studentGroupStudentData = []

      if (studentIds) {
        const getStudentsQuery = studentMappingRepository
          .createQueryBuilder('student_groups_students')
          .where('student_groups_students.student_id in (:...query)', {
            query: studentIds,
          })

        if (queryOption === Option.NotIn) {
          getStudentsQuery.andWhere(
            'student_groups_students.student_group_id != :id',
            {
              id: studentGroupId,
            },
          )
        } else {
          getStudentsQuery.andWhere(
            'student_groups_students.student_group_id = :id',
            {
              id: studentGroupId,
            },
          )
        }
        getStudentsQuery.select(
          'student_groups_students.student_id',
          'student_id',
        )

        studentGroupStudentData = await getStudentsQuery.getRawMany()
        searchBasedOnStudentIds = studentGroupStudentData.map(
          (i) => i.student_id,
        )
      } else {
        //Get districtId based on studentGroupId
        const studentGroupOrganization = await studentGroupRepository
          .createQueryBuilder('student_groups')
          .innerJoin(
            OrganizationTypeormEntity,
            'organizations',
            'organizations.id::VARCHAR = student_groups.organization_id::VARCHAR',
          )
          .select('student_groups.organization_id', 'organization_id')
          .select('organizations.district_id', 'district_id')
          .where('student_groups.id = :id', {
            id: studentGroupId,
          })
          .getRawOne()

        //Get all organizations based on districtId
        const districtOrganizationData = await organizationRepository
          .createQueryBuilder('organizations')
          .where('organizations.district_id = :id', {
            id: studentGroupOrganization.district_id,
          })
          .select('organizations.id', 'organization_id')
          .getRawMany()
        const organizationIds = districtOrganizationData.map(
          (i) => i.organization_id,
        )

        // Get all studentGroup based on organizationIds
        const studentGroupData = await studentGroupRepository
          .createQueryBuilder('student_groups')
          .where('student_groups.organization_id in (:...organizationIds)', {
            organizationIds,
          })
          .select('student_groups.id', 'student_group_id')
          .getRawMany()
        const studentGroupsId = studentGroupData.map((i) => i.student_group_id)

        //Get all students of all studentGroupId
        const studentsData = await studentMappingRepository
          .createQueryBuilder('student_groups_students')
          .where(
            'student_groups_students.student_group_id in (:...studentGroupsId)',
            {
              studentGroupsId,
            },
          )
          .select('student_groups_students.student_id', 'student_id')

        if (queryOption === Option.NotIn) {
          studentsData.andWhere(
            'student_groups_students.student_group_id != :id',
            {
              id: studentGroupId,
            },
          )
        } else {
          studentsData.andWhere(
            'student_groups_students.student_group_id = :id',
            {
              id: studentGroupId,
            },
          )
        }
        studentGroupStudentData = await studentsData.getRawMany()
        searchBasedOnStudentIds = studentGroupStudentData.map(
          (i) => i.student_id,
        )
      }

      if (searchBasedOnStudentIds.length === 0) {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }

      const studentDataResult = studentRepository
        .createQueryBuilder('students')
        .innerJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = students.user_id::VARCHAR',
        )
        .leftJoin(
          AdministratorTypeormEntity,
          'administrators',
          'administrators.user_id::VARCHAR = students.created_user_id::VARCHAR',
        )
        .select(
          'students.id AS id, students.nick_name AS nick_name,students.user_id AS user_id,students.created_user_id AS created_user_id,students.created_date AS created_date,students.student_lms_id AS student_lms_id,students.emails_to_notify AS emails_to_notify',
        )
        .addSelect('users.login_id', 'login_id')
        .addSelect('users.password', 'password')
        .addSelect('users.email', 'email')
        .addSelect('administrators.first_name', 'first_name')
        .addSelect('administrators.last_name', 'last_name')
        .where('students.id in (:...searchBasedOnStudentIds)', {
          searchBasedOnStudentIds,
        })

      if (name?.length) {
        studentDataResult.andWhere('LOWER(students.nick_name) like :name', {
          name: `%${decodeURIComponent(name?.toLowerCase())}%`,
        })
      }

      if (role === userRoles.student) {
        studentDataResult.andWhere('students.is_deactivated = :isDeactivated', {
          isDeactivated: false,
        })
      }

      let studentData = await studentDataResult.getRawMany()

      const studentsBasedOnStudentGroup = await studentMappingRepository
        .createQueryBuilder('student_groups_students')
        .where('student_groups_students.student_group_id = :studentGroupId', {
          studentGroupId,
        })
        .select('student_groups_students.student_id', 'student_id')
        .getRawMany()

      if (name?.length) {
        studentData = studentData.filter(
          (ar) =>
            !studentsBasedOnStudentGroup.find((rm) => rm.student_id === ar.id),
        )
      }

      const countObj: Record<string, number> = {}
      const studentMappingStudentGroupObj: Record<string, string> = {}

      if (studentData.length > 0) {
        const studentIdsToGetCount: string[] = studentData.map(
          (student) => student.id,
        )

        const studentMappingGroups = await studentMappingRepository
          .createQueryBuilder('student_groups_students')
          .leftJoin(
            StudentGroupTypeormEntity,
            'student_groups',
            'student_groups.id ::VARCHAR = student_groups_students.student_group_id::VARCHAR',
          )
          .select('student_groups_students.student_id', 'studentId')
          .addSelect("STRING_AGG(student_groups.name , ',')", 'studentGroups')
          .where('student_groups_students.student_id in (:...studentIds)', {
            studentIds: studentIdsToGetCount,
          })
          .groupBy('student_groups_students.student_id')
          .getRawMany()

        if (studentMappingGroups) {
          studentMappingGroups.forEach((item) => {
            studentMappingStudentGroupObj[item.studentId] = item.studentGroups
          })
        }

        const studentCount: { studentId: string; studentGroupCount: string }[] =
          await studentMappingRepository
            .createQueryBuilder()
            .select('student_id', 'studentId')
            .addSelect('COUNT(student_id)', 'studentGroupCount')
            .groupBy('student_id')
            .where('student_id in (:...studentIds)', {
              studentIds: studentIdsToGetCount,
            })
            .getRawMany()

        studentCount.forEach((item) => {
          countObj[item.studentId] = parseInt(item.studentGroupCount)
        })
      }

      const studentDataWithLessonHistory = await Promise.all(
        studentData.map(async (item) => {
          const studentsResult =
            await UserLessonStatusesRepository.createQueryBuilder(
              'user_lesson_status_history',
            )
              .where(
                'user_lesson_status_history.user_id =:userId ORDER BY user_lesson_status_history.started_at DESC LIMIT 1 ',
                {
                  userId: item.user_id,
                },
              )
              .getRawOne()
          let userDataFromUserLessonStatus

          if (studentsResult) {
            if (
              process.env.STATIC_FILES_BASE_URL &&
              process.env.LESSON_PLAYER_BASE_URL
            ) {
              userDataFromUserLessonStatus = lessonsIndexedMap(
                process.env.STATIC_FILES_BASE_URL,
                process.env.LESSON_PLAYER_BASE_URL,
              )[studentsResult.user_lesson_status_history_lesson_id]

              return {
                ...item,
                studentGroupCount: countObj[item.id] ?? 0,
                studentGroup: studentMappingStudentGroupObj[item.id] ?? '',
                last_lesson_started_at:
                  studentsResult?.user_lesson_status_history_started_at ?? null,
                last_lesson_lame: userDataFromUserLessonStatus?.name ?? null,
              }
            }
          } else {
            return {
              ...item,
              studentGroupCount: countObj[item.id] ?? 0,
              studentGroup: studentMappingStudentGroupObj[item.id] ?? '',
              last_lesson_started_at: null,
              last_lesson_lame: null,
            }
          }
        }),
      )

      const res: Students[] = []

      studentDataWithLessonHistory.map(
        (raw: {
          id: string
          nick_name: string
          student_lms_id: string
          password: string
          emails_to_notify: string
          user_id: string
          login_id: string
          first_name: string
          last_name: string
          created_date: Date
          last_lesson_started_at: Date | null
          last_lesson_lame: string
          email: string
          studentGroupCount: number
          studentGroup: string
        }) =>
          res.push({
            id: raw.id,
            nickName: raw.nick_name,
            studentLMSId: raw.student_lms_id,
            password: raw.password,
            emailsToNotify: raw.emails_to_notify
              ? raw.emails_to_notify.split(';')
              : [],
            loginId: raw.login_id,
            userId: raw.user_id,
            createdUserName:
              !!raw.first_name && !!raw.last_name
                ? raw.first_name + ' ' + raw.last_name
                : null,
            createdDate: raw.created_date.toISOString(),
            lastLessionName: raw.last_lesson_lame,
            lastLessonStartedAt: raw.last_lesson_started_at
              ? raw.last_lesson_started_at.toISOString()
              : null,
            email: raw.email,
            studentGroupCount: raw.studentGroupCount,
            studentGroup: raw.studentGroup,
          }),
      )

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get students from db`,
        ),
        value: null,
      }
    }
  }

  async addStudentInStudentGroup(
    createdUserId: string,
    studentGroupId: string,
    studentId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'StudentNotFoundError'>
      | E<'StudentAlreadyExists'>
    >
  > {
    const studentRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)
    const studentGroupStudentRepository = this.typeormDataSource.getRepository(
      StudentGroupStudentTypeormEntity,
    )

    try {
      const getStudent = await studentRepository.findOne({
        where: { id: studentId },
      })

      if (!getStudent) {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'student not found',
          },
          value: null,
        }
      }

      const alreadyExistStudent = await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students')
        .where(
          'student_groups_students.student_id= :id AND student_groups_students.student_group_id= :gid',
          {
            id: studentId,
            gid: studentGroupId,
          },
        )
        .getRawOne()

      if (alreadyExistStudent) {
        return {
          hasError: true,
          error: {
            type: 'StudentAlreadyExists',
            message: 'student already exists',
          },
          value: null,
        }
      }

      const studentMappingData = {
        student_group_id: { id: studentGroupId },
        student_id: { id: studentId },
        created_user_id: createdUserId,
      }
      const result = await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students')
        .insert()
        .values(studentMappingData)
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async removeStudentFromStudentGroup(
    studentGroupId: string,
    studentId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'StudentNotFoundError'>
      | E<'PermissionDenied'>
    >
  > {
    const studentGroupStudentRepository = this.typeormDataSource.getRepository(
      StudentGroupStudentTypeormEntity,
    )

    try {
      const deletePermission = await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students')
        .where('student_groups_students.student_id= :id', {
          id: studentId,
          gid: studentGroupId,
        })
        .getRawMany()

      if (deletePermission.length === 1) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message: 'Permission denied,student at least in one student group.',
          },
          value: null,
        }
      }

      const deleteResult = await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students')
        .delete()
        .where(
          'student_groups_students.student_id= :id AND student_groups_students.student_group_id= :gid',
          {
            id: studentId,
            gid: studentGroupId,
          },
        )
        .execute()

      if (deleteResult.affected === 1) {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      } else {
        return {
          hasError: true,
          error: {
            type: 'StudentNotFoundError',
            message: 'student not found in student-group',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async getStudentOrganizationsById(
    studentId: string,
  ): Promise<Errorable<OrgnaizationsList[], E<'UnknownRuntimeError'>>> {
    try {
      const studentMappingRepository = this.typeormDataSource.getRepository(
        StudentGroupStudentTypeormEntity,
      )
      const getStudentInfo = await studentMappingRepository
        .createQueryBuilder('student_groups_students')
        .leftJoin(
          StudentTypeormEntity,
          'students',
          'students.id::VARCHAR = student_groups_students.student_id::VARCHAR',
        )
        .leftJoin(
          StudentGroupTypeormEntity,
          'student_groups',
          'student_groups.id::VARCHAR = student_groups_students.student_group_id::VARCHAR',
        )
        .leftJoin(
          OrganizationTypeormEntity,
          'organizations',
          'organizations.id::VARCHAR = student_groups.organization_id::VARCHAR',
        )
        .where('student_groups_students.student_id = :studentId', { studentId })
        .select('organizations.id', 'id')
        .addSelect('organizations.name', 'name')
        .getRawMany()

      return {
        hasError: false,
        error: null,
        value: getStudentInfo as OrgnaizationsList[],
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student organizations list from db`,
        ),
        value: null,
      }
    }
  }

  async getStudentDetailByUserId(
    userId: string,
  ): Promise<
    Errorable<
      Omit<
        NonNullable<MeInfo['student']>,
        'districtId' | 'organizationIds' | 'studentGroupIds'
      > | null,
      E<'UnknownRuntimeError'>
    >
  > {
    const studentTypeormEntity =
      this.typeormDataSource.getRepository(StudentTypeormEntity)

    try {
      const studentData = await studentTypeormEntity
        .createQueryBuilder('students')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = students.user_id::VARCHAR',
        )
        .select('students.id', 'student_id')
        .addSelect('students.user_id', 'user_id')
        .addSelect('students.nick_name', 'nick_name')
        .addSelect('students.student_lms_id', 'student_lms_id')
        .addSelect('users.id', 'id')
        .addSelect('users.login_id', 'login_id')
        .addSelect('users.role', 'role')
        .addSelect('users.email', 'email')
        .where('students.user_id = :id', {
          id: userId,
        })
        .getRawOne()

      return {
        hasError: false,
        error: null,
        value: studentData
          ? {
              id: studentData.student_id,
              userId: studentData.user_id,
              nickName: studentData.nick_name,
              studentLMSId: studentData.student_lms_id,
            }
          : null,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get admistrator details by ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getStudentPackagesByUserId(
    userId: string,
  ): Promise<
    Errorable<
      StudentGroupPackageAssignment[] | undefined,
      E<'UnknownRuntimeError'>
    >
  > {
    const studentTypeormEntity =
      this.typeormDataSource.getRepository(StudentTypeormEntity)

    try {
      const res: StudentGroupPackageAssignment[] = []
      const studentData = await studentTypeormEntity
        .createQueryBuilder('students')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = students.user_id::VARCHAR',
        )
        .innerJoin(
          StudentGroupStudentTypeormEntity,
          'student_groups_students',
          'student_groups_students.student_id::VARCHAR = students.id::VARCHAR',
        )
        .select('students.id', 'student_id')
        .addSelect('students.user_id', 'user_id')
        .addSelect('users.id', 'id')
        .addSelect(
          'student_groups_students.student_group_id',
          'student_group_id',
        )
        .where('students.user_id = :id', {
          id: userId,
        })
        .getRawMany()

      const query = studentData.map((i) => i.student_group_id)
      const studentGroupPackageAssignmentData = await this.typeormDataSource
        .getRepository(StudentGroupPackageAssignmentTypeormEntity)
        .createQueryBuilder('student_group_package_assignment')
        .where(
          'student_group_package_assignment.student_group_id in (:...query)',
          {
            query,
          },
        )
        .select(
          'student_group_package_assignment.student_group_id',
          'student_groups_id',
        )
        .addSelect(
          'student_group_package_assignment.package_category_id',
          'package_category_id',
        )
        .addSelect('student_group_package_assignment.package_id', 'package_id')
        .getRawMany()

      studentGroupPackageAssignmentData.map(
        (raw: {
          student_groups_id: string
          package_id: string
          package_category_id: string
        }) =>
          res.push({
            studentGroupId: raw.student_groups_id,
            packageId: raw.package_id,
            packageCategoryId: raw.package_category_id,
          }),
      )

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student package by ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getStudentByStudentLmsId(
    studentLmsId: string,
  ): Promise<Errorable<StudentsInfo | undefined, E<'UnknownRuntimeError'>>> {
    try {
      const studentRepository =
        this.typeormDataSource.getRepository(StudentTypeormEntity)

      const studentInfo = await studentRepository.findOneBy({
        student_lms_id: studentLmsId,
      })
      let res: StudentsInfo | undefined = undefined

      if (studentInfo) {
        res = {
          id: studentInfo.id,
          nickName: studentInfo.nick_name,
          studentLMSId: studentInfo.student_lms_id,
          userId: studentInfo.user_id,
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get Organizations from db`,
        ),
        value: null,
      }
    }
  }

  async createStudentWithoutStudentGroupId(
    data: StudentInfo,
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    let queryRunner: QueryRunner | null = null

    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const studentRepository =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const userData = {
        login_id: data.loginId ? data.loginId : null,
        password: data.password ? data.password : null,
        role: UserRoleTypeormEnum.student,
        email: data.email,
        is_deactivated: false,
        human_user_created_at: new Date(),
        human_user_updated_at: new Date(),
      } as QueryDeepPartialEntity<{}>

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      //check user already exists or not
      const studentData = await studentRepository
        .createQueryBuilder('students')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = students.user_id::VARCHAR',
        )
        .select('students.id', 'studentId')
        .addSelect('users.id', 'userId')
        .addSelect('users.email', 'userEmail')
        .addSelect('students.student_lms_id', 'studentLmsId')
        .where('students.student_lms_id = :studentLmsId', {
          studentLmsId: data.studentLMSId,
        })
        .getRawOne()

      if (studentData) {
        //Active the deactivate user
        const userId = studentData.userId

        await userTypeormRepository
          .createQueryBuilder()
          .update(UserTypeormEntity, userData)
          .where('id=:id', { id: userId })
          .updateEntity(true)
          .execute()
        await studentRepository
          .createQueryBuilder()
          .update(StudentTypeormEntity, {
            nick_name: data.nickName,
            student_lms_id: data.studentLMSId,
            is_deactivated: false,
          } as QueryDeepPartialEntity<{}>)
          .where('user_id=:userId', { userId: userId })
          .updateEntity(true)
          .execute()
      } else {
        //create user and student
        const userRes = await userTypeormRepository
          .createQueryBuilder('users', queryRunner)
          .insert()
          .values(userData)
          .execute()
        const studentData = userRes.generatedMaps.map(
          (item, index) =>
            ({
              nick_name: data.nickName,
              user_id: item.id as string,
              student_lms_id: data.studentLMSId ? data.studentLMSId : null,
              emails_to_notify: data.emailsToNotify
                ? data.emailsToNotify?.join(';')
                : null,
              created_user_id: createdUserId ? createdUserId : null,
              is_deactivated: false,
            } as QueryDeepPartialEntity<{}>),
        )

        await studentRepository
          .createQueryBuilder('students', queryRunner)
          .insert()
          .values(studentData)
          .execute()
      }
      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction()
      }

      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    } finally {
      if (queryRunner) {
        await queryRunner.release()
      }
    }
  }

  async removeStudentFromStudentGroupClever(
    studentId: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'StudentNotFoundError'>>
  > {
    const studentGroupStudentRepository = this.typeormDataSource.getRepository(
      StudentGroupStudentTypeormEntity,
    )

    try {
      await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students')
        .delete()
        .where('student_groups_students.student_id= :id', {
          id: studentId,
        })
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to delete student from student-group-student : ${studentId}`,
        ),
        value: null,
      }
    }
  }
}
