import { CsePackageUnitDefinition } from '../../../domain/entities/codex-v2/CsePackageUnitDefinition'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { csePackageUnitDefinitions } from '../../typeorm/hardcoded-data/Pacakges/CsePackageUnitDefinitions'

export class HardCordedCsePackageUnitDefinitionRepository {
  definitionsMap: Map<string, CsePackageUnitDefinition>

  constructor(private readonly staticFilesBaseUrl: string) {
    this.definitionsMap = new Map(
      csePackageUnitDefinitions.map((e) => [e.id, e]),
    )
  }

  findById = async (
    csePackageUnitDefinitionId: string,
  ): Promise<
    Errorable<CsePackageUnitDefinition | null, E<'UnknownRuntimeError'>>
  > => {
    const result = this.definitionsMap.get(csePackageUnitDefinitionId)

    if (!result) {
      return successErrorable(null)
    }

    const csePackageUnitDefinition = this.transformToDomainEntity(result)

    return successErrorable(csePackageUnitDefinition)
  }

  findByIds = async (
    csePackageUnitDefinitionIds: string[],
  ): Promise<
    Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result: CsePackageUnitDefinition[] = csePackageUnitDefinitionIds
      .map((e) => this.definitionsMap.get(e))
      .filter((e): e is CsePackageUnitDefinition => !!e)
      .map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  findAll = async (): Promise<
    Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>
  > => {
    const result: CsePackageUnitDefinition[] = Array.from(
      this.definitionsMap.values(),
    ).map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  private transformToDomainEntity = (hardCordedEntity: {
    id: string
    name: string
    description: string
  }): CsePackageUnitDefinition => {
    return {
      id: hardCordedEntity.id,
      name: hardCordedEntity.name,
      description: hardCordedEntity.description,
    }
  }
}
