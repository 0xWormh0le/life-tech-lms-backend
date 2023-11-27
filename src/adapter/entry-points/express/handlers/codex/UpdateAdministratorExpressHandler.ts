import { UpdateAdministratorUseCase } from '../../../../../domain/usecases/codex/DistrictAdministrator/UpdateAdministratorUseCase'
import { UserRepository } from './../../../../repositories/UserRepository'
import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { Administrator } from '../../../../../domain/entities/codex/DistrictAdministrator'

type Response =
  | Paths.PutAdministrator.Responses.$200
  | Paths.PutAdministrator.Responses.$401
  | Paths.PutAdministrator.Responses.$404
  | Paths.PutAdministrator.Responses.$500

export class UpdateUserAdministratorExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.PutAdministrator.PathParameters,
    undefined,
    Paths.PutAdministrator.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const updateAdministratorUseCase = new UpdateAdministratorUseCase(
      administratorRepository,
    )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetLessons.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetLessons.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const updatedAdministrator = await updateAdministratorUseCase.run(
      getUserResult.value,
      params.pathParams.administratorId,
      params.body as Administrator,
    )

    if (updatedAdministrator.hasError) {
      switch (updatedAdministrator.error.type) {
        case 'InvalidAdministratorId': {
          const response400: Paths.PutAdministrator.Responses.$400 = {
            error: updatedAdministrator.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'InvalidEmail': {
          const response400: Paths.PutAdministrator.Responses.$400 = {
            error: updatedAdministrator.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'EmailAlreadyExists': {
          const response400: Paths.PutAdministrator.Responses.$400 = {
            error: updatedAdministrator.error.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.PutAdministrator.Responses.$403 = {
            error: updatedAdministrator.error.message,
          }

          return { statusCode: 403, response: response403 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.PutAdministrator.Responses.$404 = {
            error: updatedAdministrator?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.PutAdministrator.Responses.$500 = {
            error: JSON.stringify(updatedAdministrator.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PutAdministrator.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
