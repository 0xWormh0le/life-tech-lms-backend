import {
  E,
  Errorable,
  fromNativeError,
  wrapError,
} from '../../domain/usecases/shared/Errors'
import { DataSource } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { UnaccessibleLessonTypeormEntity } from '../typeorm/entity/UnaccessibleLesson'
import { UnaccessibleLesson } from '../../domain/entities/codex/UnaccessibleLesson'
import { StudentGroupStudentTypeormEntity } from '../typeorm/entity/StudentGroupStudent'

export class UnaccessibleLessonRepository {
  constructor(private typeormDataSource: DataSource) {}

  async createUnaccessibleLesson(
    studentGroupId: string,
    lessonIds: string[],
    createdUserId: string,
    packageId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const unaccessibleLessonTypeormEntity =
      this.typeormDataSource.getRepository(UnaccessibleLessonTypeormEntity)

    try {
      const unaccessibleLessonData: QueryDeepPartialEntity<{}> = lessonIds.map(
        (item) => ({
          student_group_id: studentGroupId,
          package_id: packageId,
          lesson_id: item,
          created_user_id: createdUserId,
        }),
      )

      const unaccessibleLessonResult = await unaccessibleLessonTypeormEntity
        .createQueryBuilder('unaccessible_lesson')
        .where('unaccessible_lesson.student_group_id = :studentGroupId', {
          studentGroupId,
        })
        .andWhere('unaccessible_lesson.package_id = :packageId', {
          packageId,
        })
        .andWhere('unaccessible_lesson.lesson_id in (:...lessonIds)', {
          lessonIds,
        })
        .getRawMany()

      if (unaccessibleLessonResult.length > 0) {
        //Do nothing because all lesson ids are already unaccessible_lesson
      } else {
        await unaccessibleLessonTypeormEntity
          .createQueryBuilder('unaccessible_lesson')
          .insert()
          .values(unaccessibleLessonData)
          .execute()
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
          `failed to restrict lesson access for student group ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async removeUnaccessibleLesson(
    studentGroupId: string,
    lessonIds: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const unaccessibleLessonTypeormEntity =
      this.typeormDataSource.getRepository(UnaccessibleLessonTypeormEntity)

    try {
      await unaccessibleLessonTypeormEntity
        .createQueryBuilder('unaccessible_lesson')
        .delete()
        .where('unaccessible_lesson.student_group_id = :student_group_id', {
          student_group_id: studentGroupId,
        })
        .andWhere('unaccessible_lesson.lesson_id in (:...lessonIds)', {
          lessonIds,
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
          `failed to remove restrict lesson access for student group ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async getUnaccessibleLessons(
    studentGroupId: string,
  ): Promise<Errorable<UnaccessibleLesson[], E<'UnknownRuntimeError'>>> {
    const unaccessibleLessonTypeormEntity =
      this.typeormDataSource.getRepository(UnaccessibleLessonTypeormEntity)

    try {
      const res: UnaccessibleLesson[] = []
      const data = await unaccessibleLessonTypeormEntity
        .createQueryBuilder('unaccessible_lesson')
        .select('unaccessible_lesson.student_group_id', 'student_group_id')
        .addSelect('unaccessible_lesson.package_id', 'package_id')
        .addSelect('unaccessible_lesson.lesson_id', 'lesson_id')
        .addSelect('unaccessible_lesson.created_user_id', 'created_user_id')
        .addSelect('unaccessible_lesson.created_date', 'created_date')
        .where('unaccessible_lesson.student_group_id = :student_group_id', {
          student_group_id: studentGroupId,
        })
        .getRawMany()

      if (data.length > 0) {
        data?.map(
          (raw: {
            package_id: string
            lesson_id: string
            created_user_id: string
            created_date: string
            student_group_id: string
          }) =>
            res.push({
              packageId: raw.package_id,
              lessonId: raw.lesson_id,
              createdUserId: raw.created_user_id,
              createdDate: raw.created_date.toString(),
              studentGroupId: raw.student_group_id,
            }),
        )
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
          `failed to get unaccessible lessons for student group ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async getStudentUnaccessibleLessons(
    studentId: string,
  ): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> {
    const studentGroupStudentTypeormEntity =
      this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)

    try {
      let res: string[] = []
      const studentGroups = await studentGroupStudentTypeormEntity
        .createQueryBuilder('student_groups_students')
        .select('student_groups_students.student_group_id', 'student_group_id')
        .where('student_groups_students.student_id = :studentId', { studentId })
        .getRawMany()
      const studentGroupUnaccessibleLessons: UnaccessibleLesson[] = []

      for (const studentGroup of studentGroups) {
        // get unaccessible lessons for student group
        const studentGroupId = studentGroup.student_group_id
        const unaccessibleLessonResult = await this.getUnaccessibleLessons(
          studentGroupId,
        )

        if (unaccessibleLessonResult.hasError) {
          return {
            hasError: true,
            error: wrapError(
              unaccessibleLessonResult.error,
              `failed to get unaccessible lesson for student group ${studentGroupId}`,
            ),
            value: null,
          }
        }

        if (unaccessibleLessonResult.value.length > 0) {
          for (const iterator of unaccessibleLessonResult.value) {
            studentGroupUnaccessibleLessons.push(iterator)
          }
        }
      }

      const unaccessibleLessonByStudentGroupId: Record<string, string[]> = {}

      if (studentGroupUnaccessibleLessons.length > 0) {
        for (const lesson of studentGroupUnaccessibleLessons) {
          if (!unaccessibleLessonByStudentGroupId[lesson.studentGroupId]) {
            unaccessibleLessonByStudentGroupId[lesson.studentGroupId] = []
          }
          unaccessibleLessonByStudentGroupId[lesson.studentGroupId].push(
            lesson.lessonId,
          )
        }

        const studentGroupLessonData = []

        for (const studentGroupLesson of Object.keys(
          unaccessibleLessonByStudentGroupId,
        )) {
          studentGroupLessonData.push(
            unaccessibleLessonByStudentGroupId[studentGroupLesson],
          )
        }
        res = studentGroupLessonData?.reduce((a, b) =>
          a.filter((c) => b.includes(c)),
        )
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
          `failed to get unaccessible lessons for student ${studentId}`,
        ),
        value: null,
      }
    }
  }
}
