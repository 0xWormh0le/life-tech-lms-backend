import { CodeillusionPackageChapterDefinition } from './_gen/resolvers-type'
import { CodeillusionPackageChapterDefinition as DomainEntityCodeillusionPackageChapterDefinition } from '../../../../../domain/entities/codex-v2/CodeillusionPackageChapterDefinition'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetCodeillusionPackageChapterDefinitionsUseCase from '../../../../../domain/usecases/codex-v2/codeillusion-package-chapter-definition/GetCodeillusionPackageChapterDefinitionsUseCase'
import { HardCordedCodeillusionPackageChapterDefinitionRepository } from '../../../../repositories/codex-v2/HardCordedCodeillusionPackageChapterDefinitionRepository'

type CodeillusionPackageChapterDefinitionResolverResponse = Omit<
  CodeillusionPackageChapterDefinition,
  'codeillusionPackageCircleDefinitions'
>

export class CodeillusionPackageChapterDefinitionResolver {
  getUseCase: GetCodeillusionPackageChapterDefinitionsUseCase

  constructor(private readonly staticFilesBaseUrl: string) {
    const codeillusionPackageChapterDefinitionRepository =
      new HardCordedCodeillusionPackageChapterDefinitionRepository(
        this.staticFilesBaseUrl,
      )

    this.getUseCase = new GetCodeillusionPackageChapterDefinitionsUseCase(
      codeillusionPackageChapterDefinitionRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<CodeillusionPackageChapterDefinitionResolverResponse>
  > = async (user, _parent) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCodeillusionPackageChapterDefinition,
  ): CodeillusionPackageChapterDefinitionResolverResponse => {
    return {
      __typename: 'CodeillusionPackageChapterDefinition',
      id: domainEntity.id,
      name: domainEntity.name,
      title: domainEntity.title,
      lessonOverViewPdfUrl: domainEntity.lessonOverViewPdfUrl,
      lessonNoteSheetsZipUrl: domainEntity.lessonNoteSheetsZipUrl,
    }
  }
}
