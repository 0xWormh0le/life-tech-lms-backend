import { DataSource } from 'typeorm'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import { UserRepository } from '../../../../repositories/UserRepository'

import { GetStudentGroupPackageAssignmentsUseCase } from '../../../../../domain/usecases/codex/StudentGroupPackageAssignment/GetStudentGroupPackageAssignmentsUseCase'
import { StudentGroupPackageAssignmentRepository } from '../../../../repositories/StudentGroupPackageAssignmentRepository'

type Response =
  | Paths.GetStudentGroupPackageAssignments.Responses.$200
  | Paths.GetStudentGroupPackageAssignments.Responses.$401
  | Paths.GetStudentGroupPackageAssignments.Responses.$403
  | Paths.GetStudentGroupPackageAssignments.Responses.$500

export class GetStudentGroupPackageAssignmentsExpressHandler {
  constructor(private appDataSource: DataSource) {}

  handler: HandlerWithToken<
    undefined,
    Paths.GetStudentGroupPackageAssignments.QueryParameters,
    undefined,
    Response
  > = async (params, token) => {
    const userRepository = new UserRepository(this.appDataSource)
    const studentGroupPackageAssignmentRepository =
      new StudentGroupPackageAssignmentRepository(this.appDataSource)

    const getStudentGroupPackageAssignmentsUseCase =
      new GetStudentGroupPackageAssignmentsUseCase(
        studentGroupPackageAssignmentRepository,
      )

    const getUserResult = await userRepository.getUserByAccessToken(token)

    if (getUserResult.hasError) {
      const response500: Paths.GetStudentGroupPackageAssignments.Responses.$500 =
        {
          error: JSON.stringify(getUserResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    if (!getUserResult.value) {
      const response401: Paths.GetStudentGroupPackageAssignments.Responses.$401 =
        {
          error: `token invalid ${token}`,
        }

      return { statusCode: 401, response: response401 }
    }

    const getStudentGroupPackageAssignmentsResult =
      await getStudentGroupPackageAssignmentsUseCase.run(
        params.query.studentGroupId,
      )

    if (getStudentGroupPackageAssignmentsResult.hasError) {
      const response500: Paths.GetStudentGroupPackageAssignments.Responses.$500 =
        {
          error: JSON.stringify(getStudentGroupPackageAssignmentsResult.error),
        }

      return { statusCode: 500, response: response500 }
    }

    const response200: Paths.GetStudentGroupPackageAssignments.Responses.$200 =
      {
        studentGroupPackageAssignments:
          getStudentGroupPackageAssignmentsResult.value,
      }

    return { statusCode: 200, response: response200 }
  }
}
