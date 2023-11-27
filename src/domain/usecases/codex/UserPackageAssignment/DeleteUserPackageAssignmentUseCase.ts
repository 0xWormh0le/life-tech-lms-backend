import { E, Errorable, wrapError } from '../../shared/Errors'
import { UserPackageAssignment } from '../../../entities/codex/UserPackageAssignment'

export interface IUserPackageAssignmentRepository {
  get(query: {
    where: Partial<UserPackageAssignment>
  }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError'>>>
  delete(
    userPackageAssignment: Pick<
      UserPackageAssignment,
      'packageCategoryId' | 'userId'
    >,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export class DeleteUserPackageAssignmentUseCase {
  constructor(
    private userPackageAssignmentRepository: IUserPackageAssignmentRepository,
  ) {}

  async run(
    userPackageAssignment: Pick<
      UserPackageAssignment,
      'packageCategoryId' | 'userId'
    >,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>
  > {
    const getSameCategoryUserPackageAssignmentsResult =
      await this.userPackageAssignmentRepository.get({
        where: {
          userId: userPackageAssignment.userId,
          packageCategoryId: userPackageAssignment.packageCategoryId,
        },
      })

    if (getSameCategoryUserPackageAssignmentsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          getSameCategoryUserPackageAssignmentsResult.error,
          `failed to userPackageAssignmentRepository.get.create ${JSON.stringify(
            {
              where: {
                userId: userPackageAssignment.userId,
                packageCategoryId: userPackageAssignment.packageCategoryId,
              },
            },
          )}`,
        ),
        value: null,
      }
    }

    if (getSameCategoryUserPackageAssignmentsResult.value.length === 0) {
      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    }

    const deleteUserPackageAssignmentsResult =
      await this.userPackageAssignmentRepository.delete(userPackageAssignment)

    if (deleteUserPackageAssignmentsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          deleteUserPackageAssignmentsResult.error,
          `failed to userPackageAssignmentRepository.delete ${JSON.stringify(
            userPackageAssignment,
          )}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
