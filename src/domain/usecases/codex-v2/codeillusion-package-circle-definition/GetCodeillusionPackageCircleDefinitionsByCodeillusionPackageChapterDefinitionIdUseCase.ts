import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CodeillusionPackageCircleDefinition } from '../../../entities/codex-v2/CodeillusionPackageCircleDefinition'

export interface CodeillusionPackageCircleDefinitionRepository {
  findByCodeillusionPackageChapterDefinitionId(
    codeillusionPackageChapterDefinitionId: string,
  ): Promise<
    Errorable<CodeillusionPackageCircleDefinition[], E<'UnknownRuntimeError'>>
  >
}

export default class GetCodeillusionPackageCircleDefinitionsByCodeillusionPackageChapterDefinitionIdUseCase {
  constructor(
    private readonly codeillusionCircleDefinitionRepository: CodeillusionPackageCircleDefinitionRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
    codeillusionPackageChapterDefinitionId: string,
  ): Promise<
    Errorable<CodeillusionPackageCircleDefinition[], E<'UnknownRuntimeError'>>
  > =>
    this.codeillusionCircleDefinitionRepository.findByCodeillusionPackageChapterDefinitionId(
      codeillusionPackageChapterDefinitionId,
    )
}
