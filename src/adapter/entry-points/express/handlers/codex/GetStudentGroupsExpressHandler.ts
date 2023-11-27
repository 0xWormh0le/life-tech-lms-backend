import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'

import { GetStudentGroupsUseCase } from '../../../../../domain/usecases/codex/StudentGroup/GetStudentGroupsUseCase'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'

type Response =
  | Paths.GetStudentGroups.Responses.$200
  | Paths.GetStudentGroups.Responses.$400
  | Paths.GetStudentGroups.Responses.$401
  | Paths.GetStudentGroups.Responses.$403
  | Paths.GetStudentGroups.Responses.$404
  | Paths.GetStudentGroups.Responses.$500

export class GetStudentGroupsExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private administratorRepository: AdministratorRepository,
  ) {}

  handler: HandlerWithToken<
    Paths.GetStudentGroups.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      this.administratorRepository,
    )
    const getStudentGroupsUseCase = new GetStudentGroupsUseCase(
      studentGroupRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetStudentGroups.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetStudentGroups.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getStudentGroupsResult = await getStudentGroupsUseCase.run(
      getUserResult.value,
      params.pathParams.organizationId,
    )

    if (getStudentGroupsResult.hasError) {
      switch (getStudentGroupsResult.error.type) {
        case 'InvalidOrganizationId': {
          const response400: Paths.GetStudentGroups.Responses.$400 = {
            error: 'Invalid organizationId',
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetStudentGroups.Responses.$403 = {
            error: getStudentGroupsResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'OrganizationNotFoundError': {
          const response404: Paths.GetStudentGroups.Responses.$404 = {
            error: `Organization information not found`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.GetStudentGroups.Responses.$404 = {
            error: getStudentGroupsResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetStudentGroups.Responses.$500 = {
            error: JSON.stringify(getStudentGroupsResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetStudentGroups.Responses.$200 = {
      studentgroups: getStudentGroupsResult.value.map((e) => ({
        ...e,
        studentGroupLmsId: e.studentGroupLmsId ?? '',
      })),
    }

    return { statusCode: 200, response: response200 }
  }
}
