import { DataSource } from 'typeorm'
import { RdbLessonHintRepository } from '../../../../repositories/codex-v2/RdbLessonHintRepository'
import { LessonHint } from './_gen/resolvers-type'
import { LessonHint as DomainEntityLessonHint } from '../../../../../domain/entities/codex-v2/LessonHint'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetLessonHintsUseCase from '../../../../../domain/usecases/codex-v2/lesson-hint/GetLessonHintsUseCase'

export class LessonHintResolver {
  getUseCase: GetLessonHintsUseCase

  constructor(private readonly appDataSource: DataSource) {
    const lessonQuizRepository = new RdbLessonHintRepository(this.appDataSource)

    this.getUseCase = new GetLessonHintsUseCase(lessonQuizRepository)
  }

  query: ResolverWithAuthenticatedUser<void, QueryResult<LessonHint>> = async (
    user,
    _parent,
  ) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityLessonHint,
  ): LessonHint => {
    return {
      __typename: 'LessonHint',
      id: domainEntity.id,
      description: domainEntity.description,
      label: domainEntity.label,
      lessonStepId: domainEntity.lessonStepId,
      createdAt: domainEntity.createdAt.toISOString(),
      updatedAt: domainEntity.updatedAt.toISOString(),
    }
  }
}
