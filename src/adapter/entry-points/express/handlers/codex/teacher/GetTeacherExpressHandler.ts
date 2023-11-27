import { DataSource } from 'typeorm'
import { GetTeachersUseCase } from '../../../../../../domain/usecases/codex/Teacher/GetTeachersUseCase'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { OrganizationsRepository } from '../../../../../repositories/OrganizationRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.GetTeachers.Responses.$200
  | Paths.GetTeachers.Responses.$400
  | Paths.GetTeachers.Responses.$401
  | Paths.GetTeachers.Responses.$403
  | Paths.GetTeachers.Responses.$404
  | Paths.GetTeachers.Responses.$500

export class GetTeacherExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetTeachers.PathParameters,
    Paths.GetTeachers.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const getTeachersUseCase = new GetTeachersUseCase(
      teacherRepository,
      organizationRepository,
      administratorRepository,
    )
    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetTeachers.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetTeachers.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getTeachers = await getTeachersUseCase.run(
      getUserResult.value,
      params?.pathParams?.organizationId,
      params.query.teacherIds,
    )

    if (getTeachers.hasError) {
      switch (getTeachers.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.GetTeachers.Responses.$400 = {
            error: getTeachers.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetTeachers.Responses.$403 = {
            error: getTeachers.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.GetTeachers.Responses.$404 = {
            error: getTeachers.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'OrganizationNotFound': {
          const response404: Paths.GetTeachers.Responses.$404 = {
            error: getTeachers?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.GetTeachers.Responses.$404 = {
            error: getTeachers?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetTeachers.Responses.$500 = {
            error: JSON.stringify(getTeachers.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetTeachers.Responses.$200 = {
      teachers: getTeachers.value === null ? undefined : getTeachers.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
