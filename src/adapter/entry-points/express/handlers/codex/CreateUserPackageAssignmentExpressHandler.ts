import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserPackageAssignmentRepository } from '../../../../repositories/UserPackageAssignmentRepository'
import { CreateUserPackageAssignmentUseCase } from '../../../../../domain/usecases/codex/UserPackageAssignment/CreateUserPackageAssignmentUseCase'

type Response =
  | Paths.PostUserPackageAssignment.Responses.$200
  | Paths.PostUserPackageAssignment.Responses.$401
  | Paths.PostUserPackageAssignment.Responses.$409
  | Paths.PostUserPackageAssignment.Responses.$500

export class CreateUserPackageAssignmentExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    undefined,
    Paths.PostUserPackageAssignment.RequestBody,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const userPackageAssignmentRepository = new UserPackageAssignmentRepository(
      this.appDataSource,
    )
    const createUserPackageAssignmentsUseCase =
      new CreateUserPackageAssignmentUseCase(userPackageAssignmentRepository)

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.PostUserPackageAssignment.Responses.$500 = {
        error: JSON.stringify(getUserResult.error),
      }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.PostUserPackageAssignment.Responses.$401 = {
        error: `token invalid ${token}`,
      }

      return { statusCode: 401, response: response401 }
    }

    const createUserPackageAssignmentResult =
      await createUserPackageAssignmentsUseCase.run(params.body)

    if (createUserPackageAssignmentResult.hasError) {
      switch (createUserPackageAssignmentResult.error.type) {
        case 'AlreadyExistError': {
          const response409: Paths.PostUserPackageAssignment.Responses.$409 = {
            error: createUserPackageAssignmentResult.error.message,
          }

          return { statusCode: 409, response: response409 }
        }
        default: {
          const response500: Paths.PostUserPackageAssignment.Responses.$500 = {
            error: JSON.stringify(createUserPackageAssignmentResult.error),
          }

          return { statusCode: 500, response: response500 }
        }
      }
    }

    const response200: Paths.PostUserPackageAssignment.Responses.$200 = {
      userPackageAssignment: createUserPackageAssignmentResult.value,
    }

    return { statusCode: 200, response: response200 }
  }
}
