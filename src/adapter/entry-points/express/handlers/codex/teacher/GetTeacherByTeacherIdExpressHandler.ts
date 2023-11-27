import { DataSource } from 'typeorm'
import { TeacherOrganization } from '../../../../../../domain/entities/codex/Teacher'
import { GetTeacherByTeacherIdUseCase } from '../../../../../../domain/usecases/codex/Teacher/GetTeacherByTeacherIdUseCase'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.GetTeacherOrganizations.Responses.$200
  | Paths.GetTeacherOrganizations.Responses.$400
  | Paths.GetTeacherOrganizations.Responses.$401
  | Paths.GetTeacherOrganizations.Responses.$403
  | Paths.GetTeacherOrganizations.Responses.$404
  | Paths.GetTeacherOrganizations.Responses.$500

export class GetTeacherByTeacherIdExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.GetTeacherOrganizations.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const getTeachersUseCase = new GetTeacherByTeacherIdUseCase(
      administratorRepository,
      teacherRepository,
    )
    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetTeacherOrganizations.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetTeacherOrganizations.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getTeacherResult = await getTeachersUseCase.run(
      getUserResult.value,
      params?.pathParams?.teacherId,
    )

    if (getTeacherResult.hasError) {
      switch (getTeacherResult.error.type) {
        case 'PermissionDenied': {
          const response403: Paths.GetTeacherOrganizations.Responses.$403 = {
            error: getTeacherResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.GetTeacherOrganizations.Responses.$404 = {
            error: getTeacherResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.GetTeacherOrganizations.Responses.$404 = {
            error: getTeacherResult?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetTeacherOrganizations.Responses.$500 = {
            error: JSON.stringify(getTeacherResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetTeacherOrganizations.Responses.$200 = {
      teacher: {
        firstName: getTeacherResult.value.firstName,
        lastName: getTeacherResult.value.lastName,
        teacherLMSId: getTeacherResult.value.teacherLMSId,
        createdDate: getTeacherResult.value.createdDate,
        createdUserId: getTeacherResult.value.createdDate,
        teacherId: getTeacherResult.value.teacherId,
        userId: getTeacherResult.value.userId,
        teacherOrganizations: getTeacherResult.value.teacherOrganizations || [],
        isPrimary: getTeacherResult.value.isPrimary,
        districtId: getTeacherResult.value.districtId,
        email: getTeacherResult.value.email,
        organizationId: getTeacherResult.value.organizationId,
      },
    }

    return { statusCode: 200, response: response200 }
  }
}
