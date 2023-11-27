import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { CreateUserLessonStepStatusUseCase } from '../../../../../domain/usecases/codex/CreateUserLessonStepStatusUseCase'
import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserLessonStepStatusRepository } from '../../../../repositories/UserLessonStepStatusRepository'
import { CreateUserLessonStatusUseCase } from '../../../../../domain/usecases/codex/CreateUserLessonStatusUseCase'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'

type Response =
  | Paths.PostStepPassed.Responses.$200
  | Paths.PostStepPassed.Responses.$401
  | Paths.PostStepPassed.Responses.$404
  | Paths.PostStepPassed.Responses.$500

export class PlayerApiPostStepPassedExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    {},
    Paths.PostStepPassed.RequestBody,
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
          const response500: Paths.PostStepPassed.Responses.$500 = {
            error: JSON.stringify(userByAccessTokenResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    if (userByAccessTokenResult.value === null) {
      const response401: Paths.PostStepPassed.Responses.$401 = {
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
      const response500: Paths.PostStepPassed.Responses.$500 = {
        error: JSON.stringify(getLessonResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (getLessonResult.value === null) {
      const response404: Paths.PostStepPassed.Responses.$404 = {
        error: `lesson not found by project_name ${projectName} and ${scenarioPath}`,
      }

      return { statusCode: 404, response: response404 }
    }

    const targetLesson = getLessonResult.value

    // Create UserLessonStepStatus
    const userLessonStepStatusRepository = new UserLessonStepStatusRepository(
      this.appDataSource,
    )

    const userLessonStatusRepository = new UserLessonStatusesRepository(
      this.appDataSource,
    )
    const createUserLessonStatusUseCase = new CreateUserLessonStatusUseCase(
      lessonRepository,
      userLessonStatusRepository,
    )
    const timeRepository = {
      getNow: async (): Promise<string> => {
        return new Date().toISOString()
      },
    }
    const stepId = parseInt(params.body.step_id, 10) || 0

    if (stepId === 1) {
      const userLessonStatusInfo = await createUserLessonStatusUseCase.run(
        requestedUser,
        {
          userId: requestedUser.id,
          lessonId: targetLesson.id,
          status: 'not_cleared',
          achievedStarCount: 0,
          usedHintCount: null,
          correctAnsweredQuizCount: null,
          stepIdskippingDetected: false,
          startedAt: await timeRepository.getNow(),
        },
      )

      if (userLessonStatusInfo.hasError) {
        switch (userLessonStatusInfo.error.type) {
          case 'NotFoundError': {
            const response404: Paths.PostUserLessonStatus.Responses.$404 = {
              error: `lesson not found for lessonId : ${targetLesson.id}`,
            }

            return { statusCode: 404, response: response404 }
          }
          default: {
            const response500: Paths.PostUserLessonStatus.Responses.$500 = {
              error: JSON.stringify(userLessonStatusInfo.error),
            }

            return { statusCode: 500, response: response500 }
          }
        }
      }
    }

    const createUserLessonStepStatusUseCase =
      new CreateUserLessonStepStatusUseCase(
        lessonRepository,
        userLessonStepStatusRepository,
      )
    const createLessonStepStatusResult =
      await createUserLessonStepStatusUseCase.run({
        userId: requestedUser.id,
        lessonId: targetLesson.id,
        stepId: params.body.step_id,
        status: 'cleared',
      })

    if (createLessonStepStatusResult.hasError) {
      switch (createLessonStepStatusResult.error.type) {
        case 'NotFoundError': {
          const response404: Paths.PostStepPassed.Responses.$404 = {
            error: `lesson not found by project_name ${projectName} and ${scenarioPath} for lesson ${targetLesson.id}`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AlreadyExistsError': {
          // Do nothing and assume success
          const response200: Paths.PostStepPassed.Responses.$200 = {}

          return { statusCode: 200, response: response200 }
        }
        default: {
          const response500: Paths.PostStepPassed.Responses.$500 = {
            error: JSON.stringify(createLessonStepStatusResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostStepPassed.Responses.$200 = {}

    return { statusCode: 200, response: response200 }
  }
}
