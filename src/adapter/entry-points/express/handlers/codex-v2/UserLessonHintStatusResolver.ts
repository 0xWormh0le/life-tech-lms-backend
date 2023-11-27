import { DataSource } from 'typeorm'
import { RdbUserLessonHintStatusRepository } from '../../../../repositories/codex-v2/RdbUserLessonHintStatusRepository'
import { UserLessonHintStatus } from './_gen/resolvers-type'
import { UserLessonHintStatus as DomainEntityUserLessonHintStatus } from '../../../../../domain/entities/codex-v2/UserLessonHintStatus'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetUserLessonHintStatusesUseCase from '../../../../../domain/usecases/codex-v2/user-lesson-hint-status/GetUserLessonHintStatusesUseCase'

export class UserLessonHintStatusResolver {
  getUseCase: GetUserLessonHintStatusesUseCase

  constructor(private readonly appDataSource: DataSource) {
    const userLessonHintStatusRepository =
      new RdbUserLessonHintStatusRepository(this.appDataSource)

    this.getUseCase = new GetUserLessonHintStatusesUseCase(
      userLessonHintStatusRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<UserLessonHintStatus>
  > = async (user, _parent) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityUserLessonHintStatus,
  ): UserLessonHintStatus => {
    return {
      __typename: 'UserLessonHintStatus',
      id: domainEntity.id,
      lessonHintId: domainEntity.lessonHintId,
      userId: domainEntity.userId,
      userLessonStatusId: domainEntity.userLessonStatusId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
