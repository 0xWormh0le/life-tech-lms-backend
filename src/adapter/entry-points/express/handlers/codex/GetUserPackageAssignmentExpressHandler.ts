import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserPackageAssignmentRepository } from '../../../../repositories/UserPackageAssignmentRepository'
import { GetUserPackageAssignmentsUseCase } from '../../../../../domain/usecases/codex/UserPackageAssignment/GetUserPackageAssignmentsUseCase'

type Response =
  | Paths.GetUserPackageAssignments.Responses.$200
  | Paths.GetUserPackageAssignments.Responses.$401
  | Paths.GetUserPackageAssignments.Responses.$404
  | Paths.GetUserPackageAssignments.Responses.$500

export class GetUserPackageAssignmentExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetUserPackageAssignments.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userPackageAssignmentRepository = new UserPackageAssignmentRepository(
      this.appDataSource,
    )
    const getUserPackageAssignmentsUseCase =
      new GetUserPackageAssignmentsUseCase(userPackageAssignmentRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetUserPackageAssignments.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetUserPackageAssignments.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const GetUserPackageAssignmentResult =
      await getUserPackageAssignmentsUseCase.run({
        where: {
          userId: params.query.userId,
          packageId: params.query.packageId,
        },
      })

    if (GetUserPackageAssignmentResult.hasError) {
      switch (GetUserPackageAssignmentResult.error.type) {
        default: {
          const response500: Paths.GetUserPackageAssignments.Responses.$500 = {
            error: JSON.stringify(GetUserPackageAssignmentResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.GetUserPackageAssignments.Responses.$200 = {
      userPackageAssignments: GetUserPackageAssignmentResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
