import { Lesson } from '../../../domain/entities/codex-v2/Lesson'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import {
  lessonsIndexedMap,
  lessonsIdArray,
} from '../../typeorm/hardcoded-data/Lessons'

export class HardCordedLessonRepository {
  lessonIndexedMap: Record<string, Lesson>

  constructor(
    private readonly staticFilesBaseUrl: string,
    private readonly lessonPlayerBaseUrl: string,
  ) {
    this.lessonIndexedMap = {}

    const orig = lessonsIndexedMap(
      this.lessonPlayerBaseUrl,
      this.staticFilesBaseUrl,
    )
    const isLessonCourse = (value: string): value is Lesson['course'] => {
      switch (value) {
        case 'basic':
        case 'webDesign':
        case 'mediaArt':
        case 'gameDevelopment':
        case '':
          return true
        default:
          return false
      }
    }
    const isLessonLessonEnvironment = (
      value: string,
    ): value is Lesson['lessonEnvironment'] => {
      return value === 'litLessonPlayer'
    }
    const isLessonLevel = (value: string): value is Lesson['level'] => {
      switch (value) {
        case 'basic':
        case 'advanced':
        case 'heroic':
        case 'adventurous':
          return true
        default:
          return false
      }
    }

    Object.keys(orig).forEach((lessonId) => {
      const origLesson = orig[lessonId]
      const course = origLesson.course

      if (!isLessonCourse(course)) {
        throw new Error(
          `lesson.course is invalid. course: ${JSON.stringify(
            course,
          )}, lessonId: ${lessonId}`,
        )
      }

      const lessonEnvironment = origLesson.lessonEnvironment

      if (!isLessonLessonEnvironment(lessonEnvironment)) {
        throw new Error(
          `lesson.lessonEnvironment is invalid. lessonEnvironment: ${JSON.stringify(
            lessonEnvironment,
          )}, lessonId: ${lessonId}`,
        )
      }

      const level = origLesson.level

      if (!isLessonLevel(level)) {
        throw new Error(
          `lesson.level is invalid. level: ${JSON.stringify(
            level,
          )}, lessonId: ${lessonId}`,
        )
      }

      const l: Lesson = {
        ...origLesson,
        course,
        lessonEnvironment,
        level,
        lessonOverViewPdfUrl: origLesson.lessonOverViewPdfUrl ?? '',
      }

      this.lessonIndexedMap[lessonId] = l
    })
  }

  findById = async (
    lessonId: string,
  ): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
    const result = this.lessonIndexedMap[lessonId]

    if (!result) {
      return successErrorable(null)
    }

    const lesson = this.transformToDomainEntity(result)

    return successErrorable(lesson)
  }

  findByIds = async (
    lessonIds: string[],
  ): Promise<Errorable<Lesson[], E<'UnknownRuntimeError'>>> => {
    const result: Lesson[] = lessonIds
      .map((e) => this.lessonIndexedMap[e])
      .filter((e) => !!e)
      .map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  findAll = async (): Promise<
    Errorable<Lesson[], E<'UnknownRuntimeError'>>
  > => {
    const result: Lesson[] = lessonsIdArray.map((id) =>
      this.transformToDomainEntity(this.lessonIndexedMap[id]),
    )

    return successErrorable(result)
  }

  private transformToDomainEntity = (hardCordedEntity: {
    id: string
    url: string
    name: string
    course: 'basic' | 'webDesign' | 'mediaArt' | 'gameDevelopment' | ''
    lessonEnvironment: 'litLessonPlayer'
    description: string
    theme: string
    skillsLearnedInThisLesson: string
    lessonOverViewPdfUrl: string
    lessonDuration: string
    thumbnailImageUrl: string
    projectName: string | null
    scenarioName: string | null
    maxStarCount: number
    quizCount: number | null
    hintCount: number | null
    level: 'basic' | 'advanced' | 'heroic' | 'adventurous'
  }): Lesson => {
    return {
      id: hardCordedEntity.id,
      url: hardCordedEntity.url,
      name: hardCordedEntity.name,
      course: hardCordedEntity.course,
      theme: hardCordedEntity.theme,
      skillsLearnedInThisLesson: hardCordedEntity.skillsLearnedInThisLesson,
      lessonOverViewPdfUrl: hardCordedEntity.lessonOverViewPdfUrl,
      lessonEnvironment: hardCordedEntity.lessonEnvironment,
      description: hardCordedEntity.description,
      lessonDuration: hardCordedEntity.lessonDuration,
      thumbnailImageUrl: hardCordedEntity.thumbnailImageUrl,
      projectName: hardCordedEntity.projectName,
      scenarioName: hardCordedEntity.scenarioName,
      maxStarCount: hardCordedEntity.maxStarCount,
      quizCount: hardCordedEntity.quizCount,
      hintCount: hardCordedEntity.hintCount,
      level: hardCordedEntity.level,
    }
  }
}
