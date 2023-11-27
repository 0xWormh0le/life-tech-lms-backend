import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { GetLessonsUseCase } from '../../../../../domain/usecases/codex/GetLessonsUseCase'
import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'

type Response =
  | Paths.GetLessons.Responses.$200
  | Paths.GetLessons.Responses.$401
  | Paths.GetLessons.Responses.$404
  | Paths.GetLessons.Responses.$500

export class GetLessonsExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetLessons.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const lessonRepository = new LessonRepository(
      this.appDataSource,
      this.staticFilesBaseUrl,
      this.lessonPlayerBaseUrl,
    )
    const getLessonsUseCase = new GetLessonsUseCase(lessonRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetLessons.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetLessons.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getLessonsResult = await getLessonsUseCase.run(
      getUserResult.value,
      params.query.lessonIds,
    )

    if (getLessonsResult.hasError) {
      switch (getLessonsResult.error.type) {
        case 'LessonsNotFoundError': {
          const response404: Paths.GetLessons.Responses.$404 = {
            error: `lesson not found in lessonId ${params.query.lessonIds}`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'UnknownRuntimeError': {
          const response500: Paths.GetLessons.Responses.$500 = {
            error: JSON.stringify(getLessonsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetLessons.Responses.$200 = {
      lessons: getLessonsResult.value.map((l) => ({
        id: l.id,
        maxStarCount: l.maxStarCount,
        quizCount: l.quizCount ?? undefined,
        hintCount: l.hintCount ?? undefined,
        lessonEnvironment: l.lessonEnvironment,
        level: l.level,
        lessonDuration: l.lessonDuration,
        description: l.description,
        theme: l.theme,
        skillsLearnedInThisLesson: l.skillsLearnedInThisLesson,
        lessonObjectives: l.lessonObjectives,
        url: l.url,
        thumbnailImageUrl: l.thumbnailImageUrl,
        lessonOverViewPdfUrl: l.lessonOverViewPdfUrl ?? undefined,
        name: l.name,
        course: l.course,
        projectName: l.projectName ?? undefined,
        scenarioName: l.scenarioName ?? undefined,
      })),
    }

    return { statusCode: 200, response: response200 }
  }
}
