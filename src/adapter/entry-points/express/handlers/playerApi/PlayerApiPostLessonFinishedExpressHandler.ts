import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { UpdateUserLessonStatusUseCase } from '../../../../../domain/usecases/codex/UpdateUserLessonStatusUseCase'
import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'
import { UserLessonQuizAnswerStatusRepository } from '../../../../repositories/UserLessonQuizAnswerStatusRepository'

type Response =
  | Paths.PostLessonFinished.Responses.$200
  | Paths.PostLessonFinished.Responses.$401
  | Paths.PostLessonFinished.Responses.$404
  | Paths.PostLessonFinished.Responses.$500

export class PlayerApiPostLessonFinishedExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
    private codexUsaFronteneBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    {},
    Paths.PostLessonFinished.RequestBody,
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
          const response500: Paths.PostLessonCleared.Responses.$500 = {
            error: JSON.stringify(userByAccessTokenResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    if (userByAccessTokenResult.value === null) {
      const response401: Paths.PostLessonCleared.Responses.$401 = {
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
      const response500: Paths.PostLessonCleared.Responses.$500 = {
        error: JSON.stringify(getLessonResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (getLessonResult.value === null) {
      const response404: Paths.PostLessonCleared.Responses.$404 = {
        error: `lesson not found by project_name ${projectName} and ${scenarioPath}`,
      }

      return { statusCode: 404, response: response404 }
    }

    const targetLesson = getLessonResult.value

    // Update UserLessonStatus
    const userLessonStatusRepository = new UserLessonStatusesRepository(
      this.appDataSource,
    )
    const userLessonQuizAnswerStatusRepository =
      new UserLessonQuizAnswerStatusRepository(this.appDataSource)
    const timeRepository = {
      getNow: async (): Promise<string> => {
        return new Date().toISOString()
      },
    }
    const updateUserLessonStatusUseCase = new UpdateUserLessonStatusUseCase(
      lessonRepository,
      userLessonStatusRepository,
    )

    // calculate achievedStarCount , hintUsed and correct quiz count
    let achievedStarCount = 1
    let usedHintCount = 0
    let correctAnsweredQuizCount = 0
    const latestUserLessonStatusHistory =
      await userLessonStatusRepository.getLatesUserLessonStatusHistoriesByUserIdAndLessonId(
        requestedUser.id,
        targetLesson.id,
      )

    if (latestUserLessonStatusHistory.hasError) {
      const response500: Paths.PostLessonCleared.Responses.$500 = {
        error: JSON.stringify(latestUserLessonStatusHistory.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (latestUserLessonStatusHistory.value) {
      const userLessonQuizAnswerStatuses =
        await userLessonQuizAnswerStatusRepository.getUserLessonQuizAnswerStatusesByUserLessonStatusHistoryId(
          latestUserLessonStatusHistory.value.id,
        )

      if (userLessonQuizAnswerStatuses.hasError) {
        const response500: Paths.PostLessonCleared.Responses.$500 = {
          error: JSON.stringify(userLessonQuizAnswerStatuses.error),
        }

        return { statusCode: 500, response: response500 }
      }

      const answerCountPerStepId: {
        [stepId: string]: { correct: number; wrong: number }
      } = {}

      for (const userLessonQuizAnswerStatus of userLessonQuizAnswerStatuses.value) {
        if (!answerCountPerStepId[userLessonQuizAnswerStatus.stepId]) {
          answerCountPerStepId[userLessonQuizAnswerStatus.stepId] = {
            correct: 0,
            wrong: 0,
          }
        }

        if (userLessonQuizAnswerStatus.isCorrect) {
          answerCountPerStepId[userLessonQuizAnswerStatus.stepId].correct += 1
        } else {
          answerCountPerStepId[userLessonQuizAnswerStatus.stepId].wrong += 1
        }
      }
      for (const stepId of Object.keys(answerCountPerStepId)) {
        if (answerCountPerStepId[stepId].wrong === 0) {
          correctAnsweredQuizCount += 1
        }
      }
    }

    if (params.body.finish_status.no_hint_cleared) {
      achievedStarCount += 1
    } else {
      usedHintCount = 1
    }

    if (params.body.finish_status.quiz_all_answered) {
      achievedStarCount += 1
    }

    const createLessonStatusResult = await updateUserLessonStatusUseCase.run(
      userByAccessTokenResult.value,
      {
        userId: requestedUser.id,
        lessonId: targetLesson.id,
        status: 'cleared',
        achievedStarCount,
        usedHintCount,
        correctAnsweredQuizCount,
        stepIdskippingDetected: params.body.finish_status.no_status_up,
        finishedAt: await timeRepository.getNow(),
      },
    )

    if (createLessonStatusResult.hasError) {
      switch (createLessonStatusResult.error.type) {
        case 'NotFoundError': {
          const response404: Paths.PostLessonCleared.Responses.$404 = {
            error: `lesson not found by project_name ${projectName} and ${scenarioPath} for lesson ${targetLesson.id}`,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostLessonCleared.Responses.$500 = {
            error: JSON.stringify(createLessonStatusResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostLessonFinished.Responses.$200 = {
      type: 'full_url',
      value:
        requestedUser.role === 'student'
          ? new URL(
              '/computer-science-essentials',
              this.codexUsaFronteneBaseUrl,
            ).toString()
          : new URL(
              '/lesson-guidance',
              this.codexUsaFronteneBaseUrl,
            ).toString(),
    }

    return { statusCode: 200, response: response200 }
  }
}
