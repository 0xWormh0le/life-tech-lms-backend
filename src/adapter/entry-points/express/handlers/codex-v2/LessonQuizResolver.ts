import { DataSource } from 'typeorm'
import { RdbLessonQuizRepository } from '../../../../repositories/codex-v2/RdbLessonQuizRepository'
import { LessonQuiz } from './_gen/resolvers-type'
import { LessonQuiz as DomainEntityLessonQuiz } from '../../../../../domain/entities/codex-v2/LessonQuiz'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetLessonQuizzesUseCase from '../../../../../domain/usecases/codex-v2/lesson-quiz/GetLessonQuizzesUseCase'

export class LessonQuizResolver {
  getUseCase: GetLessonQuizzesUseCase

  constructor(private readonly appDataSource: DataSource) {
    const lessonQuizRepository = new RdbLessonQuizRepository(this.appDataSource)

    this.getUseCase = new GetLessonQuizzesUseCase(lessonQuizRepository)
  }

  query: ResolverWithAuthenticatedUser<void, QueryResult<LessonQuiz>> = async (
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
    domainEntity: DomainEntityLessonQuiz,
  ): LessonQuiz => {
    return {
      __typename: 'LessonQuiz',
      id: domainEntity.id,
      description: domainEntity.description,
      label: domainEntity.label,
      lessonStepId: domainEntity.lessonStepId,
      createdAt: domainEntity.createdAt.toISOString(),
      updatedAt: domainEntity.updatedAt.toISOString(),
    }
  }
}
