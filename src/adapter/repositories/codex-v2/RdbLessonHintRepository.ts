import { DataSource, Repository } from 'typeorm'
import { LessonHint } from '../../../domain/entities/codex-v2/LessonHint'
import { LessonHintTypeormEntity } from '../../typeorm/entity/LessonHint'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbLessonHintRepository {
  typeormRepository: Repository<LessonHintTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      LessonHintTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    lessonHint: LessonHint,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(lessonHint),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create lesson hint: ${JSON.stringify(lessonHint)}`,
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<LessonHint | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id,
      })

      if (!result) {
        return successErrorable(null)
      }

      const lessonQuiz = this.transformToDomainEntity(result)

      return successErrorable(lessonQuiz)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get lesson hint. id: ${id}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<LessonHint[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const userLessonHintStatuses = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(userLessonHintStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all lesson hints',
        e,
      )
    }
  }

  findByLessonStepId = async (
    lessonStepId: string,
  ): Promise<Errorable<LessonHint[], E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findBy({
        lesson_step_id: lessonStepId,
      })
      const userLessonHintStatuses = result.map(this.transformToDomainEntity)

      return successErrorable(userLessonHintStatuses)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get lesson hint by lesson step id: ${lessonStepId}`,
        e,
      )
    }
  }

  update = async (
    lessonHint: LessonHint,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: lessonHint.id },
        this.transformToTypeormEntity(lessonHint),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update lesson hint. $${JSON.stringify(lessonHint)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: LessonHintTypeormEntity,
  ): LessonHint => {
    return {
      id: typeormEntity.id,
      lessonStepId: typeormEntity.lesson_step_id,
      label: typeormEntity.label,
      description: typeormEntity.description,
      createdAt: typeormEntity.created_at,
      updatedAt: typeormEntity.updated_at,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: LessonHint,
  ): QueryDeepPartialEntity<LessonHintTypeormEntity> => {
    return {
      id: domainEntity.id,
      lesson_step_id: domainEntity.lessonStepId,
      label: domainEntity.label,
      description: domainEntity.description,
      created_at: domainEntity.createdAt,
      updated_at: domainEntity.updatedAt,
    }
  }
}
