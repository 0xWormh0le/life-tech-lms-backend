import { DataSource } from 'typeorm'
import {
  TeacherInfo,
  CreateTeachersUseCase,
} from '../../../../../../domain/usecases/codex/Teacher/CreateTeachersUseCase'
import { AdministratorRepository } from '../../../../../repositories/AdministratorRepository'
import { OrganizationsRepository } from '../../../../../repositories/OrganizationRepository'
import { TeacherRepository } from '../../../../../repositories/TeacherRepository'
import { UserRepository } from '../../../../../repositories/UserRepository'
import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../../shared/types'

type Response =
  | Paths.PostTeachers.Responses.$200
  | Paths.PostTeachers.Responses.$400
  | Paths.PostTeachers.Responses.$401
  | Paths.PostTeachers.Responses.$403
  | Paths.PostTeachers.Responses.$404
  | Paths.PostTeachers.Responses.$500

export class CreateTeacherExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PostTeachers.PathParameters,
    undefined,
    Paths.PostTeachers.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const organizationRepository = new OrganizationsRepository(
      this.appDataSource,
    )
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const CreateTeacherUseCase = new CreateTeachersUseCase(
      teacherRepository,
      userRepository,
      organizationRepository,
      administratorRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostTeachers.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostTeachers.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const CreateTeachers = await CreateTeacherUseCase.run(
      params.pathParams.organizationId,
      getUserResult.value,
      params?.body?.teachers as TeacherInfo[],
    )

    if (CreateTeachers.hasError) {
      switch (CreateTeachers.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.PostTeachers.Responses.$400 = {
            error: CreateTeachers.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidTeacherAttributes': {
          const response400: Paths.PostTeachers.Responses.$400 = {
            error: CreateTeachers.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostTeachers.Responses.$403 = {
            error: CreateTeachers.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'OrganizationNotFound': {
          const response404: Paths.PostTeachers.Responses.$404 = {
            error: CreateTeachers?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PostTeachers.Responses.$404 = {
            error: CreateTeachers?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostTeachers.Responses.$500 = {
            error: JSON.stringify(CreateTeachers.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostTeachers.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
