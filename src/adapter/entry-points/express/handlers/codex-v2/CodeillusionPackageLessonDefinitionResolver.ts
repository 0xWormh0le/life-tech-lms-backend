import {
  CodeillusionPackageLessonDefinition,
  CodeillusionPackageCircleDefinition,
  CodeillusionPackageLessonDefinitionUiType,
  QueryCodeillusionPackageLessonDefinitionsArgs,
} from './_gen/resolvers-type'
import { CodeillusionPackageLessonDefinition as DomainEntityCodeillusionPackageLessonDefinition } from '../../../../../domain/entities/codex-v2/CodeillusionPackageLessonDefinition'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { HardCordedCodeillusionPackageLessonDefinitionRepository } from '../../../../repositories/codex-v2/HardCordedCodeillusionPackageLessonDefinitionRepository'
import GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase from '../../../../../domain/usecases/codex-v2/codeillusion-package-lesson-definition/GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase'
import { shouldBeNever } from '../../../../../_shared/utils'

export class CodeillusionPackageLessonDefinitionResolver {
  getUseCase: GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase

  constructor() {
    const codeillusionPackageLessonDefinitionRepository =
      new HardCordedCodeillusionPackageLessonDefinitionRepository()

    this.getUseCase =
      new GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase(
        codeillusionPackageLessonDefinitionRepository,
      )
  }

  query: ResolverWithAuthenticatedUser<
    QueryCodeillusionPackageLessonDefinitionsArgs,
    QueryResult<CodeillusionPackageLessonDefinition>,
    CodeillusionPackageCircleDefinition
  > = async (
    user,
    codeillusionPackageCircleDefinition,
    { codeillusionPackageCircleDefinitionId },
  ) => {
    const res = await this.getUseCase.run(
      user,
      codeillusionPackageCircleDefinitionId ??
        codeillusionPackageCircleDefinition.id,
    )
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCodeillusionPackageLessonDefinition,
  ): CodeillusionPackageLessonDefinition => {
    return {
      __typename: 'CodeillusionPackageLessonDefinition',
      lessonId: domainEntity.lessonId,
      codeillusionPackageCircleDefinitionId:
        domainEntity.codeillusionPackageCircleDefinitionId,
      uiType: this.transformUiTypeToGraphqlSchema(domainEntity.uiType),
    }
  }

  private transformUiTypeToGraphqlSchema = (
    domainEntity: DomainEntityCodeillusionPackageLessonDefinition['uiType'],
  ): CodeillusionPackageLessonDefinition['uiType'] => {
    switch (domainEntity) {
      case 'gem':
        return CodeillusionPackageLessonDefinitionUiType.Gem
      case 'book':
        return CodeillusionPackageLessonDefinitionUiType.Book
      case 'magicQuest':
        return CodeillusionPackageLessonDefinitionUiType.MagicQuest
      case 'magicJourney':
        return CodeillusionPackageLessonDefinitionUiType.MagicJourney
      default:
        shouldBeNever(domainEntity)
        throw new Error(
          `invalid mapping for course. course: ${JSON.stringify(domainEntity)}`,
        )
    }
  }
}
