/* eslint-disable no-type-assertion/no-type-assertion */
import { v4 as uuid } from 'uuid'
import { DataSource, DeepPartial, In } from 'typeorm'

import { IUserRepository } from '../../domain/usecases/RosterSync'
import { User } from '../../domain/entities/User'
import {
  Errorable,
  E,
  successErrorable,
  unknownRuntimeError,
} from '../../../../../domain/usecases/shared/Errors'
import {
  UserRoleTypeormEnum,
  UserTypeormEntity,
} from '../../../../../adapter/typeorm/entity/User'
import { AdministratorTypeormEntity } from '../../../../../adapter/typeorm/entity/Administrator'
import { StudentTypeormEntity } from '../../../../../adapter/typeorm/entity/Student'
import { TeacherTypeormEntity } from '../../../../../adapter/typeorm/entity/Teacher'

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

export class UserRepository implements IUserRepository {
  constructor(private typeormDataSource: DataSource) {}

  async issueId(): Promise<
    Errorable<string, E<'UnknownRuntimeError', string>>
  > {
    return successErrorable(uuid())
  }

  async getByIds(
    ids: string[],
  ): Promise<Errorable<User[], E<'UnknownRuntimeError', string>>> {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const users = await userTypeormRepository.find({
        where: { id: In(ids) },
      })
      const userData: User[] = []

      for (const u of users) {
        const role = convertRoleToEntity(u.role)

        if (role == null) {
          return unknownRuntimeError(
            `User's role ${u.role} doesn't exist in Life Is Tech portal.`,
          )
        }
        userData.push({
          id: u.id,
          loginId: u.login_id ?? undefined,
          email: u.email ?? undefined,
          role,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: userData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get users from Life Is Tech portal. ${JSON.stringify(e)}`,
      )
    }
  }

  async getByEmails(
    emails: string[],
  ): Promise<Errorable<User[], E<'UnknownRuntimeError', string>>> {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)
      const users = await userTypeormRepository.find({
        where: { email: In(emails) },
      })
      const userData: User[] = []

      for (const u of users) {
        const role = convertRoleToEntity(u.role)

        if (role == null) {
          return unknownRuntimeError(
            `User's role ${u.role} doesn't exist in Life Is Tech portal.`,
          )
        }
        userData.push({
          id: u.id,
          loginId: u.login_id ?? undefined,
          email: u.email ?? undefined,
          role,
          isDeactivated: u.is_deactivated,
        })
      }

      return {
        hasError: false,
        error: null,
        value: userData,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to get users from Life Is Tech portal. ${JSON.stringify(e)}`,
      )
    }
  }

  async createUsers(
    users: User[],
  ): Promise<
    Errorable<User[], E<'UnknownRuntimeError'> | E<'AlreadyExistError'>>
  > {
    let lmsId: null | string = null
    let message = ''
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    // Check if given users already exist
    try {
      const userTypeormEntities: DeepPartial<UserTypeormEntity>[] = []

      for (const user of users) {
        const alreadyExistUser = await userTypeormRepository.findOne({
          where: { email: user.email },
        })

        if (alreadyExistUser) {
          if (alreadyExistUser.role === 'student') {
            const studentTypeormRepository =
              this.typeormDataSource.getRepository(StudentTypeormEntity)
            const studentResult = await studentTypeormRepository.findOne({
              where: {
                user_id: alreadyExistUser.id,
              },
            })

            lmsId = studentResult?.student_lms_id ?? null
          }

          if (alreadyExistUser.role === 'teacher') {
            const teacherTypeormRepository =
              this.typeormDataSource.getRepository(TeacherTypeormEntity)
            const teacherResult = await teacherTypeormRepository.findOne({
              where: {
                user_id: alreadyExistUser.id,
              },
            })

            lmsId = teacherResult?.teacher_lms_id ?? null
          }

          if (alreadyExistUser.role === 'administrator') {
            const administratorTypeormRepository =
              this.typeormDataSource.getRepository(AdministratorTypeormEntity)
            const administratorResult =
              await administratorTypeormRepository.findOne({
                where: {
                  user_id: alreadyExistUser.id,
                },
              })

            lmsId = administratorResult?.administrator_lms_id ?? null
          }

          if (alreadyExistUser.role === user.role && lmsId !== null) {
            message = `User already exists with this email ${
              alreadyExistUser.email ?? 'null'
            }. You can not create user again.`
          } else if (alreadyExistUser.role === user.role && lmsId === null) {
            message = `User already exists with this email ${
              alreadyExistUser.email ?? 'null'
            }, but we didn't find LMS Id for this user. So please add LMS Id for this user.`
          } else {
            message = `You are trying to create user ${
              alreadyExistUser.email ?? 'null'
            } with role ${
              user.role
            }, but user already exist with different role ${
              alreadyExistUser.role
            } in Life Is Tech portal. Either please delete existing user or update the role.`
          }
          break
        }

        const role = convertRoleToTypeormEnum(user.role)

        if (role == null) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message: `User's role ${user.role} doesn't exist in Life Is Tech portal.`,
            },
            value: null,
          }
        }

        const now = new Date()

        userTypeormEntities.push({
          id: user.id,
          login_id: user.loginId !== '' ? user.loginId : undefined,
          email: user.email !== '' ? user.email : undefined,
          role,
          is_deactivated: user.isDeactivated,
          human_user_created_at: now,
          human_user_updated_at: now,
        })
      }

