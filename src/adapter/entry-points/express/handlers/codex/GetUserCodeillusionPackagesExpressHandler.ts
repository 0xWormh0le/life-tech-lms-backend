import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { GetUserCodeillusionPackagesByUserIdUseCase } from '../../../../../domain/usecases/codex/GetUserCodeillusionPackagesByUserIdUseCase'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserCodeillusionPackagesRepository } from '../../../../repositories/UserCodeillusionPackagesRepository'
import { StudentRepository } from '../../../../repositories/StudentRepository'
import { UnaccessibleLessonRepository } from '../../../../repositories/UnaccessibleLessonRepository'

type Response =
  | Paths.GetUsersUserIdCodeIllusionPackages.Responses.$200
  | Paths.GetUsersUserIdCodeIllusionPackages.Responses.$401
  | Paths.GetUsersUserIdCodeIllusionPackages.Responses.$404
  | Paths.GetUsersUserIdCodeIllusionPackages.Responses.$500

export class GetUserCodeillusionPackagesExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    Paths.GetUsersUserIdCodeIllusionPackages.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userCodeillusionPackagesRepository =
      new UserCodeillusionPackagesRepository(
        this.appDataSource,
        this.staticFilesBaseUrl,
      )
    const studentRepository = new StudentRepository(this.appDataSource)

    const getUserCodeillusionPackagesByUserIdUseCase =
      new GetUserCodeillusionPackagesByUserIdUseCase(
        userCodeillusionPackagesRepository,
        studentRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetUsersUserIdCodeIllusionPackages.Responses.$500 =
        {
          error: JSON.stringify(getUserResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetUsersUserIdCodeIllusionPackages.Responses.$401 =
        {
          error: `token invalid ${token}`,
        }

      return { statusCode: 401, response: response401 }
    }

    const getUserCodeillusionPackagesResult =
      await getUserCodeillusionPackagesByUserIdUseCase.run(
        getUserResult.value,
        params.pathParams.userId,
      )

    if (getUserCodeillusionPackagesResult.hasError) {
      switch (getUserCodeillusionPackagesResult.error.type) {
        case 'UserCodeIllusionPackageNotFoundError': {
          const response404: Paths.GetUsersUserIdCodeIllusionPackages.Responses.$404 =
            {
              error: getUserCodeillusionPackagesResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        case 'StudentNotFound': {
          const response404: Paths.GetUsersUserIdCodeIllusionPackages.Responses.$404 =
            {
              error: getUserCodeillusionPackagesResult.error.message,
            }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.GetUsersUserIdCodeIllusionPackages.Responses.$500 =
            {
              error: JSON.stringify(getUserCodeillusionPackagesResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetUsersUserIdCodeIllusionPackages.Responses.$200 =
      {
        codeIllusionPackage: getUserCodeillusionPackagesResult.value,
      }

    return { statusCode: 200, response: response200 }
  }
}
