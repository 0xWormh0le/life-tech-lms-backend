import { E, Errorable, wrapError } from '../../shared/Errors'
import { UserPackageAssignment } from '../../../entities/codex/UserPackageAssignment'

export interface IUserPackageAssignmentRepository {
  get(query: {
    where: Partial<UserPackageAssignment>
  }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError'>>>
  create(
    userPackageAssignment: Omit<UserPackageAssignment, 'id'>,
  ): Promise<Errorable<UserPackageAssignment, E<'UnknownRuntimeError'>>>
}

export class CreateUserPackageAssignmentUseCase {
  constructor(
    private userPackageAssignmentRepository: IUserPackageAssignmentRepository,
  ) {}

  async run(
    userPackageAssignment: Omit<UserPackageAssignment, 'id'>,
  ): Promise<
    Errorable<
      UserPackageAssignment,
      E<'UnknownRuntimeError'> | E<'AlreadyExistError'>
    >
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

    if (getSameCategoryUserPackageAssignmentsResult.value.length > 0) {
      return {
        hasError: true,
        error: {
          type: 'AlreadyExistError',
          message: `this user already has package assignment for requested packageCategory ${JSON.stringify(
            userPackageAssignment,
          )}`,
        },
        value: null,
      }
    }

    const craateUserPackageAssignmentsResult =
      await this.userPackageAssignmentRepository.create(userPackageAssignment)

    if (craateUserPackageAssignmentsResult.hasError) {
      return {
        hasError: true,
        error: wrapError(
          craateUserPackageAssignmentsResult.error,
          `failed to userPackageAssignmentRepository.create ${JSON.stringify(
            userPackageAssignment,
          )}`,
        ),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: craateUserPackageAssignmentsResult.value,
    }
  }
}
