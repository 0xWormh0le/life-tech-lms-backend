import {
  E,
  Errorable,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { DataSource, In, QueryRunner } from 'typeorm'
import {
  DistrictAdministrator,
  Administrator,
} from '../../domain/entities/codex/DistrictAdministrator'
import { AdministratorTypeormEntity } from '../typeorm/entity/Administrator'
import { UserRoleTypeormEnum, UserTypeormEntity } from '../typeorm/entity/User'
import { AdministratorDistrictTypeormEntity } from '../typeorm/entity/AdministratorDistrict'
import { AdminitaratorInfo } from '../../domain/usecases/codex/DistrictAdministrator/PostDistrictAdminitratorsUseCase'
import { DistrictTypeormEntity } from '../typeorm/entity/District'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { MeInfo, User } from '../../domain/entities/codex/User'
import { userRoles } from '../../domain/usecases/shared/Constants'
import { hashingPassword } from './shared/PassWordHashing'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
]

export class AdministratorRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getDistrictAdministrators(
    districtId: string,
    administratorIds: string[] | undefined,
  ): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
    try {
      const administratorDistrictTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)
      const data = administratorDistrictTypeormRepository
        .createQueryBuilder('administrators_districts')
        .innerJoin(
          AdministratorTypeormEntity,
          'administrators',
          'administrators.id::VARCHAR = administrators_districts.administrator_id::VARCHAR',
        )
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = administrators.user_id::VARCHAR',
        )
        .select('administrators.id', 'administrators_id')
        .addSelect('administrators.first_name', 'first_name')
        .addSelect('administrators.last_name', 'last_name')
        .addSelect(
          'administrators.administrator_lms_id',
          'administrator_lms_id',
        )
        .addSelect('administrators.user_id', 'user_id')
        .addSelect('administrators_districts.district_id', 'district_id')
        .addSelect('administrators.created_user_id', 'created_user_id')
        .addSelect('administrators.created_date', 'created_date')
        .addSelect(
          'administrators.administrator_lms_id',
          'administrator_lms_id',
        )
        .addSelect('users.email', 'email')
        .where(
          'administrators_districts.district_id::VARCHAR = :districtId::VARCHAR',
          {
            districtId,
          },
        )

      if (administratorIds?.length! > 0) {
        data.andWhere(
          'administrators_districts.administrator_id IN (:...administratorIds)',
          { administratorIds: administratorIds },
        )
      }

      const query = await data.getRawMany()

      const res: DistrictAdministrator[] = []

      query.map(
        (raw: {
          administrators_id: string
          user_id: string
          last_name: string
          first_name: string
          district_id: string
          created_user_id: string
          created_date: string
          administrator_lms_id: string
          email: string
        }) =>
          res.push({
            administratorId: raw.administrators_id,
            userId: raw.user_id,
            lastName: raw.last_name,
            firstName: raw.first_name,
            districtId: raw.district_id,
            createdUserId: raw.created_user_id,
            createdDate: raw.created_date.toString(),
            administratorLMSId: raw.administrator_lms_id,
            email: raw.email,
          }),
      )

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async getDistrictAdministratorByUserId(
    userId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  > {
    try {
      const administratorDistrictTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)
      const data = await administratorDistrictTypeormRepository
        .createQueryBuilder('administrators_districts')
        .innerJoin(
          AdministratorTypeormEntity,
          'administrators',
          'administrators.id::VARCHAR = administrators_districts.administrator_id::VARCHAR',
        )
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = administrators.user_id::VARCHAR',
        )
        .select('administrators.id', 'administrators_id')
        .addSelect('administrators.first_name', 'first_name')
        .addSelect('administrators.last_name', 'last_name')
        .addSelect(
          'administrators.administrator_lms_id',
          'administrator_lms_id',
        )
        .addSelect('administrators.user_id', 'user_id')
        .addSelect('administrators_districts.district_id', 'district_id')
        .addSelect('administrators.created_user_id', 'created_user_id')
        .addSelect('administrators.created_date', 'created_date')
        .addSelect(
          'administrators.administrator_lms_id',
          'administrator_lms_id',
        )
        .addSelect('users.email', 'email')
        .where('administrators.user_id::VARCHAR = :userId::VARCHAR', {
          userId,
        })
        .getRawOne()

      const res: DistrictAdministrator = {
        administratorId: data.administrators_id,
        userId: data.user_id,
        lastName: data.last_name,
        firstName: data.first_name,
        districtId: data.district_id,
        createdUserId: data.created_user_id,
        createdDate: data.created_date.toString(),
        administratorLMSId: data.administrator_lms_id,
        email: data.email,
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async postDistrictAdministrators(
    districtId: string,
    data: AdminitaratorInfo[],
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
    let queryRunner: QueryRunner | null = null

    try {
      const districtTypeormRepository = this.typeormDataSource.getRepository(
        DistrictTypeormEntity,
      )

      const district = await districtTypeormRepository.findOneBy({
        id: districtId,
      })

      if (!district) {
        return {
          hasError: true,
          error: {
            type: 'DistrictNotFound',
            message: 'District not found',
          },
          value: null,
        }
      }

      const administratorDistrictTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)

      const administratorTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorTypeormEntity)

      const userData = await Promise.all(
        data.map(async (item) => {
          if (item.password) {
            const password = await hashingPassword(item.password)

            return {
              email: item.email,
              login_id: null,
              password: password ?? null,
              role: UserRoleTypeormEnum.administrator,
              human_user_created_at: new Date(),
              human_user_updated_at: new Date(),
            } as QueryDeepPartialEntity<{}>
          } else {
            return {
              email: item.email,
              login_id: null,
              role: UserRoleTypeormEnum.administrator,
              human_user_created_at: new Date(),
              human_user_updated_at: new Date(),
            } as QueryDeepPartialEntity<{}>
          }
        }),
      )

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const userRes = await userTypeormRepository
        .createQueryBuilder('users', queryRunner)
        .insert()
        .values(userData)
        .returning(['email', 'id'])
        .execute()

      const adminData = userRes.generatedMaps.map((item) => {
        const itemData = data.find((raw) => raw.email === item.email)

        return {
          user_id: item.id as string,
          created_user_id: createdUserId,
          first_name: itemData?.firstName,
          last_name: itemData?.lastName,
          administrator_lms_id: itemData?.administratorLMSId,
        }
      })
      const adminRes = await administratorTypeormRepository
        .createQueryBuilder('administrators', queryRunner)
        .insert()
        .values(adminData)
        .execute()
      const adminDistrictData: QueryDeepPartialEntity<{}> =
        adminRes.identifiers.map((item) => ({
          administrator: item.id,
          district: districtId,
          created_user_id: createdUserId,
        }))

      await administratorDistrictTypeormRepository
        .createQueryBuilder('administrators_districts', queryRunner)
        .insert()
        .values(adminDistrictData)
        .execute()

      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction()
      }

      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    } finally {
      if (queryRunner) {
        await queryRunner.release()
      }
    }
  }

  async updateAdministratorById(
    user: User,
    administratorId: string,
    body: Administrator,
  ): Promise<
    Errorable<
      Administrator,
      | E<'UnknownRuntimeError'>
      | E<'AdministratorNotFound'>
      | E<'EmailAlreadyExists'>
      | E<'PermissionDenied'>
    >
  > {
    let userEmail

    const administratorTypeormRepository = this.typeormDataSource.getRepository(
      AdministratorTypeormEntity,
    )

    try {
      const administratorByIdResult =
        await administratorTypeormRepository.findOneBy({
          id: administratorId,
        })

      if (!administratorByIdResult) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: 'Administrator Id not found',
          },
          value: null,
        }
      }

      if (
        user.role === userRoles.administrator &&
        administratorByIdResult.user_id !== user.id
      ) {
        return {
          hasError: true,
          error: {
            type: 'PermissionDenied',
            message:
              "The user does not have permission to add the specified administrator's information",
          },
          value: null,
        }
      }

      if (body.email) {
        const userTypeormRepository =
          this.typeormDataSource.getRepository(UserTypeormEntity)

        const users = await userTypeormRepository
          .createQueryBuilder('user')
          .select('user.email', 'email')
          .where('user.email = :email', { email: body.email })
          .andWhere('id != :id', { id: administratorByIdResult.user_id })
          .execute()

        if (users.length > 0) {
          const userErrObj = users.reduce(
            (obj: object, key: { email: string }) => ({
              ...obj,
              [key.email]: 'This email is already exist',
            }),
            {},
          )

          return {
            hasError: true,
            error: {
              type: 'EmailAlreadyExists',
              message: userErrObj,
            },
            value: null,
          }
        } else {
          /* Update email id */
          const userInfo = await userTypeormRepository.findOneBy({
            id: administratorByIdResult.user_id,
          })
          const userResult = await userTypeormRepository
            .createQueryBuilder()
            .update(UserTypeormEntity, {
              ...(body.email && { email: body.email }),
              ...(body.password && {
                password:
                  userInfo?.password === body.password
                    ? userInfo.password
                    : await hashingPassword(body.password),
                human_user_updated_at: new Date(),
              }),
            })
            .where('id=:id', { id: administratorByIdResult.user_id })
            .returning('*')
            .updateEntity(true)
            .execute()

          if (userResult?.raw[0] === undefined) {
            return {
              hasError: true,
              error: {
                type: 'UnknownRuntimeError',
                message: `failed to update user email ${administratorByIdResult.user_id}`,
              },
              value: null,
            }
          }
          userEmail = userResult?.raw[0].email
        }
      }

      if (administratorByIdResult) {
        const administratorResult = await administratorTypeormRepository
          .createQueryBuilder()
          .update(AdministratorTypeormEntity, {
            first_name: body.firstName ?? administratorByIdResult.first_name,
            last_name: body.lastName ?? administratorByIdResult.last_name,
            administrator_lms_id:
              body.administratorLMSId ??
              administratorByIdResult.administrator_lms_id,
          })
          .where('id=:id', { id: administratorId })
          .returning('*')
          .updateEntity(true)
          .execute()

        if (administratorResult?.raw[0] === undefined) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `failed to update administrator of id ${administratorId}`,
            },
            value: null,
          }
        }

        return {
          hasError: false,
          error: null,
          value: {
            firstName: administratorResult?.raw[0].first_name,
            lastName: administratorResult?.raw[0].last_name,
            email: userEmail,
            administratorLMSId:
              administratorResult?.raw[0].administrator_lms_id,
          },
        }
      } else {
        return {
          hasError: false,
          error: null,
          value: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            administratorLMSId: body.administratorLMSId,
          },
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to update administrator of id ${administratorId}`,
        ),
        value: null,
      }
    }
  }

  async deleteDistrictAdministrators(
    administaratorId: string,
  ): Promise<
    Errorable<
      { message: string },
      E<'UnknownRuntimeError' | 'AdministratorNotFound'>
    >
  > {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const administratorTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorTypeormEntity)

      const administrator = await administratorTypeormRepository.findOneBy({
        id: administaratorId,
      })

      if (!administrator) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: 'Administrator not found',
          },
          value: null,
        }
      }

      await userTypeormRepository.delete({ id: administrator.user_id })
      await administratorTypeormRepository.delete({
        id: administaratorId,
      })

      return {
        hasError: false,
        error: null,
        value: {
          message: 'ok',
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async deactivateDistrictAdministrators(
    administaratorId: string,
  ): Promise<
    Errorable<
      { message: string },
      E<'UnknownRuntimeError' | 'AdministratorNotFound'>
    >
  > {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const administratorTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorTypeormEntity)

      const administrator = await administratorTypeormRepository.findOneBy({
        id: administaratorId,
      })

      if (!administrator) {
        return {
          hasError: true,
          error: {
            type: 'AdministratorNotFound',
            message: 'Administrator not found',
          },
          value: null,
        }
      }

      await userTypeormRepository.update(
        { id: administrator.user_id },
        {
          is_deactivated: true,
          human_user_updated_at: new Date(),
        },
      )

      await administratorTypeormRepository.update(
        { id: administaratorId },
        {
          is_deactivated: true,
        },
      )
      await this.removeAdministratorFromDistrictAdministrators(administaratorId)

      return {
        hasError: false,
        error: null,
        value: {
          message: 'ok',
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async getAdministratorDetailByUserId(
    userId: string,
  ): Promise<
    Errorable<
      Omit<NonNullable<MeInfo['administrator']>, 'districtId'> | null,
      E<'UnknownRuntimeError'>
    >
  > {
    const admistratorTypeormEntity = this.typeormDataSource.getRepository(
      AdministratorTypeormEntity,
    )

    try {
      const admistratorData = await admistratorTypeormEntity
        .createQueryBuilder('administrators')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = administrators.user_id::VARCHAR',
        )
        .select('administrators.id', 'administrator_id')
        .addSelect('administrators.user_id', 'user_id')
        .addSelect('administrators.first_name', 'first_name')
        .addSelect('administrators.last_name', 'last_name')
        .addSelect(
          'administrators.administrator_lms_id',
          'administrator_lms_id',
        )
        .addSelect('users.id', 'id')
        .addSelect('users.login_id', 'login_id')
        .addSelect('users.role', 'role')
        .addSelect('users.email', 'email')
        .where('administrators.user_id = :id', {
          id: userId,
        })
        .getRawOne()

      return {
        hasError: false,
        error: null,
        value: admistratorData
          ? {
              id: admistratorData.administrator_id,
              userId: admistratorData.user_id,
              firstName: admistratorData.first_name,
              lastName: admistratorData.last_name,
              administratorLMSId: admistratorData.administrator_lms_id,
            }
          : null,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get admistrator details by ${userId}`,
        ),
        value: null,
      }
    }
  }

  async checkDistrictAdministratorIsExistsByAdministratorLmsId(
    administratorLmsId: string,
  ): Promise<Errorable<boolean, E<'UnknownRuntimeError'>>> {
    const administratorTypeormRepository = this.typeormDataSource.getRepository(
      AdministratorTypeormEntity,
    )

    try {
      const administrator = await administratorTypeormRepository.findOne({
        where: { administrator_lms_id: administratorLmsId },
      })

      return {
        hasError: false,
        error: null,
        value: administrator ? true : false,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get administrator from db by administratorLmsId${JSON.stringify(
            administratorLmsId,
          )}`,
        ),
        value: null,
      }
    }
  }

  async getDistrictAdministratorByAdministratorLMSId(
    administratorLmsId: string,
  ): Promise<
    Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>
  > {
    const administratorTypeormRepository = this.typeormDataSource.getRepository(
      AdministratorTypeormEntity,
    )

    try {
      const administratorTypeOrmEntity =
        await administratorTypeormRepository.findOneBy({
          administrator_lms_id: administratorLmsId,
        })
      let administrator: DistrictAdministrator | undefined = undefined

      if (administratorTypeOrmEntity) {
        administrator = {
          administratorId: administratorTypeOrmEntity.id,
          userId: administratorTypeOrmEntity.user_id,
          districtId: '',
          email: '',
          firstName: administratorTypeOrmEntity.first_name,
          lastName: administratorTypeOrmEntity.last_name,
          administratorLMSId: administratorTypeOrmEntity.administrator_lms_id,
          createdUserId: administratorTypeOrmEntity.created_user_id,
          createdDate: administratorTypeOrmEntity.created_date.toString(),
        }
      }

      return {
        hasError: false,
        error: null,
        value: administrator,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get districtAdministratorInfo from db by administratorLmsId ${JSON.stringify(
            administratorLmsId,
          )}`,
        ),
        value: null,
      }
    }
  }

  async getAdministratorByAdministratorLMSId(
    administratorLMSId: string[],
  ): Promise<Errorable<DistrictAdministrator[], E<'UnknownRuntimeError'>>> {
    const administratorTypeormRepository = this.typeormDataSource.getRepository(
      AdministratorTypeormEntity,
    )

    try {
      const res: DistrictAdministrator[] = []

      if (administratorLMSId.length) {
        const administratorResult = await administratorTypeormRepository
          .createQueryBuilder('administrators')
          .select('administrators.id', 'administrator_id')
          .addSelect('administrators.first_name', 'first_name')
          .addSelect('administrators.last_name', 'last_name')
          .addSelect(
            'administrators.administrator_lms_id',
            'administrator_lms_id',
          )
          .addSelect('administrators.user_id', 'user_id')
          .addSelect('administrators.created_user_id', 'created_user_id')
          .addSelect('administrators.created_date', 'created_date')
          .where(
            'administrators.administrator_lms_id in (:...administratorLMSId)',
            {
              administratorLMSId,
            },
          )
          .getRawMany()

        administratorResult.map(
          (raw: {
            administrator_id: string
            user_id: string
            first_name: string
            last_name: string
            administrator_lms_id: string
            created_user_id: string
            created_date: string
          }) =>
            res.push({
              administratorId: raw.administrator_id,
              userId: raw.user_id,
              firstName: raw.first_name,
              lastName: raw.last_name,
              administratorLMSId: raw.administrator_lms_id,
              createdUserId: raw.created_user_id,
              districtId: '',
              email: '',
              createdDate: raw.created_date.toString(),
            }),
        )
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    }
  }

  async createDistrictAdministratorForClever(
    districtId: string,
    data: AdminitaratorInfo,
    createdUserId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
    let queryRunner: QueryRunner | null = null

    try {
      const districtTypeormRepository = this.typeormDataSource.getRepository(
        DistrictTypeormEntity,
      )
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const administratorTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorTypeormEntity)
      const administratorDistrictTypeormRepository =
        this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)

      const district = await districtTypeormRepository.findOneBy({
        id: districtId,
      })

      if (!district) {
        return {
          hasError: true,
          error: {
            type: 'DistrictNotFound',
            message: 'District not found',
          },
          value: null,
        }
      }

      let password = data?.password

      if (password) {
        password = await hashingPassword(password)
      }

      const userData = {
        email: data.email,
        login_id: null,
        password: password ?? null,
        is_deactivated: false,
        human_user_created_at: new Date(),
        human_user_updated_at: new Date(),
      } as QueryDeepPartialEntity<{}>

      queryRunner = this.typeormDataSource.createQueryRunner()
      await queryRunner.startTransaction()

      const administratorData = await administratorTypeormRepository
        .createQueryBuilder('administrators')
        .leftJoin(
          UserTypeormEntity,
          'users',
          'users.id::VARCHAR = administrators.user_id::VARCHAR',
        )
        .select('administrators.id', 'administratorId')
        .addSelect('users.id', 'userId')
        .addSelect('users.email', 'userEmail')
        .addSelect('administrators.administrator_lms_id', 'administratorLmsId')
        .where('administrators.administrator_lms_id = :administratorLmsId', {
          administratorLmsId: data.administratorLMSId,
        })
        .getRawOne()

      if (administratorData) {
        //Active the deactivate user
        const userId = administratorData.userId

        await userTypeormRepository
          .createQueryBuilder()
          .update(UserTypeormEntity, userData)
          .where('id=:id', { id: userId })
          .updateEntity(true)
          .execute()
        await administratorTypeormRepository
          .createQueryBuilder()
          .update(AdministratorTypeormEntity, {
            first_name: data?.firstName,
            last_name: data?.lastName,
            administrator_lms_id: data.administratorLMSId,
            is_deactivated: false,
          } as QueryDeepPartialEntity<{}>)
          .where('user_id=:userId', { userId: userId })
          .updateEntity(true)
          .execute()

        //map administrator with district
        const administratorDistrictData: QueryDeepPartialEntity<{}> = {
          administrator: administratorData.administratorId,
          district: districtId,
          created_user_id: createdUserId,
        }

        await administratorDistrictTypeormRepository
          .createQueryBuilder('administrators_districts', queryRunner)
          .insert()
          .values(administratorDistrictData)
          .execute()
      } else {
        //create user and administrator
        const userRes = await userTypeormRepository
          .createQueryBuilder('users', queryRunner)
          .insert()
          .values(userData)
          .execute()
        const administratorData = userRes.generatedMaps.map(
          (item, index) =>
            ({
              first_name: data?.firstName,
              last_name: data?.lastName,
              user_id: item.id as string,
              administrator_lms_id: data.administratorLMSId
                ? data.administratorLMSId
                : null,
              created_user_id: createdUserId ? createdUserId : null,
              is_deactivated: false,
            } as QueryDeepPartialEntity<{}>),
        )
        const administratorRes = await administratorTypeormRepository
          .createQueryBuilder('administrators', queryRunner)
          .insert()
          .values(administratorData)
          .execute()

        const administratorDistrictData: QueryDeepPartialEntity<{}> =
          administratorRes.generatedMaps.map((item) => {
            return {
              administrator: item.id,
              district: districtId,
              created_user_id: createdUserId,
            }
          })

        await administratorDistrictTypeormRepository
          .createQueryBuilder('administrators_districts', queryRunner)
          .insert()
          .values(administratorDistrictData)
          .execute()
      }

      await queryRunner.commitTransaction()

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      if (queryRunner) {
        await queryRunner.rollbackTransaction()
      }

      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          'server error',
        ),
        value: null,
      }
    } finally {
      if (queryRunner) {
        await queryRunner.release()
      }
    }
  }

  async removeAdministratorFromDistrictAdministrators(
    administaratorId: string,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
    const administratorDistrictTypeormEntity =
      this.typeormDataSource.getRepository(AdministratorDistrictTypeormEntity)

    try {
      await administratorDistrictTypeormEntity
        .createQueryBuilder('administrators_districts')
        .delete()
        .where(
          'administrators_districts.administrator_id = :administrator_id',
          {
            administrator_id: administaratorId,
          },
        )
        .execute()

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
          `failed to delete administrator from administrators-districts: ${administaratorId}`,
        ),
        value: null,
      }
    }
  }
}
