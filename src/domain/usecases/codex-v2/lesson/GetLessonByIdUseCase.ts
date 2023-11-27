import { Lesson } from '../../../entities/codex-v2/Lesson'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'

export interface LessonRepository {
  findById(
    lessonId: Lesson['id'],
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>>
}

export default class GetLessonByIdUseCase {
  constructor(private readonly lessonRepository: LessonRepository) {}

  run = async (
    authenticatedUser: User,
    lessonId: Lesson['id'],
  ): Promise<
    Errorable<
      Lesson,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'LessonNotFound'>
    >
  > => {
    const resLesson = await this.lessonRepository.findById(lessonId)

    if (resLesson.hasError) {
      return resLesson
    }

    const lesson = resLesson.value

    if (!lesson) {
      return failureErrorable(
        'LessonNotFound',
        `lesson not found. lessonId: ${lessonId}`,
      )
    }

    return successErrorable(lesson)
  }
}
