import { CurriculumPackageLessonConfiguration } from '../../../domain/entities/codex-v2/CurriculumPackageLessonConfiguration'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { packageLessonConfigurationsMapByPackageId } from '../../typeorm/hardcoded-data/Pacakges/PackageLessonConfigurations'

export class HardCordedCurriculumPackageLessonConfigurationRepository {
  configurationsByCurriculumPackageId: Record<
    string,
    CurriculumPackageLessonConfiguration[]
  > = {}

  constructor() {
    const orig = packageLessonConfigurationsMapByPackageId

    Object.keys(orig).forEach((curriculumPackageId: string) => {
      this.configurationsByCurriculumPackageId[curriculumPackageId] =
        Object.keys(orig[curriculumPackageId]).map((lessonId) => {
          const obj = orig[curriculumPackageId][lessonId]
          const curriculumPackageLessonConfiguration: CurriculumPackageLessonConfiguration =
            {
              curriculumPackageId: obj.packageId,
              lessonId: obj.lessonId,
            }

          return curriculumPackageLessonConfiguration
        })
    })
  }

  findByCurriculumPackageIdAndLessonId = async (
    curriculumPackageId: string,
    lessonId: string,
  ): Promise<
    Errorable<
      CurriculumPackageLessonConfiguration | null,
      E<'UnknownRuntimeError'>
    >
  > => {
    const curriculumPackage =
      this.configurationsByCurriculumPackageId[curriculumPackageId]

    if (!curriculumPackage) {
      return successErrorable(null)
    }

    const result = curriculumPackage.find((e) => e.lessonId === lessonId)

    if (!result) {
      return successErrorable(null)
    }

    const curriculumPackageLessonConfiguration =
      this.transformToDomainEntity(result)

    return successErrorable(curriculumPackageLessonConfiguration)
  }

  findByCurriculumPackageId = async (
    curriculumPackageId: string,
  ): Promise<
    Errorable<CurriculumPackageLessonConfiguration[], E<'UnknownRuntimeError'>>
  > => {
    const result = this.configurationsByCurriculumPackageId[curriculumPackageId]

    if (!result) {
      return successErrorable([])
    }

    return successErrorable(result.map(this.transformToDomainEntity))
  }

  private transformToDomainEntity = (hardCordedEntity: {
    curriculumPackageId: string
    lessonId: string
  }): CurriculumPackageLessonConfiguration => {
    return {
      curriculumPackageId: hardCordedEntity.curriculumPackageId,
      lessonId: hardCordedEntity.lessonId,
    }
  }
}
