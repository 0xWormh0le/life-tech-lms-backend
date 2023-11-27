import { Lesson } from '../../entities/codex/Lesson'
import { User } from '../../entities/codex/User'
import { E, Errorable, wrapError } from '../shared/Errors'

export interface ILessonRepository {
  getLessonsByLessonIds(
    lessonIds: string[],
  ): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>>
}

export class GetLessonsUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async run(
    user: User,
    lessonIds: string[],
  ): Promise<
    Errorable<Lesson[], E<'LessonsNotFoundError'> | E<'UnknownRuntimeError'>>
  > {
    // Get lesson from some Reposity
    const lessonsErrorable = await this.lessonRepository.getLessonsByLessonIds(
      lessonIds,
    )

    if (lessonsErrorable.hasError) {
      return {
        hasError: true,
        error: wrapError(
          lessonsErrorable.error,
          `failed to getLessonsByLessonIds ${lessonIds}`,
        ),
        value: null,
      }
    }

    if (lessonsErrorable.value.length === 0) {
      return {
        hasError: true,
        error: {
          type: 'LessonsNotFoundError',
          message: `no lesson found by lesson id ${lessonIds}`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: lessonsErrorable.value,
    }
  }
}