      if (message) {
        return {
          hasError: true,
          error: {
            type: 'AlreadyExistError',
            message,
          },
          value: null,
        }
      }

      if (userTypeormEntities.length) {
        const userResult = await userTypeormRepository.save(userTypeormEntities)
        const getUserResult: User[] = []

        for (const u of userResult) {
          const role = convertRoleToEntity(u.role)

          if (role == null) {
            return unknownRuntimeError(
              `User's role ${u.role} doesn't exist in Life Is Tech portal.`,
            )
          }
          getUserResult.push({
            id: u.id,
            loginId: u.login_id ?? undefined,
            role: role,
            email: u.email ?? undefined,
            isDeactivated: u.is_deactivated,
          })
        }

        if (message) {
          return {
            hasError: true,
            error: {
              type: 'UnknownRuntimeError',
              message,
            },
            value: null,
          }
        }

        return {
          hasError: false,
          error: null,
          value: getUserResult,
        }
      }

      return {
        hasError: false,
        error: null,
        value: [],
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to create user into Life Is Tech portal. ${JSON.stringify(e)}`,
      )
    }
  }

  async updateUsers(
    users: User[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'NotFoundError'>>> {
    const userTypeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)

    // Check if given users already exist
    for (const user of users) {
      try {
        const existingUsers = await userTypeormRepository.find({
          where: { id: user.id },
        })

        if (existingUsers.length === 0) {
          return {
            hasError: true,
            error: {
              type: 'NotFoundError',
              message: `Some of User doesn't exist in Life Is Tech portal. userId: ${user.id}`,
            },
            value: null,
          }
        }
      } catch (e: unknown) {
        return unknownRuntimeError(
          `User doesn't exist in Life Is Tech portal. ${JSON.stringify(e)}`,
        )
      }
    }

    // Update users
    try {
      const now = new Date()
      const userTypeormEntities: DeepPartial<UserTypeormEntity>[] = []

      for (const u of users) {
        const role = convertRoleToTypeormEnum(u.role)

        if (role == null) {
          return unknownRuntimeError(
            `User's role ${u.role} doesn't exist in Life Is Tech portal.`,
          )
        }
        userTypeormEntities.push({
          id: u.id,
          login_id: u.loginId !== '' ? u.loginId : undefined,
          email: u.email !== '' ? u.email : undefined,
          role,
          is_deactivated: u.isDeactivated,
          updated_at: now,
          human_user_updated_at: now,
        })
      }
      await userTypeormRepository.save(userTypeormEntities)

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to update users into Life Is Tech portal. ${JSON.stringify(e)}`,
      )
    }
  }

  async deleteUsers(
    ids: string[],
  ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
    try {
      const userTypeormRepository =
        this.typeormDataSource.getRepository(UserTypeormEntity)

      await userTypeormRepository.update(
        { id: In(ids) },
        {
          is_deactivated: true,
        },
      )

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return unknownRuntimeError(
        `Failed to deactivate users from Life Is Tech portal. ${JSON.stringify(
          e,
        )}`,
      )
    }
  }
}
