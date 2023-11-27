import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { UpdateStudentGroupUseCase } from '../../../../../domain/usecases/codex/StudentGroup/UpdateStudentGroupUseCase'

type Response =
  | Paths.PutStudentGroup.Responses.$200
  | Paths.PutStudentGroup.Responses.$401
  | Paths.PutStudentGroup.Responses.$403
  | Paths.PutStudentGroup.Responses.$404
  | Paths.PutStudentGroup.Responses.$500

export class UpdateStudentGroupExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private administratorRepository: AdministratorRepository,
  ) {}

  handler: HandlerWithToken<
    Paths.PutStudentGroup.PathParameters,
    undefined,
    Paths.PutStudentGroup.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      this.administratorRepository,
    )
    const updateStudentGroupUseCase = new UpdateStudentGroupUseCase(
      studentGroupRepository,
      teacherRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PutStudentGroup.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PutStudentGroup.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const studentGroupResult = await updateStudentGroupUseCase.run(
      getUserResult.value,
      params.body,
      params.pathParams.studentGroupId,
    )

    if (studentGroupResult.hasError) {
      switch (studentGroupResult.error.type) {
        case 'InvalidStudentGroupId': {
          const response400: Paths.PutStudentGroup.Responses.$400 = {
            error: studentGroupResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PutStudentGroup.Responses.$403 = {
            error: studentGroupResult.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupInfoNotFound': {
          const response404: Paths.PutStudentGroup.Responses.$404 = {
            error: `Student Group information not found for requested studentGroupId : ${params.pathParams.studentGroupId}`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'TeacherNotFound': {
          const response404: Paths.PutStudentGroup.Responses.$404 = {
            error: studentGroupResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'OrganizationInfoNotFound': {
          const response404: Paths.PutStudentGroup.Responses.$404 = {
            error: `Organization information not found for requested organizationId`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PutStudentGroup.Responses.$404 = {
            error: `Administrator information not found for requested userId : ${getUserResult.value.id}`,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'AlreadyExistError': {
          const response409: Paths.PutStudentGroup.Responses.$409 = {
            error: `Student group name already exist`,
          }

          return { statusCode: 409, response: response409 }
        }

        default: {
          const response500: Paths.PutStudentGroup.Responses.$500 = {
            error: JSON.stringify(studentGroupResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutStudentGroup.Responses.$200 = { message: 'ok' }

    return { statusCode: 200, response: response200 }
  }
}
