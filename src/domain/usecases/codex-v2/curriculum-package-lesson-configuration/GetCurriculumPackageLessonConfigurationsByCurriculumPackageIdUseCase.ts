import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { CurriculumPackageLessonConfiguration } from '../../../entities/codex-v2/CurriculumPackageLessonConfiguration'

export interface CurriculumPackageLessonConfigurationRepository {
  findByCurriculumPackageId(
    curriculumPackageId: string,
  ): Promise<
    Errorable<CurriculumPackageLessonConfiguration[], E<'UnknownRuntimeError'>>
  >
}

export default class GetCurriculumPackageLessonConfigurationsByCurriculumPackageIdUseCase {
  constructor(
    private readonly curriculumLessonConfigurationRepository: CurriculumPackageLessonConfigurationRepository,
  ) {}

  run = async (
    _authenticatedUser: User,
    curriculumPackageId: string,
  ): Promise<
    Errorable<CurriculumPackageLessonConfiguration[], E<'UnknownRuntimeError'>>
  > =>
    this.curriculumLessonConfigurationRepository.findByCurriculumPackageId(
      curriculumPackageId,
    )
}
