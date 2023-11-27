import { CodeillusionPackageCircleDefinition } from '../../../domain/entities/codex-v2/CodeillusionPackageCircleDefinition'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { codeillusionPackageCircleDefinitionsMapByChapterId } from '../../typeorm/hardcoded-data/Pacakges/CodeillusionPackageCircleDefinitions'
import { Lesson } from '../../../domain/entities/codex-v2/Lesson'

export class HardCordedCodeillusionPackageCircleDefinitionRepository {
  definitionsByChapterId: Record<
    string,
    CodeillusionPackageCircleDefinition[]
  > = {}

  definitionsMap: Map<string, CodeillusionPackageCircleDefinition> = new Map()

  constructor(private readonly staticFilesBaseUrl: string) {
    const orig = codeillusionPackageCircleDefinitionsMapByChapterId(
      this.staticFilesBaseUrl,
    )
    const isTypeCourse = (value: string): value is Lesson['course'] => {
      switch (value) {
        case 'basic':
        case 'webDesign':
        case 'mediaArt':
        case 'gameDevelopment':
          return true
        default:
          return false
      }
    }

    Object.keys(orig).forEach((chapterId: string) => {
      this.definitionsByChapterId[chapterId] = orig[chapterId].map((e) => {
        const course = e.course

        if (!isTypeCourse(course)) {
          throw new Error(
            `can't map course. course: ${JSON.stringify(
              course,
            )}, chapterId: ${chapterId}, object: ${JSON.stringify(e)}`,
          )
        }

        const codeillusionPackageCircleDefinition: CodeillusionPackageCircleDefinition =
          {
            ...e,
            course: course,
          }

        this.definitionsMap.set(e.id, codeillusionPackageCircleDefinition)

        return codeillusionPackageCircleDefinition
      })
    })
  }

  findById = async (
    codeillusionPackageCircleDefinitionId: string,
  ): Promise<
    Errorable<
      CodeillusionPackageCircleDefinition | null,
      E<'UnknownRuntimeError'>
    >
  > => {
    const result = this.definitionsMap.get(
      codeillusionPackageCircleDefinitionId,
    )

    if (!result) {
      return successErrorable(null)
    }

    const codeillusionPackageCircleDefinition =
      this.transformToDomainEntity(result)

    return successErrorable(codeillusionPackageCircleDefinition)
  }

  findByIds = async (
    codeillusionPackageCircleDefinitionIds: string[],
  ): Promise<
    Errorable<CodeillusionPackageCircleDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result: CodeillusionPackageCircleDefinition[] =
      codeillusionPackageCircleDefinitionIds
        .map((e) => this.definitionsMap.get(e))
        .filter((e): e is CodeillusionPackageCircleDefinition => !!e)
        .map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  findByCodeillusionPackageChapterDefinitionId = async (
    codeillusionPackageChapterDefinitionId: string,
  ): Promise<
    Errorable<CodeillusionPackageCircleDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result =
      this.definitionsByChapterId[codeillusionPackageChapterDefinitionId]

    if (!result) {
      return successErrorable([])
    }

    return successErrorable(result.map(this.transformToDomainEntity))
  }

  private transformToDomainEntity = (hardCordedEntity: {
    id: string
    codeillusionPackageChapterDefinitionId: string
    course: Lesson['course']
    bookName: string
    characterImageUrl: string
    clearedCharacterImageUrl: string
    bookImageUrl: string
  }): CodeillusionPackageCircleDefinition => {
    return {
      id: hardCordedEntity.id,
      codeillusionPackageChapterDefinitionId:
        hardCordedEntity.codeillusionPackageChapterDefinitionId,
      course: hardCordedEntity.course,
      bookName: hardCordedEntity.bookName,
      characterImageUrl: hardCordedEntity.characterImageUrl,
      clearedCharacterImageUrl: hardCordedEntity.clearedCharacterImageUrl,
      bookImageUrl: hardCordedEntity.bookImageUrl,
    }
  }
}
