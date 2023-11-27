import { CsePackageLessonDefinition } from '../../domain/entities/codex/CsePackageDefinition'
import { Errorable, E } from '../../domain/usecases/shared/Errors'
import { csePackageLessonDefinitionsMapByUnitId } from '../typeorm/hardcoded-data/Pacakges/CsePackageLessonDefinitions'

export class CsePackageLessonDefinitionRepository {
  async getAllByUnitDefinitionId(
    unitDefinitionId: string,
  ): Promise<
    Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError', string>>
  > {
    const lessonDefinitions =
      csePackageLessonDefinitionsMapByUnitId[unitDefinitionId]

    if (!lessonDefinitions) {
      return {
        hasError: false,
        error: null,
        value: [],
      }
    }

    return {
      hasError: false,
      error: null,
      value: lessonDefinitions,
    }
  }
}
