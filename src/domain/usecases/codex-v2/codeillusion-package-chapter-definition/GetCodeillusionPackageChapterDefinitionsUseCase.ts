import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CodeillusionPackageChapterDefinition } from '../../../entities/codex-v2/CodeillusionPackageChapterDefinition'

export interface CodeillusionPackageChapterDefinitionRepository {
  findAll(): Promise<
    Errorable<CodeillusionPackageChapterDefinition[], E<'UnknownRuntimeError'>>
  >
}

export default class GetCodeillusionPackageChapterDefinitionsUseCase {
  constructor(
    private readonly codeillusionChapterDefinitionRepository: CodeillusionPackageChapterDefinitionRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
  ): Promise<
    Errorable<CodeillusionPackageChapterDefinition[], E<'UnknownRuntimeError'>>
  > => this.codeillusionChapterDefinitionRepository.findAll()
}
