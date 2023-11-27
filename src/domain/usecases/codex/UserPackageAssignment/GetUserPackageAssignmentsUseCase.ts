import { E, Errorable, wrapError } from '../../shared/Errors'
import { UserPackageAssignment } from '../../../entities/codex/UserPackageAssignment'

export interface IUserPackageAssignmentRepository {
  get(query: {
    where: Partial<UserPackageAssignment>
  }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError'>>>
}

export class GetUserPackageAssignmentsUseCase {
  constructor(
    private userPackageAssignmentRepository: IUserPackageAssignmentRepository,
  ) {}

  async run(query: {
    where: Partial<UserPackageAssignment>
  }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError'>>> {
    const getUserPackageAssignmentsResult =
      await this.userPackageAssignmentRepository.get(query)

    if (getUserPackageAssignmentsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          getUserPackageAssignmentsResult.error,
          `failed to userPackageAssignmentRepository.get ${JSON.stringify(
            query,
          )}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: getUserPackageAssignmentsResult.value,
    }
  }
}
