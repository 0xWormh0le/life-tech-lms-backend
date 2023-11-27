import {
  CurriculumPackageLessonConfiguration,
  QueryCurriculumPackageLessonConfigurationsArgs,
} from './_gen/resolvers-type'
import { CurriculumPackageLessonConfiguration as DomainEntityCurriculumPackageLessonConfiguration } from '../../../../../domain/entities/codex-v2/CurriculumPackageLessonConfiguration'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { HardCordedCurriculumPackageLessonConfigurationRepository } from '../../../../repositories/codex-v2/HardCordedCurriculumPackageLessonConfigurationRepository'
import GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase from '../../../../../domain/usecases/codex-v2/curriculum-package-lesson-configuration/GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase'

export class CurriculumPackageLessonConfigurationResolver {
  getUseCase: GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase

  constructor() {
    const curriculumPackageLessonConfigurationRepository =
      new HardCordedCurriculumPackageLessonConfigurationRepository()

    this.getUseCase =
      new GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase(
        curriculumPackageLessonConfigurationRepository,
      )
  }

  query: ResolverWithAuthenticatedUser<
    QueryCurriculumPackageLessonConfigurationsArgs,
    QueryResult<CurriculumPackageLessonConfiguration>
  > = async (user, _parent, { curriculumPackageId }) => {
    const res = await this.getUseCase.run(user, curriculumPackageId)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCurriculumPackageLessonConfiguration,
  ): CurriculumPackageLessonConfiguration => {
    return {
      __typename: 'CurriculumPackageLessonConfiguration',
      lessonId: domainEntity.lessonId,
      curriculumPackageId: domainEntity.curriculumPackageId,
    }
  }
}
