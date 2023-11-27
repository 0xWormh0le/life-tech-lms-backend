import {
  CsePackageLessonDefinition,
  CsePackageUnitDefinition,
  QueryCsePackageLessonDefinitionsArgs,
} from './_gen/resolvers-type'
import { CsePackageLessonDefinition as DomainEntityCsePackageLessonDefinition } from '../../../../../domain/entities/codex-v2/CsePackageLessonDefinition'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { HardCordedCsePackageLessonDefinitionRepository } from '../../../../repositories/codex-v2/HardCordedCsePackageLessonDefinitionRepository'
import GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase from '../../../../../domain/usecases/codex-v2/cse-package-lesson-definition/GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase'

export class CsePackageLessonDefinitionResolver {
  getUseCase: GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase

  constructor() {
    const csePackageLessonDefinitionRepository =
      new HardCordedCsePackageLessonDefinitionRepository()

    this.getUseCase =
      new GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase(
        csePackageLessonDefinitionRepository,
      )
  }

  query: ResolverWithAuthenticatedUser<
    QueryCsePackageLessonDefinitionsArgs,
    QueryResult<CsePackageLessonDefinition>,
    CsePackageUnitDefinition
  > = async (
    user,
    csePackageUnitDefinition,
    { csePackageUnitDefinitionId },
  ) => {
    const res = await this.getUseCase.run(
      user,
      csePackageUnitDefinitionId ?? csePackageUnitDefinition.id,
    )
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCsePackageLessonDefinition,
  ): CsePackageLessonDefinition => {
    return {
      __typename: 'CsePackageLessonDefinition',
      lessonId: domainEntity.lessonId,
      csePackageUnitDefinitionId: domainEntity.csePackageUnitDefinitionId,
      isQuizLesson: domainEntity.isQuizLesson,
    }
  }
}
