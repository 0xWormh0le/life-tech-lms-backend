import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CodeillusionPackageLessonDefinition } from '../../../entities/codex-v2/CodeillusionPackageLessonDefinition'

export interface CodeillusionPackageLessonDefinitionRepository {
  findByCodeillusionPackageCircleDefinitionId(
    codeillusionPackageCircleDefinitionId: string,
  ): Promise<
    Errorable<CodeillusionPackageLessonDefinition[], E<'UnknownRuntimeError'>>
  >
}

export default class GetCodeillusionPackageLessonDefinitionsByCodeillusionPackageCircleDefinitionIdUseCase {
  constructor(
    private readonly codeillusionLessonDefinitionRepository: CodeillusionPackageLessonDefinitionRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
    codeillusionPackageCircleDefinitionId: string,
  ): Promise<
    Errorable<CodeillusionPackageLessonDefinition[], E<'UnknownRuntimeError'>>
  > =>
    this.codeillusionLessonDefinitionRepository.findByCodeillusionPackageCircleDefinitionId(
      codeillusionPackageCircleDefinitionId,
    )
}
