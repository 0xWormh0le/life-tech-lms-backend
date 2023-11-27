import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { getCodeIllusionPackagesByStudentGroupIdUseCase } from '../../../../../domain/usecases/codex/GetCodeIllusionPackagesByStudentGroupIdUseCase'
import { UserCodeillusionPackagesRepository } from '../../../../repositories/UserCodeillusionPackagesRepository'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { TeacherRepository } from '../../../../repositories/TeacherRepository'
import { StudentGroupRepository } from '../../../../repositories/StudentGroupRepository'

type Response =
  | Paths.GetPackageDetailsByStudentGroupId.Responses.$200
  | Paths.GetPackageDetailsByStudentGroupId.Responses.$401
  | Paths.GetPackageDetailsByStudentGroupId.Responses.$403
  | Paths.GetPackageDetailsByStudentGroupId.Responses.$500

export class GetCodeIllusionPackagesByStudentGroupIdExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    Paths.GetPackageDetailsByStudentGroupId.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetAllPackages.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetAllPackages.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const codeIllusionRepository = new UserCodeillusionPackagesRepository(
      this.appDataSource,
      this.staticFilesBaseUrl,
    )
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const teacherRepository = new TeacherRepository(this.appDataSource)
    const studentGroupRepository = new StudentGroupRepository(
      this.appDataSource,
      administratorRepository,
    )

    const GetPackagesByStudentGroupIdUseCase =
      new getCodeIllusionPackagesByStudentGroupIdUseCase(
        administratorRepository,
        studentGroupRepository,
        teacherRepository,
        codeIllusionRepository,
      )

    if (!getUserResult.value) {
      const response401: Paths.PostStudentInStudentGroup.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const getPackageResult = await GetPackagesByStudentGroupIdUseCase.run(
      getUserResult.value,
      params?.pathParams?.studentGroupId,
    )

    if (getPackageResult.hasError) {
      switch (getPackageResult.error.type) {
        case 'UnknownRuntimeError': {
          const response500: Paths.GetPackageDetailsByStudentGroupId.Responses.$500 =
            {
              error: JSON.stringify(getPackageResult.error),
            }

          return { statusCode: 500, response: response500 }
        }

        case 'InvalidStudentGroupId': {
          const response400: Paths.PostStudentInStudentGroup.Responses.$400 = {
            error: getPackageResult.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.GetPackageDetailsByStudentGroupId.Responses.$403 =
            {
              error: 'Access Denied',
            }

          return { statusCode: 403, response: response403 }
        }
        case 'StudentGroupNotFound': {
          const response404: Paths.PostStudentInStudentGroup.Responses.$404 = {
            error: getPackageResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'PackageNotAssigned': {
          const response404: Paths.PostStudentInStudentGroup.Responses.$404 = {
            error: getPackageResult.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
      }
    }

    const response200: Paths.GetPackageDetailsByStudentGroupId.Responses.$200 =
      {
        package: getPackageResult.value || undefined,
      }

    return { statusCode: 200, response: response200 }
  }
}
