import { CsePackageUnitDefinition } from '../../domain/entities/codex/CsePackageDefinition'
import { Errorable, E } from '../../domain/usecases/shared/Errors'
import { csePackageUnitDefinitions } from '../typeorm/hardcoded-data/Pacakges/CsePackageUnitDefinitions'

export class CsePackageUnitDefinitionRepository {
  async getAll(): Promise<
    Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError', string>>
  > {
    return { hasError: false, error: null, value: csePackageUnitDefinitions }
  }
}
