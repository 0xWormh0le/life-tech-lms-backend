import {
  CodeillusionPackageChapterDefinition,
  CodeillusionPackageCircleDefinition,
  LessonCourse,
  QueryCodeillusionPackageCircleDefinitionsArgs,
} from './_gen/resolvers-type'
import { CodeillusionPackageCircleDefinition as DomainEntityCodeillusionPackageCircleDefinition } from '../../../../../domain/entities/codex-v2/CodeillusionPackageCircleDefinition'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { HardCordedCodeillusionPackageCircleDefinitionRepository } from '../../../../repositories/codex-v2/HardCordedCodeillusionPackageCircleDefinitionRepository'
import GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase from '../../../../../domain/usecases/codex-v2/codeillusion-package-circle-definition/GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase'
import { shouldBeNever } from '../../../../../_shared/utils'

type CodeillusionPackageCircleDefinitionResolverResponse = Omit<
  CodeillusionPackageCircleDefinition,
  'codeillusionPackageLessonDefinitions'
>

export class CodeillusionPackageCircleDefinitionResolver {
  getUseCase: GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase

  constructor(private readonly staticFilesBaseUrl: string) {
    const codeillusionPackageCircleDefinitionRepository =
      new HardCordedCodeillusionPackageCircleDefinitionRepository(
        this.staticFilesBaseUrl,
      )

    this.getUseCase =
      new GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase(
        codeillusionPackageCircleDefinitionRepository,
      )
  }

  query: ResolverWithAuthenticatedUser<
    QueryCodeillusionPackageCircleDefinitionsArgs,
    QueryResult<CodeillusionPackageCircleDefinition>,
    CodeillusionPackageChapterDefinition
  > = async (
    user,
    codeillusionPackageChapterDefinition,
    { codeillusionPackageChapterDefinitionId },
  ) => {
    const res = await this.getUseCase.run(
      user,
      codeillusionPackageChapterDefinitionId ??
        codeillusionPackageChapterDefinition.id,
    )
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCodeillusionPackageCircleDefinition,
  ): CodeillusionPackageCircleDefinitionResolverResponse => {
    return {
      __typename: 'CodeillusionPackageCircleDefinition',
      id: domainEntity.id,
      codeillusionPackageChapterDefinitionId:
        domainEntity.codeillusionPackageChapterDefinitionId,
      course: this.transformCourseToGraphqlSchema(domainEntity.course),
      bookName: domainEntity.bookName,
      characterImageUrl: domainEntity.characterImageUrl,
      clearedCharacterImageUrl: domainEntity.clearedCharacterImageUrl,
      bookImageUrl: domainEntity.bookImageUrl,
    }
  }

  private transformCourseToGraphqlSchema = (
    domainEntity: DomainEntityCodeillusionPackageCircleDefinition['course'],
  ): CodeillusionPackageCircleDefinition['course'] => {
    switch (domainEntity) {
      case 'basic':
        return LessonCourse.Basic
      case 'webDesign':
        return LessonCourse.WebDesign
      case 'mediaArt':
        return LessonCourse.MediaArt
      case 'gameDevelopment':
        return LessonCourse.GameDevelopment
      case '':
        return LessonCourse.Empty
      default:
        shouldBeNever(domainEntity)
        throw new Error(
          `invalid mapping for course. course: ${JSON.stringify(domainEntity)}`,
        )
    }
  }
}
