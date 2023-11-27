import { DataSource } from 'typeorm'
import {
  AdminitaratorInfo,
  BadRequestError,
  PostDistrictAdministratorsUseCase,
} from '../../../../../domain/usecases/codex/DistrictAdministrator/PostDistrictAdminitratorsUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

type Response =
  | Paths.PostAdministrators.Responses.$200
  | Paths.PostAdministrators.Responses.$400
  | Paths.PostAdministrators.Responses.$401
  | Paths.PostAdministrators.Responses.$403
  | Paths.PostAdministrators.Responses.$404
  | Paths.PostAdministrators.Responses.$500

export class PostAdministratorExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PostAdministrators.PathParameters,
    undefined,
    Paths.PostAdministrators.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const postDistringAdministratorUseCase =
      new PostDistrictAdministratorsUseCase(
        administratorRepository,
        userRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostAdministrators.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostAdministrators.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const postAdministrators = await postDistringAdministratorUseCase.run(
      getUserResult.value,
      params?.pathParams?.districtId,
      params?.body?.administrators as AdminitaratorInfo[],
    )

    if (postAdministrators.hasError) {
      switch (postAdministrators.error.type) {
        case 'InvalidDistrictId': {
          const response400: Paths.PostAdministrators.Responses.$400 = {
            error: postAdministrators.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidAdministratorAttributes': {
          const response400: Paths.PostAdministrators.Responses.$400 = {
            error: postAdministrators.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PostAdministrators.Responses.$403 = {
            error: postAdministrators.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PostAdministrators.Responses.$404 = {
            error: postAdministrators.error.message,
          }

          return { statusCode: 404, response: response404 }
        }
        case 'DistrictNotFound': {
          const response404: Paths.PostAdministrators.Responses.$404 = {
            error: postAdministrators?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PostAdministrators.Responses.$500 = {
            error: JSON.stringify(postAdministrators.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostAdministrators.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
