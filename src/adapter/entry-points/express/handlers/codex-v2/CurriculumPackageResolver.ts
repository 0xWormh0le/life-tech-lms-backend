import {
  QueryCurriculumPackagesArgs,
  CurriculumPackage,
  CurriculumPackageLevel,
} from './_gen/resolvers-type'
import { CurriculumPackage as DomainEntityCurriculumPackage } from '../../../../../domain/entities/codex-v2/CurriculumPackage'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { HardCordedCurriculumPackageRepository } from '../../../../repositories/codex-v2/HardCordedCurriculumPackageRepository'
import { shouldBeNever } from '../../../../../_shared/utils'
import GetCurriculumPackageIdUseCase from '../../../../../domain/usecases/codex-v2/curriculum-package/GetCurriculumPackageIdUseCase'

export class CurriculumPackageResolver {
  getUseCase: GetCurriculumPackageIdUseCase

  constructor() {
    const curriculumPackageRepository =
      new HardCordedCurriculumPackageRepository()

    this.getUseCase = new GetCurriculumPackageIdUseCase(
      curriculumPackageRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryCurriculumPackagesArgs,
    QueryResult<CurriculumPackage>
  > = async (user, _parent, { curriculumBrandId }) => {
    const res = await this.getUseCase.run(user, curriculumBrandId)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCurriculumPackage,
  ): CurriculumPackage => {
    return {
      __typename: 'CurriculumPackage',
      id: domainEntity.id,
      curriculumBrandId: domainEntity.curriculumBrandId,
      name: domainEntity.name,
      level: this.transformCurriculumPackageLevelToGraphqlSchema(
        domainEntity.level,
      ),
    }
  }

  private transformCurriculumPackageLevelToGraphqlSchema = (
    curriculumPackageLevel: DomainEntityCurriculumPackage['level'],
  ): CurriculumPackage['level'] => {
    switch (curriculumPackageLevel) {
      case 'advanced':
        return CurriculumPackageLevel.Advanced
      case 'basic':
        return CurriculumPackageLevel.Basic
      default:
        shouldBeNever(curriculumPackageLevel)
        throw new Error(
          `invalid mapping for curriculum package level. value: ${JSON.stringify(
            curriculumPackageLevel,
          )}`,
        )
    }
  }
}
