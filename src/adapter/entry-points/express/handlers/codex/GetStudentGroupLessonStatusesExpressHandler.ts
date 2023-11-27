import { DataSource } from 'typeorm'
import { GetStudentGroupLessonStatusesUseCase } from '../../../../../domain/usecases/codex/GetStudentGroupLessonStatusesUseCase'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

type Response =
  | Paths.GetStudentGroupLessonStatuses.Responses.$200
  | Paths.GetStudentGroupLessonStatuses.Responses.$400
  | Paths.GetStudentGroupLessonStatuses.Responses.$401
  | Paths.GetStudentGroupLessonStatuses.Responses.$403
  | Paths.GetStudentGroupLessonStatuses.Responses.$404
  | Paths.GetStudentGroupLessonStatuses.Responses.$500

export class GetStudentGroupLessonsStatusesExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetStudentGroupLessonStatuses.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userLessonStatusesRepository = new UserLessonStatusesRepository(
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
    const GetStudentGroupLessonStatusUseCase =
      new GetStudentGroupLessonStatusesUseCase(
        userLessonStatusesRepository,
        teacherRepository,
        studentGroupRepository,
        administratorRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetStudentGroupLessonStatuses.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetStudentGroupLessonStatuses.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const GetStudentGroupLessonStatuses =
      await GetStudentGroupLessonStatusUseCase.run(
        params.pathParams.studentGroupId,
        getUserResult.value,
      )

    if (GetStudentGroupLessonStatuses.hasError) {
      switch (GetStudentGroupLessonStatuses.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.GetStudentGroupLessonStatuses.Responses.$400 =
            {
              error: GetStudentGroupLessonStatuses.error.message,
            }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetStudentGroupLessonStatuses.Responses.$403 =
            {
              error: GetStudentGroupLessonStatuses.error.message,
            }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.GetStudentGroupLessonStatuses.Responses.$404 =
            {
              error: GetStudentGroupLessonStatuses?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'UserNotFound': {
          const response404: Paths.GetStudentGroupLessonStatuses.Responses.$404 =
            {
              error: GetStudentGroupLessonStatuses?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.GetStudentGroupLessonStatuses.Responses.$404 =
            {
              error: GetStudentGroupLessonStatuses?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'LessonStatusesNotFound': {
          const response404: Paths.GetStudentGroupLessonStatuses.Responses.$404 =
            {
              error: GetStudentGroupLessonStatuses?.error?.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetStudentGroupLessonStatuses.Responses.$500 =
            {
              error: JSON.stringify(GetStudentGroupLessonStatuses.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetStudentGroupLessonStatuses.Responses.$200 = {
      studentGroupLessonStatuses:
        GetStudentGroupLessonStatuses.value === null
          ? undefined
          : GetStudentGroupLessonStatuses.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
