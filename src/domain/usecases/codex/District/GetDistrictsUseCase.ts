import { District } from '../../../entities/codex/District'
import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'

export interface IDistrictRepository {
  getDistricts(
    districtIds?: string[],
    LMSId?: string,
    enabledRosterSync?: boolean,
  ): Promise<Errorable<District[], E<'UnknownRuntimeError'>>>
}

export class GetDistrictsUseCase {
  constructor(private distictRepository: IDistrictRepository) {}

  async run(
    user: User,
    districtIds?: string[],
    LMSId?: string,
    enabledRosterSync?: boolean,
  ): Promise<
    Errorable<District[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > {
    if (user.role !== 'internalOperator') {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    //Get Districts From DistrictRepository
    const districtResult = await this.distictRepository.getDistricts(
      districtIds,
      LMSId,
      enabledRosterSync,
    )

    if (districtResult.hasError) {
      return {
        hasError: true,
        error: wrapError(districtResult.error, 'failed to get districts'),
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: districtResult.value,
    }
  }
}
