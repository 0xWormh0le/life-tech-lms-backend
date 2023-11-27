import { DataSource, Repository } from 'typeorm'
import { LessonStep } from '../../../domain/entities/codex-v2/LessonStep'
import { LessonStepTypeormEntity } from '../../typeorm/entity/LessonStep'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { v4 as uuid } from 'uuid'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class RdbLessonStepRepository {
  typeormRepository: Repository<LessonStepTypeormEntity>

  constructor(private readonly typeormDataSource: DataSource) {
    this.typeormRepository = this.typeormDataSource.getRepository(
      LessonStepTypeormEntity,
    )
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(uuid())

  create = async (
    lessonStep: LessonStep,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.insert(
        this.transformToTypeormEntity(lessonStep),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(lessonStep)}`,
        e,
      )
    }
  }

  findAll = async (): Promise<
    Errorable<LessonStep[], E<'UnknownRuntimeError'>>
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
  ): Promise<Errorable<LessonStep | null, E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findOneBy({
        id,
      })

      if (!result) {
        return successErrorable(null)
      }

      const lessonStep = this.transformToDomainEntity(result)

      return successErrorable(lessonStep)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get lessonStep. id: ${id}`,
        e,
      )
    }
  }

  findByLessonId = async (
    lessonId: string,
  ): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>> => {
    try {
      const result = await this.typeormRepository.findBy({
        lesson_id: lessonId,
      })

      const lessonStep = result.map(this.transformToDomainEntity)

      return successErrorable(lessonStep)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get lessonStep by lessonId: ${lessonId}`,
        e,
      )
    }
  }

  update = async (
    lessonStep: LessonStep,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      await this.typeormRepository.update(
        { id: lessonStep.id },
        this.transformToTypeormEntity(lessonStep),
      )

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to update lessonStep. $${JSON.stringify(lessonStep)}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    typeormEntity: LessonStepTypeormEntity,
  ): LessonStep => {
    return {
      id: typeormEntity.id,
      lessonId: typeormEntity.lesson_id,
      orderIndex: typeormEntity.order_index,
      externalLessonPlayerStepId: typeormEntity.lesson_player_step_id,
      createdAt: typeormEntity.created_date,
    }
  }

  private transformToTypeormEntity = (
    domainEntity: LessonStep,
  ): QueryDeepPartialEntity<LessonStepTypeormEntity> => {
    return {
      id: domainEntity.id,
      lesson_id: domainEntity.lessonId,
      order_index: domainEntity.orderIndex,
      lesson_player_step_id: domainEntity.externalLessonPlayerStepId,
      created_date: domainEntity.createdAt,
    }
  }
}
