/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource, DeepPartial, In } from 'typeorm'

import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import { StudentTypeormEntity } from '../../../../../adapter/typeorm/entity/Student'
import { StudentGroupStudentTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroupStudent'
import { IStudentRepository } from '../../domain//usecases/RosterSync'
import { Student } from '../../domain//entities/Student'

export class StudentRepository implements IStudentRepository {
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByStudentGroupId(
    studentGroupId: string,
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError', string>>> {
    try {
      const studentGroupStudentTypeormEntity =
        this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)
      const studentGroupStudentsResult =
        await studentGroupStudentTypeormEntity.find({
          where: {
            student_group_id: { id: studentGroupId },
          },
          order: {
            created_date: 'ASC',
          },
          relations: ['student_id'],
        })
      const studentTypeormEntity =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const studentsResult = await studentTypeormEntity.find({
        where: {
          id: In(studentGroupStudentsResult.map((e) => e.student_id.id)),
        },
        order: {
          created_date: 'ASC',
        },
      })
      const studentData: Student[] = []

      for (const u of studentsResult) {
        studentData.push({
          id: u.id,
          userId: u.user_id,
          nickName: u.nick_name,
          studentLMSId: u.student_lms_id,
          classlinkTenantId: u.classlink_tenant_id,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: studentData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get students in Life Is Tech portal for student group id: ${studentGroupId}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async getAllByLmsId(
    lmsIds: string[],
    tenantId: string | null,
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError', string>>> {
    try {
      const studentTypeormEntity =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const studentsResult = await studentTypeormEntity.find({
        where: {
          student_lms_id: In(lmsIds),
          classlink_tenant_id: tenantId ?? undefined,
        },
        order: {
          created_date: 'ASC',
        },
      })
      const studentData: Student[] = []

      for (const u of studentsResult) {
        studentData.push({
          id: u.id,
          userId: u.user_id,
          nickName: u.nick_name,
          studentLMSId: u.student_lms_id,
          classlinkTenantId: u.classlink_tenant_id,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: studentData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get students in Life Is Tech portal for lmsIds: ${JSON.stringify(
          lmsIds,
        )}. ${JSON.stringify(e)}`,
      )
    }
  }

  async createStudents(
    students: Student[],
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> {
    try {
      const studentTypeormEntity =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const studentsToCreate: DeepPartial<StudentTypeormEntity>[] =
        students.map((e) => ({
          id: e.id,
          user_id: e.userId,
          nick_name: e.nickName,
          student_lms_id: e.studentLMSId,
          classlink_tenant_id: e.classlinkTenantId,
          is_deactivated: e.isDeactivated,
        }))
      const createResult = await studentTypeormEntity.save(studentsToCreate)

      return {
        hasError: false,
        error: null,
        value: createResult.map((e) => ({
          id: e.id,
          userId: e.user_id,
          nickName: e.nick_name,
          studentLMSId: e.student_lms_id,
          classlinkTenantId: e.classlink_tenant_id,
          isDeactivated: e.is_deactivated,
        })),
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to create students into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async updateStudents(
    students: Student[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const studentTypeormEntity =
        this.typeormDataSource.getRepository(StudentTypeormEntity)
      const studentsToUpdate: DeepPartial<StudentTypeormEntity>[] =
        students.map((e) => ({
          id: e.id,
          user_id: e.userId,
          nick_name: e.nickName,
          student_lms_id: e.studentLMSId,
          classlink_tenant_id: e.classlinkTenantId,
          is_deactivated: e.isDeactivated,
        }))

      await studentTypeormEntity.save(studentsToUpdate)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update students into Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteStudents(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const studentTypeormEntity =
        this.typeormDataSource.getRepository(StudentTypeormEntity)

      await studentTypeormEntity.update(
        { id: In(ids) },
        {
          is_deactivated: true,
        },
      )

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to deactivate the students from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
