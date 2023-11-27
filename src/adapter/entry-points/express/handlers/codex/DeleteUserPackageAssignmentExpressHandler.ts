import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserPackageAssignmentRepository } from '../../../../repositories/UserPackageAssignmentRepository'
import { DeleteUserPackageAssignmentUseCase } from '../../../../../domain/usecases/codex/UserPackageAssignment/DeleteUserPackageAssignmentUseCase'

type Response =
  | Paths.DeleteUserPackageAssignment.Responses.$200
  | Paths.DeleteUserPackageAssignment.Responses.$401
  | Paths.DeleteUserPackageAssignment.Responses.$500

export class DeleteUserPackageAssignmentExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    undefined,
    Paths.DeleteUserPackageAssignment.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userPackageAssignmentRepository = new UserPackageAssignmentRepository(
      this.appDataSource,
    )
    const DeleteUserPackageAssignmentsUseCase =
      new DeleteUserPackageAssignmentUseCase(userPackageAssignmentRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.DeleteUserPackageAssignment.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.DeleteUserPackageAssignment.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const DeleteUserPackageAssignmentResult =
      await DeleteUserPackageAssignmentsUseCase.run(params.body)

    if (DeleteUserPackageAssignmentResult.hasError) {
      switch (DeleteUserPackageAssignmentResult.error.type) {
        default: {
          const response500: Paths.DeleteUserPackageAssignment.Responses.$500 =
            {
              error: JSON.stringify(DeleteUserPackageAssignmentResult.error),
            }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.DeleteUserPackageAssignment.Responses.$200 = {
      message: 'ok',
    }

    return { statusCode: 200, response: response200 }
  }
}
