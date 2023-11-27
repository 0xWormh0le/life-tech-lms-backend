import { DataSource } from 'typeorm'
import { CreateUnaccessibleLessonUseCase } from '../../../../../../domain/usecases/codex/Teacher/StudentGroupUnaccessibleLessonUseCase'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UnaccessibleLessonRepository } from '../../../../../repositories/UnaccessibleLessonRepository'
import { StudentGroupRepository } from '../../../../../repositories/StudentGroupRepository'
import { LessonRepository } from '../../../../../repositories/LessonRepository'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$200
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$400
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$401
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$403
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$404
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$409
  | Paths.PostStudentGroupUnaccessibleLesson.Responses.$500

export class StudentGroupUnaccessibleLessonExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    Paths.PostStudentGroupUnaccessibleLesson.PathParameters,
    Paths.PostStudentGroupUnaccessibleLesson.QueryParameters,
    Paths.PostStudentGroupUnaccessibleLesson.RequestBody,
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
    const StudentGroupUnaccessibleLessonsUseCase =
      new CreateUnaccessibleLessonUseCase(
        unaccessibleLessonRepository,
        teacherRepository,
        studentGroupRepository,
        lessonRepository,
        administratorRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostStudentGroupUnaccessibleLesson.Responses.$500 =
        {
          error: JSON.stringify(getUserResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostStudentGroupUnaccessibleLesson.Responses.$401 =
        {
          error: `token invalid ${token}`,
        }

      return { statusCode: 401, response: response401 }
    }

    const StudentGroupUnaccessibleLesson =
      await StudentGroupUnaccessibleLessonsUseCase.run(
        params.pathParams.studentGroupId,
        getUserResult.value,
        params.query.lessonIds,
        params.body.packageId,
      )

    if (StudentGroupUnaccessibleLesson.hasError) {
      switch (StudentGroupUnaccessibleLesson.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.PostStudentGroupUnaccessibleLesson.Responses.$400 =
            {
              error: StudentGroupUnaccessibleLesson.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostStudentGroupUnaccessibleLesson.Responses.$403 =
            {
              error: StudentGroupUnaccessibleLesson.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.PostStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: StudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'LessonsNotFound': {
          const response404: Paths.PostStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: StudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'UserNotFound': {
          const response404: Paths.PostStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: StudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PostStudentGroupUnaccessibleLesson.Responses.$404 =
            {
              error: StudentGroupUnaccessibleLesson?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostStudentGroupUnaccessibleLesson.Responses.$500 =
            {
              error: JSON.stringify(StudentGroupUnaccessibleLesson.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostStudentGroupUnaccessibleLesson.Responses.$200 =
      {
        message: 'ok',
      }

    return { statusCode: 200, response: response200 }
  }
}
