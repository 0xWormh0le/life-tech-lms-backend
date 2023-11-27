import { CurriculumBrand } from './_gen/resolvers-type'
import { CurriculumBrand as DomainEntityCurriculumBrand } from '../../../../../domain/entities/codex-v2/CurriculumBrand'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { HardCordedCurriculumBrandRepository } from '../../../../repositories/codex-v2/HardCordedCurriculumBrandRepository'
import GetCurriculumBrandsUseCase from '../../../../../domain/usecases/codex-v2/curriculum-brand/GetCurriculumBrandsUseCase'

export class CurriculumBrandResolver {
  getUseCase: GetCurriculumBrandsUseCase

  constructor() {
    const curriculumBrandRepository = new HardCordedCurriculumBrandRepository()

    this.getUseCase = new GetCurriculumBrandsUseCase(curriculumBrandRepository)
  }

  query: ResolverWithAuthenticatedUser<void, QueryResult<CurriculumBrand>> =
    async (user, _parent) => {
      const res = await this.getUseCase.run(user)
      const data = valueOrThrowErr(res)

      return {
        items: data.map(this.transformToGraphqlSchema),
        count: data.length,
      }
    }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCurriculumBrand,
  ): CurriculumBrand => {
    return {
      __typename: 'CurriculumBrand',
      id: domainEntity.id,
      name: domainEntity.name,
    }
  }
}
