/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'

import { StudentGroupStudentTypeormEntity } from '../../../../../adapter/typeorm/entity/StudentGroupStudent'
import { IStudentGroupStudentRepository } from '../../domain//usecases/RosterSync'
import { StudentGroupStudent } from '../../domain//entities/StudentGroupStudent'

export class StudentGroupStudentRepository
  implements IStudentGroupStudentRepository
{
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getAllByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentGroupStudent[], E<'UnknownRuntimeError', string>>
  > {
    const studentStudentGroupTypeormRepository =
      this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)

    try {
      const studentGroupTeachers: StudentGroupStudent[] =
        await studentStudentGroupTypeormRepository
          .createQueryBuilder()
          .where('student_group_id = :studentGroupId', { studentGroupId })
          .select('student_id', 'studentId')
          .addSelect('student_group_id', 'studentGroupId')
          .getRawMany()

      return {
        hasError: false,
        error: null,
        value: studentGroupTeachers,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get student affiliation in Life Is Tech portal for studentGroup id: ${studentGroupId}. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async createStudentGroupStudents(
    studentStudentGroups: StudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    const studentStudentGroupTypeormRepository =
      this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)

    try {
      const studentStudentGroupsData: {
        student_id: string
        student_group_id: string
      }[] = studentStudentGroups.map((studentStudentGroup) => {
        return {
          student_group_id: studentStudentGroup.studentGroupId,
          student_id: studentStudentGroup.studentId,
        }
      })

      await studentStudentGroupTypeormRepository
        .createQueryBuilder('student_groups_students')
        .insert()
        .values(
          studentStudentGroupsData as QueryDeepPartialEntity<StudentGroupStudentTypeormEntity>[],
        )
        .execute()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to add students into student group of Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }

  async deleteStudentGroupStudents(
    studentStudentGroups: StudentGroupStudent[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    const studentStudentGroupTypeormRepository =
      this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)

    try {
      if (studentStudentGroups.length === 0) {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }

      for (const studentStudentGroup of studentStudentGroups) {
        await studentStudentGroupTypeormRepository.delete({
          student_id: { id: studentStudentGroup.studentId },
          student_group_id: { id: studentStudentGroup.studentGroupId },
        })
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to remove students from student group of Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
