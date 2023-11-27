import { CurriculumPackage } from '../../../domain/entities/codex-v2/CurriculumPackage'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { packagesMapById } from '../../typeorm/hardcoded-data/Pacakges/Packages'

export class HardCordedCurriculumPackageRepository {
  findById = async (
    curriculumPackageId: string,
  ): Promise<Errorable<CurriculumPackage | null, E<'UnknownRuntimeError'>>> => {
    const result = packagesMapById[curriculumPackageId]

    if (!result) {
      return successErrorable(null)
    }

    const curriculumPackage = this.transformToDomainEntity(result)

    return successErrorable(curriculumPackage)
  }

  findByIds = async (
    curriculumPackageIds: string[],
  ): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
    const result: CurriculumPackage[] = curriculumPackageIds
      .map((e) => packagesMapById[e])
      .filter((e) => !!e)
      .map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  findAllByPackageCategoryId = async (
    packageCategoryId: string,
  ): Promise<Errorable<CurriculumPackage[], E<'UnknownRuntimeError'>>> => {
    const result = Object.values(packagesMapById)
      .filter((item) => item.packageCategoryId === packageCategoryId)
      .map(this.transformToDomainEntity)

    return successErrorable(result)
  }

  private transformToDomainEntity = (hardCordedEntity: {
    id: string
    packageCategoryId: 'codeillusion' | 'cse'
    name: string
    level: 'basic' | 'advanced'
  }): CurriculumPackage => {
    return {
      id: hardCordedEntity.id,
      curriculumBrandId: hardCordedEntity.packageCategoryId,
      name: hardCordedEntity.name,
      level: hardCordedEntity.level,
    }
  }
}
