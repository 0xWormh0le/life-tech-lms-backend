import { DataSource } from 'typeorm'
import { RdbUserLessonStepStatusRepository } from '../../../../repositories/codex-v2/RdbUserLessonStepStatusRepository'
import {
  QueryUserLessonStepStatusesArgs,
  UserLessonStepStatus,
} from './_gen/resolvers-type'
import { UserLessonStepStatus as DomainEntityUserLessonStepStatus } from '../../../../../domain/entities/codex-v2/UserLessonStepStatus'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetUserLessonStepStatusesByUserIdsUseCase from '../../../../../domain/usecases/codex-v2/user-lesson-step-status/GetUserLessonStepStatusesByUserIdsUseCase'

export class UserLessonStepStatusResolver {
  getByUserIdsUseCase: GetUserLessonStepStatusesByUserIdsUseCase

  constructor(private readonly appDataSource: DataSource) {
    const userLessonStepStatusRepository =
      new RdbUserLessonStepStatusRepository(this.appDataSource)

    this.getByUserIdsUseCase = new GetUserLessonStepStatusesByUserIdsUseCase(
      userLessonStepStatusRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryUserLessonStepStatusesArgs,
    QueryResult<UserLessonStepStatus>
  > = async (user, _parent, { userIds }) => {
    const res = await this.getByUserIdsUseCase.run(user, userIds)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityUserLessonStepStatus,
  ): UserLessonStepStatus => {
    return {
      __typename: 'UserLessonStepStatus',
      id: domainEntity.id,
      userId: domainEntity.userId,
      stepId: domainEntity.stepId,
      userLessonStatusId: domainEntity.userLessonStatusId,
      lessonId: domainEntity.lessonId,
      status: domainEntity.status,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
