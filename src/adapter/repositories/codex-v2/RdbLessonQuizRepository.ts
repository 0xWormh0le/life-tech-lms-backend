import { DataSource, Repository } from 'typeorm'
import { LessonQuiz } from '../../../domain/entities/codex-v2/LessonQuiz'
import { LessonQuizTypeormEntity } from '../../typeorm/entity/LessonQuiz'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbLessonQuizRepository {
  typeormRepository: Repository<LessonQuizTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      LessonQuizTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    lessonQuiz: LessonQuiz,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(lessonQuiz),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(lessonQuiz)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<LessonQuiz[], E<'UnknownRuntimeError'>>
  > => {
    try {
      const lessonSteps = (await this.typeormRepository.find()).map(
        this.transformToDomainEntity,
      )

      return successErrorable(lessonSteps)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        'failed to get all lessonSteps',
        e,
      )
    }
  }

  findById = async (
    id: string,
  ): Promise<Errorable<LessonQuiz | null, E<'UnknownRuntimeError'>>> => {
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
        `failed to get lessonQuiz. id: ${id}`,
        e,
      )
    }
  }

  findByLessonStepId = async (
    lessonStepId: string,
  ): Promise<Errorable<LessonQuiz | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        lesson_step_id: lessonStepId,
      })

      if (!result) {
        return successErrorable(null)
      }

      const lessonQuiz = this.transformToDomainEntity(result)

      return successErrorable(lessonQuiz)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get lessonQuiz by lessonStepId: ${lessonStepId}`,
        e,
      )
    }
  }

  update = async (
    lessonQuiz: LessonQuiz,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: lessonQuiz.id },
        this.transformToTypeormEntity(lessonQuiz),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update lessonQuiz. $${JSON.stringify(lessonQuiz)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: LessonQuizTypeormEntity,
  ): LessonQuiz => {
    return {
      id: typeormEntity.id,
      lessonStepId: typeormEntity.lesson_step_id,
      label: typeormEntity.label,
      description: typeormEntity.description,
      createdAt: typeormEntity.created_date,
      updatedAt: typeormEntity.updated_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: LessonQuiz,
  ): QueryDeepPartialEntity<LessonQuizTypeormEntity> => {
    return {
      id: domainEntity.id,
      lesson_step_id: domainEntity.lessonStepId,
      label: domainEntity.label,
      description: domainEntity.description,
      created_date: domainEntity.createdAt,
      updated_date: domainEntity.updatedAt,
    }
  }
}
