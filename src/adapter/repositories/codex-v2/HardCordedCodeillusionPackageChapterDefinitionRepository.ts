import { CodeillusionPackageChapterDefinition } from '../../../domain/entities/codex-v2/CodeillusionPackageChapterDefinition'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { codeillusionPackageChapterDefinitions } from '../../typeorm/hardcoded-data/Pacakges/CodeillusionPackageChapterDefinitions'

export class HardCordedCodeillusionPackageChapterDefinitionRepository {
  definitionsMap: Map<string, CodeillusionPackageChapterDefinition>

  constructor(private readonly staticFilesBaseUrl: string) {
    this.definitionsMap = new Map(
      codeillusionPackageChapterDefinitions(this.staticFilesBaseUrl).map(
        (e) => [e.id, e],
      ),
    )
  }

  findById = async (
    codeillusionPackageChapterDefinitionId: string,
  ): Promise<
    Errorable<
      CodeillusionPackageChapterDefinition | null,
      E<'UnknownRuntimeError'>
    >
  > => {
    const result = this.definitionsMap.get(
      codeillusionPackageChapterDefinitionId,
    )

    if (!result) {
      return successErrorable(null)
    }

    const codeillusionPackageChapterDefinition =
      this.transformToDomainEntity(result)

    return successErrorable(codeillusionPackageChapterDefinition)
  }

  findByIds = async (
    codeillusionPackageChapterDefinitionIds: string[],
  ): Promise<
    Errorable<CodeillusionPackageChapterDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result: CodeillusionPackageChapterDefinition[] =
      codeillusionPackageChapterDefinitionIds
        .map((e) => this.definitionsMap.get(e))
        .filter((e): e is CodeillusionPackageChapterDefinition => !!e)
        .map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  findAll = async (): Promise<
    Errorable<CodeillusionPackageChapterDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result: CodeillusionPackageChapterDefinition[] = Array.from(
      this.definitionsMap.values(),
    ).map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  private transformToDomainEntity = (hardCordedEntity: {
    id: string
    name: string
    title: string
    lessonOverViewPdfUrl: string
    lessonNoteSheetsZipUrl: string
  }): CodeillusionPackageChapterDefinition => {
    return {
      id: hardCordedEntity.id,
      name: hardCordedEntity.name,
      title: hardCordedEntity.title,
      lessonOverViewPdfUrl: hardCordedEntity.lessonOverViewPdfUrl,
      lessonNoteSheetsZipUrl: hardCordedEntity.lessonNoteSheetsZipUrl,
    }
  }
}
