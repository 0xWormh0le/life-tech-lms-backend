import { PackageLessonConfiguration } from '../../domain/entities/codex/PackageLessonConfiguration'
import { Errorable, E } from '../../domain/usecases/shared/Errors'
import { packageLessonConfigurationsMapByPackageId } from '../typeorm/hardcoded-data/Pacakges/PackageLessonConfigurations'

export class PackageLessonConfigurationRepository {
  async getByPackageIdAndLessonId(
    packageId: string,
    lessonId: string,
  ): Promise<
    Errorable<
      PackageLessonConfiguration | null,
      E<'UnknownRuntimeError', string>
    >
  > {
    const packageLessonConfigurationsMapByLessonId =
      packageLessonConfigurationsMapByPackageId[packageId]

    if (!packageLessonConfigurationsMapByLessonId) {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }

    const packageLessonConfiguration =
      packageLessonConfigurationsMapByLessonId[lessonId]

    if (!packageLessonConfiguration) {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: packageLessonConfiguration,
    }
  }
}
