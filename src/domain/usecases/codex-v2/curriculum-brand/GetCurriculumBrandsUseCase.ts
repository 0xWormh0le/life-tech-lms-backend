import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CurriculumBrand } from '../../../entities/codex-v2/CurriculumBrand'

export interface CurriculumBrandRepository {
  findAll(): Promise<Errorable<CurriculumBrand[], E<'UnknownRuntimeError'>>>
}

export default class GetCurriculumBrandsUseCase {
  constructor(
    private readonly curriculumLessonConfigurationRepository: CurriculumBrandRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
  ): Promise<Errorable<CurriculumBrand[], E<'UnknownRuntimeError'>>> =>
    this.curriculumLessonConfigurationRepository.findAll()
}
