import { CsePackage } from '../../domain/entities/codex/CsePackage'
import { Errorable, E } from '../../domain/usecases/shared/Errors'
import { packagesMapById } from '../typeorm/hardcoded-data/Pacakges/Packages'

export class CsePackageRepository {
  async getById(
    id: string,
  ): Promise<
    Errorable<
      Omit<CsePackage, 'units'> | null,
      E<'UnknownRuntimeError', string>
    >
  > {
    const csePackage = packagesMapById[id]

    if (!csePackage) {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    }

    if (csePackage.packageCategoryId !== 'cse') {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: `packageCategory for package ID ${id} is not cse`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: csePackage,
    }
  }
}
