import { URL } from 'url'
import { DataSource } from 'typeorm'

import { GetUserLessonStepStatusesUseCase } from '../../../../../domain/usecases/codex/GetUserLessonStepStatusesUseCase'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserLessonStepStatusRepository } from '../../../../repositories/UserLessonStepStatusRepository'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'
import { GetUserLessonStatusesByUserIdUseCase } from '../../../../../domain/usecases/codex/GetUserLessonStatusesByUserIdUseCase'
import { UserLessonStatus } from '../../../../../domain/entities/codex/UserLessonStatus'

type Response =
  | Paths.GetLessonsSetting.Responses.$200
  | Paths.GetLessonsSetting.Responses.$401
  | Paths.GetLessonsSetting.Responses.$404
  | Paths.GetLessonsSetting.Responses.$500

export class PlayerApiGetLessonSettingExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
    private codexUsaFronteneBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetLessonsSetting.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)

    // User Authentication
    const userByAccessTokenResult = await userRepository.getUserByAccessToken(
      token,
    )

    if (userByAccessTokenResult.hasError) {
      switch (userByAccessTokenResult.error.type) {
        default: {
          const response500: Paths.GetLessonsSetting.Responses.$500 = {
            error: JSON.stringify(userByAccessTokenResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    if (userByAccessTokenResult.value === null) {
      const response401: Paths.GetLessonsSetting.Responses.$401 = {
        isAccessible: false,
        redirectUrl: new URL('/', this.codexUsaFronteneBaseUrl).toString(),
      }

      return { statusCode: 401, response: response401 }
    }

    const requestedUser = userByAccessTokenResult.value

    // Get Lesson
    // Need to convert project_name and scenario_path to lessonId
    const lessonRepository = new LessonRepository(
      this.appDataSource,
      this.staticFilesBaseUrl,
      this.lessonPlayerBaseUrl,
    )
    const getLessonResult =
      await lessonRepository.getLessonByProjectNameAndScenarioPath(
        params.query.project_name,
        params.query.scenario_path,
      )

    if (getLessonResult.hasError) {
      const response500: Paths.GetLessonsSetting.Responses.$500 = {
        error: JSON.stringify(getLessonResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (getLessonResult.value === null) {
      const response404: Paths.GetLessonsSetting.Responses.$404 = {
        error: `lesson not found by project_name ${params.query.project_name} and ${params.query.scenario_path}`,
      }

      return { statusCode: 404, response: response404 }
    }

    const targetLesson = getLessonResult.value

    // Get UserLessonStatuses
    const userLessonStatusesRepository = new UserLessonStatusesRepository(
      this.appDataSource,
    )
    const getUserLessonStatusesByUserIdUseCase =
      new GetUserLessonStatusesByUserIdUseCase(userLessonStatusesRepository)
    const getUserLessonStatusesByUserIdResult =
      await getUserLessonStatusesByUserIdUseCase.run(
        requestedUser,
        requestedUser.id,
        [targetLesson.id],
      )

    if (getUserLessonStatusesByUserIdResult.hasError) {
      switch (getUserLessonStatusesByUserIdResult.error.type) {
        default: {
          const response500: Paths.GetLessonsSetting.Responses.$500 = {
            error: JSON.stringify(getUserLessonStatusesByUserIdResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    let targetLessonStatus: UserLessonStatus | null = null

    if (getUserLessonStatusesByUserIdResult.value.length !== 0) {
      targetLessonStatus = getUserLessonStatusesByUserIdResult.value[0]
    }

    // Get UserLessonStepStatuses
    const userLessonStepStatusRepository = new UserLessonStepStatusRepository(
      this.appDataSource,
    )
    const getUserLessonStepStatusesUseCase =
      new GetUserLessonStepStatusesUseCase(
        lessonRepository,
        userLessonStepStatusRepository,
      )
    const getUserLessonStepStatusesResult =
      await getUserLessonStepStatusesUseCase.run(requestedUser, targetLesson.id)

    if (getUserLessonStepStatusesResult.hasError) {
      switch (getUserLessonStepStatusesResult.error.type) {
        case 'NotFoundError': {
          const response404: Paths.GetLessonsSetting.Responses.$404 = {
            error: `lesson not found by project_name ${params.query.project_name} and ${params.query.scenario_path}`,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetLessonsSetting.Responses.$500 = {
            error: JSON.stringify(getUserLessonStepStatusesResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const userLessonStepStatuses = getUserLessonStepStatusesResult.value

    const passedStepIdList: number[] = []

    for (const status of userLessonStepStatuses) {
      // convert stepId to number
      const stepId = parseInt(status.stepId, 10)

      if (Number.isNaN(stepId) || stepId === null) {
        const response500: Paths.GetLessonsSetting.Responses.$500 = {
          error: `the stepId "${status.stepId}" of lesson "${status.lessonId}" can't be parsed as Int`,
        }

        return { statusCode: 500, response: response500 }
      }
      passedStepIdList.push(stepId)
    }

    const response200: Paths.GetLessonsSetting.Responses.$200 = {
      isAccessible: true,
      cleared:
        targetLessonStatus !== null && targetLessonStatus.status === 'cleared',
      redirecetUrl: '',
      passed_step_id_list: passedStepIdList,
    }

    return { statusCode: 200, response: response200 }
  }
}
