import { Brackets, DataSource, DeepPartial, In, Not, Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { User } from '../../domain/entities/codex/User'
import { AccessToken } from '../../domain/entities/authentication/AccessToken'
import {
  E,
  Errorable,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { AuthenticationInfo } from '../../domain/entities/authentication/AuthenticationInfo'
import { UserWithToken } from '../../domain/entities/authentication/UserWithToken'
import { UserRoleTypeormEnum, UserTypeormEntity } from '../typeorm/entity/User'
import { UserAccessTokenTypeormEntity } from '../typeorm/entity/UserAccessToken'
import {
  comparingHashedPassword,
  hashingPassword,
} from './shared/PassWordHashing'
import { StudentTypeormEntity } from '../typeorm/entity/Student'
import { TeacherTypeormEntity } from '../typeorm/entity/Teacher'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export type UserEmailType = {
  email: string | null
  userId?: string
}

const convertRoleToEntity = (
  role: UserTypeormEntity['role'],
): User['role'] | null => {
  switch (role) {
    case UserRoleTypeormEnum.student:
      return 'student'
    case UserRoleTypeormEnum.teacher:
      return 'teacher'
    case UserRoleTypeormEnum.administrator:
      return 'administrator'
    case UserRoleTypeormEnum.internal_operator:
      return 'internalOperator'
    case UserRoleTypeormEnum.anonymous:
      return 'anonymous'
    default:
      return null
  }
}

const convertRoleToTypeormEnum = (
  role: User['role'],
): UserTypeormEntity['role'] | null => {
  switch (role) {
    case 'student':
      return UserRoleTypeormEnum.student
    case 'teacher':
      return UserRoleTypeormEnum.teacher
    case 'administrator':
      return UserRoleTypeormEnum.administrator
    case 'internalOperator':
      return UserRoleTypeormEnum.internal_operator
    case 'anonymous':
      return UserRoleTypeormEnum.anonymous
    default:
      return null
  }
}

export class UserRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getUserByAccessToken(
    accessToken: AccessToken,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> {
    try {
      const userAccessTokenTypeormEntity = this.typeormDataSource.getRepository(
        UserAccessTokenTypeormEntity,
      )

      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)

      const userAccessTokenData = await userAccessTokenTypeormEntity.findOneBy({
        access_token: accessToken,
      })

      if (!userAccessTokenData?.user_id) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      const userData = await userTypeormRepository.findOneBy({
        id: userAccessTokenData.user_id,
      })

      if (!userData) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      const role = convertRoleToEntity(userData.role)

      if (role == null) {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: `unknown role "${userData.role}" detected`,
          },
          value: null,
        }
      }

      return {
        hasError: false,
        error: null,
        value: {
          id: userData.id,
          loginId: userData.login_id ?? undefined,
          email: userData.email ?? undefined,
          role,
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

  async getUserWithTokenByAuthenticationInfo(
    authenticationInfo: AuthenticationInfo,
  ): Promise<
    Errorable<
      UserWithToken | null,
      E<'UnknownRuntimeError'> | E<'AuthenticationFailedError'>
    >
  > {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const userAccessTokenTypeormEntity = this.typeormDataSource.getRepository(
        UserAccessTokenTypeormEntity,
      )
      //check credentials for all users based on email or loginId
      const userData = await userTypeormRepository
        .createQueryBuilder('user')
        .select('user.email', 'email')
        .addSelect('user.login_id', 'login_id')
        .addSelect('user.role', 'role')
        .addSelect('user.id', 'id')
        .addSelect('user.password', 'password')
        .where(
          new Brackets((qb) => {
            qb.where('user.login_id = :loginId', {
              loginId: authenticationInfo.loginId,
            }).orWhere('user.email = :loginId', {
              loginId: authenticationInfo.loginId,
            })
          }),
        )
        .andWhere('user.is_deactivated = :isDeactivated', {
          isDeactivated: false,
        })
        .getRawOne()

      if (userData) {
        if (!userData.password) {
          return {
            hasError: true,
            error: {
              type: 'AuthenticationFailedError',
              message: 'Authentication Failed Error',
            },
            value: null,
          }
        }

        const validPassword = await comparingHashedPassword(
          authenticationInfo.password,
          userData.password,
        )

        if (!validPassword) {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        }

        const accessToken = uuidv4()

        await userAccessTokenTypeormEntity.save({
          user_id: userData.id,
          access_token: accessToken,
        })

        const role = convertRoleToEntity(userData.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown role "${userData.role}" detected`,
            },
            value: null,
          }
        }

        return {
          hasError: false,
          error: null,
          value: {
            id: userData.id,
            role,
            loginId: userData.login_id,
            email: userData.email,
            accessToken: accessToken,
          },
        }
      } else {
        return {
          hasError: false,
          error: null,
          value: userData,
        }
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

  async getUsers(
    userIds: string[],
  ): Promise<Errorable<User[], E<'UnknownRuntimeError'> | E<'NotFoundError'>>> {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const users = await userTypeormRepository.find({
        order: { created_at: 'ASC' },
        where: { id: In(userIds) },
      })
      const value: User[] = []

      for (const u of users) {
        const role = convertRoleToEntity(u.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown role "${u.role}" detected`,
            },
            value: null,
          }
        }
        value.push({
          id: u.id,
          loginId: u.login_id ?? undefined,
          email: u.email ?? undefined,
          role,
        })
      }

      return {
        hasError: false,
        error: null,
        value,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get user from db`,
        ),
        value: null,
      }
    }
  }

  async getAllUsers(): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const users = await userTypeormRepository.find({
        order: { created_at: 'ASC' },
      })
      const value: User[] = []

      for (const u of users) {
        const role = convertRoleToEntity(u.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown role "${u.role}" detected`,
            },
            value: null,
          }
        }
        value.push({
          id: u.id,
          loginId: u.login_id ?? undefined,
          email: u.email ?? undefined,
          role,
        })
      }

      return {
        hasError: false,
        error: null,
        value,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get user from db`,
        ),
        value: null,
      }
    }
  }

  async createUser(
    user: Omit<User, 'id'> & { password?: string },
  ): Promise<
    Errorable<
      User,
      E<'UnknownRuntimeError', string> | E<'AlreadyExistError', string>
    >
  > {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const createdUser = await userTypeormRepository.save({
        login_id: user.loginId,
        password: user.password,
        role: user.role,
        email: user.email,
        is_deactivated: user.isDeactivated,
        human_user_created_at: new Date(),
        human_user_updated_at: new Date(),
      })

      return {
        hasError: false,
        error: null,
        value: {
          id: createdUser.id,
          role: createdUser.role,
          loginId: createdUser.login_id,
          email: createdUser.email,
          isDeactivated: createdUser.is_deactivated,
        },
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create user ${JSON.stringify(user)}`,
        ),
        value: null,
      }
    }
  }

  async createAccessToken(
    userId: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
    try {
      const userAccessTokenTypeormRepository =
        this.typeormDataSource.getRepository(UserAccessTokenTypeormEntity)
      const accessToken = uuidv4()
      const createdUserAccessToken =
        await userAccessTokenTypeormRepository.save({
          user_id: userId,
          access_token: accessToken,
        })

      return {
        hasError: false,
        error: null,
        value: createdUserAccessToken.access_token,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create user access token ${JSON.stringify(userId)}`,
        ),
        value: null,
      }
    }
  }

  async createUsers(
    users: (User & { loginId?: string; email?: string; password: string })[],
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>
  > {
    let userTypeormRepository: Repository<UserTypeormEntity>

    try {
      userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get UserTypeormEntity`,
        ),
        value: null,
      }
    }

    // Check if given users already exist
    try {
      const existingCount = await userTypeormRepository.countBy({
        login_id: In(users.map((u) => u.loginId)),
      })

      if (existingCount > 0) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message: 'some of given users already exist',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get user from db`,
        ),
        value: null,
      }
    }

    // Create new users
    try {
      const userTypeormEntities: DeepPartial<UserTypeormEntity>[] = []

      for (const u of users) {
        const role = convertRoleToTypeormEnum(u.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown role "${u.role}" detected`,
            },
            value: null,
          }
        }
        userTypeormEntities.push({
          id: u.id,
          login_id: u.loginId !== '' ? u.loginId : undefined,
          email: u.email !== '' ? u.email : undefined,
          password: await hashingPassword(u.password),
          role,
          human_user_created_at: new Date(),
          human_user_updated_at: new Date(),
        })
      }
      await userTypeormRepository.save(userTypeormEntities)

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
          `failed to create users into db`,
        ),
        value: null,
      }
    }
  }

  async updateUsers(
    users: (User & AuthenticationInfo)[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>> {
    let userTypeormRepository: Repository<UserTypeormEntity>

    try {
      userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get UserTypeormEntity`,
        ),
        value: null,
      }
    }

    // Check if given users already exist
    try {
      const existingCount = await userTypeormRepository.countBy({
        id: In(users.map((u) => u.id)),
      })

      if (existingCount !== users.length) {
        return {
          hasError: true,
          error: {
            type: 'NotFoundError',
            message: 'some of given users not found',
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get user from db`,
        ),
        value: null,
      }
    }

    // Update users
    try {
      const now = new Date()
      const userTypeormEntities: DeepPartial<UserTypeormEntity>[] = []

      for (const u of users) {
        const role = convertRoleToTypeormEnum(u.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown role "${u.role}" detected`,
            },
            value: null,
          }
        }
        userTypeormEntities.push({
          id: u.id,
          login_id: u.loginId !== '' ? u.loginId : undefined,
          email: u.email !== '' ? u.email : undefined,
          password: await hashingPassword(u.password),
          role,
          updated_at: now,
          human_user_updated_at: new Date(),
        })
      }
      await userTypeormRepository.save(userTypeormEntities)

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
          `failed to create users into db`,
        ),
        value: null,
      }
    }
  }

  async getUsersByEmails(
    emails: string[],
    studentId?: string,
  ): Promise<Errorable<UserEmailType[], E<'UnknownRuntimeError'>>> {
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)
    const studentTypeormRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)

    if (studentId) {
      try {
        let users: UserEmailType[] = []

        if (emails.length) {
          const student = await studentTypeormRepository.findOne({
            where: { id: studentId },
          })

          if (student) {
            const findEmailUserData = await userTypeormRepository.find({
              where: {
                id: Not(student.user_id),
                email: emails[0],
              },
              select: ['email'],
            })

            users = findEmailUserData
          }
        }

        return {
          hasError: false,
          error: null,
          value: users,
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to fetch users from db`,
          ),
          value: null,
        }
      }
    }

    try {
      let users: UserEmailType[] = []

      if (emails.length) {
        users = await userTypeormRepository
          .createQueryBuilder('users')
          .where('users.email in (:...emails)', {
            emails,
          })
          .select('users.email', 'email')
          .addSelect('users.id', 'userId')
          .execute()
      }

      return {
        hasError: false,
        error: null,
        value: users,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to fetch users from db`,
        ),
        value: null,
      }
    }
  }

  async findAlreadyExistsLoginId(
    loginIds: string[],
    studentId?: string,
  ): Promise<Errorable<(string | null)[], E<'UnknownRuntimeError'>>> {
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)
    const studentTypeormRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)

    if (studentId) {
      try {
        let alreadyExistsLoginIds: (string | null)[] = []

        if (loginIds.length) {
          const student = await studentTypeormRepository.findOne({
            where: { id: studentId },
          })

          if (student) {
            const findLoginIdUserData = await userTypeormRepository.find({
              where: {
                id: Not(student.user_id),
                login_id: loginIds[0],
              },
              select: ['login_id'],
            })

            alreadyExistsLoginIds = findLoginIdUserData.map((i) => i.login_id)
          }
        }

        return {
          hasError: false,
          error: null,
          value: alreadyExistsLoginIds,
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to fetch users from db`,
          ),
          value: null,
        }
      }
    }

    try {
      const query = loginIds.toString().split(',')
      const alreadyExists = await userTypeormRepository
        .createQueryBuilder('users')
        .where('users.login_id in (:...query)', {
          query,
        })
        .select('users.login_id', 'login_id')
        .getRawMany()

      const alreadyExistsLoginIds = alreadyExists.map((i) => i.login_id)

      return {
        hasError: false,
        error: null,
        value: alreadyExistsLoginIds,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to find already exists login ids`,
        ),
        value: null,
      }
    }
  }

  async getUserIdByLmsId(
    lmsId?: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
    const studentTypeormRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)
    const teacherTypeormEntity =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)
    let result: any

    try {
      result = await studentTypeormRepository
        .createQueryBuilder('students')
        .where('students.student_lms_id = :lmsId', {
          lmsId: lmsId,
        })
        .select('students.user_id', 'user_id')
        .getRawOne()

      if (result === null || result === undefined) {
        result = await teacherTypeormEntity
          .createQueryBuilder('teachers')
          .where('teachers.teacher_lms_id = :lmsId', {
            lmsId: lmsId,
          })
          .select('teachers.user_id', 'user_id')
          .getRawOne()
      }

      return {
        hasError: false,
        error: null,
        value: result?.user_id,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to fetch users from db`,
        ),
        value: null,
      }
    }
  }

  async getUserIdByLmsIdClassLink(
    tenantId: string,
    lmsId?: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>> {
    const studentTypeormRepository =
      this.typeormDataSource.getRepository(StudentTypeormEntity)
    const teacherTypeormEntity =
      this.typeormDataSource.getRepository(TeacherTypeormEntity)
    let result: any

    try {
      result = await studentTypeormRepository
        .createQueryBuilder('students')
        .where('students.classlink_tenant_id = :tenantId', {
          tenantId: tenantId,
        })
        .andWhere('students.student_lms_id = :lmsId', {
          lmsId: lmsId,
        })
        .select('students.user_id', 'user_id')
        .getRawOne()

      if (result === null || result === undefined) {
        result = await teacherTypeormEntity
          .createQueryBuilder('teachers')
          .where('teachers.classlink_tenant_id = :tenantId', {
            tenantId: tenantId,
          })
          .andWhere('teachers.teacher_lms_id = :lmsId', {
            lmsId: lmsId,
          })
          .select('teachers.user_id', 'user_id')
          .getRawOne()
      }

      return {
        hasError: false,
        error: null,
        value: result?.user_id,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to fetch users from db`,
        ),
        value: null,
      }
    }
  }

  async getUserByEmail(
    email: string,
  ): Promise<Errorable<User | undefined, E<'UnknownRuntimeError'>>> {
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    try {
      const userInfo = await userTypeormRepository.findOneBy({
        email: email,
      })
      let userData: User | undefined = undefined

      if (userInfo) {
        const role = convertRoleToEntity(userInfo?.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `unknown role "${userInfo.role}" detected`,
            },
            value: null,
          }
        }
        userData = {
          id: userInfo.id,
          role,
          email: userInfo.email ?? undefined,
        }
      }

      return {
        hasError: false,
        error: null,
        value: userData,
      }
    } catch (error) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          error as Error,
          `failed to get user from db by ${JSON.stringify(email)}`,
        ),
        value: null,
      }
    }
  }

  async updateUserPassword(
    userId: string,
    password: string,
  ): Promise<
    Errorable<void, E<'UnknownRuntimeError'> | E<'UserDataNotFound'>>
  > {
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    try {
      const userInfo = await userTypeormRepository.findOneBy({
        id: userId,
      })

      if (!userInfo) {
        return {
          hasError: true,
          error: {
            type: 'UserDataNotFound',
            message: `user data not found`,
          },
          value: null,
        }
      }

      // update user password into DB
      const hashedPassword = await hashingPassword(password)

      await userTypeormRepository
        .createQueryBuilder()
        .update(UserTypeormEntity, {
          password: hashedPassword,
          human_user_updated_at: new Date(),
        } as QueryDeepPartialEntity<{}>)
        .where('id=:userId', { userId: userId })
        .updateEntity(true)
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
          `failed to update user password into db by userId ${userId}`,
        ),
        value: null,
      }
    }
  }
}
