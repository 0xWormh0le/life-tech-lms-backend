import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'
import { UserLessonQuizAnswerStatusRepository } from '../../../../repositories/UserLessonQuizAnswerStatusRepository'
import { CreateUserLessonQuizAnswerStatusUseCase } from '../../../../../domain/usecases/codex/CreateUserLessonQuizAnswerStatusUseCase'

type Response =
  | Paths.PostQuizAnswered.Responses.$200
  | Paths.PostQuizAnswered.Responses.$401
  | Paths.PostQuizAnswered.Responses.$404
  | Paths.PostQuizAnswered.Responses.$500

export class PlayerApiPostQuizAnswredExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    {},
    Paths.PostQuizAnswered.RequestBody,
    Response
  > = async (params, token) => {
    // User Authentication
    const userRepository = new UserRepository(this.appDataSource)
    const userByAccessTokenResult = await userRepository.getUserByAccessToken(
      token,
    )

    if (userByAccessTokenResult.hasError) {
      switch (userByAccessTokenResult.error.type) {
        default: {
          const response500: Paths.PostQuizAnswered.Responses.$500 = {
            error: JSON.stringify(userByAccessTokenResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    if (userByAccessTokenResult.value === null) {
      const response401: Paths.PostQuizAnswered.Responses.$401 = {
        login_status: 'no',
      }

      return { statusCode: 401, response: response401 }
    }

    const requestedUser = userByAccessTokenResult.value

    // Get Lesson
    // Need to convert project_name and scenario_path to lessonId
    const projectName = decodeURIComponent(params.body.project_name)
    const scenarioPath = decodeURIComponent(params.body.scenario_path)
    const lessonRepository = new LessonRepository(
      this.appDataSource,
      this.staticFilesBaseUrl,
      this.lessonPlayerBaseUrl,
    )
    const getLessonResult =
      await lessonRepository.getLessonByProjectNameAndScenarioPath(
        projectName,
        scenarioPath,
      )

    if (getLessonResult.hasError) {
      const response500: Paths.PostQuizAnswered.Responses.$500 = {
        error: JSON.stringify(getLessonResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (getLessonResult.value === null) {
      const response404: Paths.PostQuizAnswered.Responses.$404 = {
        error: `lesson not found by project_name ${projectName} and ${scenarioPath}`,
      }

      return { statusCode: 404, response: response404 }
    }

    const targetLesson = getLessonResult.value

    // Create UserLessonQuizAnswerStatus
    const userLessonQuizAnswerStatusRepository =
      new UserLessonQuizAnswerStatusRepository(this.appDataSource)
    const userLessonStatusesRepository = new UserLessonStatusesRepository(
      this.appDataSource,
    )

    const latestUserLessonStatusHistoryResult =
      await userLessonStatusesRepository.getLatesUserLessonStatusHistoriesByUserIdAndLessonId(
        requestedUser.id,
        targetLesson.id,
      )

    if (latestUserLessonStatusHistoryResult.hasError) {
      const response500: Paths.PostQuizAnswered.Responses.$500 = {
        error: JSON.stringify(latestUserLessonStatusHistoryResult.error),
      }

      return { statusCode: 500, response: response500 }
    }
    // if (!latestUserLessonStatusHistoryResult.value) {
    //   const response404: Paths.PostQuizAnswered.Responses.$404 = {
    //     error: `latestUserLessonStatusHistory for user ${requestedUser.id} and lesson ${targetLesson.id} not found`,
    //   }
    //   return { statusCode: 404, response: response404 }
    // }

    const createUserLessonQuizAnswerStatusUseCase =
      new CreateUserLessonQuizAnswerStatusUseCase(
        userLessonQuizAnswerStatusRepository,
      )
    const createUserLessonQuizAnswerStatusResult =
      await createUserLessonQuizAnswerStatusUseCase.run({
        userId: requestedUser.id,
        lessonId: targetLesson.id,
        stepId: params.body.step_id,
        userLessonStatusHistoryId:
          latestUserLessonStatusHistoryResult?.value?.id ?? '',
        isCorrect: params.body.is_correct,
        selectedChoice: params.body.selected_choice,
      })

    if (createUserLessonQuizAnswerStatusResult.hasError) {
      switch (createUserLessonQuizAnswerStatusResult.error.type) {
        default: {
          const response500: Paths.PostQuizAnswered.Responses.$500 = {
            error: JSON.stringify(createUserLessonQuizAnswerStatusResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostQuizAnswered.Responses.$200 = {}

    return { statusCode: 200, response: response200 }
  }
}
