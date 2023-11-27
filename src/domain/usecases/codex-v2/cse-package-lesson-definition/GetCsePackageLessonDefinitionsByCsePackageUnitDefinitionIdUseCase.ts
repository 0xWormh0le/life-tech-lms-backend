import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CsePackageLessonDefinition } from '../../../entities/codex-v2/CsePackageLessonDefinition'

export interface CsePackageLessonDefinitionRepository {
  findByCsePackageUnitDefinitionId(
    csePackageUnitDefinitionId: string,
  ): Promise<Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError'>>>
}

export default class GetCsePackageLessonDefinitionsByCsePackageUnitDefinitionIdUseCase {
  constructor(
    private readonly cseLessonDefinitionRepository: CsePackageLessonDefinitionRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
    csePackageUnitDefinitionId: string,
  ): Promise<
    Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError'>>
  > =>
    this.cseLessonDefinitionRepository.findByCsePackageUnitDefinitionId(
      csePackageUnitDefinitionId,
    )
}
