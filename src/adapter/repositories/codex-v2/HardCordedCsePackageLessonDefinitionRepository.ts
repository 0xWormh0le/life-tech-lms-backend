import { CsePackageLessonDefinition } from '../../../domain/entities/codex-v2/CsePackageLessonDefinition'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { csePackageLessonDefinitionsMapByUnitId } from '../../typeorm/hardcoded-data/Pacakges/CsePackageLessonDefinitions'

export class HardCordedCsePackageLessonDefinitionRepository {
  definitionsByUnitId: Record<string, CsePackageLessonDefinition[]>

  constructor() {
    this.definitionsByUnitId = csePackageLessonDefinitionsMapByUnitId
  }

  findByCsePackageUnitDefinitionIdAndLessonId = async (
    csePackageUnitDefinitionId: string,
    lessonId: string,
  ): Promise<
    Errorable<CsePackageLessonDefinition | null, E<'UnknownRuntimeError'>>
  > => {
    const result = this.definitionsByUnitId[csePackageUnitDefinitionId].find(
      (e) => e.lessonId === lessonId,
    )

    if (!result) {
      return successErrorable(null)
    }

    const csePackageLessonDefinition = this.transformToDomainEntity(result)

    return successErrorable(csePackageLessonDefinition)
  }

  findByCsePackageUnitDefinitionId = async (
    csePackageUnitDefinitionId: string,
  ): Promise<
    Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result = this.definitionsByUnitId[csePackageUnitDefinitionId]

    if (!result) {
      return successErrorable([])
    }

    return successErrorable(result.map(this.transformToDomainEntity))
  }

  private transformToDomainEntity = (hardCordedEntity: {
    lessonId: string
    csePackageUnitDefinitionId: string
    isQuizLesson: boolean
  }): CsePackageLessonDefinition => {
    return {
      lessonId: hardCordedEntity.lessonId,
      csePackageUnitDefinitionId: hardCordedEntity.csePackageUnitDefinitionId,
      isQuizLesson: hardCordedEntity.isQuizLesson,
    }
  }
}
