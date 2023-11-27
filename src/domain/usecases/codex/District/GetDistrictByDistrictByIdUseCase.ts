import { E, Errorable, wrapError } from '../../shared/Errors'
import { isValidUUID } from '../../shared/Ensure'

import { DistrictInfo } from './CreateDistrictUseCase'
import { District } from '../../../entities/codex/District'

export interface IDistrictRepository {
  getDistrictByDistrictId(
    districtId: string,
  ): Promise<
    Errorable<District, E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>>
  >
}

export class GetDistrictByDistrictId {
  constructor(private districtRepository: IDistrictRepository) {}

  async run(
    districtId: string,
  ): Promise<
    Errorable<
      District,
      | E<'UnknownRuntimeError'>
      | E<'InvalidDistrictId'>
      | E<'DistrictInfoNotFound'>
    >
  > {
    if (!isValidUUID(districtId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidDistrictId',
          message: 'Invalid format of districtId.',
        },
        value: null,
      }
    }

    const districtResultByDistrictId =
      await this.districtRepository.getDistrictByDistrictId(districtId)

    if (districtResultByDistrictId.hasError) {
      switch (districtResultByDistrictId.error.type) {
        case 'DistrictInfoNotFound': {
          return {
            hasError: true,
            error: wrapError(
              districtResultByDistrictId.error,
              districtResultByDistrictId.error.message,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              districtResultByDistrictId.error,
              'failed to get district  information',
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: districtResultByDistrictId.value,
    }
  }
}
