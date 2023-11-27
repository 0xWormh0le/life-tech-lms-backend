import { CurriculumBrand } from '../../../domain/entities/codex-v2/CurriculumBrand'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'
import { CurriculumBrands } from '../../typeorm/hardcoded-data/CurriculumBrand'

export class HardCordedCurriculumBrandRepository {
  curriculumBrands: CurriculumBrand[]

  constructor() {
    this.curriculumBrands = CurriculumBrands
  }

  findAll = async (): Promise<
    Errorable<CurriculumBrand[], E<'UnknownRuntimeError'>>
  > => {
    return successErrorable(
      this.curriculumBrands.map(this.transformToDomainEntity),
    )
  }

  findById = async (
    curriculumBrandId: string,
  ): Promise<Errorable<CurriculumBrand | null, E<'UnknownRuntimeError'>>> => {
    const result = this.curriculumBrands.find((e) => e.id === curriculumBrandId)

    if (!result) {
      return successErrorable(null)
    }

    return successErrorable(this.transformToDomainEntity(result))
  }

  private transformToDomainEntity = (hardCordedEntity: {
    id: CurriculumBrand['id']
    name: CurriculumBrand['name']
  }): CurriculumBrand => {
    return {
      id: hardCordedEntity.id,
      name: hardCordedEntity.name,
    }
  }
}
