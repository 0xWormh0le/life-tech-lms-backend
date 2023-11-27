import { DataSource } from 'typeorm'
import { GetStudentUnaccessibleLessonsUseCase } from '../../../../../domain/usecases/codex/GetStudentUnaccessibleLessonsUseCase'
import { UnaccessibleLessonRepository } from '../../../../repositories/UnaccessibleLessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

type Response =
  | Paths.GetStudentUnaccessibleLessons.Responses.$200
  | Paths.GetStudentUnaccessibleLessons.Responses.$400
  | Paths.GetStudentUnaccessibleLessons.Responses.$401
  | Paths.GetStudentUnaccessibleLessons.Responses.$403
  | Paths.GetStudentUnaccessibleLessons.Responses.$404
  | Paths.GetStudentUnaccessibleLessons.Responses.$500

export class GetStudentUnaccessibleLessonsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetStudentUnaccessibleLessons.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const unaccessibleLessonRepository = new UnaccessibleLessonRepository(
      this.appDataSource,
    )

    const getStudentUnaccessibleLessonsUseCase =
      new GetStudentUnaccessibleLessonsUseCase(unaccessibleLessonRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetStudentUnaccessibleLessons.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetStudentUnaccessibleLessons.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const GetStudentUnaccessibleLesson =
      await getStudentUnaccessibleLessonsUseCase.run(
        params.pathParams.studentId,
        getUserResult.value,
      )

    if (GetStudentUnaccessibleLesson.hasError) {
      switch (GetStudentUnaccessibleLesson.error.type) {
        case 'InvalidStudentId': {
          const response400: Paths.GetStudentUnaccessibleLessons.Responses.$400 =
            {
              error: GetStudentUnaccessibleLesson.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetStudentUnaccessibleLessons.Responses.$403 =
            {
              error: GetStudentUnaccessibleLesson.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        default: {
          const response500: Paths.GetStudentUnaccessibleLessons.Responses.$500 =
            {
              error: JSON.stringify(GetStudentUnaccessibleLesson.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetStudentUnaccessibleLessons.Responses.$200 = {
      unaccessibleLessons: GetStudentUnaccessibleLesson.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
