import { District } from '../../../entities/codex/District'
import { User } from '../../../entities/codex/User'
import { Errorable, E, wrapError } from '../../shared/Errors'
import { userRoles } from '../../shared/Constants'

const ALLOWED_ROLES: string[] = [userRoles.internalOperator]

export type DistrictInfo = Omit<
  District,
  | 'id'
  | 'lmsName'
  | 'districtLMSId'
  | 'lastRosterSyncEventId'
  | 'lastRosterSyncEventDate'
  | 'enableRosterSync'
> & {
  lmsId: string
  districtLMSId?: string
}

export interface IDistrictRepository {
  editDistrict(
    user: User,
    district: DistrictInfo,
    districtId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'DistrictInfoNotFound'>
    >
  >
}

export class EditDistrictUseCase {
  constructor(private districtRepository: IDistrictRepository) {}

  async run(
    user: User,
    district: DistrictInfo,
    districtId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'AlreadyExistError'>
      | E<'DistrictInfoNotFound'>
    >
  > {
    if (!ALLOWED_ROLES.includes(user.role)) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const districtResult = await this.districtRepository.editDistrict(
      user,
      district,
      districtId,
    )

    if (districtResult.hasError) {
      switch (districtResult.error.type) {
        case 'DistrictInfoNotFound': {
          return {
            hasError: true,
            error: wrapError(
              districtResult.error,
              `${district.name} district information not found.`,
            ),
            value: null,
          }
        }
        case 'AlreadyExistError': {
          return {
            hasError: true,
            error: wrapError(
              districtResult.error,
              `${district.name} district is already exists.`,
            ),
            value: null,
          }
        }
        default: {
          return {
            hasError: true,
            error: wrapError(
              districtResult.error,
              `failed to edit district ${JSON.stringify(district)}`,
            ),
            value: null,
          }
        }
      }
    }

    return {
      hasError: false,
      error: null,
      value: undefined,
    }
  }
}
