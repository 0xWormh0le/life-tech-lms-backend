import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import { UserLessonQuizStatus } from '../../../domain/entities/codex-v2/UserLessonQuizStatus'
import { UserLessonQuizStatusTypeormEntity } from '../../typeorm/entity/UserLessonQuizStatus'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'

export class RdbUserLessonQuizStatusRepository {
  typeormRepository: Repository<UserLessonQuizStatusTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      UserLessonQuizStatusTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    entity: UserLessonQuizStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(this.transformToTypeormEntity(entity))

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create user lesson quiz status: ${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<UserLessonQuizStatus[], E<'UnknownRuntimeError'>>
  > => {
    return this.findAllByField()
  }

  findById = async (
    id: string,
  ): Promise<
    Errorable<UserLessonQuizStatus | null, E<'UnknownRuntimeError'>>
  > => {
    return this.findOneByField({ id })
  }

  findByLessonQuizId = async (
    lessonQuizId: string,
  ): Promise<Errorable<UserLessonQuizStatus[], E<'UnknownRuntimeError'>>> => {
    return this.findAllByField({ lesson_quiz_id: lessonQuizId })
  }

  findByUserLessonStatusId = async (
    userLessonStatusId: string,
  ): Promise<Errorable<UserLessonQuizStatus[], E<'UnknownRuntimeError'>>> => {
    return this.findAllByField({ user_lesson_status_id: userLessonStatusId })
  }

  findAllByField = async (
    where?: FindOptionsWhere<UserLessonQuizStatusTypeormEntity>,
  ): Promise<Errorable<UserLessonQuizStatus[], E<'UnknownRuntimeError'>>> => {
    try {
      const entities = (await this.typeormRepository.find({ where })).map(
        this.transformToDomainEntity,
      )

      return successErrorable(entities)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson quiz statuses`,
        e,
      )
    }
  }

  private findOneByField = async (
    where: FindOptionsWhere<UserLessonQuizStatusTypeormEntity>,
  ): Promise<
    Errorable<UserLessonQuizStatus | null, E<'UnknownRuntimeError'>>
  > => {
    try {
      const result = await this.typeormRepository.findOneBy(where)

      if (!result) {
        return successErrorable(null)
      }

      const entity = this.transformToDomainEntity(result)

      return successErrorable(entity)
    } catch (e) {
      const fields = Object.keys(where).join()
      const values = Object.values(where).join()

      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get user lesson quiz status. ${fields}: ${values}`,
        e,
      )
    }
  }

  update = async (
    entity: UserLessonQuizStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: entity.id },
        this.transformToTypeormEntity(entity),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update user lesson quiz status. $${JSON.stringify(entity)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: UserLessonQuizStatusTypeormEntity,
  ): UserLessonQuizStatus => {
    return {
      id: typeormEntity.id,
      userId: typeormEntity.user_id,
      lessonQuizId: typeormEntity.lesson_quiz_id,
      userLessonStatusId: typeormEntity.user_lesson_status_id,
      isCorrect: typeormEntity.is_correct,
      selectedChoice: typeormEntity.selected_choice,
      createdAt: typeormEntity.created_at,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: UserLessonQuizStatus,
  ): QueryDeepPartialEntity<UserLessonQuizStatusTypeormEntity> => {
    return {
      id: domainEntity.id,
      user_id: domainEntity.userId,
      lesson_quiz_id: domainEntity.lessonQuizId,
      user_lesson_status_id: domainEntity.userLessonStatusId,
      is_correct: domainEntity.isCorrect,
      selected_choice: domainEntity.selectedChoice,
      created_at: domainEntity.createdAt,
    }
  }
}
