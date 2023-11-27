import { DataSource, Like, Repository } from 'typeorm'
import { HumanUser } from '../../../domain/entities/codex-v2/HumanUser'
import { UserTypeormEntity } from '../../typeorm/entity/User'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import bcrypt from 'bcrypt'

export class RdbHumanUserRepository {
  typeormRepository: Repository<UserTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository =
      this.typeormDataSource.getRepository(UserTypeormEntity)
  }

  hashPassword = async (
    plainPassword: string,
  ): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
    const saltRounds = 10

    try {
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(plainPassword, salt)

      return successErrorable(hashedPassword)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all humanUsers',
        e,
      )
    }
  }

  verifyPassword = async (
    plainPassword: string,
    hashedPassword: string,
  ): Promise<Errorable<boolean, E<'UnknownRuntimeError'>>> => {
    try {
      const verifyPassword = await bcrypt.compare(plainPassword, hashedPassword)

      return successErrorable(verifyPassword)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all humanUsers',
        e,
      )
    }
  }

  create = async (
    humanUser: HumanUser,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> =>
    this.update(humanUser)

  findAll = async (): Promise<
    Errorable<HumanUser[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const humanUsers = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(humanUsers)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all humanUsers',
        e,
      )
    }
  }

  findByEmail = async (
    email: string | null,
  ): Promise<Errorable<HumanUser[], E<'UnknownRuntimeError'>>> => {
    try {
      const humanUsers = (
        await this.typeormRepository.findBy(
          email ? { email: Like(`%${email}%`) } : {},
        )
      ).map(this.transformToDomainEntity)

      return successErrorable(humanUsers)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to search humanUsers by email',
        e,
      )
    }
  }

  credentialExist = async (
    loginId: string | null,
    email: string | null,
  ): Promise<boolean> => {
    const count = await this.typeormRepository.countBy({
      login_id: loginId ?? undefined,
      email: email ?? undefined,
    })

    return count > 0
  }

  findByUserId = async (
    userId: string,
  ): Promise<Errorable<HumanUser | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id: userId,
      })

      if (!result) {
        return successErrorable(null)
      }

      const humanUser = this.transformToDomainEntity(result)

      if (!humanUser.createdAt) {
        return successErrorable(null)
      }

      return successErrorable(humanUser)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get humanUser. userId: ${userId}`,
        e,
      )
    }
  }

  update = async (
    humanUser: HumanUser,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: humanUser.userId },
        this.transformToTypeormEntity(humanUser),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update humanUser. $${JSON.stringify(humanUser)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserTypeormEntity,
  ): HumanUser => {
    return {
      userId: typeormEntity.id,
      loginId: typeormEntity.login_id,
      email: typeormEntity.email,
      hashedPassword: typeormEntity.password,
      createdAt: typeormEntity.human_user_created_at,
      updatedAt: typeormEntity.human_user_updated_at,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: HumanUser,
  ): QueryDeepPartialEntity<UserTypeormEntity> => {
    return {
      id: domainEntity.userId,
      login_id: domainEntity.loginId,
      email: domainEntity.email,
      password: domainEntity.hashedPassword,
      human_user_created_at: domainEntity.createdAt,
      human_user_updated_at: domainEntity.updatedAt,
    }
  }
}
