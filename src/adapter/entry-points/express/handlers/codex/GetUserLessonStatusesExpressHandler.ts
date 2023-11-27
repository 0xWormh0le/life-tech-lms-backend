import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { GetUserLessonStatusesByUserIdUseCase } from '../../../../../domain/usecases/codex/GetUserLessonStatusesByUserIdUseCase'

type Response =
  | Paths.GetUsersUserIdLessonStatuses.Responses.$200
  | Paths.GetUsersUserIdLessonStatuses.Responses.$401
  | Paths.GetUsersUserIdLessonStatuses.Responses.$404
  | Paths.GetUsersUserIdLessonStatuses.Responses.$500

export class GetUserLessonStatusesExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetUsersUserIdLessonStatuses.PathParameters,
    Paths.GetUsersUserIdLessonStatuses.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userLessonStatusesRepository = new UserLessonStatusesRepository(
      this.appDataSource,
    )
    const getUserLessonStatusesByUserIdUseCase =
      new GetUserLessonStatusesByUserIdUseCase(userLessonStatusesRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetUsersUserIdLessonStatuses.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetUsersUserIdLessonStatuses.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getUserLessonsResult = await getUserLessonStatusesByUserIdUseCase.run(
      getUserResult.value,
      params.pathParams.userId,
      params.query.lessonIds,
    )

    if (getUserLessonsResult.hasError) {
      switch (getUserLessonsResult.error.type) {
        default: {
          const response500: Paths.GetUsersUserIdLessonStatuses.Responses.$500 =
            {
              error: JSON.stringify(getUserLessonsResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetUsersUserIdLessonStatuses.Responses.$200 = {
      userLessonStatuses: getUserLessonsResult.value.map((s) => {
        return {
          userId: s.userId,
          lessonId: s.lessonId,
          status: s.status,
          achievedStarCount: s.achievedStarCount,
          usedHintCount: s.usedHintCount,
          correctAnsweredQuizCount: s.correctAnsweredQuizCount,
          stepIdskippingDetected: s.stepIdskippingDetected,
          startedAt: s.startedAt || undefined,
          finishedAt: s.finishedAt || undefined,
        }
      }),
    }

    return { statusCode: 200, response: response200 }
  }
}
