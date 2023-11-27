import { DataSource } from 'typeorm'

import { UserPackageAssignment } from '../../domain/entities/codex/UserPackageAssignment'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { UserPackageAssignmentTypeormEntity } from '../typeorm/entity/UserPackageAssignment'

export class UserPackageAssignmentRepository {
  constructor(private typeormDataSource: DataSource) {}

  async get(query: {
    where: Partial<UserPackageAssignment>
  }): Promise<
    Errorable<UserPackageAssignment[], E<'UnknownRuntimeError', string>>
  > {
    try {
      const userPackageAssignmentTypeormRepository =
        this.typeormDataSource.getRepository(UserPackageAssignmentTypeormEntity)
      const userPackageAssignments =
        await userPackageAssignmentTypeormRepository.find({
          where: {
            package_category_id: query.where.packageCategoryId,
            package_id: query.where.packageId,
            user_id: query.where.userId,
          },
        })

      return {
        hasError: false,
        error: null,
        value: userPackageAssignments.map((e) => ({
          packageCategoryId: e.package_category_id,
          packageId: e.package_id,
          userId: e.user_id,
        })),
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError('UnknownRuntimeError', e as Error),
        value: null,
      }
    }
  }

  async create(
    userPackageAssignment: Omit<UserPackageAssignment, 'id'>,
  ): Promise<
    Errorable<UserPackageAssignment, E<'UnknownRuntimeError', string>>
  > {
    try {
      const userPackageAssignmentTypeormRepository =
        this.typeormDataSource.getRepository(UserPackageAssignmentTypeormEntity)
      const createdUserPackageAssignment =
        await userPackageAssignmentTypeormRepository.save({
          package_category_id: userPackageAssignment.packageCategoryId,
          package_id: userPackageAssignment.packageId,
          user_id: userPackageAssignment.userId,
        })

      return {
        hasError: false,
        error: null,
        value: {
          packageCategoryId: createdUserPackageAssignment.package_category_id,
          packageId: createdUserPackageAssignment.package_id,
          userId: createdUserPackageAssignment.user_id,
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError('UnknownRuntimeError', e as Error),
        value: null,
      }
    }
  }

  async delete(
    userPackageAssignment: Pick<
      UserPackageAssignment,
      'packageCategoryId' | 'userId'
    >,
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const userPackageAssignmentTypeormRepository =
        this.typeormDataSource.getRepository(UserPackageAssignmentTypeormEntity)
      const createdUserPackageAssignment =
        await userPackageAssignmentTypeormRepository.delete({
          package_category_id: userPackageAssignment.packageCategoryId,
          user_id: userPackageAssignment.userId,
        })

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError('UnknownRuntimeError', e as Error),
        value: null,
      }
    }
  }
}
