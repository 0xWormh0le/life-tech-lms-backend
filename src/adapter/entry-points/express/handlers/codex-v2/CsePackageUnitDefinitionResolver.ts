import { CsePackageUnitDefinition } from './_gen/resolvers-type'
import { CsePackageUnitDefinition as DomainEntityCsePackageUnitDefinition } from '../../../../../domain/entities/codex-v2/CsePackageUnitDefinition'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetCsePackageUnitDefinitionsUseCase from '../../../../../domain/usecases/codex-v2/cse-package-unit-definition/GetCsePackageUnitDefinitionsUseCase'
import { HardCordedCsePackageUnitDefinitionRepository } from '../../../../repositories/codex-v2/HardCordedCsePackageUnitDefinitionRepository'

type CsePackageUnitDefinitionResolverResponse = Omit<
  CsePackageUnitDefinition,
  'csePackageLessonDefinitions'
>

export class CsePackageUnitDefinitionResolver {
  getUseCase: GetCsePackageUnitDefinitionsUseCase

  constructor(private readonly staticFilesBaseUrl: string) {
    const csePackageUnitDefinitionRepository =
      new HardCordedCsePackageUnitDefinitionRepository(this.staticFilesBaseUrl)

    this.getUseCase = new GetCsePackageUnitDefinitionsUseCase(
      csePackageUnitDefinitionRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<CsePackageUnitDefinitionResolverResponse>
  > = async (user, _parent) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityCsePackageUnitDefinition,
  ): CsePackageUnitDefinitionResolverResponse => {
    return {
      __typename: 'CsePackageUnitDefinition',
      id: domainEntity.id,
      name: domainEntity.name,
      description: domainEntity.description,
    }
  }
}
