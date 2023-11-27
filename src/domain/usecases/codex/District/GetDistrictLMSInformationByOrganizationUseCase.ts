import { DistrictLMSInfo } from '../../../entities/codex/DistrictLMSInformation'
import { isValidUUID } from '../../shared/Ensure'
import { E, Errorable, wrapError } from '../../shared/Errors'

export interface IDistrictRepository {
  getDistrictLMSInformationByOrganizationId(
    organizationId: string,
  ): Promise<
    Errorable<
      DistrictLMSInfo,
      E<'UnknownRuntimeError'> | E<'DistrictInfoNotFound'>
    >
  >
}

export class GetDistrictLMSInformationByOrganizationUseCase {
  constructor(private districtRepository: IDistrictRepository) {}

  async run(
    organizationId: string,
  ): Promise<
    Errorable<
      DistrictLMSInfo,
      | E<'UnknownRuntimeError'>
      | E<'InvalidOrganizationId'>
      | E<'DistrictInfoNotFound'>
    >
  > {
    //validate with provided organizationId
    if (!isValidUUID(organizationId)) {
      return {
        hasError: true,
        error: {
          type: 'InvalidOrganizationId',
          message: `Invalid format of organizationId of ${organizationId}.`,
        },
        value: null,
      }
    }

    const districtLMSInfo =
      await this.districtRepository.getDistrictLMSInformationByOrganizationId(
        organizationId,
      )

    if (districtLMSInfo.hasError) {
      switch (districtLMSInfo.error.type) {
        case 'DistrictInfoNotFound': {
          return {
            hasError: true,
            error: wrapError(
              districtLMSInfo.error,
              districtLMSInfo.error.message,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              districtLMSInfo.error,
              'failed to get district lms information',
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: districtLMSInfo.value,
    }
  }
}
