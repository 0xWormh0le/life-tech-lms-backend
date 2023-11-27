import { DataSource, In } from 'typeorm'
import {
  UserLessonStatus,
  StudentGroupLessonStatus,
} from '../../domain/entities/codex/UserLessonStatus'
import { UserLessonStatusHistory } from '../../domain/entities/codex/UserLessonStatusHistory'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { StudentTypeormEntity } from '../typeorm/entity/Student'
import { StudentGroupStudentTypeormEntity } from '../typeorm/entity/StudentGroupStudent'
import {
  UserLessonStatusTypeormEntity,
  UserLessonStatusTypeormEnum,
} from '../typeorm/entity/UserLessonStatus'
import { UserLessonStatusHistoryTypeormEntity } from '../typeorm/entity/UserLessonStatusHistory'
import { lessonsIndexedMap } from '../typeorm/hardcoded-data/Lessons'

const convertStatusToEntity = (
  status: UserLessonStatusTypeormEnum,
): UserLessonStatus['status'] | null => {
  switch (status) {
    case UserLessonStatusTypeormEnum.cleared:
      return 'cleared'
    case UserLessonStatusTypeormEnum.not_cleared:
      return 'not_cleared'
    default:
      return null
  }
}

const convertStatusToTypeormEnum = (
  status: UserLessonStatus['status'],
): UserLessonStatusTypeormEnum | null => {
  switch (status) {
    case 'cleared':
      return UserLessonStatusTypeormEnum.cleared
    case 'not_cleared':
      return UserLessonStatusTypeormEnum.not_cleared
    default:
      return null
  }
}

