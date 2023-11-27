import { DataSource } from 'typeorm'
import { CodexPackage } from '../../domain/entities/codex/CodexPackage'
import {
  E,
  Errorable,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { DistrictPurchasedPackageTypeormEntity } from '../typeorm/entity/DistrictPurchasedPackage'
import { packagesMapById } from '../typeorm/hardcoded-data/Pacakges/Packages'

export class DistrictPurchasedPackageRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getDistrictPurchasedPackagesByDistrictId(
    districtId: string,
  ): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
    const districtPurchasedPackageTypeormEntity =
      this.typeormDataSource.getRepository(
        DistrictPurchasedPackageTypeormEntity,
      )

    try {
      const districtPurchasedPackages =
        await districtPurchasedPackageTypeormEntity
          .createQueryBuilder()
          .where('district_id = :districtId', { districtId })
          .select('package_id', 'packageId')
          .getRawMany()

      const codexPackages: CodexPackage[] = []

      for (const p of districtPurchasedPackages) {
        const packageDefinition = packagesMapById[p.packageId]

        codexPackages.push({
          packageCategoryId: packageDefinition.packageCategoryId,
          packageId: packageDefinition.id,
          packageName: packageDefinition.name,
        })
      }

      return {
        error: null,
        hasError: false,
        value: codexPackages,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district from db by districtId : ${districtId}`,
        ),
        value: null,
      }
    }
  }
}
