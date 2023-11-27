import { DataSource } from 'typeorm'
import GetDistrictPurchasedPackagesByDistrictIdUseCase from '../../../../../domain/usecases/codex-v2/district-purchased-package/GetDistrictPurchasedPackagesByDistrictIdUseCase'
import { RdbDistrictPurchasedPackageRepository } from '../../../../repositories/codex-v2/RdbDistrictPurchasedPackageRepository'
import {
  CreateDistrictPurchasedPackagePayload,
  DeleteDistrictPurchasedPackagePayload,
  District,
  DistrictPurchasedPackage,
  MutationCreateDistrictPurchasedPackageArgs,
  MutationDeleteDistrictPurchasedPackageArgs,
} from './_gen/resolvers-type'
import { DistrictPurchasedPackage as DomainEntityDistrictPurchasedPackage } from '../../../../../domain/entities/codex-v2/DistrictPurchasedPackage'
import CreateDistrictPurchasedPackageUseCase from '../../../../../domain/usecases/codex-v2/district-purchased-package/CreateDistrictPurchasedPackageUseCase'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import { RdbDistrictRepository } from '../../../../repositories/codex-v2/RdbDistrictRepository'
import { HardCordedCurriculumPackageRepository } from '../../../../repositories/codex-v2/HardCordedCurriculumPackageRepository'
import DeleteDistrictPurchasedPackageUseCase from '../../../../../domain/usecases/codex-v2/district-purchased-package/DeleteDistrictPurchasedPackageUseCase'
import { ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'

export class DistrictPurchasedPackageResolver {
  getUseCase: GetDistrictPurchasedPackagesByDistrictIdUseCase

  createUseCase: CreateDistrictPurchasedPackageUseCase

  deleteUseCase: DeleteDistrictPurchasedPackageUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const districtRepository = new RdbDistrictRepository(this.appDataSource)
    const districtPurchasedPackageRepository =
      new RdbDistrictPurchasedPackageRepository(this.appDataSource)
    const curriculumPackageRepository =
      new HardCordedCurriculumPackageRepository()

    this.getUseCase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(
      districtPurchasedPackageRepository,
    )
    this.createUseCase = new CreateDistrictPurchasedPackageUseCase(
      districtPurchasedPackageRepository,
      datetimeRepository,
      districtRepository,
      curriculumPackageRepository,
    )
    this.deleteUseCase = new DeleteDistrictPurchasedPackageUseCase(
      districtPurchasedPackageRepository,
    )
  }

  getDistrictPurchasedPackages: ResolverWithAuthenticatedUser<
    void,
    DistrictPurchasedPackage[],
    District
  > = async (user, district) => {
    const res = await this.getUseCase.run(user, district.id)

    return valueOrThrowErr(res).map(this.transformToGraphqlSchema)
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateDistrictPurchasedPackageArgs,
    CreateDistrictPurchasedPackagePayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, input)

    return {
      districtPurchasedPackage: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  delete: ResolverWithAuthenticatedUser<
    MutationDeleteDistrictPurchasedPackageArgs,
    DeleteDistrictPurchasedPackagePayload
  > = async (
    user,
    _parent,
    { input },
  ): Promise<DeleteDistrictPurchasedPackagePayload> => {
    const res = await this.deleteUseCase.run(user, input.id)

    valueOrThrowErr(res)

    return {
      id: input.id,
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityDistrictPurchasedPackage,
  ): Omit<DistrictPurchasedPackage, 'district'> => {
    return {
      __typename: 'DistrictPurchasedPackage',
      id: domainEntity.id,
      districtId: domainEntity.districtId ?? '',
      curriculumPackageId: domainEntity.curriculumPackageId,
      createdAt: domainEntity.createdAt.toISOString(),
      createdUserId: domainEntity.createdUserId,
    }
  }
}
