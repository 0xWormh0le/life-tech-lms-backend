import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CurriculumPackage } from '../../../entities/codex-v2/CurriculumPackage'

export interface CurriculumPackageRepository {
  findAllByPackageCategoryId(
    curriculumBrandId: string,
  ): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>>
}

export default class GetCurriculumPackageIdUseCase {
  constructor(
    private readonly curriculumPackageRepository: CurriculumPackageRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
    curriculumBrandId: string,
  ): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> =>
    this.curriculumPackageRepository.findAllByPackageCategoryId(
      curriculumBrandId,
    )
}
