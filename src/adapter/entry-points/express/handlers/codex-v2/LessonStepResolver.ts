import { DataSource } from 'typeorm'
import { RdbLessonStepRepository } from '../../../../repositories/codex-v2/RdbLessonStepRepository'
import { LessonStep, QueryLessonStepsArgs } from './_gen/resolvers-type'
import { LessonStep as DomainEntityLessonStep } from '../../../../../domain/entities/codex-v2/LessonStep'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetLessonStepsByLessonIdUseCase from '../../../../../domain/usecases/codex-v2/lesson-step/GetLessonStepsByLessonIdUseCase'

export class LessonStepResolver {
  getUseCase: GetLessonStepsByLessonIdUseCase

  constructor(private readonly appDataSource: DataSource) {
    const lessonStepRepository = new RdbLessonStepRepository(this.appDataSource)

    this.getUseCase = new GetLessonStepsByLessonIdUseCase(lessonStepRepository)
  }

  query: ResolverWithAuthenticatedUser<
    QueryLessonStepsArgs,
    QueryResult<LessonStep>
  > = async (user, _parent, { lessonId }) => {
    const res = await this.getUseCase.run(user, lessonId)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityLessonStep,
  ): LessonStep => {
    return {
      __typename: 'LessonStep',
      id: domainEntity.id,
      externalLessonPlayerStepId: domainEntity.externalLessonPlayerStepId,
      lessonId: domainEntity.lessonId,
      orderIndex: domainEntity.orderIndex,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
