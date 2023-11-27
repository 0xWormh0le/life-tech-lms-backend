import { DataSource, Repository } from 'typeorm'
import { User } from '../../../domain/entities/codex-v2/User'
import {
  UserRoleTypeormEnum,
  UserTypeormEntity,
} from '../../typeorm/entity/User'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbUserRepository {
  typeormRepository: Repository<UserTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    user: User,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(user))

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(user)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> => {
    try {
      const users = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(users)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all users',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<User | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id,
      })

      if (!result) {
        return successErrorable(null)
      }

      const user = this.transformToDomainEntity(result)

      return successErrorable(user)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user. id: ${id}`,
        e,
      )
    }
  }

  update = async (
    user: User,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: user.id },
        this.transformToTypeormEntity(user),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update user. $${JSON.stringify(user)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserTypeormEntity,
  ): User => {
    const role = this.transformRoleToDomainEnum(typeormEntity.role)

    if (!role) {
      throw new Error(
        `unexpected userRole for DomainEntity. userId: ${typeormEntity.id}, role: ${typeormEntity.role}`,
      )
    }

    return {
      id: typeormEntity.id,
      role: role,
      isDemo: !!typeormEntity.is_demo,
      createdAt: typeormEntity.created_at,
      updatedAt: typeormEntity.updated_at,
    }
  }

  private transformRoleToDomainEnum = (
    typeormRole: UserTypeormEntity['role'] | null,
  ): User['role'] | null => {
    switch (typeormRole) {
      case 'student':
        return 'student'
      case 'teacher':
        return 'teacher'
      case 'administrator':
        return 'administrator'
      case 'internal_operator':
        return 'internalOperator'
      default:
        return null
    }
  }

  private transformToTypeormEntity = (
    domainEntity: User,
  ): QueryDeepPartialEntity<UserTypeormEntity> => {
    const role = this.transformRoleToTypeormEnum(domainEntity.role)

    if (!role) {
      throw new Error(
        `unexpected userRole for DB. userId: ${domainEntity.id}, role: ${domainEntity.role}`,
      )
    }

    return {
      id: domainEntity.id,
      role: role,
      is_demo: domainEntity.isDemo,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
    }
  }

  private transformRoleToTypeormEnum = (
    typeormRole: User['role'],
  ): UserRoleTypeormEnum | null => {
    switch (typeormRole) {
      case 'student':
        return UserRoleTypeormEnum.student
      case 'teacher':
        return UserRoleTypeormEnum.teacher
      case 'administrator':
        return UserRoleTypeormEnum.administrator
      case 'internalOperator':
        return UserRoleTypeormEnum.internal_operator
      default:
        return null
    }
  }
}
