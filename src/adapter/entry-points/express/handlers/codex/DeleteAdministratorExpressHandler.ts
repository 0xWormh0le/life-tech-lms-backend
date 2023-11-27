import { DataSource } from 'typeorm'
import { DeleteDistrictAdministratorsUseCase } from '../../../../../domain/usecases/codex/DistrictAdministrator/DeleteDistrictAdministratorUseCase'
import { AdministratorRepository } from '../../../../repositories/AdministratorRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

type Response =
  | Paths.DeleteAdministrator.Responses.$200
  | Paths.DeleteAdministrator.Responses.$400
  | Paths.DeleteAdministrator.Responses.$401
  | Paths.DeleteAdministrator.Responses.$403
  | Paths.DeleteAdministrator.Responses.$404
  | Paths.DeleteAdministrator.Responses.$500

export class DeleteAdministratorExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    Paths.DeleteAdministrator.PathParameters,
    undefined,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const administratorRepository = new AdministratorRepository(
      this.appDataSource,
    )
    const deleteDistringAdministratorUseCase =
      new DeleteDistrictAdministratorsUseCase(administratorRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteAdministrator.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteAdministrator.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const deleteAdministrator = await deleteDistringAdministratorUseCase.run(
      getUserResult.value,
      params?.pathParams?.administratorId,
    )

    if (deleteAdministrator.hasError) {
      switch (deleteAdministrator.error.type) {
        case 'InvalidAdministratorId': {
          const response400: Paths.DeleteAdministrator.Responses.$400 = {
            error: deleteAdministrator?.error?.message,
          }

          return { statusCode: 400, response: response400 }
        }
        case 'PermissionDenied': {
          const response403: Paths.DeleteAdministrator.Responses.$403 = {
            error: 'Access Denied',
          }

          return { statusCode: 403, response: response403 }
        }
        case 'AdministratorNotFound': {
          const response404: Paths.DeleteAdministrator.Responses.$404 = {
            error: deleteAdministrator?.error?.message,
          }

          return { statusCode: 404, response: response404 }
        }
        default: {
          const response500: Paths.DeleteAdministrator.Responses.$500 = {
            error: JSON.stringify(deleteAdministrator.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteAdministrator.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
