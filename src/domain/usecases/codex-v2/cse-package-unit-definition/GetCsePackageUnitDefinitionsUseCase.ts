import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CsePackageUnitDefinition } from '../../../entities/codex-v2/CsePackageUnitDefinition'

export interface CsePackageUnitDefinitionRepository {
  findAll(): Promise<
    Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>
  >
}

export default class GetCsePackageUnitDefinitionsUseCase {
  constructor(
    private readonly cseUnitDefinitionRepository: CsePackageUnitDefinitionRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
  ): Promise<Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>> =>
    this.cseUnitDefinitionRepository.findAll()
}
