import { DataSource } from 'typeorm'
import { RemoveUnaccessibleLessonUseCase } from '../../../../../../domain/usecases/codex/Teacher/RemoveStudentGroupUnaccessibleLessonUseCase'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UnaccessibleLessonRepository } from '../../../../../repositories/UnaccessibleLessonRepository'
import { StudentGroupRepository } from '../../../../../repositories/StudentGroupRepository'
import { LessonRepository } from '../../../../../repositories/LessonRepository'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$200
  | Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$400
  | Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$401
  | Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$403
  | Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$404
  | Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$500

export class RemoveStudentGroupUnaccessibleLessonExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    Paths.DeleteStudentGroupUnaccessibleLesson.PathParameters,
    Paths.DeleteStudentGroupUnaccessibleLesson.QueryParameters,
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
    const lessonRepository = new LessonRepository(
      this.appDataSource,
      this.staticFilesBaseUrl,
      this.lessonPlayerBaseUrl,
    )
    const DeleteStudentGroupUnaccessibleLessonsUseCase =
      new RemoveUnaccessibleLessonUseCase(
        unaccessibleLessonRepository,
        teacherRepository,
        studentGroupRepository,
        lessonRepository,
        administratorRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$500 =
        {
          error: JSON.stringify(getUserResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$401 =
        {
          error: `token invalid ${token}`,
        }

      return { statusCode: 401, response: response401 }
    }

    const DeleteStudentGroupUnaccessibleLesson =
      await DeleteStudentGroupUnaccessibleLessonsUseCase.run(
        params.pathParams.studentGroupId,
        getUserResult.value,
        params.query.lessonIds,
      )

    if (DeleteStudentGroupUnaccessibleLesson.hasError) {
      switch (DeleteStudentGroupUnaccessibleLesson.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$400 =
            {
              error: DeleteStudentGroupUnaccessibleLesson.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$403 =
            {
              error: DeleteStudentGroupUnaccessibleLesson.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: DeleteStudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'LessonsNotFound': {
          const response404: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: DeleteStudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'UserNotFound': {
          const response404: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: DeleteStudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: DeleteStudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$500 =
            {
              error: JSON.stringify(DeleteStudentGroupUnaccessibleLesson.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteStudentGroupUnaccessibleLesson.Responses.$200 =
      {
        message: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }
}
