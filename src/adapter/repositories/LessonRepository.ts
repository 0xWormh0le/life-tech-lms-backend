import {
  Lesson,
  Course,
  LessonEnvironment,
} from '../../domain/entities/codex/Lesson'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'

import { DataSource, EntityNotFoundError, In } from 'typeorm'
import {
  CourseTypeormEnum,
  LessonEnvironmentTypeormEnum,
  LessonTypeormEntity,
} from '../typeorm/entity/Lesson'
import { ILessonRepository } from '../../domain/usecases/codex/GetLessonsUseCase'
import {
  lessonIdByProjectnameAndScenarioPath,
  lessonsIndexedMap,
} from '../typeorm/hardcoded-data/Lessons'

// const convertCourse = (course: CourseTypeormEnum): Course | null => {
//   switch (course) {
//     case CourseTypeormEnum.basic:
//       return 'basic'
//     case CourseTypeormEnum.gameDevelopment:
//       return 'gameDevelopment'
//     case CourseTypeormEnum.mediaArt:
//       return 'mediaArt'
//     case CourseTypeormEnum.webDesign:
//       return 'webDesign'
//     default:
//       return null
//   }
// }

// const convertLessonEnvironment = (
//   lessonEnvironment: LessonEnvironmentTypeormEnum,
// ): LessonEnvironment | null => {
//   switch (lessonEnvironment) {
//     case LessonEnvironmentTypeormEnum.litLessonPlayer:
//       return 'litLessonPlayer'
//     default:
//       return null
//   }
// }

export class LessonRepository implements ILessonRepository {
  constructor(
    private typeormDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  // private convertAndReturnLessonAsErrorable(
  //   lesson: LessonTypeormEntity | null,
  // ): Errorable<Lesson | null, E<'UnknownRuntimeError'>> {
  //   if (lesson === null) {
  //     return {
  //       hasError: false,
  //       error: null,
  //       value: null,
  //     }
  //   }

  //   const course = convertCourse(lesson.course)
  //   if (course === null) {
  //     return {
  //       hasError: true,
  //       error: {
  //         type: 'UnknownRuntimeError',
  //         message: `unknown course name detected: ${lesson.course}`,
  //       },
  //       value: null,
  //     }
  //   }
  //   const lessonEnvironment = convertLessonEnvironment(
  //     lesson.lesson_environment,
  //   )
  //   if (lessonEnvironment === null) {
  //     return {
  //       hasError: true,
  //       error: {
  //         type: 'UnknownRuntimeError',
  //         message: `unknown lessonEnvironment name detected: ${lesson.lesson_environment}`,
  //       },
  //       value: null,
  //     }
  //   }

  //   return {
  //     hasError: false,
  //     error: null,
  //     value: {
  //       id: lesson.id,
  //       url: lesson.url,
  //       name: lesson.name,
  //       course,
  //       lessonEnvironment,
  //       description: lesson.description,
  //       lessonDuration: lesson.lesson_duration,
  //       thumbnailImageUrl: lesson.thumbnail_image_url,
  //       maxStarCount: lesson.max_star_count,
  //       quizCount: lesson.quiz_count ?? null,
  //       hintCount: lesson.hint_count ?? null,
  //       level: lesson.level,
  //     },
  //   }
  // }

  async getLessonById(
    lessonId: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> {
    return {
      hasError: false,
      error: null,
      value: lessonsIndexedMap(
        this.lessonPlayerBaseUrl,
        this.staticFilesBaseUrl,
      )[lessonId],
    }
  }

  async getLessonsByLessonIds(
    lessonIds: string[],
  ): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> {
    const indexed = lessonsIndexedMap(
      this.lessonPlayerBaseUrl,
      this.staticFilesBaseUrl,
    )
    const lessons: Lesson[] = []

    for (const id of lessonIds) {
      const lesson = indexed[id]

      if (!lesson) {
        continue
      }
      lessons.push(lesson)
    }

    return {
      hasError: false,
      error: null,
      value: lessons,
    }
  }

  // Only for Player API
  async getLessonByProjectNameAndScenarioPath(
    projectName: string,
    scenarioPath: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> {
    const targetLessonId = lessonIdByProjectnameAndScenarioPath(
      projectName,
      scenarioPath,
    )

    if (!targetLessonId) {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }

    const targetLesson = lessonsIndexedMap(
      this.lessonPlayerBaseUrl,
      this.staticFilesBaseUrl,
    )[targetLessonId]

    if (!targetLesson) {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `lessonId ${targetLessonId} is not defined somehow`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: targetLesson,
    }

    // const lessonTypeormRepository =
    //   this.typeormDataSource.getRepository(LessonTypeormEntity)
    // try {
    //   const lesson = await lessonTypeormRepository.findOneBy({
    //     project_name: projectName,
    //     scenario_path: scenarioPath,
    //   })
    //   return this.convertAndReturnLessonAsErrorable(lesson)
    // } catch (e: unknown) {
    //   if (e instanceof EntityNotFoundError) {
    //     return {
    //       hasError: false,
    //       error: null,
    //       value: null,
    //     }
    //   }
    //   return {
    //     hasError: true,
    //     error: fromNativeError(
    //       'UnknownRuntimeError',
    //       e as Error,
    //       `failed to get lesson from db by project_name "${projectName}" and scenario_path "${scenarioPath}"`,
    //     ),
    //     value: null,
    //   }
    // }
  }
}
