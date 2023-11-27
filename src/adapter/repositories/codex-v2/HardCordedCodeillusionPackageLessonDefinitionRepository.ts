import { CodeillusionPackageLessonDefinition } from '../../../domain/entities/codex-v2/CodeillusionPackageLessonDefinition'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { codeillusionPackageLessonDefinitionsMapByCircleId } from '../../typeorm/hardcoded-data/Pacakges/CodeillusionPackageLessonDefinitions'

export class HardCordedCodeillusionPackageLessonDefinitionRepository {
  definitionsByCircleId: Record<string, CodeillusionPackageLessonDefinition[]> =
    {}

  constructor() {
    const orig = codeillusionPackageLessonDefinitionsMapByCircleId
    const isTypeCourse = (
      value: string,
    ): value is CodeillusionPackageLessonDefinition['uiType'] => {
      switch (value) {
        case 'gem':
        case 'book':
        case 'magicQuest':
        case 'magicJourney':
          return true
        default:
          return false
      }
    }

    Object.keys(orig).forEach((circleId: string) => {
      this.definitionsByCircleId[circleId] = orig[circleId].map((e) => {
        const uiType = e.uiType

        if (!isTypeCourse(uiType)) {
          throw new Error(
            `can't map uiType. uiType: ${JSON.stringify(
              uiType,
            )}, circleId: ${circleId}, object: ${JSON.stringify(e)}`,
          )
        }

        const codeillusionPackageLessonDefinition: CodeillusionPackageLessonDefinition =
          {
            ...e,
            uiType: uiType,
          }

        return codeillusionPackageLessonDefinition
      })
    })
  }

  findByCodeillusionPackageCircleDefinitionIdAndLessonId = async (
    codeillusionPackageCircleDefinitionId: string,
    lessonId: string,
  ): Promise<
    Errorable<
      CodeillusionPackageLessonDefinition | null,
      E<'UnknownRuntimeError'>
    >
  > => {
    const result = this.definitionsByCircleId[
      codeillusionPackageCircleDefinitionId
    ].find((e) => e.lessonId === lessonId)

    if (!result) {
      return successErrorable(null)
    }

    const codeillusionPackageLessonDefinition =
      this.transformToDomainEntity(result)

    return successErrorable(codeillusionPackageLessonDefinition)
  }

  findByCodeillusionPackageCircleDefinitionId = async (
    codeillusionPackageCircleDefinitionId: string,
  ): Promise<
    Errorable<CodeillusionPackageLessonDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result =
      this.definitionsByCircleId[codeillusionPackageCircleDefinitionId]

    if (!result) {
      return successErrorable([])
    }

    return successErrorable(result.map(this.transformToDomainEntity))
  }

  private transformToDomainEntity = (hardCordedEntity: {
    lessonId: string
    codeillusionPackageCircleDefinitionId: string
    uiType: 'gem' | 'book' | 'magicQuest' | 'magicJourney'
  }): CodeillusionPackageLessonDefinition => {
    return {
      lessonId: hardCordedEntity.lessonId,
      codeillusionPackageCircleDefinitionId:
        hardCordedEntity.codeillusionPackageCircleDefinitionId,
      uiType: hardCordedEntity.uiType,
    }
  }
}
