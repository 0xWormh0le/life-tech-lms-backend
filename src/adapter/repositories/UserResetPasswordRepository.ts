import {
  E,
  Errorable,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { UserResetPasswordRequestTypeormEntity } from '../typeorm/entity/UserResetPasswordRequest'
import { DataSource, QueryRunner } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { UserResetPassword } from '../../domain/entities/authentication/UserResetPassword'

export class UserResetPasswordRepository {
  constructor(private typeormDataSource: DataSource) {}

  async setUserResetPassword(
    userId: string,
    token: string,
    expiry: Date,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    try {
      const userResetPasswordData = {
        user_id: userId,
        token: token,
        expiry: expiry,
      } as QueryDeepPartialEntity<{}>
      let queryRunner: QueryRunner | null = null

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      const userResetPasswordTypeormRepository =
        this.typeormDataSource.getRepository(
          UserResetPasswordRequestTypeormEntity,
        )
      const userResetPasswordResult =
        await userResetPasswordTypeormRepository.findOneBy({
          user_id: userId,
        })

      if (userResetPasswordResult) {
        await userResetPasswordTypeormRepository
          .createQueryBuilder()
          .update(UserResetPasswordRequestTypeormEntity, userResetPasswordData)
          .where('user_id=:id', { id: userId })
          .updateEntity(true)
          .execute()
      } else {
        await userResetPasswordTypeormRepository
          .createQueryBuilder('user_reset_password_request', queryRunner)
          .insert()
          .values(userResetPasswordData)
          .execute()
      }
      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'failed to set user reset password request',
        ),
        value: null,
      }
    }
  }

  async removeUserResetPassword(
    userId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    try {
      const userResetPasswordTypeormRepository =
        this.typeormDataSource.getRepository(
          UserResetPasswordRequestTypeormEntity,
        )

      const userResetPasswordResult =
        await userResetPasswordTypeormRepository.findOneBy({
          user_id: userId,
        })

      if (userResetPasswordResult) {
        await userResetPasswordTypeormRepository.delete({
          user_id: userId,
        })
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to delete user reset password for userId: ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getUserResetPasswordByToken(
    token: string,
  ): Promise<
    Errorable<UserResetPassword | undefined, E<'UnknownRuntimeError'>>
  > {
    const userResetPasswordRequestTypeormRepository =
      this.typeormDataSource.getRepository(
        UserResetPasswordRequestTypeormEntity,
      )

    try {
      const userResetPasswordInfo =
        await userResetPasswordRequestTypeormRepository.findOneBy({
          token: token,
        })
      let userResetPasswordData: UserResetPassword | undefined = undefined

      if (userResetPasswordInfo) {
        userResetPasswordData = {
          userId: userResetPasswordInfo.user_id,
          expiry: userResetPasswordInfo.expiry,
        }
      }

      return {
        hasError: false,
        error: null,
        value: userResetPasswordData,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get user reset password info from db by ${JSON.stringify(
            token,
          )}`,
        ),
        value: null,
      }
    }
  }
}
