import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'
import { CreateUserLessonStatusUseCase } from '../../../../../domain/usecases/codex/CreateUserLessonStatusUseCase'

type Response =
  | Paths.PostUserLessonStatus.Responses.$200
  | Paths.PostUserLessonStatus.Responses.$401
  | Paths.PostUserLessonStatus.Responses.$404
  | Paths.PostUserLessonStatus.Responses.$500

export class CreateUserLessonStatusExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    undefined,
    Paths.PostUserLessonStatus.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const lessonRepository = new LessonRepository(
      this.appDataSource,
      this.staticFilesBaseUrl,
      this.lessonPlayerBaseUrl,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostStudents.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostStudents.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    // Create UserLessonStatus
    const userLessonStatusRepository = new UserLessonStatusesRepository(
      this.appDataSource,
    )
    const timeRepository = {
      getNow: async (): Promise<string> => {
        return new Date().toISOString()
      },
    }

    const createUserLessonStatusUseCase = new CreateUserLessonStatusUseCase(
      lessonRepository,
      userLessonStatusRepository,
    )
    const createLessonStatusResult = await createUserLessonStatusUseCase.run(
      getUserResult.value,
      {
        userId: getUserResult.value.id,
        lessonId: params.body.lessonId,
        status: 'not_cleared',
        achievedStarCount: 0,
        usedHintCount: null,
        correctAnsweredQuizCount: null,
        stepIdskippingDetected: false,
        startedAt: await timeRepository.getNow(),
      },
    )

    if (createLessonStatusResult.hasError) {
      switch (createLessonStatusResult.error.type) {
        case 'NotFoundError': {
          const response404: Paths.PostUserLessonStatus.Responses.$404 = {
            error: `lesson not found for lessonId : ${params.body.lessonId}`,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostUserLessonStatus.Responses.$500 = {
            error: JSON.stringify(createLessonStatusResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostUserLessonStatus.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