export class UserLessonStatusesRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getUserLessonStatusesByUserId(
    userId: string,
    lessonIds?: string[],
  ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> {
    try {
      const userLessonStatusTypeormRepository =
        this.typeormDataSource.getRepository(UserLessonStatusTypeormEntity)

      let userLessonStatus: UserLessonStatusTypeormEntity[] = []

      if (lessonIds) {
        userLessonStatus = await userLessonStatusTypeormRepository.findBy({
          lesson_id: In(lessonIds),
          user_id: userId,
        })
      } else {
        userLessonStatus = await userLessonStatusTypeormRepository.findBy({
          user_id: userId,
        })
      }

      const userLessonStatusData: UserLessonStatus[] = []

      for (const s of userLessonStatus) {
        const status = convertStatusToEntity(s.status)

        if (status === null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown status detected ${s.status}`,
            },
            value: null,
          }
        }
        userLessonStatusData.push({
          lessonId: s.lesson_id,
          userId: s.user_id,
          status,
          achievedStarCount: s.achieved_star_count,
          correctAnsweredQuizCount: s.correct_answered_quiz_count,
          usedHintCount: s.used_hint_count,
          stepIdskippingDetected: s.step_id_skipping_detected || false,
          startedAt: s.started_at && s.started_at.toISOString(),
          finishedAt: s.finished_at && s.finished_at.toISOString(),
        })
      }

      return {
        hasError: false,
        error: null,
        value: userLessonStatusData,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get lesson from db by lesson id ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getLatesUserLessonStatusHistoriesByUserIdAndLessonId(
    userId: string,
    lessonId: string,
  ): Promise<
    Errorable<UserLessonStatusHistory | null, E<'UnknownRuntimeError'>>
  > {
    try {
      const userLessonStatusHistoryTypeormRepository =
        this.typeormDataSource.getRepository(
          UserLessonStatusHistoryTypeormEntity,
        )

      const userLessonStatusHistories: UserLessonStatusHistoryTypeormEntity[] =
        await userLessonStatusHistoryTypeormRepository.find({
          where: {
            user_id: userId,
            lesson_id: lessonId,
          },
          order: {
            created_at: 'DESC',
          },
        })

      if (userLessonStatusHistories.length === 0) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      const latestUserLessonStatusHistory = userLessonStatusHistories[0]

      return {
        hasError: false,
        error: null,
        value: {
          id: latestUserLessonStatusHistory.id,
          lessonId: latestUserLessonStatusHistory.lesson_id,
          userId: latestUserLessonStatusHistory.user_id,
          status: latestUserLessonStatusHistory.status,
          achievedStarCount: latestUserLessonStatusHistory.achieved_star_count,
          correctAnsweredQuizCount:
            latestUserLessonStatusHistory.correct_answered_quiz_count,
          usedHintCount: latestUserLessonStatusHistory.used_hint_count,
          stepIdskippingDetected:
            latestUserLessonStatusHistory.step_id_skipping_detected,
          startedAt: latestUserLessonStatusHistory.started_at
            ? latestUserLessonStatusHistory.started_at.toISOString()
            : undefined,
          finishedAt: latestUserLessonStatusHistory.finished_at
            ? latestUserLessonStatusHistory.finished_at.toISOString()
            : undefined,
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get lesson from db by lesson id ${userId}`,
        ),
        value: null,
      }
    }
  }

  async updateUserLessonStatus(
    userLessonStatus: UserLessonStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    try {
      const userLessonStatusesTypeormRepository =
        this.typeormDataSource.getRepository(UserLessonStatusTypeormEntity)
      const userLessonStatusesHistortyTypeormRepository =
        this.typeormDataSource.getRepository(
          UserLessonStatusHistoryTypeormEntity,
        )
      const status = convertStatusToTypeormEnum(userLessonStatus.status)

      if (status == null) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `specified status ${userLessonStatus.status} is not supported`,
          },
          value: null,
        }
      }

      const userLesssonStatusObjToUpdate = {
        user_id: userLessonStatus.userId,
        lesson_id: userLessonStatus.lessonId,
        status,
        used_hint_count: userLessonStatus.usedHintCount ?? undefined,
        correct_answered_quiz_count:
          userLessonStatus.correctAnsweredQuizCount ?? undefined,
        achieved_star_count: userLessonStatus.achievedStarCount,
        step_id_skipping_detected: userLessonStatus.stepIdskippingDetected,
        // started_at: userLessonStatus.startedAt,
        finished_at: userLessonStatus.finishedAt,
      }
      const existingUserLessonStatusHistory =
        await userLessonStatusesHistortyTypeormRepository.findOne({
          where: {
            user_id: userLessonStatus.userId,
            lesson_id: userLessonStatus.lessonId,
          },
          order: { started_at: 'DESC' },
        })

      if (!existingUserLessonStatusHistory) {
        await userLessonStatusesHistortyTypeormRepository.save({
          ...userLesssonStatusObjToUpdate,
        })

        const existingUserLessonStatus =
          await userLessonStatusesTypeormRepository.findOne({
            where: {
              user_id: userLessonStatus.userId,
              lesson_id: userLessonStatus.lessonId,
            },
          })

        if (!existingUserLessonStatus) {
          await userLessonStatusesTypeormRepository.save({
            ...userLesssonStatusObjToUpdate,
          })
        }
      }

      if (existingUserLessonStatusHistory) {
        await userLessonStatusesHistortyTypeormRepository.update(
          existingUserLessonStatusHistory.id,
          userLesssonStatusObjToUpdate,
        )

        const existingUserLessonStatus =
          await userLessonStatusesTypeormRepository.findOne({
            where: {
              user_id: userLessonStatus.userId,
              lesson_id: userLessonStatus.lessonId,
            },
          })

        if (existingUserLessonStatus) {
          await userLessonStatusesTypeormRepository.update(
            existingUserLessonStatus.id,
            {
              ...userLesssonStatusObjToUpdate,
              started_at: existingUserLessonStatusHistory.started_at,
            },
          )
        } else {
          throw new Error('user lesson status not found in db')
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
          `failed to create UserLessonStatus into db by ${JSON.stringify(
            userLessonStatus,
          )}`,
        ),
        value: null,
      }
    }
  }

  async createUserLessonStatus(
    userLessonStatus: UserLessonStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    try {
      const userLessonStatusesTypeormRepository =
        this.typeormDataSource.getRepository(UserLessonStatusTypeormEntity)
      const userLessonStatusesHistortyTypeormRepository =
        this.typeormDataSource.getRepository(
          UserLessonStatusHistoryTypeormEntity,
        )
      const status = convertStatusToTypeormEnum(userLessonStatus.status)

      if (status == null) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `specified status ${userLessonStatus.status} is not supported`,
          },
          value: null,
        }
      }

      const userLesssonStatusObjToCreate = {
        user_id: userLessonStatus.userId,
        lesson_id: userLessonStatus.lessonId,
        status,
        used_hint_count: userLessonStatus.usedHintCount ?? undefined,
        correct_answered_quiz_count:
          userLessonStatus.correctAnsweredQuizCount ?? undefined,
        achieved_star_count: userLessonStatus.achievedStarCount,
        step_id_skipping_detected: userLessonStatus.stepIdskippingDetected,
        // started_at: userLessonStatus.startedAt,
        // finished_at: userLessonStatus.finishedAt,
      }

      await userLessonStatusesHistortyTypeormRepository.save({
        ...userLesssonStatusObjToCreate,
        started_at: userLessonStatus.startedAt,
      })

      const existingUserLessonStatus =
        await userLessonStatusesTypeormRepository.findOne({
          where: {
            user_id: userLessonStatus.userId,
            lesson_id: userLessonStatus.lessonId,
          },
        })

      if (!existingUserLessonStatus) {
        await userLessonStatusesTypeormRepository.save({
          ...userLesssonStatusObjToCreate,
        })
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
          `failed to create UserLessonStatus into db by ${JSON.stringify(
            userLessonStatus,
          )}`,
        ),
        value: null,
      }
    }
  }

  async getStudentGroupLessonStatuses(
    studentGroupId: string,
    lessonIds?: string[],
  ): Promise<Errorable<StudentGroupLessonStatus[], E<'UnknownRuntimeError'>>> {
    try {
      const userLessonStatusTypeormRepository =
        this.typeormDataSource.getRepository(UserLessonStatusTypeormEntity)
      const studentGroupStudentRepository =
        this.typeormDataSource.getRepository(StudentGroupStudentTypeormEntity)
      const studentGroupData = await studentGroupStudentRepository
        .createQueryBuilder('student_groups_students')
        .where('student_groups_students.student_group_id = :id', {
          id: studentGroupId,
        })
        .innerJoin(
          StudentTypeormEntity,
          'students',
          'students.id::VARCHAR = student_groups_students.student_id::VARCHAR',
        )
        .select('students.user_id', 'user_id')
        .getRawMany()

      const userIds = studentGroupData.map((i) => i.user_id)
      const lessonStatusesData = await userLessonStatusTypeormRepository.find({
        where: { user_id: In(userIds) },
      })

      if (
        !process.env.LESSON_PLAYER_BASE_URL ||
        !process.env.STATIC_FILES_BASE_URL
      ) {
        throw new Error(
          'LESSON_PLAYER_BASE_URL or process.env.STATIC_FILES_BASE_URL not found in environment file ',
        )
      } else {
      }

      const res = lessonStatusesData.map((raw) => ({
        userId: raw.user_id,
        lessonId: raw.lesson_id,
        status: raw.status,
        achievedStarCount: raw.achieved_star_count,
        usedHintCount: raw.used_hint_count,
        correctAnsweredQuizCount: raw.correct_answered_quiz_count,
        stepIdskippingDetected: raw.step_id_skipping_detected,
        startedAt: raw.started_at ? raw.started_at.toISOString() : undefined,
        finishedAt: raw.finished_at ? raw.finished_at.toISOString() : undefined,
        quizCount:
          lessonsIndexedMap(
            process.env.LESSON_PLAYER_BASE_URL ?? '',
            process.env.STATIC_FILES_BASE_URL ?? '',
          )[raw.lesson_id].quizCount ?? 0,
      }))

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
          `failed to get lesson statuses for student group ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }
}
