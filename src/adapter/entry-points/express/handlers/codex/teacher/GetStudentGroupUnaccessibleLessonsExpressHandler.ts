import { DataSource } from 'typeorm'
import { GetUnaccessibleLessonsUseCase } from '../../../../../../domain/usecases/codex/Teacher/GetStudentGroupUnaccessibleLessonsUseCase'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UnaccessibleLessonRepository } from '../../../../../repositories/UnaccessibleLessonRepository'
import { StudentGroupRepository } from '../../../../../repositories/StudentGroupRepository'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.GetUnaccessibleLessons.Responses.$200
  | Paths.GetUnaccessibleLessons.Responses.$400
  | Paths.GetUnaccessibleLessons.Responses.$401
  | Paths.GetUnaccessibleLessons.Responses.$403
  | Paths.GetUnaccessibleLessons.Responses.$404
  | Paths.GetUnaccessibleLessons.Responses.$500

export class GetStudentGroupUnaccessibleLessonsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetUnaccessibleLessons.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const unaccessibleLessonRepository = new UnaccessibleLessonRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )
    const GetStudentGroupUnaccessibleLessonsUseCase =
      new GetUnaccessibleLessonsUseCase(
        unaccessibleLessonRepository,
        teacherRepository,
        studentGroupRepository,
        administratorRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetUnaccessibleLessons.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetUnaccessibleLessons.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const GetStudentGroupUnaccessibleLesson =
      await GetStudentGroupUnaccessibleLessonsUseCase.run(
        params.pathParams.studentGroupId,
        getUserResult.value,
      )

    if (GetStudentGroupUnaccessibleLesson.hasError) {
      switch (GetStudentGroupUnaccessibleLesson.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.GetUnaccessibleLessons.Responses.$400 = {
            error: GetStudentGroupUnaccessibleLesson.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetUnaccessibleLessons.Responses.$403 = {
            error: GetStudentGroupUnaccessibleLesson.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.GetUnaccessibleLessons.Responses.$404 = {
            error: GetStudentGroupUnaccessibleLesson?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'UserNotFound': {
          const response404: Paths.GetUnaccessibleLessons.Responses.$404 = {
            error: GetStudentGroupUnaccessibleLesson?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.GetUnaccessibleLessons.Responses.$404 = {
            error: GetStudentGroupUnaccessibleLesson?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetUnaccessibleLessons.Responses.$500 = {
            error: JSON.stringify(GetStudentGroupUnaccessibleLesson.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetUnaccessibleLessons.Responses.$200 = {
      unaccessibleLessons: GetStudentGroupUnaccessibleLesson.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
