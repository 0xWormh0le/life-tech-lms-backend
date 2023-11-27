import { Lesson } from './_gen/resolvers-type'
import { Lesson as DomainEntityLesson } from '../../../../../domain/entities/codex-v2/Lesson'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetLessonsUseCase from '../../../../../domain/usecases/codex-v2/lesson/GetLessonsUseCase'
import { HardCordedLessonRepository } from '../../../../repositories/codex-v2/HardCordedLessonRepository'

export class LessonResolver {
  getUseCase: GetLessonsUseCase

  constructor(
    private readonly staticFilesBaseUrl: string,
    private readonly lessonPlayerBaseUrl: string,
  ) {
    const lessonRepository = new HardCordedLessonRepository(
      this.staticFilesBaseUrl,
      this.lessonPlayerBaseUrl,
    )

    this.getUseCase = new GetLessonsUseCase(lessonRepository)
  }

  query: ResolverWithAuthenticatedUser<void, QueryResult<Lesson>> = async (
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
    domainEntity: DomainEntityLesson,
  ): Lesson => {
    return {
      __typename: 'Lesson',
      id: domainEntity.id,
      url: domainEntity.url,
      name: domainEntity.name,
      course: domainEntity.course,
      lessonEnvironment: domainEntity.lessonEnvironment,
      description: domainEntity.description,
      theme: domainEntity.theme,
      skillsLearnedInThisLesson: domainEntity.skillsLearnedInThisLesson,
      lessonDuration: domainEntity.lessonDuration,
      lessonOverViewPdfUrl: domainEntity.lessonOverViewPdfUrl,
      thumbnailImageUrl: domainEntity.thumbnailImageUrl,
      projectName: domainEntity.projectName,
      scenarioName: domainEntity.scenarioName,
      maxStarCount: domainEntity.maxStarCount,
      quizCount: domainEntity.quizCount,
      hintCount: domainEntity.hintCount,
      level: domainEntity.level,
    }
  }
}
